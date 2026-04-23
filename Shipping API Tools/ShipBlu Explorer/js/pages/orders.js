/* orders.js — ShipBlu Explorer Orders List + Detail Pages */

/* ═══════════════════════════════════════════════════════════════
   ORDERS LIST
   ═══════════════════════════════════════════════════════════════ */

window.registerPage('orders', {
  title: 'Orders',

  render(container) {
    // Initialise page state scoped to this render call
    const state = {
      orders: [],
      filtered: [],
      loading: false,
      cursor: null,      // current page cursor (null = first page)
      prevCursors: [],   // stack of previous cursors for back-navigation
      page: 1,
      nextCursor: null,
      searchQuery: '',
      statusFilter: 'all'
    };

    container.innerHTML = _ordersListShell();
    _bindOrdersListEvents(container, state);

    if (window.getApiKey && window.getApiKey()) {
      _fetchOrdersPage(container, state, null);
    } else {
      _renderOrdersNoKey(container);
    }
  }
});

/* ─── Orders List: HTML shell ──────────────────────────────────── */

function _ordersListShell() {
  return `
    <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <h2>Delivery Orders</h2>
        <p class="page-subtitle">Manage and track your shipments</p>
      </div>
      <a href="#create-order" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        Create Order
      </a>
    </div>

    <div class="orders-filters card" style="margin-bottom:16px;padding:14px 16px">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div class="search-wrap" style="flex:1;min-width:200px;position:relative">
          <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input id="orders-search" type="search"
            placeholder="Search by tracking # or customer name…"
            aria-label="Search orders"
            style="width:100%;padding:8px 12px 8px 32px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-size:13px;outline:none">
        </div>
        <div class="status-chips" role="group" aria-label="Filter by status" style="display:flex;gap:6px;flex-wrap:wrap">
          ${['all','pending','picked_up','out_for_delivery','in_transit','delivered','returned','cancelled','on_hold'].map(s => `
            <button class="chip ${s === 'all' ? 'chip-active' : ''}" data-status="${s}" aria-pressed="${s === 'all'}">
              ${_chipLabel(s)}
            </button>`).join('')}
        </div>
      </div>
    </div>

    <section class="card orders-table-card" aria-label="Orders table">
      <div class="table-wrap" id="orders-table-wrap">
        ${_ordersTableSkeleton()}
      </div>
      <div id="orders-pagination" class="pagination-bar" style="display:none"></div>
    </section>

    <style>
      .chip {
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid var(--border);
        background: transparent;
        color: var(--text-secondary);
        transition: all .15s;
        font-family: var(--font-sans);
      }
      .chip:hover { color: var(--text-primary); border-color: var(--text-muted); }
      .chip-active { background: var(--accent); border-color: var(--accent); color: #fff; }

      .pagination-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-top: 1px solid var(--border);
        font-size: 13px;
        color: var(--text-secondary);
      }

      .copy-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        padding: 2px 4px;
        border-radius: 3px;
        transition: color .15s;
        font-size: 12px;
        vertical-align: middle;
        font-family: var(--font-sans);
      }
      .copy-btn:hover { color: var(--text-primary); }

      .order-row-link { cursor: pointer; }
      .order-row-link:hover td { background: rgba(88,166,255,.04); }

      .rel-date { color: var(--text-secondary); font-size: 12px; }
    </style>`;
}

function _chipLabel(s) {
  const map = { all: 'All', pending: 'Pending', picked_up: 'Picked Up', out_for_delivery: 'Out for Delivery', in_transit: 'In Transit', delivered: 'Delivered', returned: 'Returned', cancelled: 'Cancelled', on_hold: 'On Hold' };
  return map[s] || s;
}

function _ordersTableSkeleton(rows = 8) {
  const skRow = `<tr>${Array(8).fill(0).map(() =>
    `<td><div class="skeleton" style="height:13px;width:75%"></div></td>`).join('')}</tr>`;
  return `<table role="table" aria-label="Loading orders">
    <thead><tr>
      <th>#</th><th>Tracking #</th><th>Customer</th><th>Zone</th>
      <th>Status</th><th>Amount</th><th>Date</th><th>Actions</th>
    </tr></thead>
    <tbody>${Array(rows).fill(skRow).join('')}</tbody>
  </table>`;
}

/* ─── Orders List: no-key ──────────────────────────────────────── */

