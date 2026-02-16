# SL - Frequently Bought Together

Product slider for “Frequently Bought Together” with card styling, auto-generated percentage badges, and add-to-cart. Designed to be modern, lightweight, and fast.

**Category:** Products  
**Templates:** Product page only  
**Dependencies:** None (Swiper loads on demand when section is visible)

---

## Overview

Horizontal product carousel for product pages. Each card shows product image, title, price, optional “X% bought together” badge, and an Add button. Percentages are auto-generated in descending order (first slide highest, last slide lowest), all above 30%.

---

## Installation

### Step 1 — Copy the section

Copy `sections/sl-frequently-bought-together.liquid` into your theme’s **sections** folder.

### Step 2 — Add the section

1. **Online Store** → **Themes** → **Customize**
2. Open a product page
3. **Add section** → **SL - Frequently Bought Together**
4. Add product blocks and pick products
5. Save

**Swiper loads automatically** — No need to add Swiper to `theme.liquid`. The section loads Swiper CSS and JS from CDN only when the section is on the page and near the viewport. If Swiper is already loaded by your theme (e.g. another section), it will be reused.

---

## Setup Details

| Item | Details |
|------|---------|
| **Data source** | **Manual** (pick products in blocks) or **Auto** (Shopify recommendations) |
| **Auto mode** | Uses Shopify's complementary intent (often bought together). Add section to product page. |
| **Manual mode** | Product blocks (select product per block) |
| **Percentage logic** | Auto-generated from product ID; slide 1 highest, descending, all ≥30% |

### Percentage ranges (auto-generated)

| Slide | Range |
|-------|-------|
| 1 | 54–65% |
| 2 | 45–54% |
| 3 | 38–45% |
| 4 | 32–38% |
| 5+ | 30–35% |

Values are pseudo-random per product (based on `product.id`) but stable per page load.

---

## Design & UX

- **Cards:** White background, light border, rounded corners, soft shadow
- **Typography:** 14px title (2-line clamp), 14px price
- **Button:** Full-width Add button with hover state
- **Responsive:** Mobile 1.2 slides, tablet 2–3, desktop 3–5
- **Touch:** Swipe/drag via Swiper
- **Accessibility:** Semantic HTML, `alt` on images, button states

---

## Performance

| Feature | Implementation |
|---------|----------------|
| **Lazy loading** | `loading="lazy"` on all images |
| **Fetch priority** | `fetchpriority="low"` on images after the 2nd slide |
| **Deferred init** | Swiper initialized only when section is near viewport (Intersection Observer, `rootMargin: 100px`) |
| **Conditional Swiper** | Swiper CSS/JS loaded **only when this section exists** and is near viewport — not on the whole site |
| **Scoped CSS** | Styles scoped to section ID, no global pollution |
| **Inline script** | Small IIFE, no extra network request |

Swiper is loaded dynamically when the section enters (or is about to enter) the viewport. Pages without this section do not load Swiper.

---

## Section settings

### Heading

- Text, alignment, size, color, spacing

### Card

- Show/hide percentage badge
- Background, border, padding, radius
- Percentage text color, price color, button colors

### Slider

- Slide width (180–360px)
- Gap between slides
- Slides visible on desktop (2–5)
- Loop, arrows, pagination
- Autoplay and delay

### Section

- Full width / content width
- Padding top/bottom

---

## Block version (product info)

To place FBT **inside the product info** (e.g. under price, in the sidebar), use the **snippet** in a **Custom Liquid** block:

1. Copy `snippets/sl-frequently-bought-together.liquid` to your theme **snippets** folder.
2. In Theme Editor → Product page → Product information block group → **Add block** → **Custom liquid**.
3. Add:

   ```liquid
   {% render 'sl-frequently-bought-together', block_id: block.id, product: product %}
   ```

4. Save.

The block version uses the **recommendations/products.json** API (no `section_id` required). It works standalone — the section file does not need to be added to the product template. Manual product blocks are not available in this mode.

---

## Translations & RTL (Arabic, etc.)

The snippet supports translations and RTL layouts. **Copy the `locales/` folder** into your theme and merge with existing locale files:

| Key | Default (EN) |
|-----|--------------|
| `sections.sl_fbt.loading` | Loading… |
| `sections.sl_fbt.heading` | Frequently Bought Together |
| `sections.sl_fbt.popular` | Popular |
| `sections.sl_fbt.add` | Add |
| `sections.sl_fbt.adding` | Adding… |
| `sections.sl_fbt.added` | Added |
| `sections.sl_fbt.sold_out` | Sold out |
| `sections.sl_fbt.no_image` | No image |

- `locales/en.default.json` — English defaults (merge into your theme's `en.default.json`)
- `locales/ar.json` — Arabic (merge into your theme's `ar.json`)

RTL (Arabic, Hebrew, Farsi, Urdu) is applied automatically via `dir="rtl"` and Swiper's RTL option when the store language is switched.

---

## File structure

```
Section Lab/Frequently Bought Together/
├── sections/
│   └── sl-frequently-bought-together.liquid
├── snippets/
│   └── sl-frequently-bought-together.liquid
├── locales/
│   └── ar.json
└── README.md
```

---

## Swiper version

- Tested with Swiper 11.x
- Loaded from CDN only when section is present and visible
- CDN: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`
- CSS: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`

---

## Limitations

- **Static products:** Products are chosen manually in blocks; no automatic FBT logic
- **Single variant:** Adds first available variant; no variant picker
- **Theme cart behavior:** Uses standard product form; cart drawer/page behavior comes from your theme
- **Swiper:** Loaded automatically by the section when needed; no manual setup

---

## Auto recommendations (complementary)

When **Product source** is set to **Auto (Shopify recommendations)**:

- Uses Shopify's complementary intent (products often bought together)
- Based on purchase history and product relationships
- Fetched via AJAX when section is on the page
- New or low-sales stores may see few or no results
- Add the section to the **product template** only
