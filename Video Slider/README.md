# Video Slider Section

Horizontal video slider with Swiper.js: multiple MP4 videos per block, optional autoplay, prev/next buttons, and pagination dots. Section title, heading size/alignment, spacing, and padding/margin are configurable in the Theme Editor.

**Category:** Video  
**Source:** [Meetanshi – How to Add a Video Slider in Shopify](https://meetanshi.com/blog/add-video-slider-shopify/)  
**Last updated in library:** 2025-02-14

## Features

- Up to 10 video blocks; each block: Video URL (MP4), optional Autoplay (muted, loop).
- Section title with H1/H2/H3 and left/center/right alignment.
- Space between videos, padding top/bottom, margin top/bottom (range settings).
- Three slides visible at once (desktop); loop, navigation arrows, clickable pagination.
- Inline styles; script checks for Swiper before initializing.

## Requirements

**Swiper.js** must be loaded in your theme (e.g. in `theme.liquid`):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

Or use your theme’s asset pipeline if you bundle Swiper.

## Installation

1. Copy `sections/videoslider.liquid` to your theme **sections** folder.
2. Ensure Swiper CSS and JS are loaded (see above).
3. In Theme Editor, add the **Video Slider** section.
4. Add Video blocks and set **Video URL (MP4)** (e.g. from Content > Files) and optionally enable **Autoplay**.

## Responsive note

The section uses `slidesPerView: 3`. For different breakpoints (e.g. 1 slide on mobile, 2 on tablet), extend the Swiper config in the script with a `breakpoints` object.

## License

Code adapted from Meetanshi blog tutorial. Use per your theme license.
