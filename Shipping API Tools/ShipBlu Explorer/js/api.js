/* =============================================================================
   ShipBlu Explorer — API Client & Global Utilities
   ============================================================================= */

'use strict';

/* ----------------------------------------------------------------------------
   Typed Error Classes
   ---------------------------------------------------------------------------- */

/** Thrown when the API returns 401/403 or no API key is set. */
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.type = 'auth';
  }
}

/** Thrown on network-level failures (offline, DNS, etc.). */
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
    this.type = 'network';
  }
}

/**
 * Thrown when CORS blocks the request.
 * Detected by inspecting the TypeError message from a failed fetch.
 */
class CorsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CorsError';
    this.type = 'cors';
  }
}

/** Thrown when the API returns 400/422 with validation field errors. */
class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = 'ValidationError';
    this.type = 'validation';
    this.fields = fields; // { fieldName: errorMessage }
  }
}

/** Thrown for any other non-2xx API response. */
class ApiError extends Error {
  constructor(message, status, body = null) {
    super(message);
    this.name = 'ApiError';
    this.type = 'api';
    this.status = status;
    this.body = body;
  }
}

// Expose error classes globally so pages can use instanceof checks
window.AuthError       = AuthError;
window.NetworkError    = NetworkError;
window.CorsError       = CorsError;
window.ValidationError = ValidationError;
window.ApiError        = ApiError;

/* ----------------------------------------------------------------------------
   API Key Storage
   ---------------------------------------------------------------------------- */

/**
 * Returns the stored ShipBlu API key, or an empty string if not set.
 * @returns {string}
 */
window.getApiKey = () => localStorage.getItem('shipblu_api_key') || '';

/**
 * Persists the ShipBlu API key and dispatches 'apikeychanged' event.
 * @param {string} key
 */
window.setApiKey = (key) => {
  if (key && typeof key === 'string') {
    localStorage.setItem('shipblu_api_key', key.trim());
  } else {
    localStorage.removeItem('shipblu_api_key');
  }
  // Let the app shell re-check connection status
  window.dispatchEvent(new CustomEvent('apikeychanged'));
};

/* ----------------------------------------------------------------------------
   API Client
   ---------------------------------------------------------------------------- */

const SHIPBLU_BASE_URL   = 'https://api.shipblu.com/api';
const REQUEST_TIMEOUT_MS = 15_000; // 15 seconds

/**
 * Makes an authenticated request to the ShipBlu API.
 *
 * @param {string} method  - HTTP verb: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
 * @param {string} path    - Path relative to base URL, e.g. '/v1/orders/'
 * @param {object|null} body - Request body (will be JSON-serialised)
 * @returns {Promise<any>}   Parsed JSON response
 * @throws {AuthError}       401 / 403 or missing API key
 * @throws {ValidationError} 400 / 422 with field errors
 * @throws {CorsError}       CORS-related network block
 * @throws {NetworkError}    Connection-level failure
 * @throws {ApiError}        Any other non-2xx response
 */
