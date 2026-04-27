# Uncovered EG — Performance Audit & Improvement Plan

**Audit date:** 2026-04-27
**Pages audited:**
- Home: https://uncoveredeg.com/
- Collection: https://uncoveredeg.com/collections/products
- Product: https://uncoveredeg.com/products/burning-liberty

Methodology follows the `web-performance-optimization` skill: measure → identify → prioritize → implement → verify.

---

## 1. Measured Baseline (cold-ish, desktop, single-run)

| Metric | Home | Collection | Product (Burning Liberty) | Target |
|---|---|---|---|---|
| TTFB | 95 ms | 60 ms | 121 ms | < 600 ms ✅ |
| FCP | 1.5 s | 3.5 s ❌ | 1.8 s | < 1.5 s |
| DOMContentLoaded | **26.5 s** ❌ | 7.5 s | 10.4 s | < 3 s |
| Load event | **61.6 s** ❌ | 15.7 s | 21.0 s | < 5 s |
| Total transfer | 557 KB | 47 KB (warm) | 381 KB | — |
| Stylesheets | **68** ❌ | 31 | 30 | < 10 |
| Scripts | 39 | 63 | **78** ❌ | < 20 |
| Image count | 33 | 24 | 45 | — |
| Images w/o `width`/`height` | 35/33 ❌ | 10/24 ❌ | 0/45 ✅ | 0 |

**Headline problems:** server is fast (TTFB ~100 ms), but DOMContentLoaded and load times are catastrophic — dominated by **third-party scripts and Shopify-app stylesheets/scripts**, not the storefront's own theme code.

---

## 2. Bottleneck Inventory (root causes)

### 2.1 Shopify-app sprawl (biggest single issue)
- **68 stylesheets on the homepage**, 30+ on collection/product pages. Most are from Shopify apps (Judge.me, Sympl, Growave/`happiness.grwx.me`, Clarity, etc.) — each one is a render-blocker and a network round-trip.
- `happiness.grwx.me` shows a **15.4 s** longest-resource time on home and **2.0 s** on product. This widget alone explains the 60 s `load` event on the homepage.
- 11 beacons + 13 fetch/XHR per page from analytics/pixels.

### 2.2 Image weight & sizing (LCP risk)
- Product carousel images on the home page are **2000×2000 to 4000×4000 PNGs** rendered into a **180×239** slot. Every thumbnail is ~50–170 KB when it should be <10 KB.
- Heaviest single asset: `dark-habit2…png` at **170 KB** (4000×4000 PNG).
- 35 of 33 (some duplicated) homepage images and 10 of 24 collection images **lack `width`/`height`**, guaranteeing CLS.
- Product page is mostly OK on dimensions, but still has 6 oversampled images at 2000²→218².
- PNG is used everywhere products are pictured. WebP/AVIF would cut these by 60–80 %.

### 2.3 Third-party tracking + chat
- `connect.facebook.net/fbevents.js` = **97 KB** + `signals/config` = **45 KB** loaded on the product page. 142 KB of pixels.
- Active vendors detected: Meta Pixel, Google Ads / Tag Manager, GA4, Microsoft Clarity, Judge.me, Sympl, Growave, Shopify Web Pixel manager.
- Most are loaded eagerly; none are gated behind consent or `requestIdleCallback`.

### 2.4 LCP / FCP gap on collection page
- TTFB 60 ms but **FCP 3.5 s** → ~3 s of render-blocking work between byte arrival and first paint. This is the 31 stylesheets being parsed sequentially.

### 2.5 Theme-side issues
- `theme.liquid` and section templates are already locally modified ([Uncovered Theme Edits/layout/theme.liquid](Uncovered%20Theme%20Edits/layout/theme.liquid), [main-product.liquid](Uncovered%20Theme%20Edits/sections/main-product.liquid)) — good, we have a lever.
- Hero/featured sections likely don't preload the LCP image.
- Multiple snippet-scoped `<style>` blocks instead of a consolidated theme stylesheet.

---

## 3. Prioritized Plan (highest ROI first)

### P0 — Kill the longest tail (target: load event < 8 s on home)

| # | Action | Where | Expected gain |
|---|---|---|---|
| P0-1 | **Audit & remove unused Shopify apps.** List every app under Online Store → Themes → App embeds. Disable Growave (`happiness.grwx.me`) if not driving revenue, or move it to "load on user interaction." | Shopify admin | -10–30 s on `load`, fewer CSS/JS files |
| P0-2 | **Defer Meta Pixel, Clarity, GTM** until first user interaction or `idle` (`requestIdleCallback`, fallback `setTimeout(…, 3000)`). Only fire `PageView` synchronously if your attribution model truly requires it. | `theme.liquid` <head>/<body> | -150 KB JS off critical path, -1–2 s TBT |
| P0-3 | **Lazy-load Judge.me widget**: keep the badge (rating only) above-the-fold, render the full review carousel via IntersectionObserver when user scrolls within 1 viewport of it. | `main-product.liquid` snippet | -60 KB images, -0.5 s on product page |

### P1 — Image pipeline (target: LCP < 2.5 s on home & product)

