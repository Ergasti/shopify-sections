# SL Price Bubble Widget (Section Lab)

Small “price bubble” widget (e.g. “Only 0.27€ per day”) with optional icon, tail (up/down/none), and full style control. Good for product pages or anywhere you want a compact price message.

**Category:** Product / Conversion  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- Text, optional icon image, alignment (desktop/mobile), tail direction (none/up/down).
- Style: padding, background color, text color, font size, icon size, border radius, border color/width (border not compatible with tail).
- Section Lab preset: “SL Price Bubble Widget” under Text.

## Installation

1. Copy `sections/sl-price-bubble.liquid` to your theme **sections** folder.
2. In Theme Editor, add the **SL Price Bubble Widget** section where you want the bubble (e.g. above product, in a column, or on product template).
3. Set **Text**, optional **Icon image**, alignment, tail, and style in the section settings.

## Showing the bubble inside product information (Custom Liquid)

To show the **same** bubble under the product price (or elsewhere in the product info column):

1. **Add the section on the product page**  
   In Theme Editor → Product template, add the **SL Price Bubble Widget** section somewhere (e.g. above or below the main product block). Configure text and style. The section can be hidden visually if you only want the bubble under the price (e.g. move it to the bottom of the template or use a minimal spacer). It **must** be on the same product template so the script can find it.
2. **Add a Custom Liquid block** where you want the bubble (e.g. right under the price block).
3. **Paste exactly this** into the Custom Liquid block (both the `div` and the `script` are required — the script copies the bubble into the div):

```liquid
<div id="sl-price-bubble-render"></div>
<script>
  (function() {
    var source = document.querySelector('[id^="sl-price-bubble-"]');
    var target = document.getElementById("sl-price-bubble-render");
    if (source && target) target.innerHTML = source.innerHTML;
  })();
</script>
```

- **Don’t** paste only the bubble HTML: the bubble is rendered by the section; the script copies it into `#sl-price-bubble-render`.
- Use **one** Price Bubble section on the product page when using this inject.

## Section full width

The bubble wrapper uses `width: fit-content` so the section only takes the width of the bubble, not the full row. Alignment (left/center/right) is controlled in the section settings.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
