# SL - Free Shipping Progress Bar

Cart free-shipping threshold progress bar with animated fill, truck emoji, tiered messages, and optional full-page confetti. Uses cart total (and theme/shop currency) and updates in real time when the cart changes.

**Category:** Cart / Promotional

---

## Features

- **Progress bar** — gradient fill (customizable colors), optional diagonal stripes (default on), track style similar to Scarcity Bar
- **Truck emoji** — 🚚 above the bar (bouncing over it) and next to the message
- **Tiered messages** — e.g. “Almost there!”, “You’re getting close!”, “Add %amount% more…”, “Free shipping when you spend %amount% more” based on remaining amount
- **Real-time updates** — listens for cart events and intercepts `/cart/add`, `/cart/change`, `/cart/update`, `/cart/clear` to refresh the bar
- **Currency** — uses store/cart currency for amounts (Shopify format or Intl/fallback)
- **Confetti** — optional full-page confetti (e.g. @hiseb/confetti) on add-to-cart and when free shipping is reached (including on reload)
- **Theme primary** — progress bar gradient can use custom colors or default green

---

## Progress bar colors (gradient)

The fill is a **gradient from a start color to an end color**. Both are optional and default to green.

| Parameter / Setting       | Default   | Description |
|---------------------------|-----------|-------------|
| `fill_color_start`        | `#4ade80` | Lighter end of the bar (left). Omit to use default green. |
| `fill_color_end`          | `#16a34a` | Darker / primary end (right). Omit to use default green; can match theme primary. |

- **No colors set** → gradient is `#4ade80` → `#16a34a` (default green).
- **Only start set** → gradient from your color to default green (`#16a34a`).
- **Both set** → gradient from start to end (e.g. your brand color → theme primary).

In the **section**, use **Progress bar gradient start** and **Progress bar gradient end** in the theme editor. When using the **snippet** only, pass `fill_color_start` and/or `fill_color_end` in the `render` call.

---

## Section usage

1. Copy `sections/sl-free-shipping-progress-bar.liquid` and `snippets/sl-free-shipping-progress-bar.liquid` into your theme.
2. In the theme editor, add the section **“SL - Free Shipping Progress Bar”** to the cart template (or page/product where the cart is available).
3. Configure:
   - **Free shipping threshold** (e.g. 50 = $50)
   - **Success message** and **Progress message** (use `%amount%` for remaining amount)
   - **Tiered messages** (optional) for “Almost there”, “Getting close”, etc.
   - **Progress bar gradient start** / **Progress bar gradient end** (optional; default to green)
   - **Show diagonal stripes on bar** (default: on) — uncheck to hide stripes
   - **Hide when cart is empty**, layout, padding, etc.

The bar appears when the cart has items (unless you turn off “Hide when cart is empty”) and updates as the cart changes.

---

## Snippet usage

Use the snippet when you need the bar inside another section or a custom layout.

Example — Arabic (Egyptian), threshold 650:

```liquid
{% render 'sl-free-shipping-progress-bar',
  threshold_amount: 650,
  success_message: "مبروك! وصلتي للشحن المجاني 🎉",
  progress_message_template: "فاضل %amount% بس ويوصلك الشحن المجاني",
  hide_when_cart_empty: true,
  fill_color_start: "#4ade80",
  fill_color_end: "#16a34a",
  show_stripes: true,
  tier_message_almost: "قربتي جدًا! فاضل %amount% بس للشحن المجاني",
  tier_message_close: "قربتي! زودي منتجات بـ %amount% وخدي الشحن مجانًا",
  tier_message_mid: "فاضل %amount% ويوصلك الشحن المجاني",
  tier_message_far: "ضيفي منتجات بـ %amount% عشان تحصلي على الشحن المجاني"
%}
```

English Example:
```liquid
{% render 'sl-free-shipping-progress-bar',
  threshold_amount: 50,
  success_message: "You've unlocked free shipping!",
  progress_message_template: "Add %amount% more for free shipping",
  hide_when_cart_empty: true,
  fill_color_start: "#4ade80",
  fill_color_end: "#16a34a",
  show_stripes: true
%}
```

### Snippet parameters

| Parameter                    | Default                          | Description |
|-----------------------------|----------------------------------|-------------|
| `threshold_amount`          | — (required)                     | Free shipping threshold in store currency units (e.g. 50 = $50). |
| `success_message`           | "You've unlocked free shipping!" | Shown when threshold is reached. |
| `progress_message_template` | "Add %amount% more for free shipping" | Progress message; use `%amount%` for remaining amount. |
| `hide_when_cart_empty`      | `true`                           | Hide the bar when the cart has no items. |
| `fill_color_start`          | `#4ade80`                        | Progress bar gradient start (lighter). Omit for default green. |
| `fill_color_end`            | `#16a34a`                        | Progress bar gradient end (darker/primary). Omit for default green. |
| `show_stripes`              | `true`                           | Show diagonal stripes on the fill. Set to `false` to hide. |
| `tier_message_almost`       | —                                | Message when &lt; $10 away (optional). |
| `tier_message_close`        | —                                | Message when &lt; $30 away (optional). |
| `tier_message_mid`          | —                                | Message when &lt; $50 away (optional). |
| `tier_message_far`          | —                                | Message when further away (optional). |

Tier messages override the main progress message when the remaining amount falls in the tier range. Use `%amount%` in tier messages for the remaining amount.

---

## Adding the bar to the minicart (cart drawer)

To show the free shipping progress bar inside your theme’s minicart (slide-out cart drawer):

1. **Locate the cart drawer in your theme**  
   Open the section that renders the minicart. It’s usually named something like:
   - `sections/cart-drawer.liquid`
   - `sections/main-cart-drawer.liquid`

2. **Place the snippet inside the drawer**  
   Add the snippet where you want the bar to appear (e.g. **above the cart items**, right after the drawer header or “Your cart” title):

   ```liquid
   {% comment %} Free shipping progress bar in minicart {% endcomment %}
   {% render 'sl-free-shipping-progress-bar',
     threshold_amount: 50,
     success_message: "You've unlocked free shipping!",
     progress_message_template: "Add %amount% more for free shipping",
     hide_when_cart_empty: true,
     fill_color_start: "#4ade80",
     fill_color_end: "#16a34a",
     show_stripes: true
   %}
   ```

   Adjust `threshold_amount` (e.g. `50` for $50) and the messages/colors to match your store.

3. **Ensure the cart drawer is re-rendered on cart updates**  
   When customers add, change, or remove items, the theme usually re-renders the cart drawer via the Section Rendering API (e.g. `sections=cart-drawer,cart-icon-bubble`). Because the progress bar lives inside the cart drawer section and uses `cart.total_price`, it will show the correct total whenever the drawer is re-rendered. The snippet’s JavaScript also listens for cart events and fetches `/cart.js` after add/change/update/clear, so the bar updates in real time even when the drawer HTML is already on the page.

No extra configuration is needed: once the snippet is inside the cart drawer section, the bar appears in the minicart and stays in sync with the cart.

---

## Files

- `sections/sl-free-shipping-progress-bar.liquid` — Section schema and render of the snippet
- `snippets/sl-free-shipping-progress-bar.liquid` — Bar markup, styles, and script (cart logic, confetti, tier messages)

No separate assets; styles and script are inline in the snippet.

**Last updated:** 2026-02-28
