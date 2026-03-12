# SL - Stacked Offers

One compact promo card that shows **two stacked incentives** at the same time:

1. **Repeating bundle deal** by qualifying collection quantity  
   Example: **3 for 299** (instead of 750). If the customer adds **6** items from the collection, they unlock **2** deals.
2. **Free delivery threshold** by cart total  
   Example: free delivery at **650** (currency units). This is independent from the bundle and can unlock later (e.g. on the 7th item).

**Category:** Cart / Product / Promotional

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

- `collection_handle` (required)
- `collection_title` (recommended)
- `show_total_saved` (default: true) — show/hide the “Total saved” row.
- `offer_qty` (default: 3)
- `offer_price` (default: 299)
- `regular_total` (default: 750)
- `free_shipping_threshold_amount` (default: 650)
- `section_id` (recommended)

**Last updated:** 2026-03-12

