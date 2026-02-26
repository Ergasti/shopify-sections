# Scarcity Bar

“Only **X** items left” urgency widget with an animated progress bar, optional pulsing dot, and EN/AR text. Quantity can be random (min–max) or, on product pages, use real product inventory.

**Category:** Product / Marketing  
**Source:** Custom (found on site)  
**Last updated in library:** 2025-02-14

## Features

- **Stock:** Min/max range for random quantity, or “Use product inventory on product page” (real inventory, capped by min/max).
- **Text:** Separate English and Arabic strings; locale from `document.documentElement.lang` (e.g. `ar` → Arabic).
- **Style:** Margin, font size, bar height, track/fill gradient, text color, pulse dot color. Animated stripes and pulse.

## Installation

**As a section**

1. Copy `sections/scarcity-bar.liquid` into your theme **sections** folder.
2. In the Theme Editor, add the **Scarcity Bar** section (e.g. on the product template, under price or in a column).
3. Set min/max, optional “Use product inventory”, and text (EN/AR). Adjust style if needed.

**As a Liquid block (snippet)**

1. Copy `snippets/scarcity-bar.liquid` into your theme **snippets** folder.
2. In the Theme Editor, on the product (or other) template, add a **Custom Liquid** block where you want the bar.
3. In the block, paste:

```liquid
{% render 'scarcity-bar', product: product, block_id: block.id, min_stock: 10, max_stock: 20 %}
```

Optional snippet variables (override defaults): `min_stock`, `max_stock`, `use_product_inventory` (true/false), `text_en`, `text_ar`, `margin_top`, `margin_bottom`, `font_size`, `track_height`, `track_color`, `fill_color_start`, `fill_color_end`, `text_color`, `pulse_color`. Example with real inventory and custom text:

```liquid
{% render 'scarcity-bar',
  product: product,
  block_id: block.id,
  min_stock: 5,
  max_stock: 25,
  use_product_inventory: true,
  text_en: "<span class='pulse-dot'></span> Only <strong class='scarcity-qty'></strong> left!"
%}
```

## Text markup

The English/Arabic settings accept HTML. Include exactly one element with class `scarcity-qty`; the script fills it with the number. Example:

- English: `"<span class='pulse-dot'></span> Only <strong class='scarcity-qty'></strong> items left"`
- Arabic: `"<span class='pulse-dot'></span> باقي <strong class='scarcity-qty'></strong> قطعة فقط"`

## File structure

```
Scarcity Bar/
├── sections/
│   └── scarcity-bar.liquid   ← Section (theme editor settings)
├── snippets/
│   └── scarcity-bar.liquid  ← Snippet for Custom Liquid block
└── README.md
```

## License

Use and adapt as needed. No separate license claim.
