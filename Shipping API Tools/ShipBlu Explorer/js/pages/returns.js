/* returns.js — ShipBlu Explorer Returns Page */

;(function () {
  'use strict';

  // ─── Register page ─────────────────────────────────────────────────────────

  window.registerPage('returns', {
    title: 'Returns',

    render(container) {
      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyState();
        return;
      }
      container.innerHTML = `${_styles()}${_loadingState()}`;
      _loadReturns(container);
    }
  });

  // ─── No-key state ──────────────────────────────────────────────────────────

  function _noKeyState() {
    return `
      <div class="page-header">
        <h2>Returns</h2>
        <p class="page-subtitle">Manage return orders</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Please configure your API key in Settings to view returns.</p>
        <a href="#settings" class="btn btn-primary" style="margin-top:16px">
          Configure API Key in Settings →
        </a>
      </div>`;
  }

  // ─── Skeleton / loading state ──────────────────────────────────────────────

  function _loadingState() {
    const skeletonRows = Array(7).fill(0).map(() => `
      <tr aria-hidden="true">
        ${Array(7).fill(0).map(() =>
          `<td><div class="skeleton" style="height:14px;width:75%"></div></td>`
        ).join('')}
      </tr>`).join('');

    return `
      <div class="page-header">
        <div class="page-header-main">
          <div>
            <div class="skeleton" style="height:24px;width:120px;border-radius:4px;margin-bottom:6px"></div>
            <div class="skeleton" style="height:14px;width:200px;border-radius:4px"></div>
          </div>
          <div class="skeleton" style="height:32px;width:120px;border-radius:var(--radius-sm,4px)"></div>
        </div>
      </div>
      ${_apiBanner()}
      <div class="card returns-card">
        <div class="table-wrap">
          <table aria-label="Returns loading" aria-busy="true">
            <thead>
              <tr>
                ${_tableHeaders()}
              </tr>
            </thead>
            <tbody>${skeletonRows}</tbody>
          </table>
        </div>
      </div>`;
  }

  // ─── Fetch returns ─────────────────────────────────────────────────────────

  async function _loadReturns(container) {
    try {
      const data    = await window.shipbluApi('GET', '/v1/returns/');
      const results = Array.isArray(data) ? data : (data.results || []);
      _renderReturns(container, results, data);
    } catch (err) {
      _renderError(container, err);
    }
  }

  // ─── Render results ─────────────────────────────────────────────────────────

  function _renderReturns(container, results, meta) {
    const total = (meta && meta.count != null) ? meta.count : results.length;

    container.innerHTML = `
      ${_styles()}
      <div class="page-header">
        <div class="page-header-main">
          <div>
            <h2>Returns
              ${total > 0 ? `<span class="badge badge-neutral" style="margin-left:8px;vertical-align:middle">${_esc(String(total))}</span>` : ''}
            </h2>
            <p class="page-subtitle">Manage return orders</p>
          </div>
          ${_createReturnButton()}
        </div>
      </div>

      ${_apiBanner()}

      <div class="card returns-card">
        ${results.length === 0 ? _emptyState() : _returnsTable(results)}
      </div>
    `;
  }

  // ─── Empty state ───────────────────────────────────────────────────────────

  function _emptyState() {
    return `
      <div class="empty-state returns-empty" role="status" aria-label="No returns">
        <div class="empty-icon-wrap" aria-hidden="true">
          ${_boxArrowIcon()}
        </div>
        <h3>No return orders yet</h3>
        <p>Returns are created when customers send items back.<br>
           They will appear here once your first return is submitted.</p>
      </div>`;
  }

  // ─── Returns table ─────────────────────────────────────────────────────────

  function _returnsTable(results) {
    const rows = results.map(r => {
      const trackNum  = _safe(r.tracking_number);
      const customer  = _safe(r.customer && (r.customer.full_name || r.customer.name));
      const reason    = _safe(r.reason || r.return_reason || r.notes);
      const status    = _safe(r.status);
      const date      = window.formatDate ? window.formatDate(r.created || r.created_at) : _safe(r.created || r.created_at);
      const statusCls = _statusBadgeClass(status);

      return `
        <tr class="return-row">
          <td class="text-mono">${_esc(String(r.id || '—'))}</td>
          <td class="text-mono">${_esc(trackNum)}</td>
          <td>${_esc(customer)}</td>
          <td class="text-muted" style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${_esc(reason)}">${_esc(reason)}</td>
          <td><span class="badge ${_esc(statusCls)}">${_esc(_statusLabel(status))}</span></td>
          <td>${_esc(date)}</td>
          <td>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              aria-label="View return ${_esc(trackNum)}"
              onclick="window.showToast('Return detail view coming soon.', 'info')"
            >
              View →
            </button>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="table-wrap">
        <table role="table" aria-label="Return orders">
          <thead>
            <tr>${_tableHeaders()}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  // ─── Error state ───────────────────────────────────────────────────────────

  function _renderError(container, err) {
    container.innerHTML = `
      ${_styles()}
      <div class="page-header">
        <div class="page-header-main">
          <div>
            <h2>Returns</h2>
            <p class="page-subtitle">Manage return orders</p>
          </div>
          ${_createReturnButton()}
        </div>
      </div>
      ${_apiBanner()}
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
        <h3>Failed to load returns</h3>
        <p>${_esc(err?.message || 'An unexpected error occurred.')}</p>
        <button class="btn btn-primary" style="margin-top:16px"
          onclick="window.navigateTo('returns')">
          Retry
        </button>
      </div>`;
  }

  // ─── Shared fragments ──────────────────────────────────────────────────────

  function _createReturnButton() {
    return `
      <div class="tooltip-wrap">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          disabled
          aria-disabled="true"
          aria-describedby="create-return-tooltip"
        >
          + Create Return
        </button>
        <span class="tooltip-text" id="create-return-tooltip" role="tooltip">
          Coming soon
        </span>
      </div>`;
  }

  function _apiBanner() {
    return `
      <div class="api-banner" role="note" aria-label="API endpoint reference">
        <span class="api-banner-label">Returns API</span>
        <code class="api-banner-code">GET /v1/returns/</code>
        <span class="api-banner-sep text-muted">·</span>
        <code class="api-banner-code">POST /v1/returns/</code>
      </div>`;
  }

  function _tableHeaders() {
    return [
      'ID', 'Tracking #', 'Customer', 'Reason', 'Status', 'Date', 'Actions'
    ].map((h, i) => `<th scope="col"${i === 6 ? ' class="sr-only"' : ''}>${_esc(h)}</th>`).join('');
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function _safe(val, fallback = '—') {
    if (val === null || val === undefined || val === '') return fallback;
    return String(val);
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _statusBadgeClass(status) {
    const map = {
      pending:      'badge-warning',
      'in-transit': 'badge-info',
      'in_transit': 'badge-info',
      received:     'badge-info',
      completed:    'badge-success',
      cancelled:    'badge-error',
    };
    return map[(status || '').toLowerCase()] || 'badge-neutral';
  }

  function _statusLabel(status) {
    if (!status || status === '—') return '—';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // ─── SVG icons ─────────────────────────────────────────────────────────────

  function _boxArrowIcon() {
    return `<svg width="56" height="56" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true"
      style="color:var(--color-text-muted,var(--text-secondary))">
      <!-- Box body -->
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <line x1="12" y1="22" x2="12" y2="12"/>
      <!-- Return arrow (top-right) -->
      <polyline points="16 2 19 5 16 8"/>
      <path d="M19 5H14a3 3 0 0 0-3 3"/>
    </svg>`;
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  function _styles() {
    return `<style>
      /* ── Returns page ── */
      .page-header-main {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--space-4, 16px);
        margin-bottom: var(--space-5, 20px);
        flex-wrap: wrap;
      }

      .returns-card {
        background: var(--color-surface, var(--bg-surface));
        border: 1px solid var(--color-border, var(--border));
        border-radius: var(--radius, 6px);
        overflow: hidden;
      }

      /* API banner */
      .api-banner {
        display: flex;
        align-items: center;
        gap: var(--space-2, 8px);
        background: var(--color-elevated, var(--bg-elevated));
        border: 1px solid var(--color-border, var(--border));
        border-radius: var(--radius, 6px);
        padding: var(--space-2, 8px) var(--space-4, 16px);
        margin-bottom: var(--space-4, 16px);
        font-size: var(--text-xs, 11px);
        flex-wrap: wrap;
      }
      .api-banner-label {
        font-weight: 600;
        color: var(--color-text-muted, var(--text-secondary));
        text-transform: uppercase;
        letter-spacing: .5px;
      }
      .api-banner-code {
        font-family: var(--font-mono, monospace);
        font-size: var(--text-xs, 11px);
        color: var(--color-accent, var(--accent));
        background: var(--color-accent-dim, rgba(88,166,255,.08));
        padding: 2px 6px;
        border-radius: 3px;
      }
      .api-banner-sep { margin: 0 2px; }

      /* Empty state */
      .returns-empty {
        padding: var(--space-12, 48px) var(--space-5, 20px);
      }
      .empty-icon-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: var(--space-4, 16px);
        opacity: .5;
      }
      .empty-state { text-align: center; padding: var(--space-12, 48px) var(--space-5, 20px); }
      .empty-icon  { font-size: 36px; margin-bottom: var(--space-3, 12px); }
      .empty-state h3 { font-size: var(--text-base, 15px); font-weight: 600; margin-bottom: 6px; }
      .empty-state p  { color: var(--color-text-muted, var(--text-secondary)); font-size: var(--text-sm, 13px); line-height: 1.6; }

      /* Tooltip */
      .tooltip-wrap { position: relative; display: inline-block; }
      .tooltip-text {
        visibility: hidden;
        opacity: 0;
        background: var(--color-elevated, #222);
        color: var(--color-text, #fff);
        font-size: var(--text-xs, 11px);
        padding: 4px 8px;
        border-radius: var(--radius-sm, 4px);
        position: absolute;
        top: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        pointer-events: none;
        transition: opacity var(--duration-fast, 150ms) ease;
        z-index: 10;
        border: 1px solid var(--color-border, var(--border));
      }
      .tooltip-wrap:hover .tooltip-text,
      .tooltip-wrap button:focus + .tooltip-text {
        visibility: visible;
        opacity: 1;
      }

      /* Table */
      .return-row:hover { background: var(--color-elevated, rgba(255,255,255,.03)); }
      .text-mono { font-family: var(--font-mono, monospace); font-size: var(--text-xs, 11px); }

      /* Screen reader only */
      .sr-only {
        position: absolute; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden;
        clip: rect(0,0,0,0); white-space: nowrap; border: 0;
      }
    </style>`;
  }

})();
