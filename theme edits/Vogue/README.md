# Vogue theme edits

Theme-specific snippets and section overrides for the **Vogue** theme. Copy into your theme and replace the originals as needed.

## Snippets

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
**Last updated:** 2025-03-06
