# SL - Volume Discount

Product-specific volume / quantity-based offer display. Shows tiers (e.g. Buy 1, Buy 2 Get 20% Off, Buy 3 Get 2 Free) as Swiper cards. **Display-only** — no cart or discount calculation. Data is driven by a metaobject and product metafield.

**Category:** Product upsell  
**Metafield:** `custom.volume_offers` (list of Volume Offer Tier metaobjects)

---

## Features

- **Swiper cards** — same design system as Frequently Bought Together (FBT)
- **Accordion** — collapsible "Purchase More & Save" heading with SVG chevron, 18px font
- **Offer types:** `none` (base price), `percent_off` (e.g. 20% off), `free_items` (Buy X Get Y Free)
- **Labels** — optional badges per tier (e.g. "Most popular", "Best value") with configurable color
- **Dual-image layout** for "Buy X Get Y Free" tiers (side-by-side images with + icon)
- **Buy now** — each card has a button that scrolls to the product form (quantity + add to cart) and sets the tier quantity
- **RTL** support (Arabic, Hebrew, Farsi, Urdu, Yiddish)
- **English & Arabic** locale files included
- Hidden on storefront when product has no volume offers; theme editor shows setup hint

---

## Metaobject: Volume Offer Tier

Create one metaobject **definition** and then create **entries** (one per tier). Each entry = one Swiper card.

### Definition

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. **Name:** `Volume Offer Tier`
3. Add these fields:

| Field key     | Type              | Required | Notes |
|---------------|-------------------|----------|--------|
| `quantity`    | Integer           | Yes      | Quantity to buy (e.g. 1, 2, 3) |
| `offer_type`  | Single line text  | Yes      | One of: `none`, `percent_off`, `free_items` |
| `offer_value` | Integer           | No       | For `percent_off`: discount % (e.g. 20). For `free_items`: number of free items (e.g. 1) |
| `label`       | Single line text  | No       | Badge text, e.g. "Most popular", "Best value" |
| `label_color` | Single line text  | No       | Badge background hex, e.g. `#eee`, `#2196F3`. Defaults to `#eee` (label text is black) |
| `description` | Multi-line text   | No       | Tier description shown in the card info section below "Offer details" |

4. **Storefront API access:** enable for the definition.
5. Save.

### Offer type behavior

- **`none`** — Base tier. Display price = quantity × product price. No discount badge.
- **`percent_off`** — Display price = quantity × product.price × (100 − offer_value) / 100. Shows "-X%" badge and strikethrough original; per-item price shown.
- **`free_items`** — Customer pays for `quantity`, receives `quantity + offer_value` items. Card uses dual-image layout with "Buy X Get Y Free" label below the picture. No product or price in the card; info section shows "Offer details" and optional tier description.

---

## Product metafield: volume_offers

1. **Settings** → **Custom data** → **Products** → **Add definition** (or edit existing).
2. **Name:** e.g. `Volume offers`
3. **Namespace and key:** `custom.volume_offers`
4. **Type:** List of metaobject references → **Volume Offer Tier**
5. **Storefront access:** enabled
6. Save.

---

## Assigning offers to a product

1. **Products** → open a product
2. **Metafields** (or **Custom data**) → **Volume offers**
3. Add references to **Volume Offer Tier** entries (create tiers first under **Content** → **Metaobjects** → **Volume Offer Tier**).
4. Order of entries = order of cards (first card gets the red “selected” border).
5. Save.

Cards show **Offer details** (e.g. "Buy 2 Get 1 Free", "Buy 2 Get 20% off", "1 at regular price") and optional **description** per tier. No product title or price is shown in the cards. For "Buy X Get Y Free", the offer label appears below the dual image.

**Example tiers for one product:**

| quantity | offer_type   | offer_value | label          | label_color | description (optional)      |
|----------|--------------|-------------|----------------|-------------|-----------------------------|
| 1        | none         | —           | (blank)        | —           | Single unit at full price   |
| 2        | percent_off  | 20          | Most popular   | #E91E63     | Save 20% when you buy 2     |
| 3        | percent_off  | 30          | Best value     | #2196F3     | Best per-unit value         |
| 2        | free_items   | 1           | (blank)        | —           | Buy 2, get 1 free           |

