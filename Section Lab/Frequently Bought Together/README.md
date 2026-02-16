# SL - Frequently Bought Together

Product slider for “Frequently Bought Together” with card styling, auto-generated percentage badges, and add-to-cart. Designed to be modern, lightweight, and fast.

**Category:** Products  
**Templates:** Product page only  
**Dependencies:** Swiper.js (CDN or theme asset)

---

## Overview

Horizontal product carousel for product pages. Each card shows product image, title, price, optional “X% bought together” badge, and an Add button. Percentages are auto-generated in descending order (first slide highest, last slide lowest), all above 30%.

---

## Installation

### Step 1 — Copy the section

Copy `sections/sl-frequently-bought-together.liquid` into your theme’s **sections** folder.

### Step 2 — Load Swiper (if not already in theme)

Add before `</body>` in `layout/theme.liquid`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

Or use your theme’s asset pipeline if Swiper is bundled.

### Step 3 — Add the section

1. **Online Store** → **Themes** → **Customize**
2. Open a product page
3. **Add section** → **SL - Frequently Bought Together**
4. Add product blocks and pick products
5. Save

---

## Setup Details

| Item | Details |
|------|---------|
| **Section placement** | Product template only |
| **Blocks** | Product (select product per block) |
| **Data source** | Theme Editor blocks (manual product selection) |
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
| **Scoped CSS** | Styles scoped to section ID, no global pollution |
| **No extra JS libs** | Only Swiper; no jQuery |
| **Inline script** | Small IIFE, no extra network request |

Swiper JS initializes when the section enters (or is about to enter) the viewport, so the main bundle is not blocked.

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

## File structure

```
Section Lab/Frequently Bought Together/
├── sections/
│   └── sl-frequently-bought-together.liquid
└── README.md
```

---

## Swiper version

- Tested with Swiper 11.x
- Uses `swiper-bundle` (core + navigation + pagination)
- CDN: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`
- CSS: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`

---

## Limitations

- **Static products:** Products are chosen manually in blocks; no automatic FBT logic
- **Single variant:** Adds first available variant; no variant picker
- **Theme cart behavior:** Uses standard product form; cart drawer/page behavior comes from your theme
- **Swiper required:** Section will not run correctly without Swiper loaded
