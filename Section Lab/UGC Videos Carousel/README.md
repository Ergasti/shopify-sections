# SL - UGC Videos Carousel


Portrait **UGC-style video carousel** (Swiper): each block pairs a video with a **related product** — product image, name, star rating, price, compare-at price, and an **Add to cart** button. Clicking a card opens a **full-screen overlay** with the video (autoplay, controls) and the same product CTA.

**Related:** [SL - UGC Videos Homepage](../UGC%20Videos%20Homepage/README.md) pulls videos from product **metafields** instead of manual blocks.

**Category:** Media  
**Source:** Section Lab (this repo)

**Last updated:** 2026-03-30

---

## Features

- **Blocks:** Each block = one hosted video + one related product (optional rating/review count overrides).
- **Product strip:** Product photo, title, 5-star SVG, price/compare-at, Add to cart button — overlaps the video card bottom.
- **AJAX Add to Cart:** Cart adds without page reload; updates cart count and dispatches `cart:refresh`.
- **Overlay:** Full video with controls + product info and Add to cart CTA. Close via button, backdrop click, or Escape.
- **Swiper:** Prev/next arrows; configurable slides per view and gap; optional max slides.
- **RTL:** Supported for Arabic and similar locales.
- **Lazy loading:** Swiper and in-viewport init via `IntersectionObserver`; card videos use `data-src` + `preload="none"`.
- **Edge cases:** If a block has no product selected, the product strip is hidden (video-only card). If product is out of stock, the CTA shows "Sold out" and is disabled.

---

## Installation (theme)

1. Copy `sections/sl-ugc-videos-carousel.liquid` into your theme's `sections/` folder.
2. Merge `locales/en.default.json` and `locales/ar.json` into your theme's `locales/` folder (merge the `sections.sl_ugc_carousel` object under `sections`).
3. In the **theme editor**, open the template you want → **Add section** → **SL - UGC Videos Carousel**.
4. Add **Video + product** blocks. For each block, upload/select a video and pick a related product.

---

## Migration from v1 (video-only)

> **Breaking change:** The block type changed from `video` to `video_product`, and the `caption` setting was removed.

If you had the previous video-only version installed:

1. Replace `sections/sl-ugc-videos-carousel.liquid` with the new file.
2. Merge the new locale keys (`reviews`, `add_to_cart`, `adding`, `added`, `sold_out`, `view_product`) into your theme locales.
3. In the theme editor, remove old "Video" blocks and add new "Video + product" blocks (the old block type will no longer appear).

---

## Shopify app: Theme App Extension

To ship this UI inside a **Shopify app**, use a **Theme App Extension** ([Theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/build)).

### App block (recommended for this carousel)

[App blocks](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-blocks-for-themes) render inline in the storefront. Set `"target": "section"` in the block's `{% schema %}` so merchants can add your block from the theme editor.

1. In your app, create or open a theme app extension (`shopify.extension.toml` with `type = "theme"`).
2. Copy the Liquid from `sl-ugc-videos-carousel.liquid` into `extensions/<your-extension>/blocks/` (e.g. `ugc-videos-carousel.liquid`).
3. Change the top-level `{% schema %}` for an **app block**:
   - Add `"target": "section"`.
   - Optionally set `"enabled_on": { "templates": ["index", "page", "collection", "product"] }`.
4. Copy the same locale keys into the extension's `locales/`.
5. Deploy: `shopify app deploy`. After install, the merchant enables the block in **Customize theme**.

### App embed (different use case)

[App embed blocks](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-embed-blocks) use `"target": "head"` or `"body"` and are meant for **global** scripts or **floating** UI — not structured page sections. Use an **app block** for this carousel.

---

## File structure

```
Section Lab/UGC Videos Carousel/
├── sections/
│   └── sl-ugc-videos-carousel.liquid
├── locales/
│   ├── en.default.json
│   └── ar.json
└── README.md
```

---

## Localization

| Key | Purpose |
|-----|---------|
| `sections.sl_ugc_carousel.close_video` | Overlay close control (accessibility). |
| `sections.sl_ugc_carousel.loading` | Shown while the overlay video loads. |
| `sections.sl_ugc_carousel.reviews` | Label appended to review count (e.g. "421 reviews"). |
| `sections.sl_ugc_carousel.add_to_cart` | Default CTA button text. |
| `sections.sl_ugc_carousel.adding` | Button text while AJAX add is in progress. |
| `sections.sl_ugc_carousel.added` | Button text after successful add. |
| `sections.sl_ugc_carousel.sold_out` | CTA text when product is unavailable. |
| `sections.sl_ugc_carousel.view_product` | Accessibility label for product link in overlay. |

---

## License

Same as the parent [Shopify Sections Library](../../README.md) (this repo).