---

## Render code (column snippet)

Use this in a **Custom Liquid** block (e.g. in the product info column):

```liquid
{% render 'sl-volume-discount', product: product, block_id: block.id %}
```

- **`product`** — pass the product object (e.g. `product` on product template).
- **`block_id`** — optional; use `block.id` when inside a section block so CSS/JS stay scoped. Omit or use a fixed string if not in a block.

Optional debug in theme editor:  
`{% render 'sl-volume-discount', product: product, block_id: block.id, debug: true %}`

---

## Installation

### Option A — Section

1. Copy the entire **Volume Discount** folder into your theme’s **Sections** (and **Snippets** / **Locales** as needed, depending on your theme structure).
2. **Online Store** → **Themes** → **Customize**
3. Open a **Product** template → **Add section** → **SL - Volume Discount**
4. Configure heading, accordion open, background color, width, padding.
5. Save.

The section only outputs content when the product has `custom.volume_offers` with at least one tier. Otherwise it is hidden on the storefront; in the theme editor you’ll see a dashed-border setup hint.

### Option B — Snippet (Custom Liquid block / column)

1. Copy **snippets/sl-volume-discount.liquid** into your theme’s `snippets/` folder.
2. Copy **locales/en.default.json** and **locales/ar.json** into your theme’s `locales/` (merge the `sections.sl_volume_discount` key into your existing locale files if you prefer).
3. In the theme editor, on the product template add a **Custom Liquid** block where you want the volume discount (e.g. in the product info column).
4. In the block paste the **render code** from [Render code (column snippet)](#render-code-column-snippet) above:

```liquid
{% render 'sl-volume-discount', product: product, block_id: block.id %}
```

5. Save.

---

## File structure

```
Section Lab/Volume Discount/
├── sections/
│   └── sl-volume-discount.liquid
├── snippets/
│   └── sl-volume-discount.liquid
├── locales/
│   ├── en.default.json
│   └── ar.json
└── README.md
```

---

## Localization

Translations live under `sections.sl_volume_discount` in the locale files. Keys:

- `heading` — Accordion title (e.g. "Purchase More & Save")
- `free` — "FREE" / "مجاناً"
- `per_item` — "({{ price }} per item)"
- `buy_x_get_y_free` — "Buy {{ x }} Get {{ y }} Free"
- `get_x_off` — "Get {{ x }} off {{ percent }}%"
- `off_badge` — "-{{ percent }}%"
- `buy_label` — "Buy {{ x }}"
- `get_y_free` — "Get {{ y }} Free"
- `buy_x_get_y_percent` — "Buy {{ x }} Get {{ percent }}% off"
- `base_offer` — "1 at regular price"
- `offer_details` — "Offer details" (heading in card info)
- `buy_now` — Button that scrolls to quantity + add to cart and sets tier quantity
- `no_offers` — Message when no offers (design mode / empty state)

---

## Design notes

- Cards match FBT: 220px slide width, 12px radius, 1px border, first card 2px red border.
- Swiper: `slidesPerView: 'auto'`, `spaceBetween: 5`, `loop: false`, prev/next arrows, no pagination.
- Swiper CSS/JS loaded from CDN (Swiper 11) when the section/block is near the viewport (IntersectionObserver, same approach as FBT).
- RTL: applied automatically for ar, he, fa, ur, yi locales.

## Performance & lazy loading

- **Images:** `loading="lazy"`, `decoding="async"`, responsive `srcset` (220w, 360w, 520w) with `sizes="220px"`. Cards after the first two use `fetchpriority="low"` to deprioritize off-screen images.
- **Swiper:** Loaded only when the Volume Discount section/block enters (or is within 100px of) the viewport, reducing initial page weight.
- **Buy now:** Click handler is attached on DOMContentLoaded so it works before Swiper initializes.
