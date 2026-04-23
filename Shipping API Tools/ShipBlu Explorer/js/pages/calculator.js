/* calculator.js — ShipBlu Explorer Shipping Calculator Page */

;(function () {
  'use strict';

  // ─── Constants ─────────────────────────────────────────────────────────────

  const LS_KEY_GOVERNORATES = 'shipblu_governorates';
  const LS_KEY_HISTORY      = 'shipblu_calc_history';
  const MAX_HISTORY_ITEMS   = 5;

  const PACKAGE_SIZES = [
    { id: 1, name: 'Small Flyer',  badge: 'S-FLY' },
    { id: 2, name: 'Medium Flyer', badge: 'M-FLY' },
    { id: 3, name: 'Large Box',    badge: 'L-BOX' },
    { id: 4, name: 'XL Box',       badge: 'XL'    },
  ];

  // ─── Module state ──────────────────────────────────────────────────────────

  let selectedPackageId = 1;
  let calcHistory       = _loadHistory();

  // ─── Register page ─────────────────────────────────────────────────────────

  window.registerPage('calculator', {
    title: 'Calculator',

    render(container) {
      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyState();
        return;
      }
      container.innerHTML = `${_styles()}${_skeleton()}`;
      _init(container);
    }
  });

  // ─── No-key state ──────────────────────────────────────────────────────────

  function _noKeyState() {
    return `
      <div class="page-header">
        <h2>Shipping Calculator</h2>
        <p class="page-subtitle">Estimate delivery costs instantly</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Connect your ShipBlu account to use the calculator.</p>
        <a href="#settings" class="btn btn-primary" style="margin-top:16px">
          Configure API Key in Settings →
        </a>
      </div>`;
  }

  // ─── Skeleton while loading governorates ───────────────────────────────────

  function _skeleton() {
    return `
      <div class="page-header">
        <h2>Shipping Calculator</h2>
        <p class="page-subtitle">Estimate delivery costs instantly</p>
      </div>
      <div class="card calc-card">
        <div class="card-body">
          <div class="skeleton" style="height:38px;width:100%;border-radius:6px;margin-bottom:16px"></div>
          <div class="skeleton" style="height:80px;width:100%;border-radius:6px;margin-bottom:16px"></div>
          <div class="skeleton" style="height:38px;width:60%;border-radius:6px"></div>
        </div>
      </div>`;
  }

  // ─── Init: load governorates then render form ───────────────────────────────

  async function _init(container) {
    let governorates = _getCachedGovernorates();

    if (!governorates) {
      // Show the form with a disabled loading select immediately
      _renderForm(container, []);
      const govSelect = container.querySelector('#gov-select');
      if (govSelect) {
        govSelect.disabled = true;
        govSelect.innerHTML = '<option value="">Loading zones…</option>';
      }
      const calcBtn = container.querySelector('#calc-btn');
      if (calcBtn) calcBtn.disabled = true;
      try {
        const data    = await window.shipbluApi('GET', '/v1/governorates/');
        governorates  = Array.isArray(data) ? data : (data.results || []);
        _cacheGovernorates(governorates);
        // Populate select now that data arrived
        if (govSelect) {
          govSelect.disabled = false;
          govSelect.innerHTML = '<option value="">Select a governorate…</option>' +
            governorates.map(g => `<option value="${_esc(String(g.id))}" data-name="${_esc(g.name || g.slug || String(g.id))}">${_esc(g.name || g.slug || String(g.id))}</option>`).join('');
        }
        if (calcBtn) calcBtn.disabled = false;
      } catch (err) {
        if (govSelect) {
          govSelect.disabled = false;
          govSelect.innerHTML = '<option value="">Failed to load — retry?</option>';
        }
        if (calcBtn) calcBtn.disabled = false;
        const errEl = container.querySelector('#calc-error');
        if (errEl) {
          errEl.textContent = 'Could not load governorates: ' + _esc(err?.message || 'Unknown error');
          errEl.hidden = false;
        }
        return;
      }
    } else {
      _renderForm(container, governorates);
    }
  }

  // ─── Full form render ──────────────────────────────────────────────────────

  function _renderForm(container, governorates) {
    const govOptions = governorates
      .map(g => `<option value="${_esc(String(g.id))}" data-name="${_esc(g.name || g.slug || String(g.id))}">${_esc(g.name || g.slug || String(g.id))}</option>`)
      .join('');

    const pkgCards = PACKAGE_SIZES.map(pkg => `
      <label
        class="pkg-card${pkg.id === selectedPackageId ? ' pkg-card--selected' : ''}"
        for="pkg-${pkg.id}"
        aria-label="${_esc(pkg.name)}"
      >
        <input
          type="radio"
          id="pkg-${pkg.id}"
          name="package_size"
          value="${pkg.id}"
          class="pkg-radio"
          ${pkg.id === selectedPackageId ? 'checked' : ''}
        />
        <span class="pkg-name">${_esc(pkg.name)}</span>
        <span class="badge badge-neutral pkg-badge">${_esc(pkg.badge)}</span>
      </label>`).join('');

    container.innerHTML = `
      ${_styles()}

      <div class="page-header">
        <h2>Shipping Calculator</h2>
        <p class="page-subtitle">Estimate delivery costs instantly</p>
      </div>

      <div class="card calc-card" aria-labelledby="calc-heading">
        <div class="card-header">
          <h3 id="calc-heading">Calculate Shipping Cost</h3>
          <span class="badge badge-neutral">Delivery</span>
        </div>
        <div class="card-body">
          <form id="calc-form" novalidate>
            <div class="calc-grid">

              <!-- Destination governorate -->
              <div class="form-group">
                <label class="form-label" for="gov-select">Destination Governorate</label>
                <select id="gov-select" class="form-select" required aria-required="true">
                  <option value="">Select a governorate…</option>
                  ${govOptions}
                </select>
              </div>

              <!-- COD amount -->
              <div class="form-group">
                <label class="form-label" for="cod-input">COD Amount (EGP)</label>
                <input
                  id="cod-input"
                  type="number"
                  class="form-input"
                  value="100"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  aria-describedby="cod-hint"
                />
                <p class="form-hint" id="cod-hint">Cash on delivery amount collected from customer</p>
              </div>

            </div><!-- /.calc-grid -->

            <!-- Package size cards -->
            <div class="form-group pkg-group">
              <p class="form-label" id="pkg-size-label">Package Size</p>
              <div class="pkg-cards" role="radiogroup" aria-labelledby="pkg-size-label">
                ${pkgCards}
              </div>
            </div>

            <!-- Error area -->
            <div id="calc-error" class="calc-error" role="alert" aria-live="assertive" hidden></div>

            <button
              type="submit"
              id="calc-btn"
              class="btn btn-primary calc-submit"
              aria-label="Calculate shipping cost"
            >
              Calculate Cost
            </button>
          </form>
        </div>
      </div>

      <!-- Result panel (hidden until first calc) -->
      <div class="card calc-result-card" id="calc-result" aria-live="polite" aria-atomic="true" hidden>
        <div class="card-header">
          <h3>Result</h3>
          <button type="button" class="btn btn-ghost btn-sm" id="copy-result-btn" aria-label="Copy result to clipboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
        </div>
        <div class="card-body">
          <div class="result-metrics" id="result-metrics" role="list" aria-label="Cost breakdown"></div>
        </div>
      </div>

      <!-- History -->
      <div class="card calc-history-card" id="history-section">
        <div class="card-header">
          <h3>Recent Calculations</h3>
          <button type="button" class="btn btn-ghost btn-sm" id="clear-history-btn"
            aria-label="Clear calculation history">
            Clear All
          </button>
        </div>
        <div id="history-list" aria-label="Calculation history" aria-live="polite"></div>
      </div>
    `;

    _bindCalcEvents(container, governorates);
    _renderHistory(container);
  }

  // ─── Event binding ─────────────────────────────────────────────────────────

  function _bindCalcEvents(container, governorates) {
    const form        = container.querySelector('#calc-form');
    const calcBtn     = container.querySelector('#calc-btn');
    const pkgCards    = container.querySelectorAll('.pkg-card');
    const clearHistBtn = container.querySelector('#clear-history-btn');
    const copyBtn     = container.querySelector('#copy-result-btn');

    // Package card selection
    pkgCards.forEach(card => {
      card.addEventListener('click', () => {
        pkgCards.forEach(c => c.classList.remove('pkg-card--selected'));
        card.classList.add('pkg-card--selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          selectedPackageId = parseInt(radio.value, 10);
        }
      });
    });

    // Enter key on inputs triggers calculation
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit'));
      }
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await _runCalculation(container, form, governorates);
    });

    // Clear history — inline "Are you sure?" confirmation toggle
    if (clearHistBtn) {
      let _clearPending = false;
      clearHistBtn.addEventListener('click', () => {
        if (!_clearPending) {
          _clearPending = true;
          clearHistBtn.textContent = 'Sure? Tap again to confirm';
          clearHistBtn.style.color = 'var(--color-red, #ef4444)';
          clearHistBtn.style.borderColor = 'rgba(239,68,68,.4)';
          // Auto-reset after 3 s if user doesn't confirm
          setTimeout(() => {
            if (_clearPending) {
              _clearPending = false;
              clearHistBtn.textContent = 'Clear All';
              clearHistBtn.style.color = '';
              clearHistBtn.style.borderColor = '';
            }
          }, 3000);
        } else {
          _clearPending = false;
          clearHistBtn.textContent = 'Clear All';
          clearHistBtn.style.color = '';
          clearHistBtn.style.borderColor = '';
          calcHistory = [];
          _saveHistory();
          _renderHistory(container);
        }
      });
      // Also reset if button loses focus
      clearHistBtn.addEventListener('blur', () => {
        setTimeout(() => {
          if (_clearPending) {
            _clearPending = false;
            clearHistBtn.textContent = 'Clear All';
            clearHistBtn.style.color = '';
            clearHistBtn.style.borderColor = '';
          }
        }, 200);
      });
    }

    // Copy result
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const resultCard = container.querySelector('#calc-result');
        if (!resultCard || resultCard.hidden) return;
        const summaryText = resultCard.dataset.summary || '';
        if (summaryText) window.copyToClipboard(summaryText);
      });
    }
  }

  // ─── Run calculation ────────────────────────────────────────────────────────

  async function _runCalculation(container, form, governorates) {
    const calcBtn   = container.querySelector('#calc-btn');
    const errorEl   = container.querySelector('#calc-error');
    const govSelect = form.querySelector('#gov-select');
    const codInput  = form.querySelector('#cod-input');

    // Validate
    const govId  = govSelect.value;
    const codAmt = parseFloat(codInput.value) || 0;

    if (!govId) {
      _showCalcError(errorEl, 'Please select a destination governorate.');
      govSelect.focus();
      return;
    }

    if (codAmt < 0) {
      _showCalcError(errorEl, 'COD amount cannot be negative.');
      codInput.focus();
      return;
    }

    _hideCalcError(errorEl);

    // Loading state
    calcBtn.disabled = true;
    calcBtn.innerHTML = `${_spinnerSvg()} Calculating…`;

    try {
      const result = await window.shipbluApi('GET',
        `/v1/delivery-orders/calculate/?governorate=${encodeURIComponent(govId)}&type=1&cash_amount=${encodeURIComponent(codAmt)}`
      );

      // Locate governorate name
      const govName = _getGovName(governorates, govId);
      const pkgInfo = PACKAGE_SIZES.find(p => p.id === selectedPackageId) || PACKAGE_SIZES[0];

      _displayResult(container, result, govName, pkgInfo, codAmt);
      _addToHistory({ govId, govName, pkgInfo, codAmt, result });
      _renderHistory(container);
    } catch (err) {
      _showCalcError(errorEl, err?.message || 'Calculation failed. Please try again.');
    } finally {
      calcBtn.disabled = false;
      calcBtn.innerHTML = 'Calculate Cost';
    }
  }

  // ─── Display result ─────────────────────────────────────────────────────────

  function _displayResult(container, result, govName, pkgInfo, codAmt) {
    const resultCard    = container.querySelector('#calc-result');
    const metricsEl     = container.querySelector('#result-metrics');

    // Parse values — adjust field names to actual API response shape
    const subtotal  = parseFloat(result.subtotal  || result.total_subtotal  || 0);
    const vat       = parseFloat(result.vat        || result.tax             || subtotal * 0.15);
    const insurance = parseFloat(result.insurance  || 0);
    const postalTax = parseFloat(result.postal_tax || result.postal         || 0);
    const total     = parseFloat(result.total      || result.total_amount   || subtotal + vat + insurance + postalTax);

    const fmt = v => window.formatCurrency ? window.formatCurrency(v) : v.toFixed(2) + ' EGP';

    const metrics = [
      { label: 'Subtotal',    value: fmt(subtotal),  highlight: false },
      { label: 'VAT (15%)',   value: fmt(vat),        highlight: false },
      { label: 'Insurance',   value: fmt(insurance),  highlight: false },
      { label: 'Postal Tax',  value: fmt(postalTax),  highlight: false },
      { label: 'Total',       value: fmt(total),      highlight: true  },
    ];

    metricsEl.innerHTML = metrics.map(m => `
      <div class="result-metric${m.highlight ? ' result-metric--total' : ''}" role="listitem">
        <span class="metric-label">${_esc(m.label)}</span>
        <span class="metric-value${m.highlight ? ' text-accent' : ''}">${_esc(m.value)}</span>
      </div>`).join('');

    // Build summary text for clipboard
    const summary = `${govName} → ${fmt(total)} (subtotal: ${fmt(subtotal)} + VAT: ${fmt(vat)})`;
    resultCard.dataset.summary = summary;

    // Reveal with animation
    resultCard.hidden = false;
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(8px)';
    resultCard.style.transition = `opacity var(--duration-normal, 300ms) ease,
      transform var(--duration-normal, 300ms) ease`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
        // Auto-scroll to result panel smoothly
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // ─── History helpers ────────────────────────────────────────────────────────

  function _addToHistory(entry) {
    // Prepend and cap at MAX_HISTORY_ITEMS
    calcHistory = [
      {
        id:       Date.now(),
        govId:    entry.govId,
        govName:  entry.govName,
        pkgId:    entry.pkgInfo.id,
        pkgName:  entry.pkgInfo.name,
        codAmt:   entry.codAmt,
        total:    parseFloat(
          entry.result.total || entry.result.total_amount ||
          entry.result.subtotal || 0
        ),
        ts:       Date.now(),
      },
      ...calcHistory,
    ].slice(0, MAX_HISTORY_ITEMS);

    _saveHistory();
  }

  function _renderHistory(container) {
    const histEl = container.querySelector('#history-list');
    if (!histEl) return;

    if (!calcHistory.length) {
      histEl.innerHTML = `
        <div class="history-empty" aria-label="No history">
          No recent calculations yet.
        </div>`;
      return;
    }

    const fmt = v => window.formatCurrency ? window.formatCurrency(v) : v.toFixed(2) + ' EGP';

    histEl.innerHTML = `<ul class="history-items" role="list">
      ${calcHistory.map((item, idx) => `
        <li class="history-item" role="listitem" data-idx="${idx}" tabindex="0"
          title="Click to re-run this calculation"
          style="cursor:pointer;">
          <span class="history-gov" aria-label="Destination">${_esc(item.govName)}</span>
          <span class="history-sep text-muted" aria-hidden="true">·</span>
          <span class="history-pkg text-muted">${_esc(item.pkgName)}</span>
          <span class="history-sep text-muted" aria-hidden="true">·</span>
          <span class="history-cod text-muted">${fmt(item.codAmt)}</span>
          <span class="history-arrow text-muted" aria-hidden="true">=</span>
          <span class="history-total text-accent">${fmt(item.total)}</span>
          <button
            type="button"
            class="btn btn-ghost btn-sm history-delete-btn"
            aria-label="Delete calculation for ${_esc(item.govName)}"
            data-idx="${idx}"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </li>`).join('')}
    </ul>`;

    // Bind delete buttons (stop propagation so row click doesn't fire)
    histEl.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        calcHistory = calcHistory.filter((_, i) => i !== idx);
        _saveHistory();
        _renderHistory(container);
      });
    });

    // Bind row clicks to re-populate form with that history entry
    histEl.querySelectorAll('.history-item').forEach(li => {
      const rerun = () => {
        const idx = parseInt(li.dataset.idx, 10);
        const item = calcHistory[idx];
        if (!item) return;
        // Restore gov select
        const govSelect = container.querySelector('#gov-select');
        if (govSelect) govSelect.value = String(item.govId);
        // Restore COD
        const codInput = container.querySelector('#cod-input');
        if (codInput) codInput.value = item.codAmt;
        // Restore package card
        const pkgCards = container.querySelectorAll('.pkg-card');
        pkgCards.forEach(card => {
          card.classList.remove('pkg-card--selected');
          const radio = card.querySelector('input[type="radio"]');
          if (radio && radio.value === String(item.pkgId)) {
            radio.checked = true;
            selectedPackageId = item.pkgId;
            card.classList.add('pkg-card--selected');
          }
        });
        // Scroll form into view
        const calcCard = container.querySelector('.calc-card');
        if (calcCard) calcCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (window.showToast) window.showToast('Form re-populated from history', 'info');
      };
      li.addEventListener('click', (e) => {
        if (e.target.closest('.history-delete-btn')) return;
        rerun();
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rerun(); }
      });
    });
  }

  // ─── Storage helpers ────────────────────────────────────────────────────────

  function _loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_HISTORY) || '[]');
    } catch {
      return [];
    }
  }

  function _saveHistory() {
    try {
      localStorage.setItem(LS_KEY_HISTORY, JSON.stringify(calcHistory));
    } catch { /* quota exceeded — ignore */ }
  }

  function _getCachedGovernorates() {
    try {
      const raw = localStorage.getItem(LS_KEY_GOVERNORATES);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      return null;
    }
  }

  function _cacheGovernorates(data) {
    try {
      localStorage.setItem(LS_KEY_GOVERNORATES, JSON.stringify(data));
    } catch { /* ignore */ }
  }

  // ─── UI helpers ────────────────────────────────────────────────────────────

  function _getGovName(governorates, govId) {
    const found = governorates.find(g => String(g.id) === String(govId));
    return found ? (found.name || found.slug || String(govId)) : String(govId);
  }

  function _showCalcError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function _hideCalcError(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _spinnerSvg() {
    return `<svg class="btn-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke-opacity=".25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>`;
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  function _styles() {
    return `<style>
      /* ── Calculator page ── */
      .calc-card,
      .calc-result-card,
      .calc-history-card {
        background: var(--color-surface, var(--bg-surface));
        border: 1px solid var(--color-border, var(--border));
        border-radius: var(--radius, 6px);
        overflow: hidden;
        margin-top: var(--space-5, 20px);
      }
      .calc-card { margin-top: 0; }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4, 16px) var(--space-5, 20px);
        border-bottom: 1px solid var(--color-border, var(--border));
      }
      .card-header h3 {
        font-size: var(--text-sm, 14px);
        font-weight: 600;
      }
      .card-body {
        padding: var(--space-5, 20px);
      }

      /* Two-column grid */
      .calc-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4, 16px);
        margin-bottom: var(--space-4, 16px);
      }
      @media (max-width: 600px) {
        .calc-grid { grid-template-columns: 1fr; }
      }

      /* Package cards */
      .pkg-group { margin-bottom: var(--space-5, 20px); }
      .pkg-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-2, 8px);
        margin-top: var(--space-2, 8px);
      }
      @media (max-width: 640px) {
        .pkg-cards { grid-template-columns: repeat(2, 1fr); }
      }

      .pkg-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: var(--space-3, 12px) var(--space-2, 8px);
        border: 2px solid var(--color-border, var(--border));
        border-radius: var(--radius, 6px);
        cursor: pointer;
        transition: border-color var(--duration-fast, 150ms) ease,
                    background var(--duration-fast, 150ms) ease;
        text-align: center;
        user-select: none;
      }
      .pkg-card:hover {
        border-color: var(--color-accent, var(--accent));
        background: var(--color-elevated, var(--bg-elevated));
      }
      .pkg-card--selected {
        border-color: var(--color-accent, var(--accent));
        background: var(--color-accent-dim, rgba(88,166,255,.08));
      }
      .pkg-radio { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
      .pkg-name  { font-size: var(--text-xs, 11px); font-weight: 600; line-height: 1.3; }
      .pkg-badge { font-size: 10px; margin-top: 2px; }

      /* Calculate button */
      .calc-submit {
        width: 100%;
        margin-top: var(--space-2, 8px);
        justify-content: center;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Error area */
      .calc-error {
        font-size: var(--text-sm, 13px);
        color: var(--color-red, #ef4444);
        background: var(--color-red-dim, rgba(239,68,68,.1));
        border: 1px solid rgba(239,68,68,.25);
        border-radius: var(--radius, 6px);
        padding: 8px 12px;
        margin-bottom: var(--space-3, 12px);
      }

      /* Result metrics */
      .result-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3, 12px);
        justify-content: space-between;
      }
      .result-metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 80px;
        padding: var(--space-3, 12px);
        background: var(--color-elevated, var(--bg-elevated));
        border-radius: var(--radius, 6px);
        border: 1px solid var(--color-border, var(--border));
      }
      .result-metric--total {
        border-color: var(--color-accent, var(--accent));
        background: var(--color-accent-dim, rgba(88,166,255,.08));
      }
      .metric-label {
        font-size: var(--text-xs, 11px);
        color: var(--color-text-muted, var(--text-secondary));
        text-transform: uppercase;
        letter-spacing: .5px;
      }
      .metric-value {
        font-size: var(--text-base, 15px);
        font-weight: 700;
        font-family: var(--font-mono, monospace);
      }
      .result-metric--total .metric-value {
        font-size: var(--text-lg, 18px);
      }

      /* History */
      .history-items {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .history-item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-2, 8px);
        padding: var(--space-3, 12px) var(--space-5, 20px);
        border-bottom: 1px solid var(--color-border, var(--border));
        font-size: var(--text-sm, 13px);
        transition: background var(--duration-fast, 150ms) ease;
      }
      .history-item:last-child { border-bottom: none; }
      .history-item:hover { background: var(--color-elevated, var(--bg-elevated)); }
      .history-gov   { font-weight: 600; }
      .history-arrow { margin: 0 2px; }
      .history-total { font-family: var(--font-mono, monospace); font-weight: 700; }
      .history-delete-btn {
        margin-left: auto;
        opacity: .4;
        padding: 3px 6px;
      }
      .history-delete-btn:hover { opacity: 1; color: var(--color-red, #ef4444); }
      .history-empty {
        padding: var(--space-5, 20px);
        text-align: center;
        font-size: var(--text-sm, 13px);
        color: var(--color-text-muted, var(--text-secondary));
      }

      @keyframes spin { to { transform: rotate(360deg); } }
      .btn-spinner { animation: spin .7s linear infinite; }
    </style>`;
  }

})();
