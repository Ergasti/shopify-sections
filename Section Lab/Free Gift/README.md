# SL - Free Gift

Auto-adds a free gift product to the cart when the customer buys X items from a qualifying collection. **Recursive:** buy 3 → 1 gift, buy 6 → 2 gifts, buy 9 → 3 gifts, etc. Works alongside Shopify's built-in **Buy X Get Y** discount — the discount handles pricing (makes the gift free), this section handles the **automatic cart addition/removal**.

**Category:** Cart / Product / Promotional

---

## Features

- **Auto add to cart** — Gift product is automatically added when the qualifying quantity is reached
- **Auto remove from cart** — Gift is removed when the customer drops below the threshold
- **Recursive** — Every X items earns another free gift (e.g. 3 body splash = 1 razor, 6 = 2 razors)
- **Discount code auto-apply** — Applies the Shopify discount code via `/discount/CODE`
- **Progress bar** — Animated gradient fill with diagonal stripes (toggleable)
- **Gift product preview** — Shows gift image, name, and FREE badge (toggleable)
- **Toast notifications** — Slide-up toast on gift added/removed (toggleable)
- **Confetti** — Celebration confetti on unlock (toggleable)
- **Out-of-stock handling** — Shows warning banner if gift is unavailable
- **Multi-variant guard** — Shows error if gift product has more than one variant
- **Skip duplicates** — Won't add gift if already in cart at the correct quantity
- **RTL support** — Full right-to-left support for Arabic, Hebrew, Farsi, Urdu
- **Real-time updates** — Listens for cart events + intercepts fetch calls to `/cart/*`
- **Two style variants** — Clean (premium) and Urgency (high converting)
- **Hidden helper mode** — Invisible on any page (product, collection, etc.) — still auto-adds gift + toast + confetti, no visible card

---

## How it works

1. Merchant creates a **Buy X Get Y** discount in Shopify admin (e.g. "Buy 3 body splash, get 1 razor free")
2. Merchant adds this section and configures:
   - The **qualifying collection**
   - The **gift product** (must be single-variant)
   - The **buy quantity** (X)
   - The **discount code**
3. When a customer adds items from the collection:
   - Section counts qualifying items in cart (excluding the gift product itself)
   - Calculates `gifts_earned = floor(qualifying_qty / buy_qty)`
   - Auto-adds or removes gift items to match
   - Auto-applies the discount code
4. The Shopify discount makes the gift free at checkout

### Important notes

