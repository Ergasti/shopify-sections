/* locations.js — ShipBlu Explorer Locations Page
 * Two sections: Governorates (searchable, sortable table) + Return Points (card grid)
 * Data fetched in parallel on render.
 */
;(function () {
  'use strict';

  // ─── Module state ─────────────────────────────────────────────────────────

  let _govs          = [];   // raw governorate array
  let _returnPoints  = [];   // raw return point array
  let _govSearch     = '';
  let _govSort       = { key: 'name', dir: 1 }; // dir: 1=asc, -1=desc

  // ─── Page registration ────────────────────────────────────────────────────

  window.registerPage('locations', {
    title: 'Locations',

    render(container) {
      _injectStyles();

      // Reset search/sort on fresh render
      _govSearch = '';
      _govSort   = { key: 'name', dir: 1 };

      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyHtml();
        return;
      }

      container.innerHTML = _shellHtml();
      _loadAll(container);
    }
  });

  // ─── Styles ───────────────────────────────────────────────────────────────

  function _injectStyles() {
    const id = 'loc-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
/* ── Locations page scoped styles ── */

/* Section header row */
.loc-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: var(--space-4, 16px);
}
.loc-section-header h3 {
  font-size: 16px; font-weight: 700;
  color: var(--color-text, #e6edf3);
  flex: 1;
}
.loc-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--color-elevated, #0d1117);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius-sm, 4px);
  padding: 0 10px;
  min-width: 220px;
}
@media (max-width: 480px) { .loc-search { width: 100%; min-width: 0; } }
.loc-search svg { color: var(--color-text-muted, #8b949e); flex-shrink: 0; }
.loc-search-input {
  background: none; border: none; outline: none;
  color: var(--color-text, #e6edf3);
  font-size: 13px;
  padding: 8px 0;
  width: 100%;
}
.loc-search-input::placeholder { color: var(--color-text-muted, #8b949e); }

/* Sortable column headers */
.loc-sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.loc-sortable:hover { color: var(--color-accent, #58a6ff); }
.loc-sort-indicator { margin-left: 4px; font-size: 10px; opacity: .7; }

/* Age badge colours */
.age-badge-green  { background: rgba(63,185,80,.15); color: #3fb950; border: 1px solid rgba(63,185,80,.3); }
.age-badge-amber  { background: rgba(210,153,34,.15); color: #d4a017; border: 1px solid rgba(210,153,34,.3); }
.age-badge-red    { background: rgba(248,81,73,.15);  color: #f85149; border: 1px solid rgba(248,81,73,.3); }

/* Return point cards */
.rp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .rp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .rp-grid { grid-template-columns: 1fr; } }

.rp-card {
  background: var(--color-surface, #161b22);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: 20px;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color var(--duration-fast, 150ms);
}
.rp-card:hover { border-color: var(--color-accent, #58a6ff); }
.rp-card-name {
  font-weight: 700; font-size: 14px;
  color: var(--color-text, #e6edf3);
  line-height: 1.4;
}
.rp-card-title {
  font-weight: 600; font-size: 13px;
  color: var(--color-text-muted, #8b949e);
  line-height: 1.4;
}
.rp-card-meta {
  font-size: 12px; color: var(--color-text-muted, #8b949e);
  display: flex; flex-direction: column; gap: 4px;
}
.rp-card-meta span { display: flex; align-items: center; gap: 6px; }
.rp-card-footer { margin-top: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* Skeleton rows */
.loc-skeleton-row td div { height: 14px; border-radius: 4px; }

/* Skeleton RP cards */
.rp-skeleton-card {
  background: var(--color-surface, #161b22);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: 20px;
  display: flex; flex-direction: column; gap: 10px;
}

/* Divider between sections */
.loc-divider {
  border: none; border-top: 1px solid var(--color-border, #30363d);
  margin: var(--space-10, 40px) 0;
}

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
        <h2>Locations</h2>
        <p class="page-subtitle">Governorates, zones, and return points</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Connect your ShipBlu account to view location data.</p>
        <a href="#settings" class="btn btn-primary" style="margin-top:16px">Set up your API key in Settings →</a>
      </div>`;
  }

  // ─── Page shell ────────────────────────────────────────────────────────────

  function _shellHtml() {
    return `
      <div class="page-header">
        <div>
          <h2>Locations</h2>
          <p class="page-subtitle">Governorates, zones, and return points</p>
        </div>
      </div>

      <section id="loc-govs-section" aria-labelledby="loc-govs-heading" aria-busy="true">
        ${_govSkeletonHtml()}
      </section>

      <hr class="loc-divider" aria-hidden="true">

      <section id="loc-rp-section" aria-labelledby="loc-rp-heading" aria-busy="true">
        ${_rpSkeletonHtml()}
      </section>`;
  }

  function _govSkeletonHtml() {
    const rows = Array(7).fill(0).map(() => `
      <tr class="loc-skeleton-row">
        ${Array(5).fill(0).map((_, i) => `<td><div class="skeleton" style="width:${60 + i * 5}%"></div></td>`).join('')}
        <td><div class="skeleton" style="width:40%"></div></td>
      </tr>`).join('');

    return `
      <div class="loc-section-header">
        <h3 id="loc-govs-heading">
          <div class="skeleton" style="width:180px;height:20px;display:inline-block;border-radius:4px"></div>
        </h3>
        <div class="skeleton" style="height:36px;width:220px;border-radius:var(--radius-sm,4px)"></div>
      </div>
      <div class="card" style="overflow:hidden">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Governorate</th>
                <th scope="col">Arabic Name</th>
                <th scope="col">Code</th>
                <th scope="col">Max Order Age</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  function _rpSkeletonHtml() {
    const cards = Array(4).fill(0).map(() => `
      <div class="rp-skeleton-card">
        <div class="skeleton" style="height:16px;width:80%"></div>
        <div class="skeleton" style="height:12px;width:60%"></div>
        <div class="skeleton" style="height:12px;width:50%"></div>
        <div class="skeleton" style="height:20px;width:30%;border-radius:20px"></div>
      </div>`).join('');

    return `
      <div class="loc-section-header">
        <h3 id="loc-rp-heading">
          <div class="skeleton" style="width:160px;height:20px;display:inline-block;border-radius:4px"></div>
        </h3>
      </div>
      <div class="rp-grid">${cards}</div>`;
  }

  // ─── Load all data in parallel ────────────────────────────────────────────

  async function _loadAll(container) {
    const [govsResult, rpResult] = await Promise.allSettled([
      window.shipbluApi('GET', '/v1/governorates/'),
      window.shipbluApi('GET', '/v1/return-points/'),
    ]);

    // Governorates
    if (govsResult.status === 'fulfilled') {
      const raw = govsResult.value;
      _govs = Array.isArray(raw) ? raw : (raw.results || []);
    } else {
      _govs = null; // signal error
    }

    // Return points
    if (rpResult.status === 'fulfilled') {
      const raw = rpResult.value;
      _returnPoints = Array.isArray(raw) ? raw : (raw.results || []);
    } else {
      _returnPoints = null; // signal error
    }

    _renderGovsSection(container, govsResult.status === 'rejected' ? govsResult.reason : null);
    _renderRpSection(container, rpResult.status === 'rejected' ? rpResult.reason : null);
  }

  // ─── Governorates section ──────────────────────────────────────────────────

  function _renderGovsSection(container, err) {
    const section = container.querySelector('#loc-govs-section');
    if (!section) return;
    section.removeAttribute('aria-busy');

    if (err || _govs === null) {
      section.innerHTML = `
        <div class="loc-section-header">
          <h3 id="loc-govs-heading">Governorates</h3>
        </div>
        ${_errorCard(err, 'governorates')}`;
      return;
    }

    _renderGovsTable(section);
  }

  function _renderGovsTable(section) {
    const govs   = _govs || [];
    const count  = govs.length;
    const sorted = _sortedGovs(govs, _govSearch);

    section.innerHTML = `
      <div class="loc-section-header">
        <h3 id="loc-govs-heading">
          Governorates
          <span class="badge badge-neutral" style="margin-left:8px;vertical-align:middle;font-size:12px">${count}</span>
        </h3>
        <div class="loc-search" role="search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input class="loc-search-input" type="search" id="loc-gov-search"
            placeholder="Filter by name or code…"
            aria-label="Filter governorates"
            value="${_esc(_govSearch)}">
        </div>
      </div>

      <div class="card" style="overflow:hidden">
        <div class="table-wrap" id="loc-gov-table-wrap">
          ${_govTableHtml(sorted)}
        </div>
      </div>`;

    // Real-time filter on input event — no button needed
    section.querySelector('#loc-gov-search').addEventListener('input', (e) => {
      _govSearch = e.target.value;
      const wrap = section.querySelector('#loc-gov-table-wrap');
      if (wrap) wrap.innerHTML = _govTableHtml(_sortedGovs(_govs, _govSearch));
      _bindSortHeaders(section);
    });

    _bindSortHeaders(section);
  }

  function _govTableHtml(govs) {
    if (govs.length === 0) {
      return `
        <div class="empty-state" style="padding:32px 20px">
          <div class="empty-icon" aria-hidden="true">🔍</div>
          <h3>No results</h3>
          <p>No governorates match your filter.</p>
        </div>`;
    }

    const sortIcon = (key) => {
      if (_govSort.key !== key) return `<span class="loc-sort-indicator" aria-hidden="true">⇅</span>`;
      return `<span class="loc-sort-indicator" aria-hidden="true">${_govSort.dir === 1 ? '↑' : '↓'}</span>`;
    };

    const rows = govs.map((g, i) => {
      const nameEn = g.name_en || g.name || '—';
      const nameAr = g.name_ar || g.name || '—';
      const code   = g.code || '—';
      const age    = g.max_order_age !== undefined && g.max_order_age !== null ? g.max_order_age : null;
      const ageFmt = age !== null ? `${age} days` : '—';
      const ageCls = age === null ? '' : age <= 5 ? 'age-badge-green' : age <= 7 ? 'age-badge-amber' : 'age-badge-red';

      return `
        <tr>
          <td class="text-muted" style="font-size:12px">${i + 1}</td>
          <td style="font-weight:500">${_esc(nameEn)}</td>
          <td dir="rtl" style="font-family:inherit;color:var(--color-text-muted,#8b949e)">${_esc(nameAr)}</td>
          <td><span class="text-mono badge badge-neutral">${_esc(String(code))}</span></td>
          <td>
            ${age !== null
              ? `<span class="badge ${ageCls}">${_esc(ageFmt)}</span>`
              : `<span class="text-muted">—</span>`}
          </td>
          <td>
            <a href="#pricing" class="btn btn-ghost btn-sm"
               aria-label="View pricing for ${_esc(nameEn)}">
              Pricing →
            </a>
          </td>
        </tr>`;
    }).join('');

    return `
      <table role="table" aria-label="Governorates">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" class="loc-sortable" data-sort="name"
                aria-sort="${_govSort.key === 'name' ? (_govSort.dir === 1 ? 'ascending' : 'descending') : 'none'}"
                tabindex="0" role="columnheader">
              Governorate (EN) ${sortIcon('name')}
            </th>
            <th scope="col">Arabic Name</th>
            <th scope="col">Code</th>
            <th scope="col" class="loc-sortable" data-sort="max_order_age"
                aria-sort="${_govSort.key === 'max_order_age' ? (_govSort.dir === 1 ? 'ascending' : 'descending') : 'none'}"
                tabindex="0" role="columnheader">
              Max Order Age ${sortIcon('max_order_age')}
            </th>
            <th scope="col"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function _bindSortHeaders(section) {
    section.querySelectorAll('.loc-sortable').forEach(th => {
      // Remove and re-add to avoid duplicate listeners
      const clone = th.cloneNode(true);
      th.parentNode.replaceChild(clone, th);
      clone.addEventListener('click', () => _handleGovSort(section, clone.dataset.sort));
      clone.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _handleGovSort(section, clone.dataset.sort);
        }
      });
    });
  }

  function _handleGovSort(section, key) {
    if (_govSort.key === key) {
      _govSort = { key, dir: _govSort.dir * -1 };
    } else {
      _govSort = { key, dir: 1 };
    }
    const wrap = section.querySelector('#loc-gov-table-wrap');
    if (wrap) wrap.innerHTML = _govTableHtml(_sortedGovs(_govs, _govSearch));
    _bindSortHeaders(section);
  }

  function _sortedGovs(govs, query) {
    let filtered = govs;
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = govs.filter(g => {
        const nameEn = (g.name_en || g.name || '').toLowerCase();
        const nameAr = (g.name_ar || '').toLowerCase();
        const code   = (g.code || '').toLowerCase();
        return nameEn.includes(q) || nameAr.includes(q) || code.includes(q);
      });
    }

    return [...filtered].sort((a, b) => {
      const key = _govSort.key;
      let aVal, bVal;
      if (key === 'max_order_age') {
        aVal = a.max_order_age !== null && a.max_order_age !== undefined ? a.max_order_age : Infinity;
        bVal = b.max_order_age !== null && b.max_order_age !== undefined ? b.max_order_age : Infinity;
      } else {
        aVal = (a.name_en || a.name || '').toLowerCase();
        bVal = (b.name_en || b.name || '').toLowerCase();
      }
      if (aVal < bVal) return -1 * _govSort.dir;
      if (aVal > bVal) return 1  * _govSort.dir;
      return 0;
    });
  }

  // ─── Return Points section ────────────────────────────────────────────────

  function _renderRpSection(container, err) {
    const section = container.querySelector('#loc-rp-section');
    if (!section) return;
    section.removeAttribute('aria-busy');

    if (err || _returnPoints === null) {
      section.innerHTML = `
        <div class="loc-section-header">
          <h3 id="loc-rp-heading">Return Points</h3>
        </div>
        ${_errorCard(err, 'return points')}`;
      return;
    }

    const rps   = _returnPoints || [];
    const count = rps.length;

    if (count === 0) {
      section.innerHTML = `
        <div class="loc-section-header">
          <h3 id="loc-rp-heading">Return Points</h3>
        </div>
        <div class="empty-state" style="padding:32px 20px">
          <div class="empty-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              style="color:var(--color-text-muted,#8b949e);opacity:.5">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3>No return points configured</h3>
          <p>No return points have been set up for this account.<br>
             Contact ShipBlu support to configure your return addresses.</p>
        </div>`;
      return;
    }

    const cardsHtml = rps.map(rp => _rpCardHtml(rp)).join('');

    section.innerHTML = `
      <div class="loc-section-header">
        <h3 id="loc-rp-heading">
          Return Points
          <span class="badge badge-neutral" style="margin-left:8px;vertical-align:middle;font-size:12px">${count}</span>
        </h3>
      </div>
      <div class="rp-grid" role="list" aria-label="Return points">${cardsHtml}</div>`;
  }

  function _rpCardHtml(rp) {
    const name      = rp.name || rp.label || '';
    const addr1     = rp.address || rp.address_line_1 || rp.line_1 || '—';
    const addr2     = rp.address_line_2 || rp.line_2 || '';
    const city      = rp.city_name || (rp.city && (rp.city.name_en || rp.city.name || String(rp.city))) || '';
    const zone      = rp.zone_name || (rp.zone && (rp.zone.name_en || rp.zone.name || `Zone ${rp.zone}`)) || (rp.zone ? String(rp.zone) : '');
    const isDefault = rp.is_default;

    const displayTitle = name || addr1;
    const displayAddr  = name ? addr1 : addr2;

    return `
      <article class="rp-card" role="listitem" aria-label="Return point: ${_esc(displayTitle)}">
        <div class="rp-card-name">${_esc(displayTitle)}</div>
        ${displayAddr && displayAddr !== '—' ? `<div class="rp-card-title">${_esc(String(displayAddr))}</div>` : ''}
        <div class="rp-card-meta">
          ${city ? `
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${_esc(String(city))}
          </span>` : ''}
          ${zone ? `
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            ${_esc(String(zone))}
          </span>` : ''}
        </div>
        <div class="rp-card-footer">
          ${isDefault
            ? `<span class="badge badge-success" aria-label="Default return point">Default</span>`
            : ''}
        </div>
      </article>`;
  }

  // ─── Error card ────────────────────────────────────────────────────────────

  function _errorCard(err, context) {
    let msg  = `Failed to load ${context}.`;
    let hint = '';

    if (err && err.name === 'AuthError') {
      msg  = 'Authentication failed.';
      hint = 'Check your API key in <a href="#settings" style="color:var(--color-accent,#58a6ff)">Settings</a>.';
    } else if (err && err.name === 'NetworkError') {
      msg  = 'Network error.';
      hint = 'Check your connection and try again.';
    } else if (err && err.name === 'CorsError') {
      msg  = 'CORS error — request was blocked.';
    } else if (err && err.message) {
      msg = err.message;
    }

    return `
      <div class="empty-state" style="padding:32px 20px">
        <div class="empty-icon-wrap" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
            style="color:var(--color-error,#f85149);opacity:.7">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p style="font-size:14px">${_esc(msg)}${hint ? ` ${hint}` : ''}</p>
        <button class="btn btn-primary" style="margin-top:16px"
          onclick="window.navigateTo('locations')">Retry</button>
      </div>`;
  }

  // ─── Utilities ─────────────────────────────────────────────────────────────

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

})();
