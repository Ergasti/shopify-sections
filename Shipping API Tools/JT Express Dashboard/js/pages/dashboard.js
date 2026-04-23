/**
 * Dashboard page — Total orders & cost per zone (overview)
 */
(function () {
  window.registerPage('dashboard', {
    title: 'Dashboard',
    async render(container) {
      if (!window.hasCredentials()) {
        container.innerHTML = noCreds();
        return;
      }
      container.innerHTML = skeletonLayout();
      try {
        await loadDashboard(container);
      } catch (err) {
        window.handleApiError(err);
        container.innerHTML = errorState(err);
      }
    },
  });

  // ── No credentials state ──────────────────────────────────────────────────
  function noCreds() {
    return `
      <div class="page-header">
        <div><div class="page-title">Dashboard</div></div>
      </div>
      <div class="no-key-banner">
        <span style="font-size:20px">⚠️</span>
        <div class="no-key-banner-text">
          No API credentials configured. <a href="#settings">Go to Settings →</a>
        </div>
      </div>`;
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────
  function skeletonLayout() {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Dashboard</div>
          <div class="page-subtitle">Loading order data…</div>
        </div>
      </div>
      <div class="progress-bar"><div class="progress-bar-fill" id="prog-bar" style="width:5%"></div></div>
      <div class="cards-grid">
        ${['red','green','blue','amber'].map(c => `
          <div class="stat-card">
            <div class="skeleton skeleton-text short" style="margin-bottom:12px"></div>
            <div class="skeleton skeleton-text" style="height:28px;width:60%"></div>
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="panel-header"><div class="panel-title">Orders by Zone</div></div>
        <div class="panel-body">
          ${[1,2,3,4,5].map(() => `<div class="zone-bar-row">
            <div class="skeleton zone-bar-name" style="height:12px"></div>
            <div class="zone-bar-track"><div class="skeleton" style="height:100%;width:70%"></div></div>
            <div class="skeleton zone-bar-value" style="height:12px"></div>
          </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Error state ───────────────────────────────────────────────────────────
  function errorState(err) {
    return `
      <div class="page-header">
        <div><div class="page-title">Dashboard</div></div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">⚡</div>
        <div class="empty-state-title">Failed to load data</div>
        <div class="empty-state-desc">${window.getErrorMessage(err)}</div>
        <button class="btn btn-secondary" style="margin-top:16px" onclick="window.navigateTo('dashboard')">Retry</button>
      </div>`;
  }

  // ── Main load ─────────────────────────────────────────────────────────────
  async function loadDashboard(container) {
    // Default: last 30 days
    const startDate = window.dateRange(30, false);
    const endDate   = window.dateRange(0,  true);

    const orders = await window.fetchAllOrders(startDate, endDate, (loaded) => {
      const bar = container.querySelector('#prog-bar');
      if (bar) bar.style.width = Math.min(90, 5 + loaded / 5) + '%';
    });

    const zones = window.aggregateByZone(orders);
    const totalOrders  = orders.length;
    const totalFreight = orders.reduce((s, o) => s + (parseFloat(o.sumFreight) || 0), 0);
    const avgFreight   = totalOrders > 0 ? totalFreight / totalOrders : 0;
    const totalZones   = zones.length;

    // Status breakdown
    const statusCounts = {};
    for (const o of orders) {
      const s = o.orderStatus || 'unknown';
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }

    container.innerHTML = buildLayout(
      { totalOrders, totalFreight, avgFreight, totalZones, statusCounts },
      zones,
      startDate,
      endDate
    );

    bindDateControls(container);
  }

  // ── Render layout ─────────────────────────────────────────────────────────
  function buildLayout(stats, zones, startDate, endDate) {
    const maxOrders  = zones[0]?.orderCount || 1;
    const maxFreight = Math.max(...zones.map(z => z.totalFreight), 1);
    const top10 = zones.slice(0, 10);

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Dashboard</div>
          <div class="page-subtitle">Orders from ${startDate.slice(0,10)} to ${endDate.slice(0,10)}</div>
        </div>
        <div class="controls-bar">
          <select class="select" id="range-select">
            <option value="7">Last 7 days</option>
            <option value="30" selected>Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button class="btn btn-primary btn-sm" id="refresh-btn">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.06-3.4L10 6h5V1l-1.35 1.35z"/></svg>
            Refresh
          </button>
          <button class="btn btn-ghost btn-sm" onclick="window.navigateTo('zones')">
            View Full Table →
          </button>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="cards-grid">
        <div class="stat-card">
          <div class="stat-card-icon red">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-card-label">Total Orders</div>
          <div class="stat-card-value">${window.formatNum(stats.totalOrders)}</div>
          <div class="stat-card-sub">${stats.totalZones} zones</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-card-label">Total Freight</div>
          <div class="stat-card-value">${window.formatMXN(stats.totalFreight)}</div>
          <div class="stat-card-sub">MXN</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon blue">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-card-label">Avg Cost / Order</div>
          <div class="stat-card-value">${window.formatMXN(stats.avgFreight)}</div>
          <div class="stat-card-sub">per shipment</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon amber">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          </div>
          <div class="stat-card-label">Active Zones</div>
          <div class="stat-card-value">${stats.totalZones}</div>
          <div class="stat-card-sub">states / provinces</div>
        </div>
      </div>

      <!-- Status breakdown -->
      <div class="panel" style="margin-bottom:24px">
        <div class="panel-header">
          <div>
            <div class="panel-title">Order Status Breakdown</div>
            <div class="panel-subtitle">Distribution of order statuses in range</div>
          </div>
        </div>
        <div class="panel-body" style="display:flex;gap:12px;flex-wrap:wrap">
          ${statusBadges(stats.statusCounts)}
        </div>
      </div>

      <!-- Charts side by side -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
        <!-- Orders by zone -->
        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">Top Zones by Orders</div>
              <div class="panel-subtitle">Top 10 destination states</div>
            </div>
            <div class="tabs" id="orders-tab">
              <button class="tab active" data-chart="orders">Count</button>
              <button class="tab" data-chart="freq">%</button>
            </div>
          </div>
          <div class="panel-body" id="orders-chart">
            ${top10.map(z => {
              const pct = Math.round((z.orderCount / stats.totalOrders) * 100);
              const barW = Math.round((z.orderCount / maxOrders) * 100);
              return `<div class="zone-bar-row">
                <div class="zone-bar-name" title="${z.zone}">${z.zone}</div>
                <div class="zone-bar-track"><div class="zone-bar-fill orders" style="width:${barW}%"></div></div>
                <div class="zone-bar-value">${window.formatNum(z.orderCount)} <span style="color:var(--text-muted);font-size:10px">(${pct}%)</span></div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Cost by zone -->
        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">Top Zones by Freight Cost</div>
              <div class="panel-subtitle">Total MXN spent per zone</div>
            </div>
          </div>
          <div class="panel-body" id="cost-chart">
            ${top10.map(z => {
              const barW = Math.round((z.totalFreight / maxFreight) * 100);
              return `<div class="zone-bar-row">
                <div class="zone-bar-name" title="${z.zone}">${z.zone}</div>
                <div class="zone-bar-track"><div class="zone-bar-fill cost" style="width:${barW}%"></div></div>
                <div class="zone-bar-value">${window.formatMXN(z.totalFreight)}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- CTA to full table -->
      <div style="text-align:center;padding:8px 0 16px">
        <button class="btn btn-secondary" onclick="window.navigateTo('zones')">
          View All Zones with Full Details →
        </button>
      </div>`;
  }

  function statusBadges(counts) {
    const labels = {
      100: ['Not dispatched', 'muted'],
      101: ['Outlet dispatched', 'blue'],
      102: ['Salesperson dispatched', 'amber'],
      103: ['Picked up', 'green'],
      104: ['Cancelled', 'red'],
    };
    return Object.entries(counts).map(([code, cnt]) => {
      const [label, color] = labels[code] || [code, 'muted'];
      return `<div style="display:flex;align-items:center;gap:8px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px">
        <span class="badge badge-${color}">${label}</span>
        <span style="font-weight:700;font-size:18px">${window.formatNum(cnt)}</span>
      </div>`;
    }).join('') || '<div style="color:var(--text-muted);font-size:13px">No status data available</div>';
  }

  // ── Date range controls ───────────────────────────────────────────────────
  function bindDateControls(container) {
    const select = container.querySelector('#range-select');
    const btn    = container.querySelector('#refresh-btn');
    if (!select || !btn) return;

    const reload = async () => {
      const days = parseInt(select.value, 10);
      const startDate = window.dateRange(days, false);
      const endDate   = window.dateRange(0, true);
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner spinner-sm"></div> Loading…';
      try {
        const orders = await window.fetchAllOrders(startDate, endDate, () => {});
        const zones = window.aggregateByZone(orders);
        const totalOrders  = orders.length;
        const totalFreight = orders.reduce((s, o) => s + (parseFloat(o.sumFreight) || 0), 0);
        const avgFreight   = totalOrders > 0 ? totalFreight / totalOrders : 0;
        const totalZones   = zones.length;
        const statusCounts = {};
        for (const o of orders) { const s = o.orderStatus || 'unknown'; statusCounts[s] = (statusCounts[s]||0)+1; }
        container.innerHTML = buildLayout(
          { totalOrders, totalFreight, avgFreight, totalZones, statusCounts },
          zones, startDate, endDate
        );
        bindDateControls(container);
        // Restore select value
        const newSelect = container.querySelector('#range-select');
        if (newSelect) newSelect.value = String(days);
      } catch (err) {
        window.handleApiError(err);
        btn.disabled = false;
        btn.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.06-3.4L10 6h5V1l-1.35 1.35z"/></svg> Refresh';
      }
    };

    btn.addEventListener('click', reload);
  }
})();
