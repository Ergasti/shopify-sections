# Plan: Full Performance Optimization — Theme Snippet Audit + Issue Fixes

## Summary
Fix the 5 issues discovered during post-deployment audit (auto-redirect, product page DCL regression, srcset cap not applied on live, CSS deferral gaps, missing image dimensions) AND optimize all Uncovered Theme Edit snippets for performance — deferred CSS, capped images, consolidated inline styles, lighter JS.

## User Story
As a visitor to uncoveredeg.com,
I want pages to load in under 5 seconds with no layout shifts,
So that I can browse and purchase fragrances without frustration.

## Problem → Solution
**Current:** Homepage/collection massively improved (DCL 1.6s/765ms), but product page regressed (DCL 19.7s), srcset cap not effective on live, 14 eager stylesheets on product page, auto-redirect disrupting collection browsing, and multiple snippets emit duplicate inline `<style>` blocks.

**Desired:** All 3 pages load < 5s, no Growave requests, product images capped at 720w everywhere, non-critical CSS deferred, inline styles consolidated, no auto-redirect loop.

## Metadata
- **Complexity**: Large
- **Source PRD**: N/A
- **PRD Phase**: N/A
- **Estimated Files**: 9

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `layout/theme.liquid` | 42-67 | Growave observer — needs optimization |
| P0 | `layout/theme.liquid` | 286-292 | Cart CSS deferral — pattern to replicate |
| P0 | `layout/theme.liquid` | 465-475 | Discount redirect script — needs defer |
| P0 | `sections/main-product.liquid` | 12-26 | Product page CSS — 10 eager stylesheets |
| P0 | `snippets/card-product.liquid` | 23-30 | Card CSS deferral — verify deployed |
| P0 | `snippets/card-product.liquid` | 65-100 | Card image srcset — verify deployed |
| P1 | `snippets/sympl-widget.liquid` | 94-366 | Heavy shadow-root JS — needs optimization |
| P1 | `sections/main-product.liquid` | 207, 833-836 | More eager CSS deep in file |
| P2 | `snippets/bogo-label.liquid` | all | Inline styles to consolidate |
| P2 | `snippets/price.liquid` | 44-52 | Inline styles to consolidate |
| P2 | `snippets/shipping-bar-restyle.liquid` | all | Already included in layout |

---

## Patterns to Mirror

### CSS_DEFERRAL
// SOURCE: layout/theme.liquid:284
```liquid
<link rel="stylesheet" href="{{ 'component-cart-items.css' | asset_url }}" media="print" onload="this.media='all'">
```

### SRCSET_CAP_720W
// SOURCE: snippets/card-product.liquid:65-70 (already applied locally)
```liquid
srcset="
  {%- if card_product.featured_media.width >= 165 -%}{{ card_product.featured_media | image_url: width: 165 }} 165w,{%- endif -%}
  {%- if card_product.featured_media.width >= 360 -%}{{ card_product.featured_media | image_url: width: 360 }} 360w,{%- endif -%}
  {%- if card_product.featured_media.width >= 533 -%}{{ card_product.featured_media | image_url: width: 533 }} 533w,{%- endif -%}
  {{ card_product.featured_media | image_url: width: 720 }} 720w
"
```

### EAGER_CRITICAL_CSS
// SOURCE: layout/theme.liquid:283
```liquid
{{ 'base.css' | asset_url | stylesheet_tag }}
```
Only `base.css` and `section-main-product.css` should be eager. Everything else defers.

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `layout/theme.liquid` | UPDATE | Optimize Growave observer, defer discount redirect script |
| `sections/main-product.liquid` | UPDATE | Defer 12 of 14 CSS files, add fetchpriority to LCP image |
| `snippets/card-product.liquid` | VERIFY | Confirm srcset cap + CSS deferral are deployed |
| `snippets/sympl-widget.liquid` | UPDATE | Optimize shadow-root injection, reduce retry loop |
| `snippets/bogo-label.liquid` | UPDATE | Move inline styles to CSS class |
| `snippets/price.liquid` | UPDATE | Move inline styles to CSS class |
| `snippets/cart-drawer.liquid` | UPDATE | Defer component CSS loads |
| `sections/related-products.liquid` | UPDATE | Defer component CSS |
| `snippets/sl-free-shipping-progress-bar.liquid` | UPDATE | Lazy-load confetti CDN script |

