# Plan: Performance P0 Quick Wins (TKT-1 → TKT-5)

## Summary

Reduce Uncovered EG storefront's homepage `load` event from 61 s → < 15 s and stylesheet count from 68 → < 25 by **(a) pruning unused Shopify-app embeds**, **(b) gating the Growave loyalty widget**, and **(c) tightening the image pipeline** in customized theme files. This is the P0 lane only — JS-deferral (TKT-6→10), CSS critical path (TKT-11→14), hygiene (TKT-15→17), and verification (TKT-18→20) are out of scope and will get their own PRPs.

## User Story

As a **shopper on a 4G mobile connection**, I want **the storefront to be interactive in under 5 seconds** so that **I don't bounce before seeing the products I came for**.

## Problem → Solution

**Current:** Homepage `load` = 61 s, DCL = 26 s, 68 stylesheets, 4000×4000 PNGs rendered into 180 px slots, Growave widget holds connections open for 15 s, 35/33 homepage images lack `width`/`height` causing CLS.

**Desired:** `load` < 15 s, < 25 stylesheets on home, no image > 80 KB on product cards, no request to `happiness.grwx.me` on initial load (or gated behind interaction), CLS < 0.1.

## Metadata

- **Complexity**: Medium
- **Source**: `Performance-Audit-Plan.md` (P0/P1 image rows)
- **Source tickets**: TKT-1 through TKT-5
- **Estimated files modified in repo**: 1–3 (card-product.liquid potentially, plus any upstream theme files that need to be brought into `Uncovered Theme Edits/`)
- **Estimated files modified in Shopify admin**: ~10 app embeds toggled
- **Estimated assets re-uploaded**: ~6 product PNGs
- **Effort**: 6.5 hr per ticket estimates

---

## UX Design

### Before

```
┌────────────────────────────────────────────┐
│  [logo]                       [cart icon]  │
│                                            │
│  ⏳ Loading hero image (170 KB PNG, 4000²) │
│  ⏳ 68 stylesheets parsing                 │
│  ⏳ Growave widget blocking 15 s           │
│                                            │
│  ☐ Layout shifts as images arrive          │
│  ☐ INP > 500 ms (main thread blocked)      │
└────────────────────────────────────────────┘
load event: 61 seconds
```

### After

```
┌────────────────────────────────────────────┐
│  [logo]                       [cart icon]  │
│  [hero image — 360 px webp, 25 KB] ────┐   │
│  [product card] [product card] [card]  │   │
│  Growave: gated behind ⓘ rewards icon   │   │
│  Stylesheet count: 23                  │   │
│  CLS: 0.04, no jumping                 │   │
└────────────────────────────────────────────┘
load event: < 15 seconds
```

### Interaction Changes

| Touchpoint | Before | After | Notes |
|---|---|---|---|
| Page open | 61 s before idle | < 15 s | TKT-1, TKT-2 |
| Product cards | 170 KB PNGs | < 80 KB WebPs | TKT-4, TKT-5 |
| Image load | layout jumps | reserved space | TKT-3 (already done in `card-product.liquid` — must verify other entry points) |
| Rewards widget | always loading | click-to-open | TKT-2 (if Growave kept) |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `Uncovered Theme Edits/snippets/card-product.liquid` | 60–105 | The **gold-standard image pattern** in this repo. Every other product image must mirror this. |
| P0 | `Uncovered Theme Edits/snippets/cart-drawer.liquid` | 135–146 | Second valid image pattern (single fixed-width). |
| P0 | `Uncovered Theme Edits/layout/theme.liquid` | 1–80 | Confirms `font_display: 'swap'` is already set, defer pattern on first-party scripts, no Meta Pixel here (loaded via `content_for_header`). |
| P0 | `Performance-Audit-Plan.md` | all | Source-of-truth for measured baselines and target metrics. |
| P1 | `https://shopify.dev/docs/api/liquid/filters/image_url` | — | `format: 'webp'` requires `image_url` (not the deprecated `img_url`). Default is original format. |
| P1 | `https://shopify.dev/docs/storefronts/themes/best-practices/performance#images` | — | Shopify recommends widths `165, 360, 533, 720, 940, 1066, 1500` for product imagery. |

