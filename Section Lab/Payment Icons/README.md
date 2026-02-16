# SL Payment Icons (Section Lab)

Displays **payment method icons** (SVG) in a styled box. Uses the store’s enabled payment types by default, or a custom comma-separated list (e.g. visa, master, apple_pay). Optional heading. Can be placed anywhere or injected into product info via Custom Liquid.

**Category:** Product / Trust  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Content:** Optional heading (richtext), custom payment icons (text field) or auto from `shop.enabled_payment_types`.
- **Layout:** Text alignment and icon alignment (left / center / right).
- **Style:** Background color, border radius, border color and width.

Uses Shopify’s `payment_type_svg_tag` filter to output payment type SVGs.

## Installation

1. Copy `sections/sl-payment-icons.liquid` into your theme **sections** folder.
2. In the Theme Editor, add the **SL Payment Icons** section and optionally set a heading and custom payment list (or leave blank for all enabled methods).

## Showing the icons inside product information (Custom Liquid)

To show the same block inside the product form/info area:

1. Add the **SL Payment Icons** section somewhere on the product template (e.g. below the product form).
2. In the product template, add a **Custom Liquid** block where you want the icons (e.g. in the product information column).
3. Paste this into the Custom Liquid block:

```liquid
<div id="sl-payment-icons-render"></div>
<script>
  (function() {
    var source = document.querySelector('[id^="sl-payment-icons-"]');
    var target = document.getElementById("sl-payment-icons-render");
    if (source && target) target.innerHTML = source.innerHTML;
  })();
</script>
```

Use **one** Payment Icons section on the product page when using this inject so the script finds the correct block.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
