# Vogue theme edits

Theme-specific snippets and section overrides for the **Vogue** theme. Copy into your theme and replace the originals as needed.

## Locales

**`locales/en.default.json`** and **`locales/ar.json`** provide translations for the product card add-to-cart snippet:

| Key | en.default | ar |
|-----|------------|-----|
| `product.general.add_to_cart_button` | Add to cart | أضف إلى السلة |
| `product.general.adding` | Adding... | جاري الإضافة... |
| `product.general.choose_options` | Choose options | اختر الخيارات |
| `product.general.sold_out` | Sold out | نفذت الكمية |

**Install:** Merge these keys into your theme’s existing locale files under `locales/` (e.g. add or overwrite the `product.general` entries). If your theme already defines these keys, you can skip or adjust as needed.

## Sections

### `sections/collection-list.liquid`

**Extended collection list section** with extra settings for card and button styling:

- **Card styling:** Corner radius (0–32px), optional border, shadow (none / subtle / medium / strong), gap between cards, content padding.
- **Button:** Size (small / medium / large), corner radius (0–24px), full width toggle.
- **Block:** Content position (button location) unchanged; uses theme `content_position` for placement (top/middle/bottom, left/center/right).

**Install:** In your Vogue theme, add this file under **Sections** (e.g. as `collection-list.liquid`) or replace the theme’s collection list section if it uses the same schema structure. If your theme names the section differently (e.g. `main-collection-list`), rename the file to match so the section stays available where the theme expects it.

**Last updated:** 2026-03-07

---

## Snippets

### `snippets/product-card.liquid`

**Edits (Yves Rocher–style collection product card):**
- **`original-price`** attribute on `<product-card>` (compare_at_price or price) for compatibility with price/sale styling.
- **Quick-add button:** Plus icon on mobile; “Add” text (or theme translation) on desktop; circular button, bottom-right, white background and shadow.
- **Layout classes:** `product-card--yves-rocher`, `wd-product-card-main-info`, `wd-product-card-title-price` for centered title/price layout.
- **Secondary image:** Hover transition for secondary image (opacity) via CSS.

**Install:** Replace your theme’s `snippets/product-card.liquid` with this file. All existing variables (e.g. `show_badges`, `show_rating`, `show_vendor`, `show_quick_buy`, `show_secondary_image`, `stacked`, `reveal`, `position`) and behaviour (badges, price-list, rating, swatches, quick-buy modal for multi-variant) are unchanged.

**Source:** Vogue theme (this repo: theme edit for Yves Rocher–style card).  
**Last updated:** 2026-03-07

---

### `snippets/product-card-add-to-cart.liquid`

**Variant product card with “Add to cart” animation:**
- Button **always shows “Add to cart”** text (no icon-only). When product is sold out, button is disabled and shows **“Sold out”** (translatable).
- On submit, button switches to **“Adding...”** with a spinner while the item is added; then resets when the cart drawer opens or after a short timeout.
- Same supported variables as `product-card`; use where you want this behaviour:  
  `{% render 'product-card-add-to-cart', product: product, first_card: forloop.first %}`

**Locales:** Copy the entries from `theme edits/Vogue/locales/en.default.json` (and `ar.json` if you use Arabic) into your theme’s locale files so the button and “Adding...” label are translated. Keys: `product.general.add_to_cart_button`, `product.general.adding`, `product.general.choose_options`, `product.general.sold_out`.

**Section settings:** The snippet uses styling from the section that renders it. Add the settings from `schema-settings/product-card-add-to-cart-settings.json` to your collection section schema to control card radius, padding, border, shadow, button colors/size/radius and full width in the theme editor.

**Last updated:** 2026-03-07

---

### `snippets/product-gallery.liquid`

**Edits:**
- **Sticky on desktop:** On desktop (min-width: 1000px), the product gallery (main images + thumbnails) stays in view and scrolls with you.
- **Curved corners:** Gallery media and thumbnails use rounded corners (12px radius) to match the Section Lab Frequently Bought Together card style.

**Install:**

1. In your Vogue theme, go to **Theme** → **Edit code**.
2. Under **Snippets**, replace (or rename the original and add this file) `product-gallery.liquid` with the contents of `theme edits/Vogue/snippets/product-gallery.liquid`.
3. Optional: if your theme uses a CSS variable for the header height, ensure `--header-height` is set (e.g. in your theme’s base CSS or layout). The sticky `top` value uses `var(--header-height, 1.5rem)` so it can align below the header.
4. The gallery uses `z-index: 50` so it stays above a sticky add-to-cart bar when scrolling. If your theme's sticky bar uses a higher z-index and still covers the gallery, increase the value in the snippet's `<style>` block (e.g. to `101`).

**Source:** Vogue theme (this repo: theme edit with sticky behavior).  
**Last updated:** 2026-03-07