## External Documentation

| Topic | Source | Key Takeaway |
|---|---|---|
| `image_url` filter | shopify.dev | Supports `width`, `height`, `crop`, `format: 'webp' \| 'jpg' \| 'pjpg'`. Shopify CDN auto-serves WebP via `Accept` negotiation regardless, but explicit `format: 'webp'` is safer. |
| App embeds | shopify.dev | Theme app extensions register via `content_for_header`. Disabling them in admin removes both their `<script>` and `<style>` injections without touching theme code. |
| Growave gating | growave.io docs | Widget exposes `data-growave-trigger` attribute; can be initialized lazily. |

---

## Patterns to Mirror

### IMAGE_PATTERN_RESPONSIVE (use for any product or collection imagery)

```liquid
{%- comment -%} SOURCE: snippets/card-product.liquid:64-83 {%- endcomment -%}
<img
  srcset="
    {%- if image.width >= 165 -%}{{ image | image_url: width: 165 }} 165w,{%- endif -%}
    {%- if image.width >= 360 -%}{{ image | image_url: width: 360 }} 360w,{%- endif -%}
    {%- if image.width >= 533 -%}{{ image | image_url: width: 533 }} 533w,{%- endif -%}
    {%- if image.width >= 720 -%}{{ image | image_url: width: 720 }} 720w,{%- endif -%}
    {%- if image.width >= 940 -%}{{ image | image_url: width: 940 }} 940w,{%- endif -%}
    {%- if image.width >= 1066 -%}{{ image | image_url: width: 1066 }} 1066w,{%- endif -%}
    {{ image | image_url }} {{ image.width }}w
  "
  src="{{ image | image_url: width: 533 }}"
  sizes="(min-width: {{ settings.page_width }}px) {{ settings.page_width | minus: 130 | divided_by: 4 }}px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
  alt="{{ image.alt | escape }}"
  loading="lazy"
  width="{{ image.width }}"
  height="{{ image.height }}"
>
```

### IMAGE_PATTERN_FIXED (use for thumbnails / cart line items)

```liquid
{%- comment -%} SOURCE: snippets/cart-drawer.liquid:138-145 {%- endcomment -%}
<img
  src="{{ image | image_url: width: 300 }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
  width="150"
  height="{{ 150 | divided_by: image.aspect_ratio | ceil }}"
>
```

### SCRIPT_DEFER_PATTERN (already used in theme.liquid:31-36)

```liquid
{%- comment -%} SOURCE: layout/theme.liquid:31-36 {%- endcomment -%}
<script src="{{ 'global.js' | asset_url }}" defer="defer"></script>
```

### FONT_DISPLAY_SWAP (already in place — do not duplicate)

```liquid
{%- comment -%} SOURCE: layout/theme.liquid:50-55 {%- endcomment -%}
{% style %}
  {{ settings.type_body_font | font_face: font_display: 'swap' }}
  {{ settings.type_header_font | font_face: font_display: 'swap' }}
{% endstyle %}
```

---

## Files to Change

| File / Asset | Action | Justification |
|---|---|---|
| Shopify admin → App embeds | TOGGLE | TKT-1: disable unused apps. No file change. |
| Shopify admin → Growave settings (if kept) | CONFIGURE | TKT-2: switch to lazy/click-to-load mode. |
| `Uncovered Theme Edits/README.md` | CREATE | TKT-1 acceptance: document kept apps. |
| `Uncovered Theme Edits/snippets/card-product.liquid` | UPDATE (minor) | TKT-4: add `format: 'webp'` to `image_url` calls. Confirm width/height already present. |
| Possibly `sections/featured-collection.liquid`, `sections/image-with-text.liquid` (if these exist upstream) | COPY-IN + UPDATE | TKT-3, TKT-4: only if these are sources of the homepage's oversized images. Determine from network panel before copying. |
| `Uncovered Theme Edits/snippets/cart-drawer.liquid` | UPDATE (minor) | TKT-4: add `format: 'webp'`. |
| Product master images (~6 PNGs in Shopify Files): `dark-habit2`, `velvet-rose1`, `vanilla-glaze`, `becoming-her-1`, `midnight-heat`, `royal-_2` | RE-UPLOAD as JPG | TKT-5. Asset team. |