## NOT Building

- Homepage design/layout changes (CRO work is out of scope)
- Third-party script deferral via `{{ content_for_header }}` (Meta Pixel, GTM, Clarity — requires Shopify admin, not theme code)
- Judge.me image dimension fixes (controlled by Judge.me app, not theme)
- Image re-upload as WebP/AVIF (requires Shopify admin product library)
- Collection page heading hierarchy (SEO, separate task)

---

## Step-by-Step Tasks

### Task 1: Optimize Growave MutationObserver
- **ACTION**: Replace the expensive `document.documentElement` observer with a targeted `document.head` observer that disconnects after finding+removing Growave elements, not after a fixed 10s timeout
- **FILE**: `layout/theme.liquid` lines 44-67
- **IMPLEMENT**:
```javascript
(function(){
  var removed = 0;
  var obs = new MutationObserver(function(muts) {
    for (var i = 0; i < muts.length; i++) {
      for (var j = 0; j < muts[i].addedNodes.length; j++) {
        var n = muts[i].addedNodes[j];
        if (n.nodeType !== 1) continue;
        var s = n.src || n.href || '';
        if (s.indexOf('grwx.me') !== -1 || s.indexOf('growave') !== -1) {
          n.remove(); removed++;
        }
      }
    }
  });
  obs.observe(document.head, { childList: true });
  // Disconnect after head is done parsing (DOMContentLoaded)
  document.addEventListener('DOMContentLoaded', function(){ obs.disconnect(); });
})();
```
- **MIRROR**: Keep the CSS hide rules as-is
- **GOTCHA**: `document.head` is enough — Shopify injects app scripts/styles into `<head>` via `{{ content_for_header }}`
- **VALIDATE**: Load homepage, check DevTools Network for 0 `grwx.me` requests. Observer should disconnect at DCL, not after 10s.

### Task 2: Defer discount redirect script
- **ACTION**: Wrap the discount redirect in `DOMContentLoaded` or move to a deferred external script
- **FILE**: `layout/theme.liquid` lines 465-475
- **IMPLEMENT**: Change `<script>` to `<script defer>` — but since this is inline, defer won't work. Instead wrap in DOMContentLoaded:
```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  var url = new URL(window.location.href);
  var discount = url.searchParams.get('discount');
  if (discount) {
    url.searchParams.delete('discount');
    window.location.href = "/discount/" + encodeURIComponent(discount) + "?redirect=" + encodeURIComponent("/?" + url.searchParams.toString());
  }
});
</script>
```
- **GOTCHA**: Also add `encodeURIComponent(discount)` to prevent URL injection. The original code directly concatenates the discount param into a URL.
- **VALIDATE**: Visit `/?discount=TEST10` — should redirect to `/discount/TEST10?redirect=...`

### Task 3: Defer product page CSS (biggest product-page win)
- **ACTION**: Convert 12 of 14 `stylesheet_tag` calls to deferred `media="print"` pattern. Keep `section-main-product.css` and `component-price.css` eager (above-fold critical).
- **FILE**: `sections/main-product.liquid`
- **IMPLEMENT**: Replace lines 13-26 and lines 207, 833-836:
```liquid
  {{ 'section-main-product.css' | asset_url | stylesheet_tag }}
  <link rel="stylesheet" href="{{ 'component-accordion.css' | asset_url }}" media="print" onload="this.media='all'">
  {{ 'component-price.css' | asset_url | stylesheet_tag }}
  <link rel="stylesheet" href="{{ 'component-slider.css' | asset_url }}" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="{{ 'component-rating.css' | asset_url }}" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="{{ 'component-deferred-media.css' | asset_url }}" media="print" onload="this.media='all'">

  {% unless product.has_only_default_variant %}
    <link rel="stylesheet" href="{{ 'component-product-variant-picker.css' | asset_url }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ 'component-swatch-input.css' | asset_url }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ 'component-swatch.css' | asset_url }}" media="print" onload="this.media='all'">
  {% endunless %}
  {%- if product.quantity_price_breaks_configured? -%}
    <link rel="stylesheet" href="{{ 'component-volume-pricing.css' | asset_url }}" media="print" onload="this.media='all'">
  {%- endif -%}
```
And at line 207:
```liquid
    <link rel="stylesheet" href="{{ 'component-product-model.css' | asset_url }}" media="print" onload="this.media='all'">
```
And at lines 833-836:
```liquid
    <link rel="stylesheet" href="{{ 'component-card.css' | asset_url }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ 'component-complementary-products.css' | asset_url }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ 'quick-add.css' | asset_url }}" media="print" onload="this.media='all'">
```
- **MIRROR**: CSS_DEFERRAL pattern from theme.liquid:284
- **GOTCHA**: `section-main-product.css` MUST stay eager — it styles the product gallery which is LCP. `component-price.css` also stays eager (visible above fold).
- **VALIDATE**: Product page should paint gallery + price within FCP. Accordion/swatch/model styles load after.

