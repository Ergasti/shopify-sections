# Marquee Products Section

Horizontal scrolling marquee that displays product cards. Supports optional dynamic prices via external API, image placeholder, and pause-on-hover.

**Category:** Carousels & Sliders  
**Source:** [bstroshek/marquee-section](https://github.com/bstroshek/marquee-section)  
**Last updated in library:** 2025-02-14

## Features

- Horizontally scrolling product marquee
- Blocks configurable in Theme Editor (image, title, description, optional API product ID)
- Image placeholder when no image is set
- Responsive; animation pauses on hover
- Optional: dynamic prices via [FakeStoreAPI](https://fakestoreapi.com/) (requires custom JS)

## Demo

Live preview: https://marquee-products.myshopify.com/ (password: yawngu)

## Installation

1. Copy `sections/marquee-products.liquid` to your theme **sections** folder.
2. Copy `snippets/image-placeholder.liquid` to your theme **snippets** folder.
3. Copy `assets/marquee-products.css` to your theme **assets** folder.
4. In the section liquid, add before `</head>` or in theme.liquid:
   - `{{ 'marquee-products.css' | asset_url | stylesheet_tag }}`
5. In Theme Editor, add the “Marquee Products” section and configure blocks.

## License

MIT (see source repo).