## NOT Building

- **TKT-6 → TKT-20**: pixel deferral, CSS consolidation, critical CSS, preload tags, lazy review carousel — separate PRPs after CRO direction is confirmed (R3).
- **Net-new sections** for hero or featured collections.
- **Build pipeline** (no Webpack/Vite — this is a vanilla Shopify theme).
- **`image_tag` filter migration** — current `<img>` patterns are already correct; switching to `image_tag` would be a churn-only change.
- **CDN swap** — Shopify CDN is fine; no Cloudflare / KeyCDN.
- **Image master re-upload from PNG → JPG** for any image where transparency is required (logos, icons).

---

## Step-by-Step Tasks

### Task 1: TKT-1 — App embed inventory (Shopify admin)

- **ACTION**: Open Shopify admin → Online Store → Themes → Customize → App embeds. Screenshot the panel.
- **IMPLEMENT**: For each enabled embed, classify as **kill** / **keep** / **lazy**:
  - kill = not in active use, disable now
  - keep = revenue-critical, leave on
  - lazy = needed but not above-the-fold, configure for delayed load (or schedule for TKT-9-style work)
- **MIRROR**: N/A (admin task)
- **IMPORTS**: N/A
- **GOTCHA**: Disabling an app embed does NOT uninstall the app — billing continues. Disable embed first, observe analytics for 7 days, then uninstall if metrics hold.
- **VALIDATE**:
  ```bash
  # After saving, reload home + measure
  curl -s https://uncoveredeg.com/ | grep -oE '<link[^>]*stylesheet[^>]*>' | wc -l
  ```
  EXPECT: stylesheet count drops from 68 → < 25.

### Task 2: TKT-1 — Document app inventory

- **ACTION**: Create `Uncovered Theme Edits/README.md` with the kept-app list.
- **IMPLEMENT**: Two-column markdown table: `App | Reason kept`. Add date.
- **MIRROR**: N/A
- **IMPORTS**: N/A
- **GOTCHA**: Future engineers will assume any app not on this list is safe to remove. Keep list updated.
- **VALIDATE**: `cat "Uncovered Theme Edits/README.md"` shows the table.

### Task 3: TKT-2 — Confirm Growave usage

- **ACTION**: Open Shopify admin → Apps → Growave (if installed) and check Active Customers / Points Redeemed in last 30 days.
- **IMPLEMENT**:
  - **If active (>10 redemptions/mo)**: configure widget to load on click. Growave admin → Widget → Display → "On click only" (or equivalent). If no such option, edit the embed to render a static "Rewards" button that injects the widget script onclick.
  - **If inactive**: disable embed entirely.
- **MIRROR**: SCRIPT_DEFER_PATTERN if a custom click-to-load wrapper is needed.
- **IMPORTS**: N/A
- **GOTCHA**: Growave often re-enables itself on theme update — re-verify after any theme change.
- **VALIDATE**:
  ```bash
  # After change, reload home and check network
  # In browser DevTools → Network → filter "happiness.grwx.me"
  # EXPECT: 0 requests on initial load
  ```

### Task 4: TKT-3 — Audit `<img>` dimension coverage in repo

- **ACTION**: Verify all `<img>` tags in `Uncovered Theme Edits/` already have `width`/`height` attrs.
- **IMPLEMENT**: Grep + manual scan:
  ```bash
  cd "Uncovered Theme Edits"
  for f in $(grep -rl '<img' snippets sections layout); do
    awk '/<img/,/>/' "$f" | grep -B1 -A8 '<img' | grep -L 'width=' && echo "MISSING in $f"
  done
  ```
