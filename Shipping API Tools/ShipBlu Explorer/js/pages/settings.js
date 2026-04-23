/* settings.js — ShipBlu Explorer Settings Page */

;(function () {
  'use strict';

  // ─── Constants ─────────────────────────────────────────────────────────────

  const LS_KEY_LAST_TESTED    = 'shipblu_last_tested';
  const LS_KEY_API_KEY        = 'shipblu_api_key';
  const SS_KEY_ONBOARD_DISMISS = 'shipblu_onboard_dismissed';
  const BASE_URL              = 'https://api.shipblu.com/api';

  // ─── Register page ─────────────────────────────────────────────────────────

  window.registerPage('settings', {
    title: 'Settings',

    render(container) {
      _renderSettings(container);
    }
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _maskKey(key) {
    if (!key || key.length <= 8) return key;
    const visible = 4;
    return key.slice(0, visible) + '•'.repeat(key.length - visible * 2) + key.slice(-visible);
  }

  function _formatLastTested(ts) {
    if (!ts) return 'Never';
    const d = new Date(parseInt(ts, 10));
    if (isNaN(d.getTime())) return 'Never';
    return window.formatDate ? window.formatDate(d) : d.toLocaleString();
  }

  // ─── Main render ───────────────────────────────────────────────────────────

  function _renderSettings(container) {
    const currentKey     = window.getApiKey ? window.getApiKey() : '';
    const lastTestedTs   = localStorage.getItem(LS_KEY_LAST_TESTED);
    const onboardDismiss = sessionStorage.getItem(SS_KEY_ONBOARD_DISMISS);
    const showOnboard    = !currentKey && !onboardDismiss;

    container.innerHTML = `
      ${_styles()}

      ${showOnboard ? _onboardingBanner() : ''}

      <div class="page-header">
        <h2>Settings</h2>
        <p class="page-subtitle">Configure your ShipBlu API connection</p>
      </div>

      <div class="settings-layout">

        <!-- Section 1: API Connection -->
        <section class="card settings-card" aria-labelledby="api-connection-heading">
          <div class="card-header">
            <h3 id="api-connection-heading">API Connection</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label" for="api-key-input">API Key</label>
              <div class="key-input-wrap">
                <input
                  id="api-key-input"
                  type="text"
                  class="form-input key-input"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                  value="${_escHtml(_maskKey(currentKey))}"
                  aria-describedby="api-key-hint api-key-security-tip"
                  data-real-value="${_escHtml(currentKey)}"
                  data-masked="true"
                  placeholder="Enter your ShipBlu API key"
                />
                <button
                  type="button"
                  class="btn btn-ghost btn-sm key-toggle-btn"
                  id="key-visibility-btn"
                  aria-label="Show API key"
                  aria-pressed="false"
                  title="Toggle key visibility"
                >
                  ${_eyeIcon()}
                </button>
                ${currentKey ? `
                <button
                  type="button"
                  class="btn btn-ghost btn-sm key-copy-btn"
                  id="key-copy-btn"
                  aria-label="Copy API key"
                  title="Copy API key to clipboard"
                >
                  ${_copyIcon()}
                </button>` : ''}
              </div>
              <p class="form-hint" id="api-key-hint">
                Your API key from the ShipBlu merchant dashboard. Stored locally in your browser.
              </p>
              <p class="security-tip" id="api-key-security-tip" role="note">
                ⚠ Never share your API key — it grants full account access
              </p>
            </div>

            <div class="settings-actions" role="group" aria-label="API key actions">
              <button type="button" class="btn btn-primary" id="save-key-btn">
                Save
              </button>
              <button type="button" class="btn btn-ghost" id="test-conn-btn">
                Test Connection
              </button>
              <button type="button" class="btn btn-danger btn-sm" id="clear-key-btn">
                Clear
              </button>
            </div>

            <div id="test-result-area" aria-live="polite" aria-atomic="true"></div>
          </div>
        </section>

        <!-- Section 2: Connection Status -->
        <section class="card settings-card" aria-labelledby="conn-status-heading">
          <div class="card-header">
            <h3 id="conn-status-heading">Connection Status</h3>
          </div>
          <div class="card-body">
            <div class="status-grid">
              <div class="status-row">
                <span class="status-label">Status</span>
                <span id="status-indicator" class="status-value">
                  ${_statusIndicator(currentKey)}
                </span>
              </div>
              <div class="status-row">
                <span class="status-label">Last Tested</span>
                <span class="status-value text-mono" id="last-tested-value">
                  ${_escHtml(_formatLastTested(lastTestedTs))}
                </span>
              </div>
              <div class="status-row">
                <span class="status-label">Base URL</span>
                <span class="status-value text-mono base-url-value">
                  ${_escHtml(BASE_URL)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: About -->
        <section class="card settings-card" aria-labelledby="about-heading">
          <div class="card-header">
            <h3 id="about-heading">About</h3>
          </div>
          <div class="card-body">
            <div class="about-body">
              <p class="about-version">ShipBlu Explorer <span class="badge badge-info">v1.0</span></p>
              <p class="about-desc">
                A local developer tool for exploring the ShipBlu shipping API.
                Browse orders, calculate shipping costs, and manage returns from your browser.
              </p>
              <div class="warning-note" role="note" aria-label="Security warning">
                ⚠ This tool stores your API key in browser localStorage.
                Do not use on shared or public computers.
              </div>
            </div>
          </div>
        </section>

      </div><!-- /.settings-layout -->
    `;

    _bindEvents(container, currentKey);
  }

  // ─── Onboarding banner ─────────────────────────────────────────────────────

  function _onboardingBanner() {
    return `
      <div class="onboarding-banner" role="region" aria-label="Welcome message" id="onboarding-banner">
        <div class="onboarding-icon" aria-hidden="true">🚀</div>
        <div class="onboarding-body">
          <strong>Welcome to ShipBlu Explorer!</strong>
          Enter your API key below to get started.
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-sm onboarding-dismiss"
          id="onboard-dismiss-btn"
          aria-label="Dismiss welcome message"
        >
          ✕
        </button>
      </div>`;
  }

  // ─── Status indicator ──────────────────────────────────────────────────────

  function _statusIndicator(key, verified = false, disconnected = false) {
    if (disconnected) {
      return `<span class="conn-status conn-disconnected" aria-label="Disconnected">
        ${_crossIcon()} Disconnected
      </span>`;
    }
    if (verified) {
      return `<span class="conn-status conn-connected" aria-label="Connected and verified">
        ${_checkIcon()} Connected
      </span>`;
    }
    if (key) {
      return `<span class="conn-status conn-key-set" aria-label="API key set, not yet tested">
        ${_checkIcon()} Key set
      </span>`;
    }
    return `<span class="conn-status conn-disconnected" aria-label="No API key set">
      ${_crossIcon()} No API Key
    </span>`;
  }

  // ─── SVG icons ─────────────────────────────────────────────────────────────

  function _eyeIcon(open = true) {
    if (open) {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`;
    }
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;
  }

  function _checkIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;
  }

  function _crossIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`;
  }

  function _spinnerSvg() {
    return `<svg class="btn-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke-opacity=".25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
    </svg>`;
  }

  function _copyIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>`;
  }

  // ─── Event binding ─────────────────────────────────────────────────────────

  function _bindEvents(container, initialKey) {
    // Track current revealed state
    let isRevealed = false;

    const inputEl     = container.querySelector('#api-key-input');
    const toggleBtn   = container.querySelector('#key-visibility-btn');
    const copyBtn     = container.querySelector('#key-copy-btn');
    const saveBtn     = container.querySelector('#save-key-btn');
    const testBtn     = container.querySelector('#test-conn-btn');
    const clearBtn    = container.querySelector('#clear-key-btn');
    const dismissBtn  = container.querySelector('#onboard-dismiss-btn');

    // On focus: reveal full key for editing
    inputEl.addEventListener('focus', () => {
      if (!isRevealed) {
        const realVal = inputEl.dataset.realValue || '';
        inputEl.value = realVal;
        inputEl.dataset.masked = 'false';
      }
    });

    // On blur: if still masked mode, re-mask
    inputEl.addEventListener('blur', () => {
      if (!isRevealed) {
        const typed = inputEl.value.trim();
        inputEl.dataset.realValue = typed;
        inputEl.value = _maskKey(typed);
        inputEl.dataset.masked = 'true';
      }
    });

    // Show / hide toggle
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isRevealed = !isRevealed;
        const realVal = inputEl.dataset.realValue || inputEl.value;

        if (isRevealed) {
          inputEl.value = realVal;
          inputEl.dataset.masked = 'false';
          toggleBtn.setAttribute('aria-pressed', 'true');
          toggleBtn.setAttribute('aria-label', 'Hide API key');
          toggleBtn.innerHTML = _eyeIcon(false);
        } else {
          inputEl.dataset.realValue = realVal;
          inputEl.value = _maskKey(realVal);
          inputEl.dataset.masked = 'true';
          toggleBtn.setAttribute('aria-pressed', 'false');
          toggleBtn.setAttribute('aria-label', 'Show API key');
          toggleBtn.innerHTML = _eyeIcon(true);
        }
      });
    }

    // Copy API key
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const keyToCopy = (inputEl.dataset.realValue || '').trim() || (isRevealed ? inputEl.value.trim() : '');
        if (!keyToCopy) {
          window.showToast('No API key to copy.', 'error');
          return;
        }
        if (window.copyToClipboard) {
          window.copyToClipboard(keyToCopy);
        } else {
          navigator.clipboard.writeText(keyToCopy).then(() => {
            window.showToast('API key copied to clipboard', 'success');
          }).catch(() => {
            window.showToast('Could not copy to clipboard', 'error');
          });
        }
      });
    }

    // Save
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const typedVal = isRevealed
          ? inputEl.value.trim()
          : (inputEl.dataset.realValue || '').trim();

        if (!typedVal) {
          window.showToast('Please enter an API key before saving.', 'error');
          inputEl.focus();
          return;
        }

        window.setApiKey(typedVal);
        inputEl.dataset.realValue = typedVal;
        if (!isRevealed) {
          inputEl.value = _maskKey(typedVal);
        }

        _updateStatusIndicator(container, typedVal);
        window.showToast('API key saved', 'success');
      });
    }

    // Test connection
    if (testBtn) {
      testBtn.addEventListener('click', () => _testConnection(container, inputEl, testBtn, isRevealed));
    }

    // Clear
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        window.setApiKey('');
        inputEl.value = '';
        inputEl.dataset.realValue = '';
        isRevealed = false;
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-pressed', 'false');
          toggleBtn.setAttribute('aria-label', 'Show API key');
          toggleBtn.innerHTML = _eyeIcon(true);
        }
        _updateStatusIndicator(container, '');
        window.showToast('API key cleared', 'info');
      });
    }

    // Onboarding dismiss
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        sessionStorage.setItem(SS_KEY_ONBOARD_DISMISS, 'true');
        const banner = container.querySelector('#onboarding-banner');
        if (banner) {
          banner.style.opacity = '0';
          banner.style.transition = 'opacity 200ms ease';
          setTimeout(() => banner.remove(), 210);
        }
      });
    }
  }

  // ─── Test connection ───────────────────────────────────────────────────────

  async function _testConnection(container, inputEl, testBtn, isRevealed) {
    // Grab the key that would be used — prefer input current value
    const keyToTest = isRevealed
      ? inputEl.value.trim()
      : (inputEl.dataset.realValue || window.getApiKey() || '').trim();

    if (!keyToTest) {
      window.showToast('Enter an API key first to test the connection.', 'error');
      return;
    }

    // Temporarily override the stored key for the test request
    const previousKey = window.getApiKey();
    window.setApiKey(keyToTest);

    const resultArea = container.querySelector('#test-result-area');

    testBtn.disabled = true;
    testBtn.innerHTML = `${_spinnerSvg()} Testing…`;

    if (resultArea) resultArea.innerHTML = '';

    try {
      await window.shipbluApi('GET', '/v1/governorates/');

      // Success
      localStorage.setItem(LS_KEY_LAST_TESTED, Date.now().toString());
      _updateLastTested(container);
      _updateStatusIndicator(container, keyToTest, /* verified */ true, /* disconnected */ false);

      window.showToast('Connection successful — API key is valid.', 'success');

      if (resultArea) {
        resultArea.innerHTML = `
          <div class="test-result test-result-ok" role="status">
            ${_checkIcon()} Connected successfully
          </div>`;
      }
    } catch (err) {
      // Restore previous key if test key was different and not saved
      if (keyToTest !== previousKey) {
        window.setApiKey(previousKey);
      }

      _updateStatusIndicator(container, previousKey, /* verified */ false, /* disconnected */ true);

      const msg = window.getErrorMessage ? window.getErrorMessage(err) : (err?.message || 'Network error — check your connection.');
      window.showToast(msg, 'error');

      if (resultArea) {
        resultArea.innerHTML = `
          <div class="test-result test-result-err" role="alert">
            ${_crossIcon()} ${_escHtml(msg)}
          </div>`;
      }
    } finally {
      testBtn.disabled = false;
      testBtn.innerHTML = 'Test Connection';
    }
  }

  // ─── Live UI updates ───────────────────────────────────────────────────────

  function _updateStatusIndicator(container, key, verified = false, disconnected = false) {
    const el = container.querySelector('#status-indicator');
    if (el) el.innerHTML = _statusIndicator(key, verified, disconnected);
  }

  function _updateLastTested(container) {
    const el = container.querySelector('#last-tested-value');
    if (el) {
      const ts = localStorage.getItem(LS_KEY_LAST_TESTED);
      el.textContent = _formatLastTested(ts);
    }
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  function _styles() {
    return `<style>
      /* ── Settings page ── */
      .settings-layout {
        display: flex;
        flex-direction: column;
        gap: var(--space-5, 20px);
        max-width: 680px;
      }

      .settings-card .card-header {
        padding: var(--space-4, 16px) var(--space-5, 20px);
        border-bottom: 1px solid var(--color-border, var(--border));
      }
      .settings-card .card-header h3 {
        font-size: var(--text-sm, 14px);
        font-weight: 600;
        letter-spacing: .3px;
        text-transform: uppercase;
        color: var(--color-text-muted, var(--text-secondary));
      }
      .settings-card .card-body {
        padding: var(--space-5, 20px);
        display: flex;
        flex-direction: column;
        gap: var(--space-4, 16px);
      }

      /* Key input row */
      .key-input-wrap {
        display: flex;
        align-items: center;
        gap: var(--space-2, 8px);
      }
      .key-input {
        flex: 1;
        font-family: var(--font-mono, monospace);
        font-size: var(--text-sm, 13px);
        letter-spacing: .5px;
      }
      .key-toggle-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        color: var(--color-text-muted, var(--text-secondary));
        border-radius: var(--radius-sm, 4px);
      }
      .key-toggle-btn:hover { color: var(--color-text, var(--text)); }

      /* Copy key button */
      .key-copy-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        color: var(--color-text-muted, var(--text-secondary));
        border-radius: var(--radius-sm, 4px);
      }
      .key-copy-btn:hover { color: var(--color-text, var(--text)); }

      /* Security tip */
      .security-tip {
        font-size: var(--text-xs, 11px);
        color: var(--color-amber, #f59e0b);
        background: var(--color-amber-dim, rgba(245,158,11,.08));
        border: 1px solid rgba(245,158,11,.2);
        border-radius: var(--radius-sm, 4px);
        padding: 5px 10px;
        margin-top: 2px;
        line-height: 1.4;
      }

      /* Action buttons row */
      .settings-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2, 8px);
        align-items: center;
      }

      /* Test result pill */
      .test-result {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: var(--text-sm, 13px);
        padding: 6px 12px;
        border-radius: var(--radius, 6px);
        margin-top: 4px;
      }
      .test-result-ok {
        color: #22c55e;
        background: rgba(34,197,94,.1);
        border: 1px solid rgba(34,197,94,.25);
      }
      .test-result-err {
        color: var(--color-red, #ef4444);
        background: var(--color-red-dim, rgba(239,68,68,.1));
        border: 1px solid var(--color-red, rgba(239,68,68,.25));
      }

      /* Status grid */
      .status-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 12px);
      }
      .status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4, 16px);
        padding: var(--space-2, 8px) 0;
        border-bottom: 1px solid var(--color-border, var(--border));
      }
      .status-row:last-child { border-bottom: none; }
      .status-label {
        font-size: var(--text-sm, 13px);
        color: var(--color-text-muted, var(--text-secondary));
        flex-shrink: 0;
      }
      .status-value {
        font-size: var(--text-sm, 13px);
        text-align: right;
      }
      .base-url-value {
        font-size: var(--text-xs, 11px);
        color: var(--color-text-muted, var(--text-secondary));
        word-break: break-all;
      }

      /* Connection status badge */
      .conn-status {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: var(--text-sm, 13px);
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 99px;
      }
      .conn-connected {
        color: #22c55e;
        background: rgba(34,197,94,.12);
        border: 1px solid rgba(34,197,94,.3);
      }
      .conn-key-set {
        color: var(--color-amber, #f59e0b);
        background: var(--color-amber-dim, rgba(245,158,11,.1));
        border: 1px solid rgba(245,158,11,.25);
      }
      .conn-disconnected {
        color: var(--color-red, #ef4444);
        background: var(--color-red-dim, rgba(239,68,68,.1));
        border: 1px solid rgba(239,68,68,.25);
      }

      /* About section */
      .about-body {
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 12px);
      }
      .about-version {
        font-size: var(--text-base, 15px);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .about-desc {
        font-size: var(--text-sm, 13px);
        color: var(--color-text-muted, var(--text-secondary));
        line-height: 1.6;
      }
      .warning-note {
        font-size: var(--text-sm, 13px);
        color: var(--color-amber, #f59e0b);
        background: var(--color-amber-dim, rgba(245,158,11,.1));
        border: 1px solid rgba(245,158,11,.25);
        border-radius: var(--radius, 6px);
        padding: var(--space-3, 12px) var(--space-4, 16px);
        line-height: 1.5;
      }

      /* Onboarding banner */
      .onboarding-banner {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3, 12px);
        background: var(--color-blue-dim, rgba(59,130,246,.1));
        border: 1px solid var(--color-blue, rgba(59,130,246,.35));
        border-radius: var(--radius, 6px);
        padding: var(--space-4, 16px);
        margin-bottom: var(--space-5, 20px);
        max-width: 680px;
      }
      .onboarding-icon { font-size: 20px; flex-shrink: 0; line-height: 1.2; }
      .onboarding-body {
        flex: 1;
        font-size: var(--text-sm, 13px);
        line-height: 1.5;
        color: var(--color-text, var(--text));
      }
      .onboarding-dismiss {
        flex-shrink: 0;
        opacity: .6;
        padding: 2px 6px;
      }
      .onboarding-dismiss:hover { opacity: 1; }

      /* Spinner animation */
      @keyframes spin { to { transform: rotate(360deg); } }
      .btn-spinner { animation: spin .7s linear infinite; vertical-align: middle; }

      /* Card base (if not globally defined) */
      .settings-card {
        background: var(--color-surface, var(--bg-surface));
        border: 1px solid var(--color-border, var(--border));
        border-radius: var(--radius, 6px);
        overflow: hidden;
      }
    </style>`;
  }

})();
