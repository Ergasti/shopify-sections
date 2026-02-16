# SL Delivery Countdown (Section Lab)

Shows **estimated delivery** (day and date range) and a **countdown** to the order cutoff (e.g. "order before X H Y M"). Optional status dot with pulse. Can be placed on the product template or injected into product info via Custom Liquid.

**Category:** Promotional / Product  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Time:** Cutoff hour (0–23), min/max delivery days (1–10), delivery days of week (checkboxes).
- **Style:** Padding, background, border (radius, width, color), dot and pulse colors for "available" and "unavailable".

Section is restricted to **product** template in the schema; remove or change `templates` in the schema if you want it on other templates.

## Installation

1. Copy `sections/sl-delivery-countdown.liquid` into your theme **sections** folder.
2. In the Theme Editor, open a **product** template and add the **SL Delivery Countdown** section where you want it.
3. Configure cutoff time, delivery days range, delivery days of week, and styling.

## Showing the countdown inside product information (Custom Liquid)

To show the same countdown inside the product form/info area:

1. Add the **SL Delivery Countdown** section somewhere on the product template (e.g. above the product form).
2. In the product template, add a **Custom Liquid** block where you want the countdown (e.g. in the product information column).
3. Paste this into the Custom Liquid block:

```liquid
<div id="sl-estimated-delivery-render"></div>
<script>
  (function() {
    var source = document.querySelector('[id^="sl-estimated-delivery-"]');
    var target = document.getElementById("sl-estimated-delivery-render");
    if (source && target) target.innerHTML = source.innerHTML;
  })();
</script>
```

Use **one** Delivery Countdown section on the product page when using this inject. The inject copies the section's HTML; the countdown script runs in the original section and updates only those elements, so the **injected copy will not update** (one-time snapshot). For a **live** countdown inside product info, add the **SL Delivery Countdown** section directly in that area in the theme editor instead of using the inject.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