- **MIRROR**: IMAGE_PATTERN_RESPONSIVE or IMAGE_PATTERN_FIXED for any tag found missing dims.
- **IMPORTS**: N/A
- **GOTCHA**: The audit found 35 missing-dim images on the home page, but only 4 `<img>` tags exist in this repo (all with dims). The 35 come from **upstream Dawn theme files not yet copied here** (`featured-collection.liquid`, `image-with-text.liquid`, `slideshow.liquid`) **or vendor-injected HTML** (Judge.me, Sympl). Identify the source via DevTools before adding files to the repo — don't copy in files we don't intend to customize.
- **VALIDATE**:
  ```javascript
  // Run in browser DevTools console on https://uncoveredeg.com/
  Array.from(document.images).filter(i => !(i.hasAttribute('width') && i.hasAttribute('height'))).map(i => i.src)
  ```
  Group results by host. Theme-controlled hosts (`cdn.shopify.com/s/files/1/0661/9853/6243/files/...`) → fix in theme. Vendor hosts (`judgeme.imgix.net`, `s3.amazonaws.com/me.judge.review-images`) → fix via app config or wrap.

### Task 5: TKT-3 — Fix theme-controlled missing-dim images

- **ACTION**: For each theme file identified in Task 4, copy the upstream Dawn version into `Uncovered Theme Edits/sections/` and apply IMAGE_PATTERN_RESPONSIVE.
- **IMPLEMENT**: Most likely targets:
  - `sections/featured-collection.liquid` (homepage product grid)
  - `sections/image-with-text.liquid` (homepage hero)
  - `sections/slideshow.liquid` (homepage carousel if used)

  For each `<img>` that lacks dims, replace with the IMAGE_PATTERN_RESPONSIVE block, substituting `image` for the section's image variable.
- **MIRROR**: IMAGE_PATTERN_RESPONSIVE
- **IMPORTS**: N/A
- **GOTCHA**: Don't copy files just to copy them — only copy what you'll change. Each customized file means future Dawn updates must be merged manually.
- **VALIDATE**: Re-run the DevTools console check from Task 4. Theme-host images should now all have dimensions.

### Task 6: TKT-3 — Address vendor-injected missing-dim images

- **ACTION**: For Judge.me / Sympl images without dims, configure the app or wrap the embed.
- **IMPLEMENT**:
  - **Judge.me**: Settings → Reviews Widget → "Image dimensions" — enable explicit sizing if available. If not, add CSS `aspect-ratio` rule in `assets/base.css`:
    ```css
    .jdgm-rev__pic-img, .jdgm-carousel__item img { aspect-ratio: 4 / 3; height: auto; width: 100%; }
    ```
  - **Sympl**: file lives at `Uncovered Theme Edits/snippets/sympl-widget.liquid` — already in repo. Audit any `<img>` it injects and add dims.
- **MIRROR**: IMAGE_PATTERN_FIXED if Sympl widget renders product cards.
- **IMPORTS**: N/A
- **GOTCHA**: CSS `aspect-ratio` does not change CLS scoring if the image actually arrives at a different ratio than declared. Use the actual CDN aspect ratio.
- **VALIDATE**: Lighthouse `cumulative-layout-shift` < 0.1.

### Task 7: TKT-4 — Add `format: 'webp'` to image_url calls in repo

- **ACTION**: Append `, format: 'webp'` to every `image_url` filter call in the customized theme files.
- **IMPLEMENT**:

  In `snippets/card-product.liquid` lines 66–74, 89–97, 480–488 (and any other `image_url` site), change:
  ```diff
  - {{ card_product.featured_media | image_url: width: 165 }} 165w,
  + {{ card_product.featured_media | image_url: width: 165, format: 'webp' }} 165w,
  ```
  Repeat for every width and every snippet.

  In `snippets/cart-drawer.liquid` line 140:
  ```diff
  - src="{{ item.image | image_url: width: 300 }}"
  + src="{{ item.image | image_url: width: 300, format: 'webp' }}"
  ```