window.shipbluApi = async (method, path, body = null) => {
  const apiKey = window.getApiKey();

  if (!apiKey) {
    throw new AuthError('No API key set. Go to Settings to add your ShipBlu API key.');
  }

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const url = `${SHIPBLU_BASE_URL}${path}`;

  /** @type {RequestInit} */
  const options = {
    method:  method.toUpperCase(),
    signal:  controller.signal,
    headers: {
      'Authorization': `Api-Key ${apiKey}`,
      'Content-Type':  'application/json',
      'Accept':        'application/json',
    },
  };

  if (body !== null && !['GET', 'HEAD'].includes(options.method)) {
    options.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(url, options);
  } catch (err) {
    clearTimeout(timeoutId);

    // AbortController fired — timeout
    if (err.name === 'AbortError') {
      throw new NetworkError(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s — API may be slow`);
    }

    // Heuristic: CORS errors in browsers surface as TypeErrors with these phrases
    const msg = err.message || '';
    const isCorsLike =
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError when attempting to fetch resource') ||
      msg.includes('Load failed') ||          // Safari
      msg.includes('CORS');

    if (isCorsLike) {
      throw new CorsError(
        'CORS blocked — run via a local server or browser extension'
      );
    }

    throw new NetworkError(`Network unreachable — check your connection`);
  } finally {
    clearTimeout(timeoutId);
  }

  // --- Parse response body ------------------------------------------------
  let responseData = null;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      // Non-JSON body on an otherwise OK response — return null
      responseData = null;
    }
  }

  // --- Handle error status codes -----------------------------------------
  if (!response.ok) {
    const status = response.status;

    if (status === 401 || status === 403) {
      throw new AuthError(
        responseData?.detail ||
        responseData?.message ||
        'Invalid API key — check Settings'
      );
    }

    if (status === 400 || status === 422) {
      // ShipBlu typically returns { field: [error] } or { detail: string }
      const fields = (typeof responseData === 'object' && responseData !== null)
        ? responseData
        : {};
      const summary =
        fields.detail ||
        fields.message ||
        fields.non_field_errors?.[0] ||
        Object.entries(fields)
              .filter(([k]) => k !== 'detail')
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
              .join('; ') ||
        `Validation error (${status})`;

      throw new ValidationError(summary, fields);
    }

    if (status === 404) {
      const urlPath = new URL(url).pathname;
      throw new ApiError(`Not found (404) — ${urlPath}`, status, responseData);
    }

    if (status === 429) {
      throw new ApiError(
        'Rate limited — slow down requests',
        status,
        responseData
      );
    }

    if (status >= 500) {
      throw new ApiError(
        `Server error (${status}) — ShipBlu API issue`,
        status,
        responseData
      );
    }

    throw new ApiError(
      responseData?.detail ||
      responseData?.message ||
      `Unexpected response (${status})`,
      status,
      responseData
    );
  }

  // 204 No Content
  if (response.status === 204) return null;

  return responseData;
};

/* ----------------------------------------------------------------------------
   Toast Notifications
   ---------------------------------------------------------------------------- */

/** Internal registry of active toasts keyed by caller-supplied ID. */
const _toastRegistry = new Map();

/**
 * Displays a toast notification at the bottom-right of the screen.
 *
 * @param {string} message - The text to display
 * @param {'success'|'error'|'warning'|'loading'|'info'} type
 * @param {string} [id]    - Optional stable ID; if a toast with this ID
 *   already exists it will be replaced in-place (useful for loading → result).
 * @returns {function} dismiss - Call to remove the toast early
 */
window.showToast = (message, type = 'info', id = null) => {
  const container = document.getElementById('toast-container');
  if (!container) return () => {};

  // Replace an existing toast with the same ID
  if (id && _toastRegistry.has(id)) {
    const existing = _toastRegistry.get(id);
    if (existing && existing.isConnected) existing.remove();
    _toastRegistry.delete(id);
  }

  const ICONS = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    loading: `<div class="toast-spinner" role="status" aria-label="Loading"></div>`,
  };

  const toast    = document.createElement('div');
  const safeType = ICONS[type] ? type : 'info';

  toast.className   = `toast toast-${safeType}`;
  toast.setAttribute('role', safeType === 'error' ? 'alert' : 'status');
  toast.setAttribute('aria-live', safeType === 'error' ? 'assertive' : 'polite');

  toast.innerHTML = `
    ${ICONS[safeType] || ICONS.info}
    <div class="toast-body">${_escapeHtml(message)}</div>
    <button class="toast-dismiss" aria-label="Dismiss notification" tabindex="0">×</button>
  `;

  if (id) _toastRegistry.set(id, toast);
  container.appendChild(toast);

  const dismiss = () => {
    if (!toast.isConnected) return;
    toast.style.animation = 'fadeOut 200ms ease forwards';
    setTimeout(() => {
      toast.remove();
      if (id) _toastRegistry.delete(id);
    }, 210);
  };

  // Dismiss button
  toast.querySelector('.toast-dismiss').addEventListener('click', dismiss);

  // Auto-dismiss after 4 seconds (not for 'loading' type)
  let autoDismissTimer = null;
  if (type !== 'loading') {
    autoDismissTimer = setTimeout(dismiss, 4000);
  }

  // Pause timer on hover so users can read long messages
  toast.addEventListener('mouseenter', () => clearTimeout(autoDismissTimer));
  toast.addEventListener('mouseleave', () => {
    if (type !== 'loading') {
      autoDismissTimer = setTimeout(dismiss, 2000);
    }
  });

  return dismiss;
};

/**
 * Shows a loading toast, awaits the promise, then swaps to success or error.
 *
 * @param {Promise<any>} promise
 * @param {string} loadingMsg  - Shown while waiting
 * @param {string} successMsg  - Shown on resolution
 * @returns {Promise<any>}     Resolves/rejects with the original promise value
 */
window.withLoadingToast = async (promise, loadingMsg, successMsg) => {
  const toastId = `loading-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.showToast(loadingMsg, 'loading', toastId);
  try {
    const result = await promise;
    window.showToast(successMsg, 'success', toastId);
    return result;
  } catch (err) {
    const msg = window.getErrorMessage ? window.getErrorMessage(err) : (err?.message || 'An error occurred.');
    window.showToast(msg, 'error', toastId);
    throw err;
  }
};

/* ----------------------------------------------------------------------------
   Formatting Utilities
   ---------------------------------------------------------------------------- */

/**
 * Formats a number as Egyptian Pounds.
 * @param {number|string} amount
 * @returns {string} e.g. "149.99 EGP"
 */
window.formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '— EGP';
  return `${num.toFixed(2)} EGP`;
};

/**
 * Formats a date string into a human-readable relative or absolute form.
 * - < 60s:   "just now"
 * - < 1h:    "X minutes ago"
 * - < 24h:   "X hours ago"
 * - < 7d:    "X days ago"
 * - else:    "Jan 5, 2025"
 *
 * @param {string|Date} dateStr
 * @returns {string}
 */
window.formatDate = (dateStr) => {
  if (!dateStr) return '—';

  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);

  const now      = Date.now();
  const diffMs   = now - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60)        return 'just now';
  if (diffSecs < 3600)      return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400)     return `${Math.floor(diffSecs / 3600)}h ago`;
  if (diffSecs < 7 * 86400) return `${Math.floor(diffSecs / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
};

/**
 * Formats a date string as a full absolute datetime string.
 * @param {string|Date} dateStr
 * @returns {string} e.g. "Jan 5, 2025, 2:30 PM"
 */
window.formatDateFull = (dateStr) => {
  if (!dateStr) return '—';
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);

  return date.toLocaleString('en-US', {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};

/**
 * Copies text to clipboard with a graceful fallback.
 * @param {string} text
 * @returns {Promise<void>}
 */
window.copyToClipboard = async (text) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    window.showToast('Copied to clipboard', 'success');
  } catch {
    // Fallback: create a temporary textarea
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    try {
      document.execCommand('copy');
      window.showToast('Copied to clipboard', 'success');
    } catch {
      window.showToast('Could not copy to clipboard', 'error');
    } finally {
      ta.remove();
    }
  }
};

/* ----------------------------------------------------------------------------
   Error → User Message Helper
   ---------------------------------------------------------------------------- */

/**
 * Converts a thrown error into a user-facing message string.
 * Useful for catch blocks in page scripts.
 *
 * @param {Error} err
 * @returns {string}
 */
window.getErrorMessage = (err) => {
  if (err instanceof AuthError)       return err.message;
  if (err instanceof CorsError)       return err.message;
  if (err instanceof NetworkError)    return err.message;
  if (err instanceof ValidationError) return err.message;
  if (err instanceof ApiError)        return err.message;
  return err?.message || 'An unexpected error occurred.';
};

/**
 * Shows a toast for a caught error and returns the message.
 * @param {Error} err
 * @returns {string}
 */
window.handleApiError = (err) => {
  const message = window.getErrorMessage(err);
  window.showToast(message, 'error');
  return message;
};

/* ----------------------------------------------------------------------------
   Internal Helpers
   ---------------------------------------------------------------------------- */

/**
 * Escapes HTML special characters to prevent XSS in toast messages.
 * @param {string} str
 * @returns {string}
 */
function _escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
