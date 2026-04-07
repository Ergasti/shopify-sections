# SL - Free Gift: Implementation Plan

## Overview

A Shopify section that **automatically adds a free gift product to the cart** when the customer buys X items from a qualifying collection. Works alongside Shopify's built-in Buy X Get Y discount (which handles pricing) — this section handles the **cart addition/removal** that Shopify doesn't do automatically.

---

## Core Behavior

- **Trigger:** Quantity of items from a specific collection reaches threshold X
- **Action:** Auto-add gift product to cart + auto-apply discount code
- **Recursive:** Buy 3 get 1 free razor → buy 6 get 2 → buy 9 get 3
- **Bidirectional:** Removes gift when qualifying items drop below threshold
- **Validation:** Only works with a single-variant gift product; shows error for multi-variant
- **Skip logic:** Won't duplicate if gift already in cart at correct quantity

---

## Section Settings (Theme Editor)

| Setting | Type | Purpose |
|---------|------|---------|
| Discount code | text | The Shopify discount code to auto-apply |
| Qualifying collection | collection picker | Products that count toward X |
| Buy quantity (X) | range | Items to buy per free gift cycle |
| Gift product | product picker | The exact product to auto-add (must be single-variant) |
| Show progress bar | checkbox | Toggle progress bar UI |
| Show gift preview | checkbox | Toggle gift product image/name |
| Show confetti | checkbox | Toggle confetti on unlock |
| Show toast | checkbox | Toggle toast notification |
| Style variant | select | Clean / Urgency |
| Layout controls | range | Max width, padding, margins |
| Progress bar colors | color | Gradient start/end |

---

## File Structure

```
Section Lab/Free Gift/
├── sections/
│   └── sl-free-gift.liquid          # Section with schema + render snippet
├── snippets/
│   └── sl-free-gift.liquid          # All markup, styles, JS logic
├── locales/
│   ├── en.default.json
│   └── ar.json
└── README.md
```

---

## JS Logic Flow

```
Page Load / Cart Event
    │
    ├─ 1. Validate gift product (single variant check)
    │     └─ If multi-variant → show error, stop
    │
    ├─ 2. Fetch collection product IDs (/collections/<handle>/products.json)
    │
    ├─ 3. Fetch cart (/cart.js)
    │
    ├─ 4. Count qualifying items from collection in cart
    │     └─ EXCLUDE the gift product from qualifying count
    │
    ├─ 5. Calculate: gifts_earned = floor(qty_in_cart / buy_qty)
    │
    ├─ 6. Count gift product already in cart (by variant_id)
    │
    ├─ 7. Reconcile:
    │     ├─ gifts_earned > gifts_in_cart → POST /cart/add.js (add difference)
    │     ├─ gifts_earned < gifts_in_cart → POST /cart/change.js (reduce to earned)
    │     └─ gifts_earned == gifts_in_cart → no action
    │
    ├─ 8. Apply discount code via fetch('/discount/<CODE>') if not already applied
    │
    ├─ 9. Handle out-of-stock → show "gift out of stock" message
    │
    └─ 10. Update UI (progress bar, gift preview, toast, confetti)
```

---

## Cart Event Interception

- Listen: `cart:refresh`, `cart:change`, `cart:updated`, `product:added`
- Intercept `fetch` calls to `/cart/add`, `/cart/change`, `/cart/update`, `/cart/clear`
- Mutex lock (`_slFgReconciling`) during reconciliation to prevent infinite loops
- Debounce to avoid race conditions

---

## Edge Cases

| Case | Handling |
|------|----------|
| Gift has multiple variants | Show error message, section disabled |
| Gift out of stock | Show "gift is out of stock" message, skip add |
| Gift already in cart (manually added) | Count it toward gifted quantity |
| Customer removes qualifying items | Auto-remove excess gifts |
| Discount code invalid/expired | Show warning, still add gift product |
| Cart race condition (add triggers add) | Lock flag during reconciliation, skip nested triggers |
| Gift product is in qualifying collection | Exclude gift product_id from qualifying count |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Infinite loop: auto-add triggers cart event triggers auto-add | **HIGH** | Mutex lock + skip own fetch calls |
| `/discount/CODE` fetch may not persist in all themes | **MEDIUM** | Document fallback: use automatic discount |
| Gift product counted as qualifying item | **MEDIUM** | Exclude gift product_id from qualifying count |
| Rate limiting on `/cart/add.js` | **LOW** | Debounce, single request with quantity |
