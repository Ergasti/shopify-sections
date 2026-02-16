# SL Sales Nudge Widget (Section Lab)

Toast-style **“social proof”** nudges: “Someone from [city] just bought [product]” with product image and “Verified Purchase · X min ago”. Uses **Toastify-js** from CDN. Shows up to 5 toasts (every 30s) or one persistent toast in preview mode. Clicking the toast goes to the product.

**Category:** Marketing / Conversion  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Product list:** Pick up to 10 products; message shows a random product and random city.
- **Cities:** Comma-separated list (e.g. Berlin, Munich, Hamburg).
- **Headline:** Custom text (e.g. “Someone just made a purchase!”).
- **Preview mode:** One toast that stays open (for editing); when off, toasts auto-close and repeat.
- **Styling:** Headline/text/highlight sizes and colors, background, border, shadow, position (top/bottom, left/center/right), max width, padding, close button.

## Requirements

- **Toastify-js** is loaded from CDN (`cdn.jsdelivr.net/npm/toastify-js`). The section includes the script and CSS; no theme changes needed unless you want to self-host.

## Translations & RTL (Arabic, etc.)

The widget supports translations and RTL. Copy the `locales/` folder into your theme and merge with existing locale files:

- `locales/en.default.json` — English
- `locales/ar.json` — Arabic

**Keys:** `sections.sl_nudges.nudge_message` (format: `Someone from {{ city }} just bought {{ product }}`), `sections.sl_nudges.verified_purchase` (format: `Verified Purchase · {{ count }} min ago`).

RTL (Arabic, Hebrew, etc.) is applied automatically: toast flips layout and position.

---

## Installation

1. Copy `sections/sl-nudges-widget.liquid` to your theme **sections** folder.
2. In Theme Editor, add the **SL Sales Nudge Widget** section (can be at the bottom of the theme so it loads; the toast is injected by Toastify).
3. Set **Products** (required), **City names** (comma separated), **Headline text**, and optional **Preview mode** for editing. Adjust position and styles as needed.

## Cookie

The script checks for a cookie to stop showing nudges (e.g. after the user closes one). The section does not set that cookie by default; you can add an `onClose` or close-button handler that sets it if your Toastify version supports it.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