function _renderOrdersNoKey(container) {
  const wrap = container.querySelector('#orders-table-wrap');
  if (wrap) wrap.innerHTML = `
    <div class="empty-state" style="padding:60px 20px">
      <div class="empty-icon">🔑</div>
      <h3>API Key Required</h3>
      <p>Go to Settings and enter your ShipBlu API key to load orders.</p>
      <a href="#settings" class="btn btn-primary" style="margin-top:16px">Open Settings →</a>
    </div>`;
}

/* ─── Orders List: fetch ───────────────────────────────────────── */

async function _fetchOrdersPage(container, state, cursor) {
  state.loading = true;
  const wrap = container.querySelector('#orders-table-wrap');
  if (wrap) wrap.innerHTML = _ordersTableSkeleton();

  try {
    const path = cursor
      ? `/v1/delivery-orders/?cursor=${encodeURIComponent(cursor)}`
      : '/v1/delivery-orders/';

    const data = await window.shipbluApi('GET', path);
    state.orders = data.results || [];
    state.nextCursor = data.next ? _extractCursor(data.next) : null;
    state.prevCursor = data.previous ? _extractCursor(data.previous) : null;
    state.currentCursor = cursor;

    _applyFilters(state);
    _renderOrdersTable(container, state);
    _renderPagination(container, state);
  } catch (err) {
    if (wrap) wrap.innerHTML = `
      <div class="empty-state" style="padding:48px 20px">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load orders</h3>
        <p>${_safe(err && err.message, 'An unexpected error occurred.')}</p>
        <button class="btn btn-primary" style="margin-top:16px"
          onclick="window.navigateTo && window.navigateTo('orders')">Retry</button>
      </div>`;
  } finally {
    state.loading = false;
  }
}

function _extractCursor(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get('cursor') || null;
  } catch {
    return null;
  }
}

/* ─── Orders List: filter + render ────────────────────────────── */

function _applyFilters(state) {
  let result = state.orders;
  const q = state.searchQuery.toLowerCase().trim();
  const sf = state.statusFilter;

  if (q) {
    result = result.filter(o => {
      const tn = (o.tracking_number || '').toLowerCase();
      const cn = (o.customer && o.customer.full_name ? o.customer.full_name : '').toLowerCase();
      return tn.includes(q) || cn.includes(q);
    });
  }
  if (sf !== 'all') {
    result = result.filter(o => (o.status || '').toLowerCase() === sf);
  }
  state.filtered = result;
}

