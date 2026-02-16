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
2. Copy `snippets/sl-price-bubble.liquid` to your theme **snippets** folder (required for block usage).
3. Optionally copy `sections/sl-price-bubble-blocks.liquid` if you want multiple bubbles with separate settings.

---

## Add as a block in product section (recommended — fully editable)

To add the Price Bubble as an **editable block** inside your product information (alongside Title, Price, Description, etc.):

1. **Edit your theme's product section** (usually `sections/main-product.liquid`)
2. **Add the block schema** — see **[BLOCK-SCHEMA.md](BLOCK-SCHEMA.md)** for the complete block definition
3. **Add the rendering code** — in your block loop, add:
   ```liquid
   {% when 'price_bubble' %}
     {% render 'sl-price-bubble',
       bubble_text: block.settings.bubble_text,
       image: block.settings.image,
       bubble_id: block.id,
       align_desktop: block.settings.align_desktop,
       align_mobile: block.settings.align_mobile,
       tail: block.settings.tail,
       padding_top: block.settings.padding_top,
       padding_bottom: block.settings.padding_bottom,
       background_color: block.settings.background_color,
       text_color: block.settings.text_color,
       font_size: block.settings.font_size,
       image_size: block.settings.image_size,
       border_radius: block.settings.border_radius,
       border_color: block.settings.border_color,
       border_width: block.settings.border_width
     %}
   ```

Then in Theme Editor → Product template → main product section, click **Add block** → **Price Bubble**. All settings are editable in the sidebar — text, icon, colors, padding, alignment, etc.

**See [BLOCK-SCHEMA.md](BLOCK-SCHEMA.md) for complete instructions.**

---

## Use the section directly (standalone section)

The section has all settings editable in the theme editor. No Custom Liquid blocks needed.

1. In Theme Editor → Product template, click **Add section**.
2. Add **SL Price Bubble Widget**.
3. Configure all settings in the sidebar (text, icon, colors, padding, etc.).
4. The section uses `width: fit-content` so it only takes the width of the bubble, not full width.

**All settings are editable:** Text, icon image, alignment, tail, padding, colors, font size, border — everything is in the theme editor sidebar.

---

## Use as a block under the product price (Custom Liquid)

So the bubble appears exactly where product blocks go (e.g. under the price), use the **snippet** in a **Custom Liquid** block — no section and no inject script.

1. In Theme Editor → Product template, open the **main product** section (the one with Title, Price, Description, etc.).
2. Add a **Custom Liquid** block where you want the bubble (e.g. right under the **Price** block).
3. In the Custom Liquid block, paste:

```liquid
{% render 'sl-price-bubble',
  bubble_text: 'Only 0.27€ per day',
  bubble_id: block.id
%}
```

Change `bubble_text` to your line (e.g. per-day price). Optional parameters (add as needed):

| Parameter | Default | Example |
|-----------|--------|--------|
| `bubble_text` | `'Only 0.27€ per day'` | `'Only 0.27€ per day'` (English) |
| `bubble_text_ar` | (none) | `'فقط 0.27€ في اليوم'` (Arabic - auto-shows when locale is Arabic) |
| `image` | (none) | `section.settings.my_icon` or `'https://cdn.shopify.com/...'` (URL string) |
| `bubble_id` | `'default'` | `block.id` (recommended in a block) |
| `align_desktop` | `'center'` | `'flex-start'`, `'center'`, `'flex-end'` |
| `align_mobile` | `'center'` | same |
| `tail` | `'up'` | `'none'`, `'up'`, `'down'` |
| `padding_top` | `10` | number |
| `padding_bottom` | `20` | number |
| `background_color` | `'#F0F0F0'` | `'#ffffff'` |
| `text_color` | `'#000000'` | `'#333'` |
| `font_size` | `14` | number |
| `image_size` | `24` | number |
| `border_radius` | `8` | number |
| `border_color` | `'#0171E2'` | color |
| `border_width` | `2` | number |

Example with an icon from a section setting (if your product section has an image setting):

```liquid
{% render 'sl-price-bubble',
  bubble_text: 'Only 0.27€ per day',
  image: section.settings.price_bubble_icon,
  bubble_id: block.id
%}
```

If you add a setting to your theme’s product section for the icon, use `section.settings.that_setting_id` for `image`.

---

## Use as a section (full-width row)

Add the **SL Price Bubble Widget** section on the product template and configure it in the theme editor. The wrapper uses `width: fit-content` so the section doesn’t stretch full width.

To show that same section output **inside** the product column (e.g. under the price) without moving the section, you can use the inject pattern: add the section somewhere on the template, then in a Custom Liquid block paste:

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

Use **one** Price Bubble section on the page when using this inject. Prefer the **snippet + Custom Liquid block** above so the bubble is a real block under the price.

---

## Multiple bubbles with separate settings (block-based)

If you need multiple price bubbles on the same page, each with its own settings:

1. Copy `sections/sl-price-bubble-blocks.liquid` to your theme **sections** folder.
2. Add the **SL Price Bubble Widget (Blocks)** section.
3. Click **Add block** → **Price Bubble** for each bubble you want.
4. Configure each block's settings separately in the sidebar.

Each bubble block has its own text, icon, colors, padding, etc. — all editable in the theme editor.

## Section full width

The bubble wrapper uses `width: fit-content` so the section only takes the width of the bubble, not the full row. Alignment (left/center/right) is controlled in the section settings.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
