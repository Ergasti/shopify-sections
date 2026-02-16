# SL Face Proof Bubble (Section Lab)

Overlapping **circular images** (up to 3) with optional **verification badge** on the last image, plus **richtext**. Use as a standalone section or inject into product info via Custom Liquid.

**Category:** Product / Marketing  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Content:** Richtext, optional verification badge (checkbox + color), box background color.
- **Images:** Up to 3 image pickers, each with border color and border width.
- **Layout:** Desktop and mobile alignment (left/center/right), spacing (top, bottom, sides).
- **Style:** Font size, image size (16–128px), box border (color, width, radius).

## Installation

1. Copy `sections/sl-face-proof-bubble.liquid` into your theme **sections** folder.
2. In the Theme Editor, add the **SL Face Proof Bubble** section and set images, text, and styling.

## Showing the bubble inside product information (Custom Liquid)

To show the same block inside the product form/info area:

1. Add the **SL Face Proof Bubble** section somewhere on the product template (e.g. above the product form).
2. In the product template, add a **Custom Liquid** block where you want the bubble (e.g. in the product information column).
3. Paste this into the Custom Liquid block:

```liquid
<div id="sl-face-proof-bubble-render"></div>
<script>
  (function() {
    var source = document.querySelector('[id^="sl-face-proof-bubble-"]');
    var target = document.getElementById("sl-face-proof-bubble-render");
    if (source && target) target.innerHTML = source.innerHTML;
  })();
</script>
```

Use **one** Face Proof Bubble section on the product page when using this inject so the script finds the correct block.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