- **MIRROR**: IMAGE_PATTERN_RESPONSIVE / IMAGE_PATTERN_FIXED (just add the `format` arg).
- **IMPORTS**: N/A
- **GOTCHA**:
  - Shopify CDN already serves `.webp` to browsers that send `Accept: image/webp` — explicit `format: 'webp'` is belt-and-braces. AVIF is **not** supported via the `format` arg.
  - For images that legitimately need transparency (logos in cart drawer), keep PNG: `format: 'png'` (or omit).
  - `format` was added to `image_url`; the deprecated `img_url` filter does NOT accept it — confirm callsite uses `image_url`.
- **VALIDATE**:
  ```bash
  cd "Uncovered Theme Edits"
  grep -rn 'image_url' snippets/ sections/ | grep -v "format:" | grep -v ".png"
  ```
  EXPECT: no results (every `image_url` call has either `format:` or is intentionally raw).

  Then in browser:
  ```javascript
  Array.from(document.images).filter(i => i.currentSrc.includes('cdn.shopify.com')).every(i => i.currentSrc.includes('.webp') || i.currentSrc.includes('format=webp'))
  ```
  EXPECT: `true`.

### Task 8: TKT-4 — Verify product-card sizing budget

- **ACTION**: Confirm no product card image exceeds 80 KB after Task 7.
- **IMPLEMENT**: Reload `https://uncoveredeg.com/` with a hard refresh, open DevTools Network → filter `Img`, sort by Size desc.
- **MIRROR**: N/A
- **IMPORTS**: N/A
- **GOTCHA**: First load may show stale cached PNG until CDN propagates the new `format: 'webp'` URL — bump `?v=` or wait 5 min.
- **VALIDATE**: Network tab shows no product-card image > 80 KB. (Hero image may still be larger — that's TKT-13's territory, not P0.)

### Task 9: TKT-5 — Re-upload PNG masters as JPG

- **ACTION**: Asset team re-exports the 6 product PNGs as 80%-quality JPGs and re-uploads via Shopify admin → Settings → Files.
- **IMPLEMENT**: For each of `dark-habit2`, `velvet-rose1`, `vanilla-glaze`, `becoming-her-1`, `midnight-heat`, `royal-_2`:
  1. Download the original PNG.
  2. Open in Photoshop/Affinity/Squoosh — confirm there's no real transparency (white-on-white is not transparency). If there is real transparency, skip.
  3. Export as JPG, quality 80, progressive.
  4. Upload to Shopify Files. Replace product `featured_image` references in admin.
- **MIRROR**: N/A (asset operation)
- **IMPORTS**: N/A
- **GOTCHA**:
  - Replacing a Shopify product image creates a new `image_url` — old URLs 404. Use the in-admin "Replace image" flow on each product, not "Delete + add", to preserve alt text and ordering.
  - PNGs that are 4000×4000 likely originate from a designer using "save for web" without resampling. Export at 1500×1500 max — no shopper sees more.
- **VALIDATE**:
  ```bash
  # After upload, sample home page
  curl -s "https://uncoveredeg.com/" | grep -oE 'cdn\.shopify\.com/[^"]*\.(png|jpg)' | sort -u
  ```
  EXPECT: no `.png` URLs for product imagery (logos and icons OK).

---

## Testing Strategy

### Validation Tests

This is a Liquid theme — no unit-test framework. Validation is performance + visual.

| Test | Input | Expected Output | Edge Case? |
|---|---|---|---|
| Stylesheet count on home | curl + grep | < 25 | After TKT-1 |
| `happiness.grwx.me` request count | DevTools network on home | 0 on initial paint | After TKT-2 |
| Images without `width`/`height` on home | DevTools console | 0 from theme-controlled hosts | After TKT-3 |
| Largest product card image on home | DevTools network | < 80 KB | After TKT-4 |
| `.png` URLs from `cdn.shopify.com` for product images | curl + grep | none | After TKT-5 |
| CLS (Lighthouse mobile) | Lighthouse | < 0.1 | After TKT-3 |
| LCP (Lighthouse mobile) | Lighthouse | < 2.5 s | After TKT-4, TKT-5 |
| `load` event on home | Performance API | < 15 s | After all P0 tickets |