- The gift product **must have exactly one variant**. If it has multiple variants, the section shows an error.
- The gift product is **excluded from the qualifying count** (adding razors doesn't count toward more razors).
- Maximum gifts per order is controlled by the **Shopify discount settings** (not this section).
- The section uses a **mutex lock** to prevent infinite loops (auto-add triggers cart event which triggers refresh).

---

## Section install

1. Copy files into your theme:
   - `sections/sl-free-gift.liquid` → `sections/sl-free-gift.liquid`
   - `snippets/sl-free-gift.liquid` → `snippets/sl-free-gift.liquid`
2. Merge locale keys:
   - `locales/en.default.json` → your theme's `locales/en.default.json`
   - `locales/ar.json` → your theme's `locales/ar.json` (if you use Arabic)
3. In the theme editor, add **"SL - Free Gift"** to your product page, cart page, or cart drawer.
4. Configure:
   - **Qualifying collection** — the collection whose products count toward the offer
   - **Gift product** — the exact product to auto-add (single variant only)
   - **Buy quantity** — items to buy per free gift (e.g. 3 = buy 3 get 1 free)
   - **Discount code** — the Shopify discount code to auto-apply

---

## Snippet usage

Render the snippet anywhere (cart drawer, product page, etc.):

```liquid
{% render 'sl-free-gift',
  collection_handle: 'body-splash',
  collection_title:  'Body Splash',
  buy_qty:           3,
  gift_product:      all_products['razor-pack'],
  discount_code:     'BUYGIFT',
  show_progress_bar: true,
  show_gift_preview: true,
  show_confetti:     true,
  show_toast:        true,
  display_mode:      'full',
  fill_color_start:  '#4ade80',
  fill_color_end:    '#16a34a',
  style_variant:     'clean',
  section_id:        section.id
%}
```

### Snippet parameters

| Parameter | Default | Description |
|---|---|---|
| `collection_handle` | — | **(Required)** Handle of the qualifying collection. |
| `collection_title` | handle | Display name shown in messages. |
| `buy_qty` | `3` | Items to buy to earn 1 free gift. |
| `gift_product` | — | **(Required)** The gift product object. Must have exactly 1 variant. |
| `discount_code` | `''` | Shopify discount code to auto-apply. Leave empty if using automatic discount. |
| `show_progress_bar` | `true` | Show/hide the progress bar. |
| `show_gift_preview` | `true` | Show/hide the gift product image and name. |
| `show_confetti` | `true` | Show/hide confetti on unlock. |
| `show_toast` | `true` | Show/hide toast notifications. |
| `display_mode` | `full` | `full` (card + progress) or `hidden` (helper only — no visible UI, still auto-adds gift + toast + confetti). |
| `fill_color_start` | `#4ade80` | Progress bar gradient start (lighter). |
| `fill_color_end` | `#16a34a` | Progress bar gradient end (darker). |
| `style_variant` | `clean` | `clean` or `urgency`. |
| `section_id` | auto | Unique ID to scope styles. Use `section.id` to avoid clashes. |

---

## Settings reference

| Setting | Type | Default | Description |
|---|---|---|---|
| Qualifying collection | collection | — | Products that count toward X |
| Gift product | product | — | Auto-add product (single variant) |
| Buy quantity (X) | range 1-20 | 3 | Items per free gift cycle |
| Discount code | text | — | Shopify discount code |
| Display mode | select | full | Full display or Hidden helper (auto-add only) |
| Show progress bar | checkbox | on | Toggle progress bar UI |
| Show gift preview | checkbox | on | Toggle gift product card |
| Show confetti | checkbox | on | Toggle confetti celebration |
| Show toast | checkbox | on | Toggle toast notifications |
| Style variant | select | clean | Clean or Urgency |
| Max width | range 320-900 | 560 | Card max width |
| Vertical margin | range 0-60 | 16 | Top/bottom margin |
| Padding top/bottom | range 0-60 | 0 | Inner padding |
| Padding left/right | range 0-60 | 0 | Inner padding |
| Gradient start | color | #4ade80 | Bar fill start color |
| Gradient end | color | #16a34a | Bar fill end color |

---

## Edge cases

| Situation | Behavior |
|---|---|
| Gift has multiple variants | Error card shown, section disabled |
| Gift out of stock | Warning banner, gift not added |
| Gift already in cart (correct qty) | No action (skip) |
| Customer removes qualifying items | Excess gifts auto-removed |
| Gift product is in qualifying collection | Excluded from qualifying count |
| Discount code invalid/expired | Warning in console, gift still added |
| Cart race condition | Mutex lock prevents infinite loops |

---

## Localization

Both `en.default.json` and `ar.json` are included. Keys are under `sections.sl_free_gift`:

| Key | Purpose |
|---|---|
| `msg_none` | No qualifying items yet |
| `msg_progress` | Partial progress toward next gift |
| `msg_earned` | Gift(s) earned, progress toward next |
| `msg_ready` | Gift added to cart |
| `msg_all_earned` | All earned gifts in cart |
| `msg_out_of_stock` | Gift unavailable |
| `error_multi_variant` | Multi-variant product error |
| `toast_added` | Toast on gift add |
| `toast_removed` | Toast on gift remove |
| `free_badge` | Badge text on gift image |

Placeholders: `%count%` for remaining items, `%free%` for earned gifts, `%collection%` for collection name.

---

## Files

```
Section Lab/Free Gift/
├── sections/
│   └── sl-free-gift.liquid
├── snippets/
│   └── sl-free-gift.liquid
├── locales/
│   ├── en.default.json
│   └── ar.json
├── PLAN.md
└── README.md
```

No separate assets; styles and script are inline in the snippet.

---

**Last updated:** 2026-04-07
