/**
 * Freight Calculator — uses official.jtjms-eg.com public API (no auth required)
 */
(function () {

  const BASE = 'https://official.jtjms-eg.com';

  function apiGet(path) {
    return fetch(BASE + path, {
      headers: { 'Accept': 'application/json', 'timezone': 'GMT+2', 'language': 'EN' }
    }).then(r => r.json());
  }

  function apiPost(path, data) {
    return fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'timezone': 'GMT+2', 'language': 'EN' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  }

  function getCost(startId, endId, weight) {
    return apiPost('/official/costCalculation/spmStandardShippingQuote/comCost', {
      startProviderId: startId,
      endProviderId: endId,
      startCityId: String(startId),
      endCityId: String(endId),
      productTypeId: '98',
      productTypeCode: 'EZ',
      goodsTypeCode: 'ITN6',
      goodsTypeId: '110',
      value: String(weight),
      volume: false,
    });
  }

  // ── Page ─────────────────────────────────────────────────────────────────────
  window.registerPage('freight', {
    title: 'Freight Calculator',
    async render(container) {
      container.innerHTML = skeletonHTML();
      try {
        const [provRes, goodsRes, prodRes] = await Promise.all([
          apiPost('/official/appNetwork/getAddressRating', { size: 100, current: 1 }),
          apiGet('/official/baseData/getGoodsList'),
          apiGet('/official/baseData/getProductTypeAll'),
        ]);

        const provinces = (provRes.data?.records || []).sort((a, b) => a.enName.localeCompare(b.enName));
        const goods     = goodsRes.data || [];
        const products  = prodRes.data  || [];

        container.innerHTML = buildPage(provinces, goods, products);
        bindEvents(container, provinces, goods, products);
      } catch (err) {
        container.innerHTML = errorHTML(err.message);
      }
    },
  });

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  function skeletonHTML() {
    return `
      <div class="page-header">
        <div><div class="page-title">Freight Calculator</div><div class="page-subtitle">Loading rate data…</div></div>
      </div>
      <div class="panel" style="max-width:700px">
        <div class="panel-body">${[1,2,3,4,5].map(()=>`<div class="skeleton skeleton-text" style="margin-bottom:16px"></div>`).join('')}</div>
      </div>`;
  }

  function errorHTML(msg) {
    return `<div class="page-header"><div class="page-title">Freight Calculator</div></div>
      <div class="empty-state">
        <div class="empty-state-icon">⚡</div>
        <div class="empty-state-title">Failed to load</div>
        <div class="empty-state-desc">${msg}</div>
        <button class="btn btn-secondary" style="margin-top:16px" onclick="window.navigateTo('freight')">Retry</button>
      </div>`;
  }

  // ── Build page ────────────────────────────────────────────────────────────────
  function buildPage(provinces, goods, products) {
    const opts = provinces.map(p => `<option value="${p.id}">${p.enName}</option>`).join('');
    const goodsOpts = goods.map(g => `<option value="${g.code}" data-id="${g.id}">${g.name}</option>`).join('');

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Freight Calculator</div>
          <div class="page-subtitle">
            Standard published rates · J&amp;T Express Egypt · No account required
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:6px 12px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);font-size:12px;color:var(--text-muted)">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" style="color:var(--green);flex-shrink:0"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          Public rates — not account-specific
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">

        <!-- Calculator form -->
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Calculate Rate</div></div>
          <div class="panel-body">

            <div class="form-group">
              <label class="form-label">Origin</label>
              <select class="select form-input" id="fc-from">${opts}</select>
            </div>

            <div class="form-group">
              <label class="form-label">Destination</label>
              <select class="select form-input" id="fc-to">${opts}</select>
            </div>

            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input class="input form-input" id="fc-weight" type="number" min="0.1" max="30" step="0.5" value="1">
              <div class="form-hint">0.1 – 30 kg</div>
            </div>

            <div class="form-group">
              <label class="form-label">Goods Type</label>
              <select class="select form-input" id="fc-goods">${goodsOpts}</select>
            </div>

            <div id="fc-error" style="display:none;margin-bottom:12px"></div>

            <button class="btn btn-primary" id="fc-calc" style="width:100%">Calculate</button>
          </div>
        </div>

        <!-- Result -->
        <div id="fc-result-panel">
          <div class="panel">
            <div class="panel-header"><div class="panel-title">Estimated Rate</div></div>
            <div class="panel-body" id="fc-result-body">
              <div class="empty-state" style="padding:24px 0">
                <div class="empty-state-title" style="font-size:14px">Fill in the form and click Calculate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rate matrix: Cairo from/to all zones -->
      <div class="panel" style="margin-top:24px" id="matrix-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Cairo → All Zones</div>
            <div class="panel-subtitle">Standard rate at 1 kg</div>
          </div>
          <div class="controls-bar">
            <select class="select" id="matrix-weight">
              <option value="1">1 kg</option>
              <option value="2">2 kg</option>
              <option value="5">5 kg</option>
              <option value="10">10 kg</option>
              <option value="20">20 kg</option>
            </select>
            <button class="btn btn-primary btn-sm" id="matrix-load">Load</button>
            <button class="btn btn-ghost btn-sm" id="matrix-export">Export CSV</button>
          </div>
        </div>
        <div class="panel-body" id="matrix-body">
          <div class="empty-state" style="padding:16px 0">
            <div class="empty-state-title" style="font-size:14px">Click Load to fetch all zone rates</div>
          </div>
        </div>
      </div>`;
  }

  // ── Events ────────────────────────────────────────────────────────────────────
  function bindEvents(container, provinces, goods) {
    // Default: select Cairo for both origin and destination
    const cairoOpt = [...container.querySelectorAll('#fc-from option')].find(o => o.textContent === 'Cairo');
    if (cairoOpt) {
      container.querySelector('#fc-from').value = cairoOpt.value;
      container.querySelector('#fc-to').value   = cairoOpt.value;
    }

    // Calculate button
    container.querySelector('#fc-calc')?.addEventListener('click', async () => {
      const btn    = container.querySelector('#fc-calc');
      const from   = container.querySelector('#fc-from').value;
      const to     = container.querySelector('#fc-to').value;
      const weight = parseFloat(container.querySelector('#fc-weight').value) || 1;
      const goodsSel = container.querySelector('#fc-goods');
      const goodsCode = goodsSel.value;
      const goodsId   = goodsSel.selectedOptions[0]?.dataset.id || '110';

      const fromName = container.querySelector('#fc-from').selectedOptions[0]?.text;
      const toName   = container.querySelector('#fc-to').selectedOptions[0]?.text;

      btn.disabled = true;
      btn.innerHTML = '<div class="spinner spinner-sm"></div> Calculating…';
      const errEl = container.querySelector('#fc-error');
      if (errEl) errEl.style.display = 'none';

      try {
        const res = await apiPost('/official/costCalculation/spmStandardShippingQuote/comCost', {
          startProviderId: parseInt(from),
          endProviderId: parseInt(to),
          startCityId: from,
          endCityId: to,
          productTypeId: '98',
          productTypeCode: 'EZ',
          goodsTypeCode: goodsCode,
          goodsTypeId: goodsId,
          value: String(weight),
          volume: false,
        });

        if (String(res.code) !== '1' || !res.data) {
          throw new Error(res.msg || 'Unknown error');
        }

        const cost = res.data.cost;
        const billed = res.data.setWeight;
        container.querySelector('#fc-result-body').innerHTML = resultHTML(fromName, toName, weight, billed, cost);
      } catch (err) {
        if (errEl) {
          errEl.style.display = 'block';
          errEl.className = 'badge badge-red';
          errEl.style.cssText = 'display:block;padding:8px 12px;border-radius:var(--radius-sm);font-size:13px;margin-bottom:12px';
          errEl.textContent = '✗ ' + err.message;
        }
      } finally {
        btn.disabled = false;
        btn.textContent = 'Calculate';
      }
    });

    // Matrix load
    container.querySelector('#matrix-load')?.addEventListener('click', () => loadMatrix(container, provinces));
    container.querySelector('#matrix-export')?.addEventListener('click', () => exportMatrix(container));

    // Auto-load Cairo matrix on page load
    loadMatrix(container, provinces);
  }

  function resultHTML(from, to, weight, billed, cost) {
    return `
      <div style="text-align:center;padding:12px 0">
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">${from} → ${to}</div>
        <div style="font-size:42px;font-weight:700;color:var(--accent);letter-spacing:-1px">${cost.toFixed(2)}</div>
        <div style="font-size:16px;color:var(--text-secondary);margin-bottom:16px">EGP</div>
        <div style="display:flex;justify-content:center;gap:24px;font-size:13px;color:var(--text-muted)">
          <span>Entered: ${weight} kg</span>
          <span>Billed: ${billed} kg</span>
        </div>
        <div style="margin-top:16px;font-size:11px;color:var(--text-muted);padding:6px 10px;background:var(--bg-elevated);border-radius:var(--radius-sm)">
          Standard published rate — may differ from your account contract
        </div>
      </div>`;
  }

  // ── Rate matrix ───────────────────────────────────────────────────────────────
  let _matrixData = [];

  async function loadMatrix(container, provinces) {
    const weightSel = container.querySelector('#matrix-weight');
    const weight = parseFloat(weightSel?.value || '1');
    const btn = container.querySelector('#matrix-load');
    const body = container.querySelector('#matrix-body');
    if (!body) return;

    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-sm"></div>'; }
    body.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';

    const CAIRO_ID = 1011;

    try {
      const results = await Promise.all(
        provinces.map(p =>
          getCost(CAIRO_ID, p.id, weight)
            .then(res => ({ name: p.enName, id: p.id, cost: res.data?.cost ?? null }))
            .catch(() => ({ name: p.enName, id: p.id, cost: null }))
        )
      );

      _matrixData = results.filter(r => r.cost !== null).sort((a, b) => a.cost - b.cost);
      const maxCost = Math.max(..._matrixData.map(r => r.cost));

      // Update subtitle
      const sub = container.querySelector('#matrix-panel .panel-subtitle');
      if (sub) sub.textContent = `Cairo origin · ${weight} kg · ${_matrixData.length} zones`;

      body.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Destination Province</th>
              <th>Freight Cost (EGP)</th>
              <th style="width:200px">Visual</th>
            </tr>
          </thead>
          <tbody>
            ${_matrixData.map(r => {
              const barW = Math.round((r.cost / maxCost) * 100);
              return `<tr>
                <td><strong>${r.name}</strong></td>
                <td><strong>${r.cost.toFixed(2)} EGP</strong></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="flex:1;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden">
                      <div style="height:100%;width:${barW}%;background:var(--accent);border-radius:3px"></div>
                    </div>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`;
    } catch (err) {
      body.innerHTML = `<div class="empty-state"><div class="empty-state-desc">${err.message}</div></div>`;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Load'; }
    }
  }

  function exportMatrix(container) {
    if (!_matrixData.length) return;
    const weightSel = container.querySelector('#matrix-weight');
    const weight = weightSel?.value || '1';
    const header = 'Destination,Freight Cost (EGP)';
    const rows = _matrixData.map(r => `${r.name},${r.cost.toFixed(2)}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jt_cairo_rates_${weight}kg_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast('CSV exported!', 'success');
  }
})();