### Edge Cases Checklist

- [ ] Product without a featured_image → `card-product.liquid` already handles via `{%- if card_product.featured_media -%}` guard — no regression risk.
- [ ] Image narrower than 165 px → existing `if image.width >= 165` guards prevent broken srcset entries.
- [ ] WebP-incapable browser (Safari < 14) → Shopify CDN's `Accept` negotiation falls back to JPG. Confirm with `User-Agent: Safari 13` curl.
- [ ] Logo / icon with transparency mistakenly converted to JPG → visible white box. Manual visual check post-Task 9.
- [ ] Growave widget gated → confirm rewards icon still appears for logged-in customers.
- [ ] Apps disabled but referenced in checkout → Shopify admin warns; un-disable if needed.

---

## Validation Commands

### Static Analysis

```bash
# Verify all image_url calls in customized files include format
cd "/Users/trial/shopify-sections/Uncovered Theme Edits"
grep -rn 'image_url' snippets/ sections/ | grep -v "format:" | grep -v "image_url:\s*$"
```
EXPECT: zero results that aren't intentionally raw (e.g., the `srcset` final fallback `{{ image | image_url }}` is acceptable as the "original" URL).

```bash
# Verify no <img tag without both width and height in repo
cd "/Users/trial/shopify-sections/Uncovered Theme Edits"
python3 -c "
import re, glob
for f in glob.glob('**/*.liquid', recursive=True):
    src = open(f).read()
    for m in re.finditer(r'<img\b[^>]*>', src, re.S):
        if 'width=' not in m.group() or 'height=' not in m.group():
            print(f'{f}: {m.group()[:80]}')
"
```
EXPECT: zero hits.

### Browser Validation (run after deploy)

Open `https://uncoveredeg.com/` in Chrome Incognito → DevTools → Console:

```javascript
// 1. Stylesheet count
document.querySelectorAll('link[rel="stylesheet"]').length;
// EXPECT: < 25

// 2. Growave request check
performance.getEntriesByType('resource').filter(r => r.name.includes('grwx.me')).length;
// EXPECT: 0 (or 0 until user clicks rewards)

// 3. Theme images without dimensions
Array.from(document.images)
  .filter(i => i.src.includes('cdn.shopify.com') && i.src.includes('/files/'))
  .filter(i => !(i.hasAttribute('width') && i.hasAttribute('height')))
  .length;
// EXPECT: 0

// 4. Largest product image
Math.max(...performance.getEntriesByType('resource')
  .filter(r => r.initiatorType === 'img' && r.name.includes('cdn.shopify.com'))
  .map(r => r.transferSize || 0)) / 1024;
// EXPECT: < 80 (KB) for product cards; hero may exceed

// 5. PNG count for product images
performance.getEntriesByType('resource')
  .filter(r => r.name.match(/cdn\.shopify\.com.*\.png/) && !r.name.includes('logo'))
  .length;
// EXPECT: 0
```

### Lighthouse

```bash
# Mobile, slow-4G, 4× CPU
lighthouse https://uncoveredeg.com/ \
  --preset=mobile --throttling-method=simulate \
  --output=html --output-path=docs/perf-baselines/2026-04-27-after-p0/home.html
```
EXPECT: Performance score ≥ 65 (was estimated 30–45). LCP < 2.5 s. CLS < 0.1.

Repeat for `/collections/products` and `/products/burning-liberty`.

### Manual Validation

