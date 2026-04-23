/**
 * Settings page — API credentials management
 */
(function () {
  window.registerPage('settings', {
    title: 'Settings',
    render(container) {
      const creds = window.getCredentials();
      container.innerHTML = buildSettings(creds);
      bindEvents(container);
    },
  });

  function buildSettings(creds) {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">Settings</div>
          <div class="page-subtitle">Configure your J&amp;T Express MX API credentials</div>
        </div>
      </div>

      <div class="panel" style="max-width:600px">
        <div class="panel-header">
          <div class="panel-title">API Credentials</div>
          <div id="conn-status" class="badge ${creds.apiAccount ? 'badge-green' : 'badge-muted'}">
            ${creds.apiAccount ? 'Configured' : 'Not configured'}
          </div>
        </div>
        <div class="panel-body">

          <div class="form-group">
            <label class="form-label">Region</label>
            <div class="tabs" style="width:fit-content">
              <button class="tab ${(creds.region||'eg')==='eg'?'active':''}" data-region="eg">Egypt (EG)</button>
              <button class="tab ${creds.region==='mx'?'active':''}" data-region="mx">Mexico (MX)</button>
            </div>
          </div>

          <div class="form-group" id="env-row" style="${(creds.region||'eg')==='eg'?'display:none':''}">
            <label class="form-label">Environment</label>
            <div class="tabs" style="width:fit-content">
              <button class="tab ${creds.testMode !== false ? 'active' : ''}" data-env="test">Test</button>
              <button class="tab ${creds.testMode === false ? 'active' : ''}" data-env="production">Production</button>
            </div>
            <div class="form-hint" id="env-hint">
              ${creds.testMode !== false
                ? 'Using: <code>demoopenapi.jtjms-mx.com</code>'
                : 'Using: <code>openapi.jtjms-mx.com</code>'}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">API Account ID <span style="color:var(--accent)">*</span></label>
            <input class="input form-input" id="f-apiAccount" type="text" value="${creds.apiAccount || ''}"
              placeholder="e.g. 292508153084379141">
            <div class="form-hint">Provided by J&amp;T Express platform</div>
          </div>

          <div class="form-group">
            <label class="form-label">Private Key <span style="color:var(--accent)">*</span></label>
            <div style="position:relative">
              <input class="input form-input" id="f-privateKey" type="password" value="${creds.privateKey || ''}"
                placeholder="32-character key" style="padding-right:40px">
              <button id="toggle-pk" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted)">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
            <div class="form-hint">Used for header signature generation</div>
          </div>

          <div class="form-group">
            <label class="form-label">Customer Code <span style="color:var(--accent)">*</span></label>
            <input class="input form-input" id="f-customerCode" type="text" value="${creds.customerCode || ''}"
              placeholder="e.g. J0086024119">
            <div class="form-hint">Your J&amp;T customer code (from your outlet)</div>
          </div>

          <div class="form-group">
            <label class="form-label">Customer Password</label>
            <div style="position:relative">
              <input class="input form-input" id="f-customerPassword" type="password" value="${creds.customerPassword || ''}"
                placeholder="Cleartext password" style="padding-right:40px">
              <button id="toggle-cp" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted)">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
            <div class="form-hint">Needed for the business-level biz digest</div>
          </div>

          <div class="form-group">
            <label class="form-label">Timezone</label>
            <select class="select form-input" id="f-timezone">
              <option value="GMT+2" ${creds.timezone==='GMT+2'?'selected':''}>GMT+2 (Cairo / Egypt)</option>
              <option value="GMT-5" ${creds.timezone==='GMT-5'?'selected':''}>GMT-5</option>
              <option value="GMT-6" ${creds.timezone==='GMT-6'?'selected':''}>GMT-6 (Mexico City)</option>
              <option value="GMT-7" ${creds.timezone==='GMT-7'?'selected':''}>GMT-7</option>
              <option value="GMT-8" ${creds.timezone==='GMT-8'?'selected':''}>GMT-8</option>
            </select>
          </div>

          <div id="save-msg" style="display:none;margin-bottom:12px"></div>

          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" id="save-btn">Save Credentials</button>
            <button class="btn btn-secondary" id="test-btn" ${!creds.apiAccount?'disabled':''}>
              Test Connection
            </button>
            <button class="btn btn-ghost" id="clear-btn">Clear All</button>
          </div>
        </div>
      </div>

      <div class="panel" style="max-width:600px">
        <div class="panel-header"><div class="panel-title">How Authentication Works</div></div>
        <div class="panel-body" style="color:var(--text-secondary);font-size:13px;line-height:1.8">
          <p style="margin-bottom:10px">Every request sends these headers:</p>
          <pre style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;padding:12px;font-size:12px;overflow-x:auto;color:var(--text-primary)">apiAccount  = your account ID
digest      = base64( md5( bizContentJson + privateKey ) )
timestamp   = current time in milliseconds
timezone    = e.g. GMT-6</pre>
          <p style="margin-top:10px">The business digest inside <code>bizContent</code>:</p>
          <pre style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;padding:12px;font-size:12px;overflow-x:auto;color:var(--text-primary)">ciphertext = MD5( password + "jadada236t2" ).toUpperCase()
digest     = base64( md5( customerCode + ciphertext + privateKey ) )</pre>
        </div>
      </div>`;
  }

  function bindEvents(container) {
    const saved = window.getCredentials();
    let testMode = saved.testMode !== false;
    let region   = saved.region || 'eg';

    // Region tabs
    container.querySelectorAll('[data-region]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-region]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        region = btn.dataset.region;
        const envRow = container.querySelector('#env-row');
        if (envRow) envRow.style.display = region === 'eg' ? 'none' : '';
      });
    });

    // Environment tabs
    container.querySelectorAll('[data-env]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-env]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        testMode = btn.dataset.env === 'test';
        const hint = container.querySelector('#env-hint');
        if (hint) hint.innerHTML = testMode
          ? 'Using: <code>demoopenapi.jtjms-mx.com</code>'
          : 'Using: <code>openapi.jtjms-mx.com</code>';
      });
    });

    // Password toggles
    container.querySelector('#toggle-pk')?.addEventListener('click', () => {
      const f = container.querySelector('#f-privateKey');
      f.type = f.type === 'password' ? 'text' : 'password';
    });
    container.querySelector('#toggle-cp')?.addEventListener('click', () => {
      const f = container.querySelector('#f-customerPassword');
      f.type = f.type === 'password' ? 'text' : 'password';
    });

    // Save
    container.querySelector('#save-btn')?.addEventListener('click', () => {
      const apiAccount       = container.querySelector('#f-apiAccount').value.trim();
      const privateKey       = container.querySelector('#f-privateKey').value.trim();
      const customerCode     = container.querySelector('#f-customerCode').value.trim();
      const customerPassword = container.querySelector('#f-customerPassword').value.trim();
      const timezone         = container.querySelector('#f-timezone').value;

      if (!apiAccount || !privateKey || !customerCode) {
        showMsg(container, 'API Account, Private Key, and Customer Code are required.', 'error');
        return;
      }

      window.setCredentials({ apiAccount, privateKey, customerCode, customerPassword, timezone, testMode, region });
      showMsg(container, 'Credentials saved!', 'success');

      // Update status badge
      const badge = container.querySelector('#conn-status');
      if (badge) { badge.className = 'badge badge-green'; badge.textContent = 'Configured'; }

      // Enable test button
      container.querySelector('#test-btn')?.removeAttribute('disabled');
    });

    // Test connection
    container.querySelector('#test-btn')?.addEventListener('click', async () => {
      const btn = container.querySelector('#test-btn');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner spinner-sm"></div> Testing…';
      try {
        const startDate = window.dateRange(1, false);
        const endDate   = window.dateRange(0, true);
        const creds = window.getCredentials();
        const bizDigest = creds.customerCode && creds.customerPassword && creds.privateKey
          ? window.makeBizDigest(creds.customerCode, creds.customerPassword, creds.privateKey)
          : '';
        await window.jtApi('/api/order/getOrders', {
          customerCode: creds.customerCode,
          digest: bizDigest,
          command: 3,
          startDate,
          endDate,
          current: 1,
          size: 1,
        });
        showMsg(container, '✓ Connection successful! Credentials are valid.', 'success');
        window.showToast('Connection successful!', 'success');
      } catch (err) {
        showMsg(container, `✗ ${window.getErrorMessage(err)}`, 'error');
        window.showToast(window.getErrorMessage(err), 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Test Connection';
      }
    });

    // Clear
    container.querySelector('#clear-btn')?.addEventListener('click', () => {
      if (confirm('Clear all saved credentials?')) {
        window.setCredentials({});
        window.registerPage && window.navigateTo('settings');
      }
    });
  }

  function showMsg(container, msg, type) {
    const el = container.querySelector('#save-msg');
    if (!el) return;
    el.style.display = 'block';
    el.className = `badge badge-${type === 'success' ? 'green' : 'red'}`;
    el.style.padding = '8px 12px';
    el.style.borderRadius = 'var(--radius-sm)';
    el.style.fontSize = '13px';
    el.textContent = msg;
  }
})();