### Task 4: Optimize Sympl widget shadow-root injection
- **ACTION**: Replace the `setInterval` retry loop (up to 60 attempts) with a single MutationObserver + requestIdleCallback
- **FILE**: `snippets/sympl-widget.liquid` lines 316-366
- **IMPLEMENT**: Replace `attachToHost` function:
```javascript
function attachToHost(host, key, css, dataAttr) {
  if (injectShadowStyles(host, key, css, dataAttr)) return;
  // Wait for shadowRoot to appear
  var obs = new MutationObserver(function() {
    if (injectShadowStyles(host, key, css, dataAttr)) obs.disconnect();
  });
  obs.observe(host, { childList: true, subtree: true });
  // Safety: disconnect after 6s max
  setTimeout(function(){ obs.disconnect(); }, 6000);
}
```
- **GOTCHA**: The shadowRoot may already exist when the observer starts — the `injectShadowStyles` call at the top handles that case.
- **VALIDATE**: Sympl widget on product page should still show styled installment card. Check that shadow-root has `data-sympl-native` attribute.

### Task 5: Defer cart-drawer component CSS
- **ACTION**: Convert the 2 eager stylesheets in cart-drawer.liquid to deferred
- **FILE**: `snippets/cart-drawer.liquid` lines 8-9
- **IMPLEMENT**:
```liquid
<link rel="stylesheet" href="{{ 'quantity-popover.css' | asset_url }}" media="print" onload="this.media='all'">
<link rel="stylesheet" href="{{ 'component-card.css' | asset_url }}" media="print" onload="this.media='all'">
```
- **MIRROR**: CSS_DEFERRAL pattern
- **VALIDATE**: Cart drawer should still render properly when opened.

### Task 6: Consolidate inline styles from bogo-label and price snippets
- **ACTION**: Move the inline `<style>` blocks from bogo-label.liquid and price.liquid into the shipping-bar-restyle.liquid snippet (which is already a global style override included in theme.liquid)
- **FILE**: `snippets/shipping-bar-restyle.liquid` — append the consolidated styles
- **FILE**: `snippets/bogo-label.liquid` — remove `<style>` block
- **FILE**: `snippets/price.liquid` — remove `<style>` block
- **IMPLEMENT**: Add to shipping-bar-restyle.liquid before `</style>`:
```css
  /* ── BOGO label price overrides ── */
  .card-wrapper .price-item--regular {
    font-size: 0.85em;
  }
  .card-wrapper .price-item--sale {
    font-size: 1em;
  }
  /* ── Sale price styling ── */
  .price--on-sale .price-item--regular {
    font-size: 12px;
    color: black;
  }
```
- **GOTCHA**: These styles are rendered once per product card. Moving them to a single global style tag eliminates N duplicates on collection pages (12+ products = 12+ duplicate `<style>` blocks).
- **VALIDATE**: Collection page should show same BOGO/sale price styling as before.

### Task 7: Lazy-load confetti CDN script in shipping progress bar
- **ACTION**: Only load the confetti script when the free shipping threshold is actually reached, not on every page load
- **FILE**: `snippets/sl-free-shipping-progress-bar.liquid`
- **IMPLEMENT**: In the `playConfetti` function, change the script loading to only fetch when called:
```javascript
function playConfetti() {
  if (typeof confetti === 'function') {
    confetti({ /* ... */ });
  } else {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.1.0/dist/confetti.min.js';
    s.onload = function() { confetti({ /* ... */ }); };
    document.head.appendChild(s);
  }
}
```
- **GOTCHA**: The confetti script is small (~4KB) but it's from a CDN — adds a DNS lookup + connection. Only load when needed.
- **VALIDATE**: Add items to cart above threshold — confetti should still play.

