# SL - UGC Videos Carousel (standalone)


Portrait **UGC-style video carousel** (Swiper): one video per block, optional caption. Clicking a card opens a **full-screen overlay** with the video (autoplay, controls). **No product fields, metafields, or cart UI**—use this anywhere a normal section can go.

**Related:** [SL - UGC Videos Homepage](../UGC%20Videos%20Homepage/README.md) adds a related product strip per video and product metafield sources.

**Category:** Media  
**Source:** Section Lab (this repo)

**Last updated:** 2026-03-30

---

## Features

- **Blocks:** Each block = one hosted video + optional caption.
- **Overlay:** Full video with controls; close via button, backdrop click, or Escape.
- **Swiper:** Prev/next arrows; configurable slides per view and gap; optional max slides.
- **RTL:** Supported for Arabic and similar locales.
- **Lazy loading:** Swiper and in-viewport init via `IntersectionObserver`; card videos use `data-src` + `preload="none"`.

---

## Installation (theme)

1. Copy `sections/sl-ugc-videos-carousel.liquid` into your theme’s `sections/` folder.
2. Merge `locales/en.default.json` and `locales/ar.json` into your theme’s `locales/` folder (merge the `sections.sl_ugc_carousel` object under `sections`, or copy the keys into your existing structure).
3. In the **theme editor**, open the template you want (home, page, collection, etc.) → **Add section** → **SL - UGC Videos Carousel**.
4. Add **Video** blocks and upload or select a video for each.

---

## Shopify app: Theme App Extension

To ship this UI inside a **Shopify app**, use a **Theme App Extension** ([Theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/build)).

### App block (recommended for this carousel)

[App blocks](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-blocks-for-themes) render inline in the storefront. Set `"target": "section"` in the block’s `{% schema %}` so merchants can add your block from the theme editor (often under **Apps**).

1. In your app, create or open a theme app extension (`shopify.extension.toml` with `type = "theme"`).
2. Copy the Liquid from `sl-ugc-videos-carousel.liquid` into `extensions/<your-extension>/blocks/` (e.g. `ugc-videos-carousel.liquid`).
3. Change the top-level `{% schema %}` for an **app block**:
   - Add `"target": "section"`.
   - Optionally set `"enabled_on": { "templates": ["index", "page", "collection", "product"] }` (or only the templates you support).
4. Copy the same locale keys into the extension’s `locales/` (`en.default.json`, `ar.json`, etc.).
5. Deploy: `shopify app deploy` (or your CI). After install, the merchant enables the block in **Customize theme** and places it on a template.

This matches how Shopify expects full-width, page-level UI (carousels, reviews widgets) to be delivered from apps.

### App embed (different use case)

[App embed blocks](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#app-embed-blocks) use `"target": "compliance_head"`, `"head"`, or `"body"`. They inject near the end of `<head>` or before `</body>` and are meant for **global** scripts, analytics, cookie banners, or **floating** UI—not for a structured section that should sit in the page flow with headings and slides.

- **Do not** try to cram this entire carousel into a typical app embed unless you are intentionally rendering a fixed overlay via script (unusual for this design).
- **Do** use an **app block** for the carousel; use an **app embed** only if you also need a separate global asset (e.g. shared script) and document that as optional.

### Deep link to app embeds (if you add one)

If you add a separate app embed for global assets, merchants enable it under **Theme settings → App embeds**. Shopify supports [deep links](https://shopify.dev/docs/apps/online-store/theme-app-extensions/extensions-framework#deep-linking) to open the theme editor on the app embeds panel.

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

---

## License

Same as the parent [Shopify Sections Library](../../README.md) (this repo).
