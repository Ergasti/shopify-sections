/**
 * Zones page — Full sortable table: orders + cost per zone
 */
(function () {
  // Module state
  let _zones = [];
  let _sortCol = 'orderCount';
  let _sortDir = 'desc';
  let _search  = '';

  window.registerPage('zones', {
    title: 'Orders by Zone',
    async render(container) {
      if (!window.hasCredentials()) {
        container.innerHTML = noCreds();
        return;
      }
      container.innerHTML = skeleton();
      try {
        await loadZones(container, 30);
      } catch (err) {
        window.handleApiError(err);
        container.innerHTML = errorState(err);
      }
    },
  });

  // ── No credentials ────────────────────────────────────────────────────────
  function noCreds() {
    return `<div class="page-header"><div class="page-title">Orders by Zone</div></div>
      <div class="no-key-banner">
        <span style="font-size:20px">⚠️</span>
        <div class="no-key-banner-text">No API credentials configured. <a href="#settings">Go to Settings →</a></div>
      </div>`;
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────
  function skeleton() {
    return `
      <div class="page-header">
        <div><div class="page-title">Orders by Zone</div><div class="page-subtitle">Fetching orders…</div></div>
      </div>
      <div class="progress-bar"><div class="progress-bar-fill" id="prog-bar" style="width:5%"></div></div>
      <div class="panel">
        <div class="panel-body">
          ${[1,2,3,4,5,6,7,8].map(() => `
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--border-subtle)">
              ${[1,2,3,4,5].map(() => `<div class="skeleton skeleton-text"></div>`).join('')}
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Error state ───────────────────────────────────────────────────────────
  function errorState(err) {
    return `<div class="page-header"><div class="page-title">Orders by Zone</div></div>
      <div class="empty-state">
        <div class="empty-state-icon">⚡</div>
        <div class="empty-state-title">Failed to load data</div>
        <div class="empty-state-desc">${window.getErrorMessage(err)}</div>
        <button class="btn btn-secondary" style="margin-top:16px" onclick="window.navigateTo('zones')">Retry</button>
      </div>`;
  }

  // ── Main load ─────────────────────────────────────────────────────────────
  async function loadZones(container, days) {
    _search = '';
    const startDate = window.dateRange(days, false);
    const endDate   = window.dateRange(0, true);

    const orders = await window.fetchAllOrders(startDate, endDate, (loaded) => {
      const bar = container.querySelector('#prog-bar');
      if (bar) bar.style.width = Math.min(90, 5 + loaded / 5) + '%';
    });

    _zones = window.aggregateByZone(orders);
    _sortCol = 'orderCount';
    _sortDir = 'desc';

    container.innerHTML = buildPage(_zones, orders, days, startDate, endDate);
    bindPageEvents(container, days);
  }

  // ── Build full page ───────────────────────────────────────────────────────
  function buildPage(zones, allOrders, days, startDate, endDate) {
    const totalOrders  = allOrders.length;
    const totalFreight = allOrders.reduce((s, o) => s + (parseFloat(o.sumFreight) || 0), 0);

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Orders by Zone</div>
          <div class="page-subtitle">${startDate.slice(0,10)} → ${endDate.slice(0,10)} · ${window.formatNum(totalOrders)} orders across ${zones.length} zones</div>
        </div>
        <div class="controls-bar">
          <select class="select" id="range-select">
            <option value="7" ${days===7?'selected':''}>Last 7 days</option>
            <option value="30" ${days===30?'selected':''}>Last 30 days</option>
            <option value="60" ${days===60?'selected':''}>Last 60 days</option>
            <option value="90" ${days===90?'selected':''}>Last 90 days</option>
          </select>
          <button class="btn btn-primary btn-sm" id="reload-btn">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14"><path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.06-3.4L10 6h5V1l-1.35 1.35z"/></svg>
            Reload
          </button>
          <button class="btn btn-ghost btn-sm" id="export-btn">
            <svg viewBox="0 0 16 16" fill="currentColor" width="14"><path d="M8 12l-4-4h2.5V4h3v4H12L8 12zm-6 2h12v1H2v-1z"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="cards-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
        <div class="stat-card">
          <div class="stat-card-label">Total Orders</div>
          <div class="stat-card-value">${window.formatNum(totalOrders)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Total Freight</div>
          <div class="stat-card-value" style="font-size:20px">${window.formatMXN(totalFreight)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Avg per Order</div>
          <div class="stat-card-value" style="font-size:20px">${window.formatMXN(totalOrders > 0 ? totalFreight / totalOrders : 0)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Zones</div>
          <div class="stat-card-value">${zones.length}</div>
        </div>
      </div>

      <!-- Zones table panel -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Zone Breakdown</div>
            <div class="panel-subtitle">Click column headers to sort</div>
          </div>
          <input class="input" id="zone-search" placeholder="Search zone…" style="width:200px" value="${_search}">
        </div>
        <div class="table-wrap">
          <table id="zones-table">
            <thead>
              <tr>
                <th data-col="zone"         class="${sortClass('zone')}">Zone (State)</th>
                <th data-col="orderCount"   class="${sortClass('orderCount')}">Orders</th>
                <th data-col="totalFreight" class="${sortClass('totalFreight')}">Total Freight (MXN)</th>
                <th data-col="avgFreight"   class="${sortClass('avgFreight')}">Avg / Order</th>
                <th data-col="pct"          class="${sortClass('pct')}">% of Total Orders</th>
              </tr>
            </thead>
            <tbody id="zones-tbody">
              ${renderRows(zones, totalOrders)}
            </tbody>
          </table>
        </div>
        <div id="zones-empty" style="display:none">
          <div class="empty-state">
            <div class="empty-state-title">No zones match your search</div>
          </div>
        </div>
      </div>`;
  }

  function sortClass(col) {
    if (_sortCol !== col) return '';
    return _sortDir === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  function renderRows(zones, totalOrders) {
    const filtered = _search
      ? zones.filter(z => z.zone.toLowerCase().includes(_search.toLowerCase()))
      : zones;

    const sorted = [...filtered].sort((a, b) => {
      let av = _sortCol === 'pct' ? a.orderCount : a[_sortCol];
      let bv = _sortCol === 'pct' ? b.orderCount : b[_sortCol];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return _sortDir === 'asc' ? -1 : 1;
      if (av > bv) return _sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    if (sorted.length === 0) return '';

    return sorted.map((z, i) => {
      const pct = totalOrders > 0 ? ((z.orderCount / totalOrders) * 100).toFixed(1) : '0.0';
      return `<tr>
        <td><strong>${z.zone}</strong></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span>${window.formatNum(z.orderCount)}</span>
            <div style="flex:1;max-width:80px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${Math.round((z.orderCount/(_zones[0]?.orderCount||1))*100)}%;background:var(--accent);border-radius:3px"></div>
            </div>
          </div>
        </td>
        <td><strong>${window.formatMXN(z.totalFreight)}</strong></td>
        <td>${window.formatMXN(z.avgFreight)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span>${pct}%</span>
            <div style="flex:1;max-width:60px;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:var(--blue);border-radius:3px"></div>
            </div>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  // ── Bind events ───────────────────────────────────────────────────────────
  function bindPageEvents(container, days) {
    let currentDays = days;

    // Range select + reload
    container.querySelector('#reload-btn')?.addEventListener('click', async () => {
      const sel = container.querySelector('#range-select');
      const newDays = parseInt(sel?.value || '30', 10);
      container.innerHTML = skeleton();
      try {
        await loadZones(container, newDays);
      } catch (err) {
        window.handleApiError(err);
        container.innerHTML = errorState(err);
      }
    });

    // Sort by column
    container.querySelector('#zones-table')?.addEventListener('click', (e) => {
      const th = e.target.closest('th[data-col]');
      if (!th) return;
      const col = th.dataset.col;
      if (_sortCol === col) {
        _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        _sortCol = col;
        _sortDir = col === 'zone' ? 'asc' : 'desc';
      }
      const totalOrders = _zones.reduce((s, z) => s + z.orderCount, 0);
      refreshTable(container, totalOrders);
    });

    // Search
    container.querySelector('#zone-search')?.addEventListener('input', (e) => {
      _search = e.target.value;
      const totalOrders = _zones.reduce((s, z) => s + z.orderCount, 0);
      refreshTable(container, totalOrders);
    });

    // Export CSV
    container.querySelector('#export-btn')?.addEventListener('click', () => {
      exportCSV(_zones);
    });
  }

  function refreshTable(container, totalOrders) {
    const tbody = container.querySelector('#zones-tbody');
    const empty = container.querySelector('#zones-empty');
    if (!tbody) return;

    const html = renderRows(_zones, totalOrders);
    tbody.innerHTML = html;

    // Update sort header classes
    container.querySelectorAll('thead th[data-col]').forEach(th => {
      th.className = sortClass(th.dataset.col);
    });

    if (empty) empty.style.display = !html ? 'block' : 'none';
  }

  // ── CSV Export ────────────────────────────────────────────────────────────
  function exportCSV(zones) {
    const totalOrders = zones.reduce((s, z) => s + z.orderCount, 0);
    const header = 'Zone,Orders,Total Freight (MXN),Avg Freight (MXN),% of Total';
    const rows = zones.map(z => {
      const pct = totalOrders > 0 ? ((z.orderCount / totalOrders) * 100).toFixed(2) : '0.00';
      return [z.zone, z.orderCount, z.totalFreight.toFixed(2), z.avgFreight.toFixed(2), pct].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `jt_zones_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast('CSV exported!', 'success');
  }
})();
