# SL Icon List (Section Lab)

Vertical **icon + text** list (product bullets style). Each block has an optional icon image and rich text. Use as a standalone section or copy its content into the product info area via Custom Liquid.

**Category:** Product / Content  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Blocks:** “Item” with **Icon image** (image picker) and **Text** (richtext).
- **Section settings:** Font size, space between icon and text, space between items, icon size, icon vertical alignment (top/center), list alignment (left/center/right).

## Installation

1. Copy `sections/sl-avatar-slider.liquid` to your theme **sections** folder.
2. In Theme Editor, add the **SL Icon List** section where you want it (e.g. on the product template above or below the product form).
3. Add **Item** blocks and set icon image and text for each.

## Showing the list inside product information (Custom Liquid)

To show the **same** list inside the product form/info area:

1. Add the **SL Icon List** section somewhere on the product template (e.g. above the product form) and add your items.
2. In the product template, add a **Custom Liquid** block where you want the list (e.g. in the product information column).
3. Paste this into the Custom Liquid block:

```liquid
<div id="sl-pdp-icon-list-render"></div>
<script>
  (function() {
    var source = document.querySelector('[id^="sl-pdp-icon-list-"]');
    var target = document.getElementById("sl-pdp-icon-list-render");
    if (source && target) target.innerHTML = source.innerHTML;
  })();
</script>
```

Use **one** Icon List section on the product page when using this inject so the script finds the correct list.

## File name

Section file is `sl-avatar-slider.liquid`; the preset name in the Theme Editor is **SL Icon List**.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
