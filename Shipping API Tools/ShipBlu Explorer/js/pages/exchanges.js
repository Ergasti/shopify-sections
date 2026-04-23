/* exchanges.js — ShipBlu Explorer Exchanges Page */

;(function () {
  'use strict';

  // ─── Register page ─────────────────────────────────────────────────────────

  window.registerPage('exchanges', {
    title: 'Exchanges',

    render(container) {
      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyState();
        return;
      }
      container.innerHTML = `${_styles()}${_loadingState()}`;
      _loadExchanges(container);
    }
  });

  // ─── No-key state ──────────────────────────────────────────────────────────

  function _noKeyState() {
    return `
      <div class="page-header">
        <h2>Exchanges</h2>
        <p class="page-subtitle">Manage exchange orders</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Please configure your API key in Settings to view exchanges.</p>
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
        <div class="exch-header-main">
          <div>
            <div class="skeleton" style="height:24px;width:140px;border-radius:4px;margin-bottom:6px"></div>
            <div class="skeleton" style="height:14px;width:210px;border-radius:4px"></div>
          </div>
          <div class="skeleton" style="height:32px;width:140px;border-radius:var(--radius-sm,4px)"></div>
        </div>
      </div>
      ${_apiBanner()}
      <div class="card exchanges-card">
        <div class="table-wrap">
          <table aria-label="Exchanges loading" aria-busy="true">
            <thead>
              <tr>${_tableHeaders()}</tr>
            </thead>
            <tbody>${skeletonRows}</tbody>
          </table>
        </div>
      </div>`;
  }

  // ─── Fetch exchanges ────────────────────────────────────────────────────────

  async function _loadExchanges(container) {
    try {
      const data    = await window.shipbluApi('GET', '/v1/exchanges/');
      const results = Array.isArray(data) ? data : (data.results || []);
      _renderExchanges(container, results, data);
    } catch (err) {
      _renderError(container, err);
    }
  }

  // ─── Render results ─────────────────────────────────────────────────────────

  function _renderExchanges(container, results, meta) {
    const total = (meta && meta.count != null) ? meta.count : results.length;

    container.innerHTML = `
      ${_styles()}
      <div class="page-header">
        <div class="exch-header-main">
          <div>
            <h2>Exchanges
              ${total > 0 ? `<span class="badge badge-neutral" style="margin-left:8px;vertical-align:middle">${_esc(String(total))}</span>` : ''}
            </h2>
            <p class="page-subtitle">Manage exchange orders</p>
          </div>
          ${_createExchangeButton()}
        </div>
      </div>

      ${_apiBanner()}

      <div class="card exchanges-card">
        ${results.length === 0 ? _emptyState() : _exchangesTable(results)}
      </div>
    `;
  }

  // ─── Empty state ───────────────────────────────────────────────────────────

  function _emptyState() {
    return `
      <div class="empty-state exchanges-empty" role="status" aria-label="No exchanges">
        <div class="empty-icon-wrap" aria-hidden="true">
          ${_exchangeIcon()}
        </div>
        <h3>No exchange orders yet</h3>
        <p>Exchanges replace delivered items with new ones.<br>
           They will appear here once your first exchange is created.</p>
      </div>`;
  }

  // ─── Exchanges table ────────────────────────────────────────────────────────

  function _exchangesTable(results) {
    const rows = results.map(r => {
      const trackNum      = _safe(r.tracking_number);
      const customer      = _safe(r.customer && (r.customer.full_name || r.customer.name));
      const originalOrder = _safe(r.original_order || r.delivery_order);
      const status        = _safe(r.status);
      const date          = window.formatDate
        ? window.formatDate(r.created || r.created_at)
        : _safe(r.created || r.created_at);
      const statusCls     = _statusBadgeClass(status);

      return `
        <tr class="exchange-row">
          <td class="text-mono">${_esc(String(r.id || '—'))}</td>
          <td class="text-mono">${_esc(trackNum)}</td>
          <td>${_esc(customer)}</td>
          <td class="text-mono">${_esc(String(originalOrder))}</td>
          <td><span class="badge ${_esc(statusCls)}">${_esc(_statusLabel(status))}</span></td>
          <td>${_esc(date)}</td>
          <td>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              aria-label="View exchange ${_esc(trackNum)}"
              onclick="window.showToast('Exchange detail view coming soon.', 'info')"
            >
              View →
            </button>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="table-wrap">
        <table role="table" aria-label="Exchange orders">
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
        <div class="exch-header-main">
          <div>
            <h2>Exchanges</h2>
            <p class="page-subtitle">Manage exchange orders</p>
          </div>
          ${_createExchangeButton()}
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
        <h3>Failed to load exchanges</h3>
        <p>${_esc(err?.message || 'An unexpected error occurred.')}</p>
        <button class="btn btn-primary" style="margin-top:16px"
          onclick="window.navigateTo('exchanges')">
          Retry
        </button>
      </div>`;
  }

  // ─── Shared fragments ──────────────────────────────────────────────────────

  function _createExchangeButton() {
    return `
      <div class="tooltip-wrap">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          disabled
          aria-disabled="true"
          aria-describedby="create-exch-tooltip"
        >
          + Create Exchange
        </button>
        <span class="tooltip-text" id="create-exch-tooltip" role="tooltip">
          Coming soon
        </span>
      </div>`;
  }

  function _apiBanner() {
    return `
      <div class="api-banner" role="note" aria-label="API endpoint reference">
        <span class="api-banner-label">Exchanges API</span>
        <code class="api-banner-code">GET /v1/exchanges/</code>
        <span class="api-banner-sep text-muted">·</span>
        <code class="api-banner-code">POST /v1/exchanges/</code>
      </div>`;
  }

  function _tableHeaders() {
    const cols = ['ID', 'Tracking #', 'Customer', 'Original Order', 'Status', 'Date', 'Actions'];
    return cols.map((h, i) =>
      `<th scope="col"${i === cols.length - 1 ? ' class="sr-only"' : ''}>${_esc(h)}</th>`
    ).join('');
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
      delivered:    'badge-success',
      exchanged:    'badge-success',
      cancelled:    'badge-error',
    };
    return map[(status || '').toLowerCase()] || 'badge-neutral';
  }

  function _statusLabel(status) {
    if (!status || status === '—') return '—';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // ─── SVG icons ─────────────────────────────────────────────────────────────

  function _exchangeIcon() {
    return `<svg width="56" height="56" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true"
      style="color:var(--color-text-muted,var(--text-secondary))">
      <!-- Swap / exchange arrows forming a circle -->
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>`;
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  function _styles() {
    return `<style>
      /* ── Exchanges page ── */
      .exch-header-main {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--space-4, 16px);
        margin-bottom: var(--space-5, 20px);
        flex-wrap: wrap;
      }

      .exchanges-card {
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
      .exchanges-empty {
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
      .exchange-row:hover { background: var(--color-elevated, rgba(255,255,255,.03)); }
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
