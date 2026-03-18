# SL - Buy 2 Get 1

A compact promo card that markets a **Buy X Get 1 Free** offer with a live cart progress bar. Optionally stacks a **free delivery threshold** row below it.

1. **Buy 2 Get 1 Free** — tracks qualifying items from a chosen collection.
   For every `offer_qty` items added (default: 2), **1 free item is unlocked**.
   Supports multiple redemptions: add 4 → 2 free, add 6 → 3 free, etc.
2. **Free delivery threshold** *(optional)* — shown only when a threshold > 0 is set.

**Category:** Cart / Product / Promotional

**Files in this folder:**
- `sections/sl-buy2get1.liquid` — Shopify section with theme editor settings.
- `snippets/sl-buy2get1.liquid` — Snippet version, render from any template.
- `snippets/sl-product-card-b2g1-label.liquid` — "BUY 2 GET 1 FREE" badge for product card images.
- `locales/en.default.json`, `locales/ar.json` — Translation strings.

---

## How it works

- Loads qualifying product IDs for the configured collection from `/collections/<handle>/products.json` (cached per page session).
- Fetches `/cart.js` and sums cart quantities for items whose `product_id` belongs to the collection.
- Calculates using a **cycle model**:
  - `cycle = offer_qty + 1` (e.g. 3 for Buy 2 Get 1)
  - `free_earned = floor(qty / cycle)` — complete cycles (free items earned)
  - `remainder = qty % cycle` — position within the current cycle
  - Progress bar fills as `remainder / offer_qty × 100%`, capping at 100% when the free item is ready
- Fires **confetti + toast** when a free item is unlocked or free delivery is reached.
- Listens to `cart:refresh`, `cart:change`, `cart:updated`, `product:added` events and intercepts `fetch` calls to `/cart/add`, `/cart/change`, `/cart/update`, `/cart/clear` for instant updates.

> **Note:** This section shows the offer UI only. To actually apply the discount, configure a Shopify **automatic discount** (Buy X Get Y) or use a discount app.

---

## Section install

1. Copy `sections/sl-buy2get1.liquid` into your theme's `sections/` folder.
2. Merge locale keys into your theme locales:
   - `locales/en.default.json`
   - `locales/ar.json` (if you support Arabic)
3. In the theme editor, add **"SL - Buy 2 Get 1"** to the product page, cart page, or any template.
4. Configure settings:
   - **Qualifying collection** — products that count toward the offer.
   - **Buy quantity** — number of items to buy (default: 2).
   - **Free item value** *(optional)* — shows savings when free items are earned.
   - **Free delivery threshold** *(optional, 0 = hidden)* — currency units (e.g. 500 = 500 EGP).
   - **Style variant** — Clean or Urgency (adds pulsing badge + countdown timer).

---

## Snippet usage

```liquid
{% render 'sl-buy2get1',
  collection_handle:              collection.handle,
  collection_title:               collection.title,
  offer_qty:                      2,
  free_item_value:                199,
  free_shipping_threshold_amount: 500,
  section_id:                     section.id
%}
```

### Snippet parameters

| Parameter | Default | Description |
|---|---|---|
| `collection_handle` | — | **(Required)** Handle of the qualifying collection. |
| `collection_title` | handle | Display name shown above the headline. |
| `offer_qty` | `2` | Items to buy to earn 1 free (e.g. 2 = Buy 2 Get 1). |
| `free_item_value` | `0` | Value of the free item in currency units. Set to 0 to hide savings. |
| `free_shipping_threshold_amount` | `0` | Cart total threshold for free delivery. Set to 0 to hide the shipping row. |
| `fill_color_start` | `#fb923c` | Progress bar gradient start color. |
| `fill_color_end` | `#ea580c` | Progress bar gradient end color. |
| `style_variant` | `clean` | `clean` or `urgency`. |
| `evergreen_timer_hours` | `6` | Countdown timer duration (urgency style only). |
| `section_id` | auto | Unique ID to scope styles. Use `section.id` to avoid clashes. |

---

## Product card label

Show a **"BUY 2 GET 1 FREE"** badge on top of product card images (e.g. on collection pages).

### Install

1. Copy `snippets/sl-product-card-b2g1-label.liquid` into your theme's `snippets/` folder.
2. Merge the `offer_label` key from `locales/en.default.json` (and `ar.json`) into your theme locales.
3. In your theme's product card snippet (e.g. `snippets/card-product.liquid`), inside `card__media` at the **top** (before the image), add:

```liquid
{% render 'sl-product-card-b2g1-label', offer_qty: 2 %}
```

### Label parameters

| Parameter | Default | Description |
|---|---|---|
| `offer_qty` | `2` | Buy quantity shown in the label text. |
| `show` | `true` | Pass `false` to conditionally hide the label. |
| `style` | `default` | `default` (with 🎁 icon) or `compact` (text only, smaller). |

The label is `position: absolute` and supports RTL locales (Arabic, Hebrew, Farsi) via `request.locale`.

---

## Style variants

| Variant | Description |
|---|---|
| `clean` | Minimal premium card with subtle border and shadow. |
| `urgency` | Glowing border, pulsing "Buy 2 Get 1 Free" badge chip, and evergreen countdown timer. |

Switch via the **Style variant** setting in the section editor, or pass `style_variant: 'urgency'` to the snippet.

---

## Localization

Both `en.default.json` and `ar.json` are included. To add another language, copy `en.default.json`, rename it (e.g. `fr.json`), and translate the `sections.sl_b2g1` keys. The `offer_label` key supports a `%qty%` placeholder.

---

**Last updated:** 2026-03-18
