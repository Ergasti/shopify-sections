/**
 * J&T Express MX API Client
 * Browser-side, no build tools required.
 * Depends on: md5 from blueimp-md5 (loaded via CDN in index.html)
 */

// ── Error types ──────────────────────────────────────────────────────────────

class AuthError extends Error {
  constructor(msg) { super(msg); this.name = 'AuthError'; }
}
class NetworkError extends Error {
  constructor(msg) { super(msg); this.name = 'NetworkError'; }
}
class ApiError extends Error {
  constructor(msg, code) { super(msg); this.name = 'ApiError'; this.code = code; }
}

window.AuthError   = AuthError;
window.NetworkError = NetworkError;
window.ApiError    = ApiError;

// ── Credential storage ───────────────────────────────────────────────────────

const CRED_KEY = 'jt_credentials';

const DEFAULT_CREDENTIALS = {
  apiAccount:       '411857874587758643',
  privateKey:       'daa83efa26d14bbfa8440ac29404ec83',
  customerCode:     'J0086000227',
  customerPassword: 'Flextock2025@',
  timezone:         'GMT+2',
  testMode:         false,
  region:           'eg',
};

window.getCredentials = function () {
  try {
    const stored = JSON.parse(localStorage.getItem(CRED_KEY));
    return stored || DEFAULT_CREDENTIALS;
  } catch { return DEFAULT_CREDENTIALS; }
};

window.setCredentials = function (creds) {
  localStorage.setItem(CRED_KEY, JSON.stringify(creds));
  window.dispatchEvent(new Event('jtcredchanged'));
};

window.hasCredentials = function () {
  const c = window.getCredentials();
  return !!(c.apiAccount && c.privateKey && c.customerCode);
};

// ── Signature helpers ────────────────────────────────────────────────────────

/**
 * Header-level digest: base64( md5_raw( bizContentJson + privateKey ) )
 * Uses blueimp-md5's raw mode (third arg = true → raw binary string)
 */
window.makeHeaderDigest = function (bizContentJson, privateKey) {
  // md5(str, key, raw) → raw binary string when raw=true
  const raw = window.md5(bizContentJson + privateKey, null, true);
  return btoa(raw);
};

/**
 * Business-level digest (inside bizContent):
 * ciphertext = MD5( password + "jadada236t2" ).toUpperCase()
 * digest     = base64( md5_raw( customerCode + ciphertext + privateKey ) )
 */
window.makeBizDigest = function (customerCode, password, privateKey) {
  const ciphertext = window.md5(password + 'jadada236t2').toUpperCase();
  const raw = window.md5(customerCode + ciphertext + privateKey, null, true);
  return btoa(raw);
};

// ── Core API call ────────────────────────────────────────────────────────────

/**
 * @param {string} path  - e.g. '/api/order/getOrders'
 * @param {object} bizContent - business parameter object
 * @returns {Promise<{code:string, msg:string, data:any}>}
 */
window.jtApi = async function (path, bizContent) {
  const creds = window.getCredentials();
  if (!creds.apiAccount || !creds.privateKey) {
    throw new AuthError('Missing API credentials. Please configure them in Settings.');
  }

  const region = creds.region || 'mx';
  let baseUrl;
  if (region === 'eg') {
    baseUrl = 'https://openapi.jtjms-eg.com/webopenplatformapi/api';
  } else if (creds.testMode !== false) {
    baseUrl = 'https://demoopenapi.jtjms-mx.com/webopenplatformapi';
  } else {
    baseUrl = 'https://openapi.jtjms-mx.com/webopenplatformapi';
  }

  const bizContentJson = JSON.stringify(bizContent);
  const timestamp = Date.now();
  const digest = window.makeHeaderDigest(bizContentJson, creds.privateKey);
  const timezone = creds.timezone || 'GMT-6';

  const body = 'bizContent=' + encodeURIComponent(bizContentJson);

  let response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    // EG base_url already includes /api — strip it from path to avoid doubling
    const resolvedPath = region === 'eg' ? path.replace(/^\/api/, '') : path;
    response = await fetch(baseUrl + resolvedPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiAccount':   String(creds.apiAccount),
        'digest':       digest,
        'timestamp':    String(timestamp),
        'timezone':     timezone,
      },
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    if (err.name === 'AbortError') throw new NetworkError('Request timed out after 20s.');
    throw new NetworkError('Connection failed. Check your internet connection.');
  }

  let json;
  try {
    json = await response.json();
  } catch {
    throw new ApiError(`Server returned non-JSON (HTTP ${response.status})`, response.status);
  }

  if (String(json.code) !== '1') {
    // Known permission error — provide a clearer message
    const msg = String(json.code) === '145003012'
      ? 'This API account does not have orders query permission. Contact J&T Express to whitelist the getOrders endpoint for your account.'
      : (json.msg || `API error code ${json.code}`);
    throw new ApiError(msg, json.code);
  }

  return json;
};