### Task 8: Push all changes and verify
- **ACTION**: Push updated files via Shopify CLI, then re-run performance measurement on all 3 pages
- **IMPLEMENT**:
```bash
cd "Uncovered Theme Edits"
shopify theme push --theme 152080253116 --allow-live --nodelete \
  --only "layout/theme.liquid" \
  --only "sections/main-product.liquid" \
  --only "snippets/card-product.liquid" \
  --only "snippets/sympl-widget.liquid" \
  --only "snippets/cart-drawer.liquid" \
  --only "snippets/shipping-bar-restyle.liquid" \
  --only "snippets/bogo-label.liquid" \
  --only "snippets/price.liquid" \
  --json
```
- **VALIDATE**: All 3 pages load without visual regressions. Measure:
  - Homepage: DCL < 3s, Load < 6s
  - Collection: DCL < 2s, Load < 5s
  - Product: DCL < 5s (down from 19.7s), Load < 10s (down from 32.4s)

---

## Testing Strategy

### Manual Validation
- [ ] Homepage loads — hero visible within 2s, no Growave widgets
- [ ] Collection page — products visible, BOGO labels styled, no redirect to product page
- [ ] Product page — gallery loads, price visible, Sympl widget styled, reviews load
- [ ] Cart drawer — opens properly, styled correctly despite deferred CSS
- [ ] Discount URL (`/?discount=TEST10`) still redirects correctly
- [ ] Free shipping confetti plays when threshold met
- [ ] No console errors on any page

### Performance Targets

| Metric | Homepage | Collection | Product |
|---|---|---|---|
| TTFB | < 200ms | < 200ms | < 200ms |
| FCP | < 1.5s | < 1.5s | < 1.5s |
| DCL | < 3s | < 2s | < 5s |
| Load | < 6s | < 5s | < 10s |
| Growave requests | 0 | 0 | 0 |
| Stylesheets (render-blocking) | < 5 | < 5 | < 5 |

---

## Validation Commands

### Push to Shopify
```bash
cd "Uncovered Theme Edits" && shopify theme push --theme 152080253116 --allow-live --nodelete --only "layout/theme.liquid" --only "sections/main-product.liquid" --only "snippets/card-product.liquid" --only "snippets/sympl-widget.liquid" --only "snippets/cart-drawer.liquid" --only "snippets/shipping-bar-restyle.liquid" --only "snippets/bogo-label.liquid" --only "snippets/price.liquid" --json
```
EXPECT: Upload success, no errors

### Browser Validation
```
Navigate to https://uncoveredeg.com/ — measure timing
Navigate to https://uncoveredeg.com/collections/products — measure timing
Navigate to https://uncoveredeg.com/products/burning-liberty — measure timing
```
EXPECT: All targets met

---

## Acceptance Criteria
- [ ] All 8 tasks completed
- [ ] Growave blocked on all pages (0 requests)
- [ ] Product page DCL < 5s (down from 19.7s)
- [ ] No visual regressions on any page
- [ ] Discount redirect still works with URL sanitization
- [ ] Sympl widget renders correctly
- [ ] Cart drawer functions properly
- [ ] BOGO/sale price labels display correctly

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Deferred product CSS causes FOUC on product page | Medium | Medium | Keep `section-main-product.css` and `component-price.css` eager |
| Growave observer disconnect at DCL misses late-injected scripts | Low | Medium | Growave injects in `<head>` via `content_for_header`, which completes before DCL |
| Cart drawer unstyled flash when opened | Medium | Low | User won't notice — drawer has open animation that provides 200ms for CSS |
| Confetti lazy-load fails on slow connection | Low | Low | Graceful degradation — bar works without confetti |

## Notes
- The "auto-redirect from collection to product page" flagged by the CRO audit is likely NOT from theme code. The only redirect in theme.liquid is the discount handler (`/?discount=X → /discount/X`). The redirect may be from a Shopify app or the store's navigation config. Needs investigation in Shopify admin.
- The srcset 720w cap IS in the local `card-product.liquid` but may not be taking effect because the live theme's Dawn template might be using a different product card snippet. Need to verify the live theme's actual snippet names.
- Product page has 14 eager `stylesheet_tag` calls — this is the most likely cause of the DCL regression. Deferring 12 of them should bring DCL back down to < 5s.
