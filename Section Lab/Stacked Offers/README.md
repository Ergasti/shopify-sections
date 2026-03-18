# SL - Stacked Offers

One compact promo card that shows **two stacked incentives** at the same time:

1. **Repeating bundle deal** by qualifying collection quantity  
   Example: **3 for 299** (instead of 750). If the customer adds **6** items from the collection, they unlock **2** deals.
2. **Free delivery threshold** by cart total  
   Example: free delivery at **650** (currency units). This is independent from the bundle and can unlock later (e.g. on the 7th item).

**Category:** Cart / Product / Promotional

**Files in this folder:**  
- `sections/sl-stacked-offers.liquid` — Section for the stacked offers card.  
- `snippets/sl-stacked-offers.liquid` — Snippet version of the same card.  
- `snippets/sl-product-card-offer-label.liquid` — “BUY 3 for 299” label for **collection/card** product images.  
- `snippets/product-media-with-offer-label.liquid` — Product **media** wrapper that shows the same label on the **product page** gallery.  
- `locales/en.default.json`, `locales/ar.json` — Translations (include `offer_label` for the label).

---

## How it works

- Loads qualifying product IDs for the configured collection from ` /collections/<handle>/products.json ` (cached).
- Fetches ` /cart.js ` and:
  - Sums cart quantities for items whose `product_id` belongs to the collection.
  - Reads `cart.total_price` for the free delivery threshold.
- Calculates:
  - `deals = floor(qty / offer_qty)` (supports multiple redemptions, e.g. 6 → 2)
  - `next_remaining = offer_qty - (qty % offer_qty)` (or `offer_qty` if exactly divisible)
  - Free delivery remaining: `threshold - cart.total_price`

---

## Section install

1. Copy `sections/sl-stacked-offers.liquid` into your theme.
2. Merge locale keys:
   - `locales/en.default.json`
   - `locales/ar.json` (if you use Arabic)
3. Add **“SL - Stacked Offers”** in the theme editor where you want it (product page or cart).

---

## Snippet usage

```liquid
{% render 'sl-stacked-offers',
  collection_handle: collection.handle,
  collection_title: collection.title,
  show_total_saved: true,
  offer_qty: 3,
  offer_price: 299,
  regular_total: 750,
  free_shipping_threshold_amount: 650,
  section_id: section.id
%}
```

### Snippet parameters

| Parameter | Default | Description |
|---|---|---|
| `collection_handle` | — | **(Required)** Handle of the qualifying collection. |
| `collection_title` | handle | Display name shown above the headline. |
| `offer_qty` | `3` | Items to buy to unlock the deal (e.g. 3 = Buy 3). |
| `offer_price` | `299` | Deal price in currency units. |
| `regular_total` | `750` | Regular price for `offer_qty` items (used to show savings). |
| `free_shipping_threshold_amount` | `0` | Cart total threshold for free delivery. Set to `0` to hide the shipping row. |
| `show_total_saved` | `true` | Show/hide the “Total saved” summary row. |
| `fill_color_start` | `#4ade80` | Progress bar gradient start color. |
| `fill_color_end` | `#16a34a` | Progress bar gradient end color. |
| `style_variant` | `clean` | `clean` or `urgency` (glowing border + pulsing badge + countdown timer). |
| `evergreen_timer_hours` | `6` | Countdown timer duration in hours (urgency style only). |
| `section_id` | auto | Unique ID to scope styles. Use `section.id` to avoid clashes when rendered multiple times. |

---

## Offer label on product cards

To show a **"BUY 3 for 299"** (or Arabic: **"اشتري 3 بـ 299"**) label on top of product cards (e.g. on collection pages):

1. Copy `snippets/sl-product-card-offer-label.liquid` into your theme's `snippets/` folder.
2. Merge the `offer_label` key from `locales/en.default.json` and `locales/ar.json` into your theme locales.
3. In your theme's product card snippet (e.g. `snippets/card-product.liquid`), inside the **card__media** div and at the **top** (before the image), add:

```liquid
{% render 'sl-product-card-offer-label', offer_qty: 3, offer_price: 299 %}
```

Optional: pass `show: false` to hide the label, or change `offer_qty` / `offer_price` to match your offer. The label is positioned absolutely on top of the card image and supports RTL (Arabic, etc.) via `request.locale`.

---

## Offer label on the product page (main image)

The same offer label can appear on the **product page** gallery (main image and all slides). Use the wrapper snippet `product-media-with-offer-label.liquid`, which wraps your theme’s product media output in a `position: relative` container and renders the label on top.

### Prerequisites

- `snippets/sl-product-card-offer-label.liquid` is in your theme.
- The `offer_label` locale key is in your theme’s `locales/en.default.json` and `locales/ar.json` (see “Offer label on product cards” above).

### Step 1: Add the wrapper snippet

Copy **`snippets/product-media-with-offer-label.liquid`** from this folder into your theme’s `snippets/` folder.

### Step 2: Use it in the product gallery

Your theme usually renders the main product image via a snippet such as `product-thumbnail`, which in turn calls `product-media`. You can either replace `product-media` or switch the render to the new snippet.

**Option A — Replace `product-media` (label on every gallery slide)**

1. In your theme, back up `snippets/product-media.liquid`.
2. Replace the contents of `snippets/product-media.liquid` with the contents of `product-media-with-offer-label.liquid`.
3. No other file changes needed. The label will show on all product media (images, video posters, 3D) in the main gallery.

**Option B — Use the new snippet only where you want the label**

1. Find where your theme renders the product media (often inside `snippets/product-thumbnail.liquid` or the main product section).
2. Change the render from `product-media` to `product-media-with-offer-label` and pass the offer options. Example:

```liquid
{% render 'product-media-with-offer-label',
  media: media,
  loop: section.settings.enable_video_looping,
  variant_image: variant_image,
  show_offer_label: true,
  offer_qty: 3,
  offer_price: 299
%}
```

3. Repeat for every place you want the label (e.g. each `render 'product-media'` in the gallery).

### Parameters (product page snippet)

| Parameter          | Default | Description                                      |
|--------------------|--------|--------------------------------------------------|
| `show_offer_label` | `true` | Set to `false` to hide the label on this media.  |
| `offer_qty`        | `3`    | Quantity in the offer (e.g. “BUY 3 for”).        |
| `offer_price`      | `299`  | Price in currency units (e.g. 299).              |

All other parameters are the same as your theme’s `product-media` snippet (`media`, `loop`, `variant_image`, etc.).

To hide the label only on the product page, pass `show_offer_label: false` when rendering. The label does not affect layout; it is absolutely positioned over the media.

**Last updated:** 2026-03-18

