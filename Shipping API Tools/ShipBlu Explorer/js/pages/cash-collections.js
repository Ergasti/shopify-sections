/* cash-collections.js — ShipBlu Explorer Cash Collections Page */
;(function () {
  'use strict';

  // ─── Page registration ────────────────────────────────────────────────────

  window.registerPage('cash-collections', {
    title: 'Cash Collections',

    render(container) {
      _injectStyles();

      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyHtml();
        return;
      }

      container.innerHTML = _shellHtml();
      _loadCollections(container);
    }
  });

  // ─── Styles ───────────────────────────────────────────────────────────────

  function _injectStyles() {
    const id = 'cc-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
/* ── Cash Collections scoped styles ── */

/* Summary card */
.cc-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: var(--space-6, 24px);
}
@media (max-width: 600px) { .cc-summary { grid-template-columns: 1fr; } }

.cc-summary-card {
  background: var(--color-elevated, rgba(255,255,255,.03));
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cc-summary-label {
  font-size: var(--text-xs, 11px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--color-text-muted, #8b949e);
}
.cc-summary-value {
  font-size: var(--text-lg, 20px);
  font-weight: 700;
  font-family: var(--font-mono, monospace);
  color: var(--color-text, #e6edf3);
}
.cc-summary-card.cc-summary-total .cc-summary-value {
  color: var(--color-accent, #58a6ff);
}
.cc-summary-card.cc-summary-pending .cc-summary-value {
  color: var(--color-warning, #d4a017);
}
.cc-summary-card.cc-summary-paid .cc-summary-value {
  color: var(--color-success, #3fb950);
}

.cc-skeleton-row td div { height: 14px; width: 70%; border-radius: 4px; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
    `;
    document.head.appendChild(style);
  }

  // ─── No-key state ─────────────────────────────────────────────────────────

  function _noKeyHtml() {
    return `
      <div class="page-header">
        <h2>Cash Collections</h2>
        <p class="page-subtitle">Track collected cash from deliveries</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Connect your ShipBlu account to view cash collections.</p>
        <a href="#settings" class="btn btn-primary" style="margin-top:16px">Set up your API key in Settings →</a>
      </div>`;
  }

  // ─── Page shell with skeleton ──────────────────────────────────────────────

  function _shellHtml() {
    return `
      <div class="page-header">
        <div>
          <div class="skeleton" style="height:24px;width:180px;border-radius:4px;margin-bottom:6px"></div>
          <div class="skeleton" style="height:14px;width:240px;border-radius:4px"></div>
        </div>
      </div>

      <div id="cc-summary" style="display:none"></div>
      <div id="cc-content">${_skeletonHtml()}</div>`;
  }

  function _skeletonHtml() {
    const rows = Array(6).fill(0).map(() => `
      <tr class="cc-skeleton-row">
        ${Array(6).fill(0).map(() => `<td><div class="skeleton"></div></td>`).join('')}
      </tr>`).join('');

    return `
      <section class="card" aria-label="Cash collections loading" aria-busy="true">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tracking / Ref</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
  }

  // ─── Load ─────────────────────────────────────────────────────────────────

  async function _loadCollections(container) {
    try {
      const data = await window.shipbluApi('GET', '/v1/cash-collections/');
      const results = data.results || (Array.isArray(data) ? data : []);
      _renderCollections(container, results, data.count || results.length);
    } catch (err) {
      _renderError(container, err);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  function _renderCollections(container, results, count) {
    const summaryEl = container.querySelector('#cc-summary');
    const contentEl = container.querySelector('#cc-content');

    // Replace header skeleton with real heading
    const headerEl = container.querySelector('.page-header');
    if (headerEl) {
      headerEl.innerHTML = `
        <div>
          <h2>Cash Collections
            ${count > 0 ? `<span class="badge badge-neutral" style="margin-left:8px;vertical-align:middle">${_esc(String(count))}</span>` : ''}
          </h2>
          <p class="page-subtitle">Track collected cash from deliveries</p>
        </div>`;
    }

    // Summary stats
    const totalCod  = results.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const pending   = results.filter(r => (r.status || '').toLowerCase() === 'pending').length;
    const paid      = results.filter(r => ['paid', 'collected'].includes((r.status || '').toLowerCase())).length;
    const totalFmt  = window.formatCurrency ? window.formatCurrency(totalCod) : `${totalCod.toFixed(2)} EGP`;

    summaryEl.innerHTML = `
      <div class="cc-summary" role="region" aria-label="Collections summary">
        <div class="cc-summary-card cc-summary-total">
          <span class="cc-summary-label">Total COD Collected</span>
          <span class="cc-summary-value">${_esc(totalFmt)}</span>
        </div>
        <div class="cc-summary-card cc-summary-pending">
          <span class="cc-summary-label">Pending</span>
          <span class="cc-summary-value">${_esc(String(pending))}</span>
        </div>
        <div class="cc-summary-card cc-summary-paid">
          <span class="cc-summary-label">Paid / Collected</span>
          <span class="cc-summary-value">${_esc(String(paid))}</span>
        </div>
      </div>`;
    summaryEl.style.display = '';

    // Empty state
    if (results.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            ${_walletIcon()}
          </div>
          <h3>No cash collections yet</h3>
          <p>COD orders will appear here once collected.<br>
             Collections are created automatically after cash-on-delivery orders are completed.</p>
        </div>`;
      return;
    }

    // Table
    const rows = results.map(r => _collectionRow(r)).join('');

    contentEl.innerHTML = `
      <section class="card" aria-label="Cash collections table" aria-live="polite">
        <div class="table-wrap">
          <table role="table" aria-label="Cash collections">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tracking / Ref</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
  }

  function _collectionRow(r) {
    const id        = r.id || '—';
    const trackRef  = r.tracking_number || r.order_reference || r.merchant_order_reference || r.order || '—';
    const amount    = window.formatCurrency
      ? window.formatCurrency(parseFloat(r.amount) || 0)
      : `${(parseFloat(r.amount) || 0).toFixed(2)} EGP`;
    const statusCls = _statusBadgeClass(r.status);
    const statusLbl = _statusLabel(r.status);
    const date      = window.formatDate ? window.formatDate(r.created || r.date) : _shortDate(r.created || r.date);

    return `
      <tr>
        <td><span class="text-mono">#${_esc(String(id))}</span></td>
        <td><span class="text-mono">${_esc(String(trackRef))}</span></td>
        <td><span class="text-mono" style="font-weight:600">${_esc(amount)}</span></td>
        <td><span class="badge ${statusCls}">${_esc(statusLbl)}</span></td>
        <td class="text-muted">${_esc(date)}</td>
        <td>
          ${r.id
            ? `<button class="btn btn-ghost btn-sm"
                 onclick="window.showToast('Collection detail view coming soon.', 'info')"
                 aria-label="View collection #${_esc(String(id))}">View →</button>`
            : ''}
        </td>
      </tr>`;
  }

  // ─── Error state ────────────────────────────────────────────────────────────

  function _renderError(container, err) {
    const contentEl = container.querySelector('#cc-content');
    if (!contentEl) return;

    let msg  = 'An unexpected error occurred.';
    let hint = '';

    if (err && err.name === 'AuthError') {
      msg  = 'Authentication failed.';
      hint = 'Please check your API key in <a href="#settings" style="color:var(--color-accent,#58a6ff)">Settings</a>.';
    } else if (err && err.name === 'NetworkError') {
      msg  = 'Network error.';
      hint = 'Check your connection and try again.';
    } else if (err && err.name === 'CorsError') {
      msg  = 'CORS error.';
      hint = 'The API did not allow this request. Try refreshing.';
    } else if (err && err.message) {
      msg = err.message;
    }

    contentEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-wrap" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
            style="color:var(--color-error,#f85149);opacity:.7">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3>Failed to load collections</h3>
        <p>${_esc(msg)}${hint ? ` ${hint}` : ''}</p>
        <button class="btn btn-primary" style="margin-top:16px"
          onclick="window.navigateTo('cash-collections')">Retry</button>
      </div>`;
  }

  // ─── SVG icons ─────────────────────────────────────────────────────────────

  function _walletIcon() {
    return `<svg width="56" height="56" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true"
      style="color:var(--color-text-muted,#8b949e)">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>`;
  }

  // ─── Utilities ─────────────────────────────────────────────────────────────

  function _statusBadgeClass(status) {
    const map = {
      paid:       'badge-success',
      collected:  'badge-success',
      pending:    'badge-warning',
      processing: 'badge-info',
      failed:     'badge-error',
      cancelled:  'badge-error',
    };
    return map[(status || '').toLowerCase()] || 'badge-neutral';
  }

  function _statusLabel(status) {
    if (!status) return '—';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function _shortDate(val) {
    if (!val) return '—';
    try { return new Date(val).toLocaleDateString(); } catch (_) { return String(val).slice(0, 10); }
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

})();
