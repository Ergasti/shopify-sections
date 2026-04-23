/* create-order.js — ShipBlu Explorer Create Order Page
 * Multi-step wizard: Step 1 Customer → Step 2 Package → Step 3 Review
 */
;(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────

  const STORAGE_KEY = 'shipblu_create_order_draft';

  const PACKAGE_SIZES = [
    { id: 1, name: 'Small Flyer', dims: '25×35cm',   icon: '📦' },
    { id: 2, name: 'Medium Flyer', dims: '35×45cm',  icon: '📦' },
    { id: 3, name: 'Large Box',    dims: '45×60cm',  icon: '🗃️' },
    { id: 4, name: 'XL Box',       dims: '60×80cm',  icon: '📫' },
  ];

  // ─── Module state ─────────────────────────────────────────────────────────

  /** @type {{ step: number, fields: Object, zones: Array, loadingZones: boolean }} */
  let _state = {
    step: 1,
    fields: {},
    zones: [],
    loadingZones: false,
  };

  // ─── Page registration ────────────────────────────────────────────────────

  window.registerPage('create-order', {
    title: 'Create Order',

    render(container) {
      _injectStyles();

      if (!window.getApiKey || !window.getApiKey()) {
        container.innerHTML = _noKeyHtml();
        return;
      }

      // Restore saved draft from sessionStorage
      _restoreDraft();

      // Reset step to 1 on fresh render (but keep field values)
      _state.step = 1;

      _renderWizard(container);
      _loadZones(container);
    }
  });

  // ─── Styles ───────────────────────────────────────────────────────────────

  function _injectStyles() {
    const id = 'co-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
/* ── Create Order scoped styles ── */
.co-page { max-width: 680px; margin: 0 auto; }

/* Step indicator */
.co-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: var(--space-8, 32px);
}
.co-step {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  cursor: default;
}
.co-step.done { cursor: pointer; }
.co-step-num {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border, #333);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  color: var(--color-text-muted, #888);
  background: var(--color-surface, #1a1a1a);
  flex-shrink: 0;
  transition: background .2s, border-color .2s, color .2s;
}
.co-step.active .co-step-num {
  background: var(--color-accent, #58a6ff);
  border-color: var(--color-accent, #58a6ff);
  color: #fff;
}
.co-step.done .co-step-num {
  background: var(--color-accent-dim, rgba(88,166,255,.15));
  border-color: var(--color-accent, #58a6ff);
  color: var(--color-accent, #58a6ff);
}
.co-step-label {
  font-size: 13px; font-weight: 500;
  color: var(--color-text-muted, #888);
  white-space: nowrap;
}
.co-step.active .co-step-label { color: var(--color-text, #e6edf3); font-weight: 600; }
.co-step.done .co-step-label  { color: var(--color-accent, #58a6ff); }
.co-step-connector {
  flex: 1; height: 2px;
  background: var(--color-border, #333);
  margin: 0 8px;
  flex-shrink: 1;
  min-width: 16px;
}

/* Form card */
.co-card {
  background: var(--color-surface, #161b22);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: var(--space-8, 32px);
}

/* Package size cards */
.co-pkg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 6px;
}
@media (max-width: 480px) { .co-pkg-grid { grid-template-columns: 1fr; } }
.co-pkg-card {
  border: 2px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: 16px;
  cursor: pointer;
  display: flex; align-items: center; gap: 12px;
  transition: border-color .15s, background .15s;
  background: var(--color-elevated, #0d1117);
  user-select: none;
}
.co-pkg-card:hover { border-color: var(--color-accent, #58a6ff); }
.co-pkg-card.selected {
  border-color: var(--color-accent, #58a6ff);
  background: var(--color-accent-dim, rgba(88,166,255,.08));
}
.co-pkg-card input[type="radio"] { display: none; }
.co-pkg-icon { font-size: 24px; flex-shrink: 0; }
.co-pkg-name { font-weight: 600; font-size: 14px; }
.co-pkg-dims { font-size: 11px; color: var(--color-text-muted, #8b949e); margin-top: 2px; }

/* Form actions */
.co-actions {
  display: flex; align-items: center; gap: 12px;
  margin-top: var(--space-8, 32px);
  justify-content: flex-end;
}

/* Review summary */
.co-review-section { margin-bottom: var(--space-6, 24px); }
.co-review-section h4 {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .6px; color: var(--color-text-muted, #8b949e);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border, #30363d);
}
.co-review-row {
  display: flex; gap: 12px;
  padding: 6px 0;
  font-size: 14px;
}
.co-review-label {
  color: var(--color-text-muted, #8b949e);
  min-width: 150px;
  flex-shrink: 0;
}
.co-review-value { color: var(--color-text, #e6edf3); font-weight: 500; }
@media (max-width: 480px) { .co-review-row { flex-direction: column; gap: 2px; } .co-review-label { min-width: 0; } }

/* Success screen */
.co-success {
  text-align: center;
  padding: var(--space-12, 48px) var(--space-8, 32px);
}
.co-success-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: rgba(63,185,80,.12);
  border: 2px solid rgba(63,185,80,.4);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto var(--space-6, 24px);
  color: #3fb950; font-size: 32px;
}
.co-success h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.co-success p { font-size: 14px; color: var(--color-text-muted, #8b949e); margin-bottom: var(--space-6, 24px); }
.co-tracking-block {
  background: var(--color-elevated, #0d1117);
  border: 1px solid var(--color-border, #30363d);
  border-radius: var(--radius, 8px);
  padding: 20px;
  margin: 0 auto var(--space-8, 32px);
  max-width: 360px;
}
.co-tracking-label { font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: var(--color-text-muted, #8b949e); margin-bottom: 8px; }
.co-tracking-num {
  font-family: var(--font-mono, monospace);
  font-size: 22px; font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-accent, #58a6ff);
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.co-copy-btn {
  background: none; border: none; cursor: pointer; padding: 4px;
  color: var(--color-text-muted, #8b949e);
  display: inline-flex; align-items: center;
  transition: color .15s;
}
.co-copy-btn:hover { color: var(--color-accent, #58a6ff); }
.co-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* Inline field error */
.co-field-error {
  color: var(--color-red, #f85149);
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Spinner */
.co-spinner {
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: co-spin .6s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes co-spin { to { transform: rotate(360deg); } }

.form-group { margin-bottom: var(--space-5, 20px); }
.form-group:last-of-type { margin-bottom: 0; }
    `;
    document.head.appendChild(style);
  }

  // ─── No-key state ─────────────────────────────────────────────────────────

  function _noKeyHtml() {
    return `
      <div class="page-header">
        <h2>Create Order</h2>
        <p class="page-subtitle">Ship a new package to a customer</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🔑</div>
        <h3>API Key Required</h3>
        <p>Connect your ShipBlu account to create orders.</p>
        <a href="#settings" class="btn btn-primary" style="margin-top:16px">Set up your API key in Settings →</a>
      </div>`;
  }

  // ─── Render wizard ─────────────────────────────────────────────────────────

  function _renderWizard(container) {
    const step = _state.step;
    container.innerHTML = `
      <div class="co-page" role="main">
        <div class="page-header">
          <h2>Create Order</h2>
          <p class="page-subtitle">Ship a new package to a customer</p>
        </div>
        ${_stepIndicatorHtml(step)}
        <div id="co-step-content"></div>
      </div>`;
    _renderStep(container, step);
  }

  // ─── Step indicator ────────────────────────────────────────────────────────

  function _stepIndicatorHtml(currentStep) {
    const steps = [
      { num: 1, label: 'Customer' },
      { num: 2, label: 'Package'  },
      { num: 3, label: 'Review'   },
    ];

    let html = '<nav class="co-steps" aria-label="Order creation steps">';
    steps.forEach((s, i) => {
      const isDone   = currentStep > s.num;
      const isActive = currentStep === s.num;
      const cls = isDone ? 'done' : isActive ? 'active' : '';
      const numContent = isDone
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`
        : s.num;
      const ariaCurrent = isActive ? ' aria-current="step"' : '';
      const onClick = isDone
        ? `onclick="(function(){window._coGoToStep&&window._coGoToStep(${s.num})})()"  tabindex="0" role="button" onkeydown="if(event.key==='Enter')this.click()"`
        : '';

      html += `
        <div class="co-step ${cls}" aria-label="Step ${s.num}: ${s.label}${isDone ? ' (completed)' : isActive ? ' (current)' : ''}"${ariaCurrent} ${onClick}>
          <div class="co-step-num">${numContent}</div>
          <div class="co-step-label">${s.label}</div>
        </div>`;
      if (i < steps.length - 1) {
        html += `<div class="co-step-connector" aria-hidden="true"></div>`;
      }
    });
    html += '</nav>';
    return html;
  }

  // ─── Render individual step ────────────────────────────────────────────────

  function _renderStep(container, step) {
    const content = container.querySelector('#co-step-content');
    if (!content) return;

    if (step === 1) _renderStep1(container, content);
    else if (step === 2) _renderStep2(content);
    else if (step === 3) _renderStep3(content);

    // Re-attach global step nav helper
    window._coGoToStep = (n) => {
      if (n < _state.step) {
        _state.step = n;
        _updateStepIndicator(container);
        _renderStep(container, n);
      }
    };
  }

  // ─── Update step indicator only (no full re-render) ────────────────────────

  function _updateStepIndicator(container) {
    const navEl = container.querySelector('.co-steps');
    if (navEl) navEl.outerHTML = _stepIndicatorHtml(_state.step);
    // Re-query after outerHTML swap
    const newNav = container.querySelector('.co-steps');
    if (newNav) newNav.outerHTML = _stepIndicatorHtml(_state.step);
    // Actually rebuild from scratch is cleaner:
    const page = container.querySelector('.co-page');
    if (page) {
      const existingNav = page.querySelector('.co-steps');
      if (existingNav) {
        existingNav.outerHTML = _stepIndicatorHtml(_state.step);
      }
    }
  }

  // ─── Step 1: Customer Info ─────────────────────────────────────────────────

  function _renderStep1(container, content) {
    const f = _state.fields;
    const zonesOptions = _state.zones.length
      ? _state.zones.map(z => `<option value="${_esc(String(z.id))}" ${f.zone == z.id ? 'selected' : ''}>${_esc(z.name || z.name_en || String(z.id))}</option>`).join('')
      : (f.zone ? `<option value="${_esc(String(f.zone))}" selected>Zone ${_esc(String(f.zone))}</option>` : '');

    content.innerHTML = `
      <form id="co-step1-form" novalidate>
        <div class="co-card">
          <fieldset style="border:none;padding:0;margin:0">
            <legend style="font-size:15px;font-weight:600;margin-bottom:var(--space-6,24px);color:var(--color-text,#e6edf3)">Customer Information</legend>

            <div class="form-group">
              <label class="form-label" for="co-full-name">Full Name <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></label>
              <input class="form-input" type="text" id="co-full-name" name="full_name"
                placeholder="Ahmed Ali" autocomplete="name"
                value="${_esc(f.full_name || '')}" required aria-required="true">
              <span class="co-field-error" id="err-full_name" role="alert" aria-live="polite"></span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group">
                <label class="form-label" for="co-phone">Phone <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></label>
                <input class="form-input" type="tel" id="co-phone" name="phone"
                  placeholder="201012345678" autocomplete="tel"
                  value="${_esc(f.phone || '')}" required aria-required="true"
                  aria-describedby="hint-phone">
                <span class="form-hint" id="hint-phone" style="font-size:11px;color:var(--color-text-muted,#8b949e);margin-top:3px;display:block">e.g. 201012345678 (digits only)</span>
                <span class="co-field-error" id="err-phone" role="alert" aria-live="polite"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="co-phone2">Secondary Phone <span class="text-muted" style="font-weight:400">(optional)</span></label>
                <input class="form-input" type="tel" id="co-phone2" name="secondary_phone"
                  placeholder="Optional" autocomplete="tel"
                  value="${_esc(f.secondary_phone || '')}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-email">Email <span class="text-muted" style="font-weight:400">(optional)</span></label>
              <input class="form-input" type="email" id="co-email" name="email"
                placeholder="ahmed@example.com" autocomplete="email"
                value="${_esc(f.email || '')}">
            </div>

            <div class="form-group">
              <label class="form-label" for="co-addr1">Address Line 1 <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></label>
              <input class="form-input" type="text" id="co-addr1" name="address_line1"
                placeholder="Street 10, Building 5" autocomplete="address-line1"
                value="${_esc(f.address_line1 || '')}" required aria-required="true">
              <span class="co-field-error" id="err-address_line1" role="alert" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-addr2">Address Line 2 <span class="text-muted" style="font-weight:400">(optional)</span></label>
              <input class="form-input" type="text" id="co-addr2" name="address_line2"
                placeholder="Apartment 12, Floor 3" autocomplete="address-line2"
                value="${_esc(f.address_line2 || '')}">
            </div>

            <div class="form-group">
              <label class="form-label" for="co-zone">Zone <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></label>
              <select class="form-select" id="co-zone" name="zone" required aria-required="true"
                ${_state.loadingZones ? 'disabled aria-disabled="true"' : ''}>
                <option value="">${_state.loadingZones ? 'Loading zones…' : 'Select a zone'}</option>
                ${zonesOptions}
              </select>
              <span class="co-field-error" id="err-zone" role="alert" aria-live="polite"></span>
            </div>
          </fieldset>
        </div>

        <div class="co-actions">
          <button type="submit" class="btn btn-primary" id="co-step1-next">
            Next: Package Details →
          </button>
        </div>
      </form>`;

    // Auto-save on input + strip non-digits from phone on input
    content.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        if (el.name === 'phone' || el.name === 'secondary_phone') {
          // Strip non-digit chars while typing
          const digits = el.value.replace(/\D/g, '');
          if (el.value !== digits) el.value = digits;
        }
        _state.fields[el.name] = el.type === 'checkbox' ? el.checked : el.value;
        _saveDraft();
        // Clear error on input if field was invalid
        const errEl = content.querySelector(`#err-${el.name}`);
        if (errEl && errEl.textContent) {
          errEl.textContent = '';
          el.style.borderColor = '';
          el.removeAttribute('aria-invalid');
        }
      });
    });

    // Blur validation — show red border + helper text on field blur
    const _blurChecks = {
      full_name:    { test: v => v && v.trim().length > 0, msg: 'Full name is required.' },
      phone:        { test: v => v && v.replace(/\D/g, '').length >= 11, msg: 'Phone must be at least 11 digits.' },
      address_line1:{ test: v => v && v.trim().length > 0, msg: 'Address is required.' },
      zone:         { test: v => v && v !== '', msg: 'Please select a zone.' },
    };
    content.querySelectorAll('input[name], select[name]').forEach(el => {
      const check = _blurChecks[el.name];
      if (!check) return;
      el.addEventListener('blur', () => {
        const val = _state.fields[el.name] || el.value;
        const errEl = content.querySelector(`#err-${el.name}`);
        if (!check.test(val)) {
          if (errEl) errEl.textContent = check.msg;
          el.style.borderColor = 'var(--color-red, #f85149)';
          el.setAttribute('aria-invalid', 'true');
        } else {
          if (errEl) errEl.textContent = '';
          el.style.borderColor = '';
          el.removeAttribute('aria-invalid');
        }
      });
    });

    // Form submit → validate → advance
    content.querySelector('#co-step1-form').addEventListener('submit', (e) => {
      e.preventDefault();
      _syncStep1Fields(content);
      if (_validateStep1(content)) {
        _state.step = 2;
        _updateStepIndicator(container);
        _renderStep(container, 2);
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function _syncStep1Fields(content) {
    content.querySelectorAll('input, select').forEach(el => {
      if (el.name) _state.fields[el.name] = el.value;
    });
    _saveDraft();
  }

  function _validateStep1(content) {
    let ok = true;
    const fields = _state.fields;

    const checks = [
      {
        name: 'full_name',
        test: v => v && v.trim().length > 0,
        msg: 'Full name is required.',
      },
      {
        name: 'phone',
        test: v => v && v.replace(/\D/g, '').length >= 11,
        msg: 'Phone must be at least 11 digits.',
      },
      {
        name: 'address_line1',
        test: v => v && v.trim().length > 0,
        msg: 'Address is required.',
      },
      {
        name: 'zone',
        test: v => v && v !== '',
        msg: 'Please select a zone.',
      },
    ];

    checks.forEach(({ name, test, msg }) => {
      const errEl = content.querySelector(`#err-${name}`);
      if (!errEl) return;
      if (!test(fields[name])) {
        errEl.textContent = msg;
        const input = content.querySelector(`[name="${name}"]`);
        if (input) input.setAttribute('aria-invalid', 'true');
        ok = false;
      } else {
        errEl.textContent = '';
        const input = content.querySelector(`[name="${name}"]`);
        if (input) input.removeAttribute('aria-invalid');
      }
    });

    return ok;
  }

  // ─── Step 2: Package ───────────────────────────────────────────────────────

  function _renderStep2(content) {
    const f = _state.fields;
    const selectedPkg = parseInt(f.package_size, 10) || 1;

    const pkgCardsHtml = PACKAGE_SIZES.map(pkg => `
      <label class="co-pkg-card ${selectedPkg === pkg.id ? 'selected' : ''}" for="pkg-${pkg.id}"
        aria-label="${pkg.name}, ${pkg.dims}">
        <input type="radio" id="pkg-${pkg.id}" name="package_size"
          value="${pkg.id}" ${selectedPkg === pkg.id ? 'checked' : ''}>
        <div class="co-pkg-icon" aria-hidden="true">${pkg.icon}</div>
        <div>
          <div class="co-pkg-name">${pkg.name}</div>
          <div class="co-pkg-dims">${pkg.dims}</div>
          <span class="badge badge-neutral" style="margin-top:6px;font-size:10px">ID ${pkg.id}</span>
        </div>
      </label>`).join('');

    content.innerHTML = `
      <form id="co-step2-form" novalidate>
        <div class="co-card">
          <fieldset style="border:none;padding:0;margin:0">
            <legend style="font-size:15px;font-weight:600;margin-bottom:var(--space-6,24px);color:var(--color-text,#e6edf3)">Package Details</legend>

            <div class="form-group">
              <span class="form-label" id="pkg-size-legend">Package Size <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></span>
              <div class="co-pkg-grid" role="radiogroup" aria-labelledby="pkg-size-legend">
                ${pkgCardsHtml}
              </div>
              <span class="co-field-error" id="err-package_size" role="alert" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-cod">COD Amount (EGP) <span aria-hidden="true" style="color:var(--color-red,#f85149)">*</span></label>
              <input class="form-input" type="number" id="co-cod" name="cash_amount"
                placeholder="100" min="0" step="0.01"
                value="${_esc(f.cash_amount !== undefined ? String(f.cash_amount) : '')}"
                required aria-required="true" aria-describedby="co-cod-hint">
              <span class="form-hint" id="co-cod-hint">Cash on delivery amount in EGP. Enter 0 for prepaid.</span>
              <span class="co-field-error" id="err-cash_amount" role="alert" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:var(--color-text,#e6edf3)">
                <input type="checkbox" id="co-fragile" name="fragile"
                  ${f.fragile ? 'checked' : ''}
                  style="width:16px;height:16px;accent-color:var(--color-accent,#58a6ff);cursor:pointer">
                Handle with care (fragile package)
              </label>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-notes">Order Notes <span class="text-muted" style="font-weight:400">(optional)</span></label>
              <textarea class="form-input" id="co-notes" name="order_notes" rows="3"
                placeholder="Special instructions…"
                aria-describedby=""
                style="resize:vertical">${_esc(f.order_notes || '')}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-ref">Merchant Order Reference <span class="text-muted" style="font-weight:400">(optional)</span></label>
              <input class="form-input" type="text" id="co-ref" name="merchant_order_reference"
                placeholder="Your internal order ID"
                value="${_esc(f.merchant_order_reference || '')}">
              <span class="form-hint">Your own internal order ID for reference.</span>
            </div>
          </fieldset>
        </div>

        <div class="co-actions">
          <button type="button" class="btn btn-ghost" id="co-step2-back">← Back</button>
          <button type="submit" class="btn btn-primary" id="co-step2-next">Review Order →</button>
        </div>
      </form>`;

    // Package card visual selection
    content.querySelectorAll('.co-pkg-card').forEach(card => {
      card.addEventListener('click', () => {
        content.querySelectorAll('.co-pkg-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
      // Keyboard
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
    });

    // Auto-save
    content.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        if (!el.name) return;
        _state.fields[el.name] = el.type === 'checkbox' ? el.checked : el.value;
        _saveDraft();
      });
    });

    // Back
    content.querySelector('#co-step2-back').addEventListener('click', () => {
      _state.step = 1;
      const container = content.closest('[role="main"]')?.parentElement;
      if (container) {
        _updateStepIndicator(container);
        _renderStep(container, 1);
      }
    });

    // Submit
    content.querySelector('#co-step2-form').addEventListener('submit', (e) => {
      e.preventDefault();
      _syncStep2Fields(content);
      if (_validateStep2(content)) {
        const container = content.closest('[role="main"]')?.parentElement;
        _state.step = 3;
        if (container) {
          _updateStepIndicator(container);
          _renderStep(container, 3);
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  function _syncStep2Fields(content) {
    content.querySelectorAll('input, textarea').forEach(el => {
      if (!el.name) return;
      _state.fields[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    });
    _saveDraft();
  }

  function _validateStep2(content) {
    let ok = true;

    // Package size
    const pkgErr = content.querySelector('#err-package_size');
    const pkgVal = _state.fields.package_size;
    if (!pkgVal) {
      if (pkgErr) pkgErr.textContent = 'Please select a package size.';
      ok = false;
    } else {
      if (pkgErr) pkgErr.textContent = '';
    }

    // COD amount
    const codErr = content.querySelector('#err-cash_amount');
    const codVal = _state.fields.cash_amount;
    if (codVal === '' || codVal === undefined || codVal === null) {
      if (codErr) codErr.textContent = 'COD amount is required (enter 0 for prepaid).';
      const input = content.querySelector('[name="cash_amount"]');
      if (input) input.setAttribute('aria-invalid', 'true');
      ok = false;
    } else if (parseFloat(codVal) < 0) {
      if (codErr) codErr.textContent = 'COD amount cannot be negative.';
      ok = false;
    } else {
      if (codErr) codErr.textContent = '';
      const input = content.querySelector('[name="cash_amount"]');
      if (input) input.removeAttribute('aria-invalid');
    }

    return ok;
  }

  // ─── Step 3: Review ────────────────────────────────────────────────────────

  function _renderStep3(content) {
    const f = _state.fields;

    const pkgId  = parseInt(f.package_size, 10) || 1;
    const pkgObj = PACKAGE_SIZES.find(p => p.id === pkgId) || PACKAGE_SIZES[0];
    const zone   = _state.zones.find(z => String(z.id) === String(f.zone));
    const zoneName = zone ? (zone.name || zone.name_en || `Zone ${f.zone}`) : (f.zone || '—');
    const codFmt = window.formatCurrency ? window.formatCurrency(parseFloat(f.cash_amount) || 0) : `${parseFloat(f.cash_amount || 0).toFixed(2)} EGP`;

    const _pencilIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    content.innerHTML = `
      <div class="co-card" id="co-review-card">
        <h3 style="font-size:15px;font-weight:600;margin-bottom:var(--space-6,24px)">Review Your Order</h3>

        <div class="co-review-section">
          <h4>Customer <button type="button" class="co-edit-section-btn" data-goto="1" title="Edit customer info" style="background:none;border:none;cursor:pointer;color:var(--color-text-muted,#8b949e);padding:2px 4px;border-radius:3px;vertical-align:middle;transition:color .15s;" onmouseover="this.style.color='var(--color-accent,#58a6ff)'" onmouseout="this.style.color='var(--color-text-muted,#8b949e)'">${_pencilIcon}</button></h4>
          ${_reviewRow('Full Name', f.full_name)}
          ${_reviewRow('Phone', f.phone)}
          ${f.secondary_phone ? _reviewRow('Secondary Phone', f.secondary_phone) : ''}
          ${f.email ? _reviewRow('Email', f.email) : ''}
          ${_reviewRow('Address', [f.address_line1, f.address_line2].filter(Boolean).join(', '))}
          ${_reviewRow('Zone', zoneName)}
        </div>

        <div class="co-review-section">
          <h4>Package <button type="button" class="co-edit-section-btn" data-goto="2" title="Edit package details" style="background:none;border:none;cursor:pointer;color:var(--color-text-muted,#8b949e);padding:2px 4px;border-radius:3px;vertical-align:middle;transition:color .15s;" onmouseover="this.style.color='var(--color-accent,#58a6ff)'" onmouseout="this.style.color='var(--color-text-muted,#8b949e)'">${_pencilIcon}</button></h4>
          ${_reviewRow('Package Size', `${pkgObj.name} (${pkgObj.dims})`)}
          ${_reviewRow('COD Amount', codFmt)}
          ${_reviewRow('Fragile', f.fragile ? 'Yes — Handle with care' : 'No')}
          ${f.order_notes ? _reviewRow('Notes', f.order_notes) : ''}
          ${f.merchant_order_reference ? _reviewRow('Reference', f.merchant_order_reference) : ''}
        </div>

        <div id="co-submit-error" role="alert" aria-live="polite" style="display:none;margin-bottom:16px;padding:12px;background:rgba(248,81,73,.08);border:1px solid rgba(248,81,73,.3);border-radius:var(--radius-sm,4px);font-size:13px;color:var(--color-red,#f85149)"></div>
      </div>

      <div class="co-actions">
        <button class="btn btn-ghost" id="co-review-back">← Back to Edit</button>
        <button class="btn btn-primary" id="co-submit-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          Submit Order
        </button>
      </div>`;

    // Back
    content.querySelector('#co-review-back').addEventListener('click', () => {
      const container = content.closest('[role="main"]')?.parentElement;
      _state.step = 2;
      if (container) {
        _updateStepIndicator(container);
        _renderStep(container, 2);
      }
    });

    // Submit
    content.querySelector('#co-submit-btn').addEventListener('click', () => {
      _submitOrder(content);
    });

    // Edit section pencil buttons — jump back to that step
    content.querySelectorAll('.co-edit-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.dataset.goto, 10);
        if (!targetStep) return;
        const container = content.closest('[role="main"]')?.parentElement;
        _state.step = targetStep;
        if (container) {
          _updateStepIndicator(container);
          _renderStep(container, targetStep);
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function _reviewRow(label, value) {
    return `
      <div class="co-review-row">
        <span class="co-review-label">${_esc(label)}</span>
        <span class="co-review-value">${_esc(String(value || '—'))}</span>
      </div>`;
  }

  // ─── Submit order ──────────────────────────────────────────────────────────

  async function _submitOrder(content) {
    const f = _state.fields;
    const submitBtn = content.querySelector('#co-submit-btn');
    const backBtn   = content.querySelector('#co-review-back');
    const errBox    = content.querySelector('#co-submit-error');

    // Disable buttons / show spinner
    submitBtn.disabled = true;
    backBtn.disabled   = true;
    submitBtn.innerHTML = `<span class="co-spinner" aria-hidden="true"></span>Creating order…`;

    const body = {
      customer: {
        full_name: f.full_name || '',
        phone: f.phone || '',
        ...(f.email       ? { email: f.email }                  : {}),
        ...(f.secondary_phone ? { phone_secondary: f.secondary_phone } : {}),
        address: {
          line_1: f.address_line1 || '',
          ...(f.address_line2 ? { line_2: f.address_line2 } : {}),
          zone: parseInt(f.zone, 10),
        },
      },
      packages: [{ package_size: parseInt(f.package_size, 10) || 1 }],
      cash_amount: parseFloat(f.cash_amount) || 0,
      ...(f.order_notes                ? { order_notes: f.order_notes }                         : {}),
      ...(f.merchant_order_reference   ? { merchant_order_reference: f.merchant_order_reference } : {}),
    };

    try {
      const result = await window.shipbluApi('POST', '/v1/delivery-orders/', body);
      _clearDraft();
      _showSuccess(content.closest('.co-page') || content.parentElement, result);
    } catch (err) {
      submitBtn.disabled = false;
      backBtn.disabled   = false;
      submitBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        Submit Order`;

      // Map validation errors back to fields if possible
      if (err && err.name === 'ValidationError' && err.fieldErrors) {
        const mapped = _mapApiErrors(err.fieldErrors);
        if (mapped.length) {
          errBox.textContent = mapped.join(' ');
          errBox.style.display = '';
          return;
        }
      }

      const msg = (err && err.message) ? err.message : 'Failed to create order. Please try again.';
      errBox.textContent = msg;
      errBox.style.display = '';

      if (window.showToast) window.showToast(msg, 'error');
    }
  }

  function _mapApiErrors(fieldErrors) {
    if (!fieldErrors || typeof fieldErrors !== 'object') return [];
    return Object.entries(fieldErrors).map(([k, v]) => {
      const msgs = Array.isArray(v) ? v.join(', ') : String(v);
      return `${k}: ${msgs}`;
    });
  }

  // ─── Success screen ────────────────────────────────────────────────────────

  function _showSuccess(wrapper, result) {
    const orderId      = result && (result.id || result.order_id);
    const trackingNum  = result && (result.tracking_number || result.tracking || '—');

    if (window.showToast) window.showToast('Order created successfully!', 'success');

    wrapper.innerHTML = `
      <div class="co-page">
        <div class="co-success co-card" role="status" aria-live="polite">
          <div class="co-success-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3>Order Created Successfully!</h3>
          <p>Your shipment has been queued for pickup.</p>

          ${orderId ? `
            <div style="background:var(--color-elevated,#0d1117);border:1px solid var(--color-border,#30363d);border-radius:var(--radius,8px);display:inline-block;padding:8px 20px;margin-bottom:20px;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-muted,#8b949e);">Order ID</span>
              <div style="font-family:var(--font-mono,monospace);font-size:20px;font-weight:700;color:var(--color-text,#e6edf3);margin-top:2px;">#${_esc(String(orderId))}</div>
            </div>` : ''}

          <div class="co-tracking-block" aria-label="Tracking number">
            <div class="co-tracking-label">Tracking Number</div>
            <div class="co-tracking-num" id="co-tracking-display">
              <span>${_esc(String(trackingNum))}</span>
              <button class="co-copy-btn" title="Copy tracking number" aria-label="Copy tracking number to clipboard"
                onclick="(function(){
                  window.copyToClipboard && window.copyToClipboard('${_esc(String(trackingNum))}');
                  window.showToast && window.showToast('Tracking number copied!', 'success');
                })()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            </div>
          </div>

          <div class="co-success-actions">
            ${orderId ? `<a href="#orders-detail?id=${_esc(String(orderId))}" class="btn btn-ghost">View Order →</a>` : ''}
            <button class="btn btn-primary" id="co-create-another">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              Create Another
            </button>
          </div>
        </div>
      </div>`;

    wrapper.querySelector('#co-create-another').addEventListener('click', () => {
      _state.fields = {};
      _state.step   = 1;
      _clearDraft();
      // Re-render the full page
      const container = wrapper.parentElement;
      if (container) {
        _renderWizard(container);
        _loadZones(container);
      }
    });
  }

  // ─── Load zones (governorates as zone proxy) ────────────────────────────────

  async function _loadZones(container) {
    _state.loadingZones = true;
    try {
      const data = await window.shipbluApi('GET', '/v1/governorates/');
      const list = Array.isArray(data) ? data : (data.results || []);
      _state.zones = list;
      _state.loadingZones = false;
      // Refresh zone select if still on step 1
      if (_state.step === 1) {
        const zoneSelect = container.querySelector('#co-zone');
        if (zoneSelect) {
          const f = _state.fields;
          zoneSelect.disabled = false;
          zoneSelect.removeAttribute('aria-disabled');
          zoneSelect.innerHTML = `<option value="">Select a zone</option>` +
            list.map(z => `<option value="${_esc(String(z.id))}" ${f.zone == z.id ? 'selected' : ''}>${_esc(z.name_en || z.name || String(z.id))}</option>`).join('');
        }
      }
    } catch (err) {
      _state.loadingZones = false;
      // Zone loading failure is non-fatal; show message in select
      const zoneSelect = container.querySelector('#co-zone');
      if (zoneSelect) {
        zoneSelect.disabled = false;
        zoneSelect.innerHTML = `<option value="">Failed to load zones</option>`;
      }
    }
  }

  // ─── Draft persistence ─────────────────────────────────────────────────────

  function _saveDraft() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_state.fields));
    } catch (_) { /* quota exceeded — silently skip */ }
  }

  function _restoreDraft() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) _state.fields = JSON.parse(raw);
    } catch (_) { _state.fields = {}; }
  }

  function _clearDraft() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  // ─── Utility ───────────────────────────────────────────────────────────────

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

})();
