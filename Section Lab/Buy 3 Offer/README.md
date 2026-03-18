# SL - Buy 3 Offer

Product-page promo card that highlights a fixed offer (default: **Buy 3 for 299** instead of **750**) and **tracks how many of that product are already in the cart**, showing:

- **Add X more** to unlock the offer
- **Save Y** (regular total − offer price)
- **Progress bar** (same card/track styling approach as the SL Free Shipping Progress Bar)

**Category:** Product / Promotional

---

## How it works

- The offer is tied to a **collection** (qualifying collection).
- On load and on cart changes:
  - it loads the qualifying collection product IDs from ` /collections/<handle>/products.json ` (cached), then
  - it fetches ` /cart.js ` and sums cart quantities for items whose `product_id` is in that collection.
- It calculates:
  - Remaining items \(X = \max(0, \text{offer\_qty} - \text{qty\_in\_cart})\)
  - Savings \(Y = \max(0, \text{regular\_total} - \text{offer\_price})\)
  - Progress \(= \min(100, \text{qty} / \text{offer\_qty} \times 100)\)

---

## Install

1. Copy files into your theme:
   - `sections/sl-buy-3-offer.liquid` → `sections/sl-buy-3-offer.liquid` (optional if you want it as a section)
   - `snippets/sl-buy-3-offer.liquid` → `snippets/sl-buy-3-offer.liquid` (for rendering inside other sections/snippets)
2. Merge locale keys:
   - `locales/en.default.json` → your theme’s `locales/en.default.json`
   - `locales/ar.json` → your theme’s `locales/ar.json` (if you use Arabic)
3. In the theme editor, add **“SL - Buy 3 Offer”** to your **product template** (recommended).

---

## Snippet usage

Render the snippet anywhere (recommended near the product Add to Cart):

```liquid
{% render 'sl-buy-3-offer',
  collection_handle: collection.handle,
  collection_title: collection.title,
  offer_qty: 3,
  offer_price: 299,
  regular_total: 750,
  fill_color_start: '#4ade80',
  fill_color_end: '#16a34a',
  show_stripes: true,
  section_id: section.id
%}
```

### Snippet parameters

| Parameter | Default | Description |
|---|---|---|
| `collection_handle` | — | **(Required)** Handle of the qualifying collection. |
| `collection_title` | handle | Display name shown in the card heading. |
| `offer_qty` | `3` | Items to buy to unlock the deal. |
| `offer_price` | `299` | Deal price in currency units. |
| `regular_total` | `750` | Regular price for `offer_qty` items (used to calculate savings). |
| `fill_color_start` | `#4ade80` | Progress bar gradient start color. |
| `fill_color_end` | `#16a34a` | Progress bar gradient end color. |
| `show_stripes` | `true` | Show diagonal stripes on the progress bar fill. |
| `section_id` | auto | Unique ID to scope styles. Use `section.id` when rendered multiple times. |

---

## Settings

- **Offer quantity** (default: 3)
- **Offer price** (default: 299)
- **Regular total** for that quantity (default: 750)
- Card sizing/padding
- Progress bar gradient + stripes

**Last updated:** 2026-03-12