- [ ] Visit home in mobile Safari, verify product images load and look sharp (no JPG compression artifacts).
- [ ] Visit a product page, add to cart, open cart drawer — image visible and not stretched.
- [ ] Visit home as logged-in customer — rewards widget either hidden behind icon (TKT-2 lazy) or absent (TKT-2 kill).
- [ ] FB Events Manager Test Events (only if any of TKT-1's "kill" decisions touched the Meta Pixel app embed by mistake) — confirm `PageView` still fires.

---

## Acceptance Criteria

- [ ] Stylesheet count on home `< 25`
- [ ] No request to `happiness.grwx.me` on initial home load
- [ ] No theme-controlled image on home / collection / PDP missing `width`/`height`
- [ ] No product-card image on home `> 80 KB`
- [ ] No `cdn.shopify.com` PNG URL for product imagery (logos / icons OK)
- [ ] Lighthouse mobile CLS `< 0.1` on all 3 audited pages
- [ ] `Uncovered Theme Edits/README.md` documents kept apps with date
- [ ] All validation console commands return expected values

## Completion Checklist

- [ ] Code follows `IMAGE_PATTERN_RESPONSIVE` and `IMAGE_PATTERN_FIXED`
- [ ] No new `<style>` blocks added (P2 territory)
- [ ] No new `<script>` tags added (P1 territory)
- [ ] `font_display: 'swap'` left untouched (already correct)
- [ ] No backwards-compat shims for old image URLs
- [ ] Changes committed with message `perf: P0 quick wins (TKT-1..5) — app pruning, image hygiene`
- [ ] Lighthouse before/after JSONs saved under `docs/perf-baselines/2026-04-27-{before,after-p0}/`

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Disabling an app embed silently breaks checkout / pixel | Medium | High | TKT-1 phase: disable, observe analytics + checkout-flow smoke test for 24 h before uninstalling. |
| Growave loyalty drives repeat purchases; killing it tanks LTV | Low–Medium | High | Task 3 starts with usage data check, not deletion. |
| `format: 'webp'` causes blurriness on retina due to wrong width pick | Low | Low | Existing srcset already covers up to 1066 w; retina laptops will pick `1066w` automatically. |
| PNG → JPG re-upload introduces white background where transparency existed | Low | Medium | Task 9 step 2 mandates a transparency check. |
| Vendor (Judge.me / Sympl) updates break the aspect-ratio CSS shim | Low | Low | Re-test CLS quarterly. |
| Upstream Dawn theme update conflicts with files we just copied into `Uncovered Theme Edits/` | Medium | Medium | Document each copied file's source-version commit hash in `README.md` for future merges. |
| Asset team unavailable for Task 9 in the same week | Medium | Low | Tasks 1–8 are independent of Task 9; ship them first. |

## Notes

- The repo's `Uncovered Theme Edits/` folder is **selective** — it only contains files that have been customized off the upstream Dawn baseline. Tasks 5 and 6 may require copying upstream files (`featured-collection.liquid`, `image-with-text.liquid`) into the repo before editing. Don't copy what you won't change.
- `theme.liquid` already has correct `font_display: 'swap'` (line 51) and uses `defer="defer"` on first-party scripts (lines 31–36) — TKT-17 is mostly already done; verify only.
- Meta Pixel, GTM, Clarity are loaded via `{{ content_for_header }}` (theme.liquid:42), which is Shopify-app-controlled. **TKT-6, TKT-7, TKT-8 cannot be done from the theme alone** — they require either Shopify Customer Events config or editing the actual app embed. Those tickets need their own PRP.
- The biggest single win is almost certainly TKT-1 + TKT-2 (kill app sprawl + Growave). Image work (TKT-3/4/5) is correctness-and-CLS, not speed-of-light.
- The `card-product.liquid` snippet has TWO copies of the image block (lines 64–105 and 480–488). Both must be updated for TKT-4. The duplication is from the upstream Dawn theme's "card variants" pattern — leave the duplication intact.

---

## Confidence Score: **7/10**

Single-pass implementable for Tasks 1–4, 7–8 (clear, repo-only). Tasks 5–6 depend on browser-side discovery (which exact upstream files inject the missing-dim images) and Task 9 depends on asset team availability. Confidence drops because of the asset-team external dependency, not the technical work.
