/* dashboard.js — ShipBlu Explorer Dashboard Page */

window.registerPage('dashboard', {
  title: 'Dashboard',

  render(container) {
    if (!window.getApiKey || !window.getApiKey()) {
      container.innerHTML = _dashboardNoKey();
      return;
    }

    container.innerHTML = _dashboardSkeleton();
    _loadDashboard(container);
  }
});

/* ─── helpers ─────────────────────────────────────────────────── */

function _safe(val, fallback = '—') {
  if (val === null || val === undefined || val === '') return fallback;
  return val;
}

function _statusBadgeClass(status) {
  const map = {
    delivered: 'badge-success',
    cancelled: 'badge-error',
    pending: 'badge-warning',
    'in-transit': 'badge-info',
    'in_transit': 'badge-info',
  };
  return map[(status || '').toLowerCase()] || 'badge-neutral';
}

function _statusLabel(status) {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ─── no-key state ────────────────────────────────────────────── */

function _dashboardNoKey() {
  return `
    <div class="page-header">
      <h2>Dashboard</h2>
      <p class="page-subtitle">Welcome back — here's what's happening</p>
    </div>
    <div class="empty-state">
      <div class="empty-icon">🔑</div>
      <h3>API Key Required</h3>
      <p>Connect your ShipBlu account to view your dashboard.</p>
      <a href="#settings" class="btn btn-primary" style="margin-top:16px">Set up your API key in Settings →</a>
    </div>`;
}

/* ─── skeleton ────────────────────────────────────────────────── */

function _dashboardSkeleton() {
  const skeletonCards = Array(4).fill(0).map(() => `
    <div class="stat-card">
      <div class="skeleton" style="width:32px;height:32px;border-radius:8px;margin-bottom:12px"></div>
      <div class="skeleton" style="width:60%;height:12px;margin-bottom:8px"></div>
      <div class="skeleton" style="width:40%;height:28px"></div>
    </div>`).join('');

  const skeletonRows = Array(5).fill(0).map(() => `
    <tr>
      ${Array(6).fill(0).map(() => `<td><div class="skeleton" style="height:14px;width:80%"></div></td>`).join('')}
    </tr>`).join('');

  return `
    <div class="page-header">
      <div>
        <h2>Dashboard</h2>
        <p class="page-subtitle">Welcome back — here's what's happening</p>
      </div>
    </div>
    <div class="stat-cards-row">${skeletonCards}</div>
    <section class="card" style="margin-top:24px">
      <div class="card-header">
        <h3>Recent Orders</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking #</th><th>Customer</th><th>Status</th>
              <th>Amount</th><th>Date</th><th></th>
            </tr>
          </thead>
          <tbody>${skeletonRows}</tbody>
        </table>
      </div>
    </section>`;
}

/* ─── load ────────────────────────────────────────────────────── */

async function _loadDashboard(container) {
  try {
    const data = await window.shipbluApi('GET', '/v1/delivery-orders/');
    const orders = data.results || [];
    const hasMore = !!data.next;
    const apiCount = (data.count !== undefined && data.count !== null) ? data.count : null;
    _renderDashboard(container, orders, hasMore, apiCount);
  } catch (err) {
    _renderDashboardError(container, err);
  }
}

/* ─── error state ─────────────────────────────────────────────── */

function _renderDashboardError(container, err) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2>Dashboard</h2>
        <p class="page-subtitle">Welcome back — here's what's happening</p>
      </div>
    </div>
    <div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3>Failed to load data</h3>
      <p>${_safe(err && err.message, 'An unexpected error occurred.')}</p>
      <button class="btn btn-primary" style="margin-top:16px"
        onclick="window.navigateTo && window.navigateTo('dashboard')">Retry</button>
    </div>`;
}

/* ─── main render ─────────────────────────────────────────────── */

function _renderDashboard(container, orders, hasMore, apiCount = null) {
  const total = apiCount !== null ? apiCount : (hasMore ? orders.length + '+' : orders.length);
  const delivered = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
  const cancelled = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;
  const codSum = orders.reduce((acc, o) => acc + (parseFloat(o.cash_amount) || 0), 0);

  const stats = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
      label: 'Total Orders',
      value: total,
      accent: 'var(--accent)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`,
      label: 'Delivered',
      value: delivered,
      accent: 'var(--green)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
      label: 'Cancelled',
      value: cancelled,
      accent: 'var(--red)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
      label: 'Total COD',
      value: window.formatCurrency ? window.formatCurrency(codSum) : codSum.toFixed(2) + ' EGP',
      accent: 'var(--orange)'
    }
  ];

  const statCardsHtml = stats.map(s => `
    <div class="stat-card" style="--stat-accent:${s.accent}">
      <div class="stat-icon" style="color:${s.accent}" aria-hidden="true">${s.icon}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    </div>`).join('');

  const recentOrders = orders.slice(0, 10);

  let tableBody;
  if (recentOrders.length === 0) {
    tableBody = `<tr><td colspan="6">
      <div class="empty-state" style="padding:40px 20px">
        <div class="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Create your first order to get started.</p>
        <a href="#create-order" class="btn btn-primary" style="margin-top:12px">Create your first order →</a>
      </div>
    </td></tr>`;
  } else {
    tableBody = recentOrders.map(order => {
      const statusClass = _statusBadgeClass(order.status);
      const trackNum = _safe(order.tracking_number);
      const customer = _safe(order.customer && order.customer.full_name);
      const amount = window.formatCurrency
        ? window.formatCurrency(order.cash_amount || 0)
        : (parseFloat(order.cash_amount) || 0).toFixed(2) + ' EGP';
      const date = window.formatDate
        ? window.formatDate(order.created)
        : (order.created ? order.created.slice(0, 10) : '—');

      return `<tr class="order-row" style="cursor:pointer"
          onclick="location.hash='#orders/${order.id}'"
          role="button"
          aria-label="View order ${trackNum}">
        <td><span class="mono">${trackNum}</span></td>
        <td>${customer}</td>
        <td><span class="badge ${statusClass}">${_statusLabel(order.status)}</span></td>
        <td class="mono">${amount}</td>
        <td>${date}</td>
        <td><span class="row-arrow" aria-hidden="true">→</span></td>
      </tr>`;
    }).join('');
  }

  const quickActions = [
    {
      href: '#create-order',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
      title: 'Create Order',
      desc: 'Ship a new package to a customer'
    },
    {
      href: '#pricing',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
      title: 'View Pricing',
      desc: 'View shipping rates by governorate'
    },
    {
      href: '#calculator',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4M8 18h4"/></svg>`,
      title: 'Calculator',
      desc: 'Estimate shipping costs before sending'
    }
  ];

  const quickActionsHtml = quickActions.map(a => `
    <a href="${a.href}" class="quick-action-card card" aria-label="${a.title}">
      <div class="qa-icon" aria-hidden="true">${a.icon}</div>
      <div class="qa-body">
        <div class="qa-title">${a.title}</div>
        <div class="qa-desc">${a.desc}</div>
      </div>
      <span class="qa-arrow" aria-hidden="true">→</span>
    </a>`).join('');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2>Dashboard</h2>
        <p class="page-subtitle">Welcome back — here's what's happening</p>
      </div>
    </div>

    <section aria-label="Order statistics">
      <div class="stat-cards-row">${statCardsHtml}</div>
    </section>

    <section aria-labelledby="recent-orders-heading" class="card" style="margin-top:24px">
      <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <h3 id="recent-orders-heading" style="display:flex;align-items:center;gap:8px">
          Recent Orders
          ${recentOrders.length > 0 ? `<span class="badge badge-neutral" style="font-size:11px;font-weight:500">${recentOrders.length}${hasMore ? '+' : ''}</span>` : ''}
        </h3>
        <a href="#orders" class="btn btn-ghost btn-sm" style="font-size:12px;opacity:.75">View all →</a>
      </div>
      <div class="table-wrap">
        <table role="table" aria-label="Recent orders">
          <thead>
            <tr>
              <th scope="col">Tracking #</th>
              <th scope="col">Customer</th>
              <th scope="col">Status</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col"><span class="sr-only">Detail</span></th>
            </tr>
          </thead>
          <tbody>${tableBody}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="quick-actions-heading" style="margin-top:24px">
      <h3 id="quick-actions-heading" style="font-size:14px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Quick Actions</h3>
      <div class="quick-actions-grid">${quickActionsHtml}</div>
    </section>

    <style>
      .stat-cards-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      @media (max-width: 900px) { .stat-cards-row { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 520px) { .stat-cards-row { grid-template-columns: 1fr; } }

      .stat-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: relative;
        overflow: hidden;
      }
      .stat-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 3px; height: 100%;
        background: var(--stat-accent, var(--accent));
        border-radius: var(--radius) 0 0 var(--radius);
      }
      .stat-icon { margin-bottom: 4px; }
      .stat-label { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .5px; }
      .stat-value { font-size: 26px; font-weight: 700; font-family: var(--font-mono); line-height: 1; }

      .card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); }
      .card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); }
      .card-header h3 { font-size: 15px; font-weight: 600; }
      .card-footer { padding: 12px 20px; border-top: 1px solid var(--border); }

      .order-row:hover { background: rgba(88,166,255,.04); }
      .row-arrow { color: var(--text-muted); font-size: 14px; }
      .mono { font-family: var(--font-mono); font-size: 12px; }

      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      @media (max-width: 700px) { .quick-actions-grid { grid-template-columns: 1fr; } }

      .quick-action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        text-decoration: none;
        color: inherit;
        transition: border-color .15s, background .15s;
      }
      .quick-action-card:hover { border-color: var(--accent); background: var(--bg-elevated); }
      .qa-icon { color: var(--accent); flex-shrink: 0; }
      .qa-body { flex: 1; }
      .qa-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
      .qa-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
      .qa-arrow { color: var(--text-muted); font-size: 16px; flex-shrink: 0; }

      .page-header { margin-bottom: 24px; }
      .page-header h2 { font-size: 22px; font-weight: 700; letter-spacing: -.3px; }
      .page-subtitle { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }

      .empty-state { text-align: center; padding: 48px 20px; }
      .empty-icon { font-size: 36px; margin-bottom: 12px; }
      .empty-state h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
      .empty-state p { color: var(--text-secondary); font-size: 14px; }

      .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
    </style>`;
}