// ── Pagination helper ────────────────────────────────────────────────────────

/**
 * Fetch ALL orders by date range, paginating automatically.
 * Calls onProgress(loadedCount, totalEstimate) on each page.
 *
 * @param {string} startDate  - 'yyyy-MM-dd HH:mm:ss'
 * @param {string} endDate    - 'yyyy-MM-dd HH:mm:ss'
 * @param {function} onProgress
 * @param {number} maxPages - safety cap (default 20 = 1000 orders)
 * @returns {Promise<Array>} all order objects
 */
window.fetchAllOrders = async function (startDate, endDate, onProgress, maxPages = 20) {
  const creds = window.getCredentials();
  const bizDigest = creds.customerCode && creds.customerPassword && creds.privateKey
    ? window.makeBizDigest(creds.customerCode, creds.customerPassword, creds.privateKey)
    : '';

  const PAGE_SIZE = 50;
  let allOrders = [];
  let current = 1;
  let hasMore = true;

  while (hasMore && current <= maxPages) {
    const biz = {
      customerCode: creds.customerCode,
      digest: bizDigest,
      command: 3,          // query by time range
      startDate,
      endDate,
      current,
      size: PAGE_SIZE,
    };

    const res = await window.jtApi('/api/order/getOrders', biz);
    const orders = Array.isArray(res.data) ? res.data : (res.data?.records || []);

    allOrders = allOrders.concat(orders);
    onProgress && onProgress(allOrders.length, allOrders.length + (orders.length === PAGE_SIZE ? PAGE_SIZE : 0));

    hasMore = orders.length === PAGE_SIZE;
    current++;
  }

  return allOrders;
};

// ── Zone aggregation ─────────────────────────────────────────────────────────

/**
 * Group orders by receiver province (zone).
 * Returns array of { zone, orderCount, totalFreight, avgFreight } sorted by orderCount desc.
 */
window.aggregateByZone = function (orders) {
  const map = {};

  for (const order of orders) {
    const zone = order.receiver?.prov
      || order.receiver?.city
      || 'Unknown';

    if (!map[zone]) {
      map[zone] = { zone, orderCount: 0, totalFreight: 0 };
    }
    map[zone].orderCount++;
    const freight = parseFloat(order.sumFreight) || 0;
    map[zone].totalFreight += freight;
  }

  return Object.values(map)
    .map(z => ({
      ...z,
      totalFreight: Math.round(z.totalFreight * 100) / 100,
      avgFreight: z.orderCount > 0
        ? Math.round((z.totalFreight / z.orderCount) * 100) / 100
        : 0,
    }))
    .sort((a, b) => b.orderCount - a.orderCount);
};

// ── Formatting helpers ───────────────────────────────────────────────────────

window.formatMXN = function (amount) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount || 0);
};

window.formatNum = function (n) {
  return new Intl.NumberFormat('es-MX').format(n || 0);
};

/**
 * Returns ISO date string 'yyyy-MM-dd HH:mm:ss' for N days ago (start of day)
 * or today (end of day) in local time.
 */
window.dateRange = function (daysAgo, isEnd = false) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  if (isEnd) {
    d.setHours(23, 59, 59, 0);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// ── Toast system ─────────────────────────────────────────────────────────────

(function () {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(container));

  window.showToast = function (msg, type = 'info', duration = 3500) {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="flex:1">${msg}</span><span class="toast-dismiss" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, duration);
  };

  window.getErrorMessage = function (err) {
    if (err instanceof AuthError)    return err.message;
    if (err instanceof NetworkError) return err.message;
    if (err instanceof ApiError)     return `API Error: ${err.message}`;
    return err?.message || 'An unexpected error occurred.';
  };

  window.handleApiError = function (err) {
    window.showToast(window.getErrorMessage(err), 'error');
  };
})();

// ── Connection status indicator ──────────────────────────────────────────────

window.updateConnBadge = function () {
  const badge = document.getElementById('conn-badge');
  if (!badge) return;
  const creds = window.getCredentials();
  if (!creds.apiAccount) {
    badge.className = 'conn-badge';
    badge.querySelector('.conn-label').textContent = 'Not configured';
  } else {
    badge.className = 'conn-badge connected';
    const region = (creds.region || 'mx').toUpperCase();
    const mode   = creds.testMode !== false && creds.region !== 'eg' ? ' (Test)' : '';
    badge.querySelector('.conn-label').textContent = region + mode;
  }
};

window.addEventListener('jtcredchanged', window.updateConnBadge);
document.addEventListener('DOMContentLoaded', window.updateConnBadge);