| # | Action | Where | Expected gain |
|---|---|---|---|
| P1-1 | **Use Shopify CDN image transforms** in every `img_url` filter: `{{ image \| image_url: width: 360 \| image_tag: loading: 'lazy', widths: '180,360,540,720' }}`. Never serve a 2000×2000 PNG into a 180-px slot. | Every product card snippet | -300+ KB on home alone |
| P1-2 | **Switch product PNGs to WebP/AVIF.** Re-upload masters as JPG/WebP; PNG is only for transparency. Verify with `?format=webp` or rely on Shopify's auto-`.webp` negotiation. | Product asset library | -50–70 % image bytes |
| P1-3 | **Add explicit `width`/`height`** to every image tag in theme. Use `image_tag` (Shopify auto-emits both) instead of hand-rolled `<img src=>`. | All section/snippet liquid | CLS → < 0.1 |
| P1-4 | **Preload the hero/LCP image** with `<link rel="preload" as="image" imagesrcset="…" imagesizes="…" fetchpriority="high">` only on the homepage and product page. | `theme.liquid` `<head>` | -300–800 ms LCP |
| P1-5 | Set `loading="eager" fetchpriority="high"` on the LCP image only; `loading="lazy"` on everything below the fold. Currently many homepage images are `loading="auto"`. | `image-with-text.liquid`, `featured-collection.liquid` | -1 LCP candidate competition |

### P2 — CSS/JS critical path (target: FCP < 1.5 s everywhere)

| # | Action | Where | Expected gain |
|---|---|---|---|
| P2-1 | **Consolidate theme CSS** into one file, minified. Move app CSS that ships per-section into `defer`-able `<link>` tags using `media="print" onload="this.media='all'"` pattern for non-critical apps. | `theme.liquid` | -1.5–2.5 s FCP on collection page |
| P2-2 | **Inline critical CSS** for above-the-fold (hero, header, primary CTA) in `<style>` block, defer the rest. Use `critical` or a manual extract — keep it under 14 KB so it fits the first TCP packet. | Layout file | -0.5–1 s FCP |
| P2-3 | **Audit `<script>` tags**: every theme/app `<script>` should have `defer` (preferred) or `async`. Remove duplicates (Sympl appears twice on product). | `theme.liquid` + app embeds | -1–2 s TBT |
| P2-4 | **Subset & self-host fonts** via Shopify CDN already (`anonymous_pro` already preloaded ✅). Verify `font-display: swap` is set in the `@font-face` rules emitted by Shopify. | `theme.liquid` | -100–300 ms FCP |

### P3 — Theme code hygiene

| # | Action | Where | Expected gain |
|---|---|---|---|
| P3-1 | Remove unused sections / leftover dev `<style>` blocks (the repo shows several `*-restyle` and one-off snippets). Each `<style>` injected per-section costs a parse. | `Section Lab/`, `Uncovered Theme Edits/snippets/` | small but compounding |
| P3-2 | Add `loading="lazy"` to Judge.me carousel images and review thumbnails (currently `loading="auto"`). | review snippet | -200 KB on home |
| P3-3 | Cache control: ensure Shopify default `Cache-Control` headers are intact for `cdn.shopify.com` assets (they are by default — just don't proxy through your domain). | n/a | already good |

### P4 — Verification

| # | Action |
|---|---|
| P4-1 | Run **Lighthouse** (mobile, slow-4G, 4× CPU) on all three URLs before and after each P0 batch. Capture LCP/CLS/INP delta. |
| P4-2 | Run **WebPageTest** filmstrip on home + product. Confirm hero image lands ≤ 2.5 s. |
| P4-3 | Enable **Core Web Vitals monitoring** in Shopify (Reports → Online store speed) or wire up `web-vitals.js` posting to GA4 to track real users for 7 days. |
| P4-4 | Smoke-test Meta Pixel `PageView` + `AddToCart` still fire after deferral (Facebook Events Manager → Test Events). |

---

## 4. Quick-win order of operations (do this exact sequence)

1. **Today (1 hr):** disable any unused Shopify apps; verify the `happiness.grwx.me` widget is intentional.
2. **Today (1 hr):** add `width`/`height` to every theme `<img>` and switch homepage product cards to `image_url: width: 360, format: 'webp'`. → expect a 5-point Lighthouse jump.
3. **This week (2–3 hr):** defer Meta Pixel + Clarity + GTM behind `requestIdleCallback`. Lazy-mount the Judge.me carousel. → expect another 10-point jump.
4. **Next sprint:** consolidate CSS, inline critical CSS, preload LCP image.
5. **Verify** with Lighthouse + WebPageTest after each step; never optimize blindly.

---

## 5. Realistic targets after full plan

| Metric | Today (home) | After P0+P1 | After P0–P3 |
|---|---|---|---|
| LCP | ~3–4 s (estimated) | 2.0–2.5 s | < 2.0 s |
| CLS | high (no dims) | 0.05 | < 0.05 |
| TBT/INP | high (vendors) | medium | < 200 ms |
| Load event | 61 s | < 15 s | < 8 s |
| Lighthouse mobile | likely 30–45 | 65–75 | 85–95 |

---

**Pro tip:** the single largest win on this storefront is **app & vendor pruning**, not theme code. Spend the first hour in Shopify admin, not in Liquid.