function _renderOrdersTable(container, state) {
  const wrap = container.querySelector('#orders-table-wrap');
  if (!wrap) return;

  const orders = state.filtered;

  if (orders.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state" style="padding:60px 20px">
        <div class="empty-icon">📭</div>
        <h3>No orders found</h3>
        <p>${state.searchQuery || state.statusFilter !== 'all'
          ? 'Try adjusting your search or filter.'
          : 'Create your first order to get started.'}</p>
        ${!state.searchQuery && state.statusFilter === 'all'
          ? `<a href="#create-order" class="btn btn-primary" style="margin-top:12px">Create Order →</a>` : ''}
      </div>`;
    return;
  }

  const rows = orders.map((order, idx) => {
    const statusClass = _oStatusBadgeClass(order.status);
    const trackNum = _safe(order.tracking_number);
    const customer = _safe(order.customer && order.customer.full_name);
    const zone = _safe(
      order.customer && order.customer.address && order.customer.address.zone
        ? order.customer.address.zone.name
        : null
    );
    const amount = window.formatCurrency
      ? window.formatCurrency(order.cash_amount || 0)
      : (parseFloat(order.cash_amount) || 0).toFixed(2) + ' EGP';
    const created = order.created || '';
    const relDate = _relativeDate(created);
    const fullDate = _safe(window.formatDate ? window.formatDate(created) : created.slice(0, 10));

    return `<tr class="order-row-link"
        tabindex="0"
        role="row"
        aria-label="Order ${trackNum}"
        onclick="location.hash='#orders-detail?id=${order.id}'"
        onkeydown="if(event.key==='Enter'||event.key===' ')location.hash='#orders-detail?id=${order.id}'">
      <td style="color:var(--text-muted);font-size:12px">${state.page > 1 ? '' : idx + 1}</td>
      <td>
        <span class="mono tracking-num" style="font-size:12px">${trackNum}</span>
        <button class="copy-btn" title="Copy tracking number"
          aria-label="Copy tracking number ${trackNum}"
          onclick="event.stopPropagation();_copyTrackingNum(this,'${trackNum}')"
          onkeydown="event.stopPropagation()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
      </td>
      <td>${customer}</td>
      <td style="color:var(--text-secondary);font-size:12px">${zone}</td>
      <td><span class="badge ${statusClass}">${_statusLabel(order.status)}</span></td>
      <td class="mono" style="font-size:12px">${amount}</td>
      <td>
        <span class="rel-date" title="${fullDate}">${relDate}</span>
      </td>
      <td>
        <a href="#orders-detail?id=${order.id}"
          class="btn btn-ghost btn-sm"
          aria-label="View order ${trackNum}"
          onclick="event.stopPropagation()">View</a>
      </td>
    </tr>`;
  }).join('');

  wrap.innerHTML = `<table role="table" aria-label="Orders">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Tracking #</th>
        <th scope="col">Customer</th>
        <th scope="col">Zone</th>
        <th scope="col">Status</th>
        <th scope="col">Amount</th>
        <th scope="col">Date</th>
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function _renderPagination(container, state) {
  const bar = container.querySelector('#orders-pagination');
  if (!bar) return;

  const hasPrev = state.prevCursors && state.prevCursors.length > 0;
  const hasNext = !!state.nextCursor;

  if (!hasPrev && !hasNext) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  const _pgCount = state.filtered.length;
  const _pgInfo = _pgCount
    ? `Page ${state.page} &middot; ${_pgCount} order${_pgCount === 1 ? '' : 's'} shown`
    : `Page ${state.page}`;
  bar.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="orders-prev-btn" ${!hasPrev ? 'disabled' : ''} aria-label="Previous page">
      ← Previous
    </button>
    <span style="color:var(--text-secondary);font-size:12px">${_pgInfo}</span>
    <button class="btn btn-ghost btn-sm" id="orders-next-btn" ${!hasNext ? 'disabled' : ''} aria-label="Next page">
      Next →
    </button>`;

  bar.querySelector('#orders-prev-btn').addEventListener('click', () => {
    if (!hasPrev) return;
    const prevCursor = state.prevCursors.pop();
    state.page = Math.max(1, state.page - 1);
    _fetchOrdersPage(container, state, prevCursor || null);
  });

  bar.querySelector('#orders-next-btn').addEventListener('click', () => {
    if (!hasNext) return;
    state.prevCursors.push(state.currentCursor || null);
    state.page++;
    _fetchOrdersPage(container, state, state.nextCursor);
  });
}

/* ─── Orders List: event binding ──────────────────────────────── */

function _bindOrdersListEvents(container, state) {
  // Search
  const searchInput = container.querySelector('#orders-search');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = searchInput.value;
        _applyFilters(state);
        _renderOrdersTable(container, state);
      }, 220);
    });
  }

  // Status chips
  container.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-status]');
    if (!chip) return;
    container.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('chip-active', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    state.statusFilter = chip.dataset.status;
    _applyFilters(state);
    _renderOrdersTable(container, state);
  });
}

/* ─── Copy tracking helper (global so inline onclick works) ────── */

window._copyTrackingNum = function(btn, text) {
  const original = btn.innerHTML;
  const succeed = () => {
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
    setTimeout(() => { btn.innerHTML = original; }, 1500);
    if (window.showToast) window.showToast('Copied!', 'success');
  };
  if (window.copyToClipboard) {
    window.copyToClipboard(text);
    succeed();
  } else {
    navigator.clipboard.writeText(text).then(succeed).catch(() => {
      if (window.showToast) window.showToast('Copy failed', 'error');
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   ORDER DETAIL
   ═══════════════════════════════════════════════════════════════ */

window.registerPage('orders-detail', {
  title: 'Order Detail',

  render(container, params) {
    // Parse id from params or from location.hash
    let id = params && params.id;
    if (!id) {
      const hashMatch = location.hash.match(/[?&]id=([^&]+)/);
      if (hashMatch) id = hashMatch[1];
    }

    if (!id) {
      container.innerHTML = _detailError('No order ID provided.', true);
      return;
    }

    container.innerHTML = _detailSkeleton();
    _fetchOrderDetail(container, id);
  }
});

/* ─── Detail: fetch ────────────────────────────────────────────── */

async function _fetchOrderDetail(container, id) {
  try {
    const order = await window.shipbluApi('GET', `/v1/delivery-orders/${id}/`);
    _renderOrderDetail(container, order);
  } catch (err) {
    const is404 = err && err.status === 404;
    container.innerHTML = _detailError(
      is404 ? 'Order not found.' : _safe(err && err.message, 'Failed to load order.'),
      true
    );
  }
}

/* ─── Detail: error state ──────────────────────────────────────── */

function _detailError(msg, showBack) {
  return `
    <div class="page-header">
      ${showBack ? `<button class="btn btn-ghost btn-sm" onclick="location.hash='#orders'" aria-label="Back to orders">← Back to Orders</button>` : ''}
    </div>
    <div class="empty-state" style="padding:60px 20px">
      <div class="empty-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>${msg}</p>
      <button class="btn btn-ghost btn-sm" style="margin-top:16px" onclick="location.hash='#orders'">← Back to Orders</button>
    </div>`;
}

/* ─── Detail: skeleton ─────────────────────────────────────────── */

function _detailSkeleton() {
  const block = (w, h) => `<div class="skeleton" style="width:${w};height:${h}px;margin-bottom:8px"></div>`;
  const cardSkel = `
    <div class="detail-card">
      ${block('40%', 12)}${block('70%', 14)}${block('55%', 14)}${block('65%', 14)}
    </div>`;
  return `
    <div class="page-header" style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <button class="btn btn-ghost btn-sm" onclick="location.hash='#orders'" aria-label="Back to orders">← Back</button>
      <div style="flex:1">${block('30%', 18)}${block('15%', 12)}</div>
    </div>
    <div class="detail-grid">
      ${Array(4).fill(cardSkel).join('')}
    </div>`;
}

/* ─── Detail: main render ──────────────────────────────────────── */

function _renderOrderDetail(container, o) {
  const trackNum = _safe(o.tracking_number);
  const statusClass = _oStatusBadgeClass(o.status);
  const createdFmt = window.formatDate ? window.formatDate(o.created) : _safe(o.created && o.created.slice(0, 10));

  /* customer */
  const cust = o.customer || {};
  const addr = cust.address || {};
  const zone = addr.zone || {};
  const city = zone.city || {};
  const gov = city.governorate || {};

  /* packages */
  const pkgs = o.packages || [];

  /* merchant */
  const merch = o.merchant || {};

  /* service level */
  const svc = o.service_level || {};

  container.innerHTML = `
    <!-- Header bar -->
    <div class="detail-header-bar">
      <button class="btn btn-ghost btn-sm" onclick="location.hash='#orders'" aria-label="Back to orders">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Orders
      </button>
      <div class="detail-header-info">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span class="mono detail-tracking">${trackNum}</span>
          <button class="copy-btn" aria-label="Copy tracking number"
            onclick="_copyTrackingNum(this,'${trackNum}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
          <span class="badge ${statusClass}" style="font-size:13px;padding:4px 12px">${_statusLabel(o.status)}</span>
        </div>
        <div style="color:var(--text-secondary);font-size:13px;margin-top:4px">Created ${createdFmt}</div>
      </div>
    </div>

    <!-- Info grid -->
    <div class="detail-grid">

      <!-- Customer card -->
      <div class="detail-card" aria-labelledby="cust-heading">
        <h3 id="cust-heading" class="detail-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Customer
        </h3>
        <div class="detail-field">
          <span class="field-label">Full Name</span>
          <span class="field-value">${_safe(cust.full_name)}</span>
        </div>
        <div class="detail-field">
          <span class="field-label">Phone</span>
          <span class="field-value">
            ${cust.phone ? `<a href="tel:${cust.phone}" style="color:var(--accent)">${cust.phone}</a>` : '—'}
          </span>
        </div>
        ${cust.secondary_phone ? `
        <div class="detail-field">
          <span class="field-label">Alt. Phone</span>
          <span class="field-value"><a href="tel:${cust.secondary_phone}" style="color:var(--accent)">${cust.secondary_phone}</a></span>
        </div>` : ''}
        ${addr.line_1 ? `
        <div class="detail-field">
          <span class="field-label">Address</span>
          <span class="field-value">
            <div>${addr.line_1}</div>
            ${addr.line_2 ? `<div style="color:var(--text-secondary);font-size:12px">${addr.line_2}</div>` : ''}
          </span>
        </div>` : ''}
        ${zone.name ? `
        <div class="detail-field">
          <span class="field-label">Zone</span>
          <span class="field-value zone-breadcrumb">
            <span>${_safe(gov.name)}</span>
            <span class="bc-sep">›</span>
            <span>${_safe(city.name)}</span>
            <span class="bc-sep">›</span>
            <span>${_safe(zone.name)}</span>
          </span>
        </div>` : ''}
      </div>

      <!-- Order Details card -->
      <div class="detail-card" aria-labelledby="ord-heading">
        <h3 id="ord-heading" class="detail-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Order Details
        </h3>
        <div class="detail-field">
          <span class="field-label">Service Level</span>
          <span class="field-value">
            ${svc.short_code ? `<span class="badge badge-info" style="margin-right:6px">${svc.short_code}</span>` : ''}
            ${_safe(svc.name)}
          </span>
        </div>
        <div class="detail-field">
          <span class="field-label">Merchant Ref</span>
          <span class="field-value">
            ${o.merchant_order_reference ? `
              <span class="mono" style="font-size:12px">${o.merchant_order_reference}</span>
              <button class="copy-btn" aria-label="Copy reference"
                onclick="_copyTrackingNum(this,'${o.merchant_order_reference}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            ` : '—'}
          </span>
        </div>
        <div class="detail-field">
          <span class="field-label">Cash Amount</span>
          <span class="field-value" style="font-size:18px;font-weight:700;font-family:var(--font-mono);color:var(--green)">
            ${window.formatCurrency ? window.formatCurrency(o.cash_amount || 0) : (parseFloat(o.cash_amount) || 0).toFixed(2) + ' EGP'}
          </span>
        </div>
        <div class="detail-field">
          <span class="field-label">Delivery Attempts</span>
          <span class="field-value">${_safe(o.delivery_attempts, '0')}</span>
        </div>
        ${o.order_notes ? `
        <div class="detail-field">
          <span class="field-label">Notes</span>
          <span class="field-value" style="color:var(--text-secondary);font-size:13px;line-height:1.5">${o.order_notes}</span>
        </div>` : ''}
      </div>

      <!-- Package card -->
      <div class="detail-card" aria-labelledby="pkg-heading">
        <h3 id="pkg-heading" class="detail-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          Package
        </h3>
        ${pkgs.length === 0 ? `<p style="color:var(--text-muted);font-size:13px">No package details.</p>` :
          pkgs.map((p, i) => {
            const pkg = p.package || p;
            const size = pkg.package_size ? pkg.package_size.name : null;
            return `
              ${pkgs.length > 1 ? `<div class="field-label" style="margin-bottom:6px">Package ${i + 1}</div>` : ''}
              <div class="detail-field">
                <span class="field-label">Size</span>
                <span class="field-value">${_safe(size)}</span>
              </div>
              <div class="detail-field">
                <span class="field-label">Description</span>
                <span class="field-value">${_safe(pkg.description)}</span>
              </div>
              ${pkg.fragile ? `
              <div class="detail-field">
                <span class="field-label">Fragile</span>
                <span class="field-value"><span class="badge badge-warning">Fragile</span></span>
              </div>` : ''}`;
          }).join('')}
      </div>

      <!-- Timeline card -->
      <div class="detail-card" aria-labelledby="tl-heading">
        <h3 id="tl-heading" class="detail-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Timeline
        </h3>
        ${_renderTimeline(o)}
      </div>

      <!-- Flags card -->
      <div class="detail-card" aria-labelledby="flags-heading">
        <h3 id="flags-heading" class="detail-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
          Order Flags
        </h3>
        ${_renderFlag('Exchange', o.is_exchange)}
        ${_renderFlag('Counter Dropoff', o.is_counter_dropoff)}
        ${_renderFlag('Buy and Try', o.is_buy_and_try)}
        ${_renderFlag('Customer Can Open', o.customer_can_open)}
      </div>

    </div>

    <!-- Merchant section -->
    <section class="detail-card detail-merchant" aria-labelledby="merch-heading" style="margin-top:16px">
      <h3 id="merch-heading" class="detail-card-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Merchant
      </h3>
      <div class="detail-merchant-grid">
        <div class="detail-field">
          <span class="field-label">Name</span>
          <span class="field-value">${_safe(merch.name)}</span>
        </div>
        ${merch.display_name ? `
        <div class="detail-field">
          <span class="field-label">Display Name</span>
          <span class="field-value">${merch.display_name}</span>
        </div>` : ''}
        ${merch.subscription ? `
        <div class="detail-field">
          <span class="field-label">Subscription</span>
          <span class="field-value">${merch.subscription}</span>
        </div>` : ''}
        ${merch.store_email ? `
        <div class="detail-field">
          <span class="field-label">Email</span>
          <span class="field-value"><a href="mailto:${merch.store_email}" style="color:var(--accent)">${merch.store_email}</a></span>
        </div>` : ''}
        ${merch.store_phone ? `
        <div class="detail-field">
          <span class="field-label">Phone</span>
          <span class="field-value"><a href="tel:${merch.store_phone}" style="color:var(--accent)">${merch.store_phone}</a></span>
        </div>` : ''}
      </div>
    </section>

    <style>
      .detail-header-bar {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .detail-tracking {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: .5px;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      @media (max-width: 700px) { .detail-grid { grid-template-columns: 1fr; } }

      .detail-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 20px;
      }
      .detail-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: .5px;
        margin-bottom: 16px;
      }

      .detail-field {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
      }
      .detail-field:last-child { margin-bottom: 0; }
      .field-label {
        font-size: 11px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: .4px;
        margin-bottom: 3px;
      }
      .field-value { font-size: 14px; color: var(--text-primary); }

      .zone-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; font-size: 13px; }
      .bc-sep { color: var(--text-muted); }

      /* Timeline */
      .timeline { position: relative; padding-left: 20px; }
      .timeline-item {
        position: relative;
        padding-bottom: 16px;
        padding-left: 12px;
      }
      .timeline-item:last-child { padding-bottom: 0; }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--tl-color, var(--border));
        border: 2px solid var(--tl-border, var(--border));
      }
      .timeline-item::after {
        content: '';
        position: absolute;
        left: -9px;
        top: 13px;
        width: 2px;
        bottom: 0;
        background: var(--border-light);
      }
      .timeline-item:last-child::after { display: none; }
      .timeline-item.done::before { background: var(--green); border-color: var(--green); --tl-color: var(--green); }
      .tl-label { font-size: 12px; color: var(--text-secondary); }
      .tl-value { font-size: 13px; color: var(--text-primary); margin-top: 2px; }

      /* Flags */
      .flag-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--border-light); }
      .flag-row:last-child { border-bottom: none; }
      .flag-name { font-size: 13px; color: var(--text-secondary); }

      /* Merchant grid */
      .detail-merchant-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px 24px;
      }

      /* Misc */
      .mono { font-family: var(--font-mono); }
      .copy-btn { background:none;border:none;cursor:pointer;color:var(--text-muted);padding:2px 4px;border-radius:3px;transition:color .15s;vertical-align:middle;font-family:var(--font-sans); }
      .copy-btn:hover { color: var(--text-primary); }
      .page-header { margin-bottom: 0; }
      .page-subtitle { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }
      .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
    </style>`;
}

/* ─── Detail: timeline ─────────────────────────────────────────── */

function _renderTimeline(o) {
  const steps = [
    { label: 'Created', date: o.created },
    { label: 'Pickup Date', date: o.pickup_date },
    { label: 'Estimated Delivery', date: o.estimated_date },
    { label: 'Delivered', date: o.delivered_date }
  ];

  const items = steps.map(step => {
    const done = !!step.date;
    const formatted = done
      ? (window.formatDate ? window.formatDate(step.date) : step.date.slice(0, 10))
      : '—';
    return `<div class="timeline-item ${done ? 'done' : ''}">
      <div class="tl-label">${step.label}</div>
      <div class="tl-value">${formatted}</div>
    </div>`;
  }).join('');

  return `<div class="timeline">${items}</div>`;
}

/* ─── Detail: flag row ─────────────────────────────────────────── */

function _renderFlag(label, value) {
  const isYes = value === true;
  const badge = isYes
    ? '<span class="badge badge-info">Yes</span>'
    : '<span class="badge badge-neutral">No</span>';
  return `<div class="flag-row"><span class="flag-name">${label}</span>${badge}</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UTILITIES (orders-scoped)
   ═══════════════════════════════════════════════════════════════ */

function _safe(val, fallback) {
  const fb = fallback !== undefined ? fallback : '—';
  if (val === null || val === undefined || val === '') return fb;
  return val;
}

function _oStatusBadgeClass(status) {
  const map = {
    delivered: 'badge-success',
    cancelled: 'badge-error',
    returned: 'badge-error',
    pending: 'badge-warning',
    on_hold: 'badge-warning',
    picked_up: 'badge-info',
    out_for_delivery: 'badge-info',
    'in-transit': 'badge-info',
    'in_transit': 'badge-info',
  };
  return map[(status || '').toLowerCase()] || 'badge-neutral';
}

function _statusLabel(status) {
  if (!status) return '—';
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function _relativeDate(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return dateStr.slice(0, 10);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
