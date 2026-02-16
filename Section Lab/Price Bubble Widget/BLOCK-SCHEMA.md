# Add Price Bubble as a Block to Product Section

To add the Price Bubble as an editable block in your product section (alongside Title, Price, Description, etc.), you need to:

1. **Edit your theme's main product section** (usually `sections/main-product.liquid` or `sections/product-form.liquid`)
2. **Add this block definition** to the section's schema `blocks` array
3. **Add the block rendering code** where you want blocks to appear

---

## Step 1: Add Block Schema

Find the `{% schema %}` tag in your product section file. Inside the schema, find the `"blocks"` array (or create one if it doesn't exist). Add this block definition:

```json
{
  "type": "price_bubble",
  "name": "Price Bubble",
  "settings": [
    {
      "type": "header",
      "content": "Content"
    },
    {
      "type": "text",
      "id": "bubble_text",
      "label": "Text",
      "default": "Only 0.27€ per day"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Icon image"
    },
    {
      "type": "select",
      "id": "align_desktop",
      "label": "Alignment (desktop)",
      "options": [
        { "value": "flex-start", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "flex-end", "label": "Right" }
      ],
      "default": "center"
    },
    {
      "type": "select",
      "id": "align_mobile",
      "label": "Alignment (mobile)",
      "options": [
        { "value": "flex-start", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "flex-end", "label": "Right" }
      ],
      "default": "center"
    },
    {
      "type": "select",
      "id": "tail",
      "label": "Tail direction",
      "options": [
        { "value": "none", "label": "None" },
        { "value": "up", "label": "Up" },
        { "value": "down", "label": "Down" }
      ],
      "default": "down"
    },
    {
      "type": "header",
      "content": "Style"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Padding top",
      "min": 0,
      "max": 100,
      "step": 1,
      "unit": "px",
      "default": 10
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Padding bottom",
      "min": 0,
      "max": 100,
      "step": 1,
      "unit": "px",
      "default": 20
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background color",
      "default": "#F0F0F0"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text color",
      "default": "#000000"
    },
    {
      "type": "range",
      "id": "font_size",
      "label": "Text size",
      "min": 10,
      "max": 40,
      "step": 1,
      "unit": "px",
      "default": 14
    },
    {
      "type": "range",
      "id": "image_size",
      "label": "Icon size",
      "min": 10,
      "max": 100,
      "step": 1,
      "unit": "px",
      "default": 24
    },
    {
      "type": "range",
      "id": "border_radius",
      "label": "Border radius",
      "min": 0,
      "max": 50,
      "step": 1,
      "unit": "px",
      "default": 8
    },
    {
      "type": "color",
      "id": "border_color",
      "label": "Border color",
      "default": "#0171E2"
    },
    {
      "type": "range",
      "id": "border_width",
      "label": "Border width",
      "min": 0,
      "max": 10,
      "step": 1,
      "unit": "px",
      "default": 2,
      "info": "Not compatible with Tail"
    }
  ]
}
```

---

## Step 2: Add Block Rendering Code

In your product section file, find where blocks are rendered (usually something like `{% for block in section.blocks %}`). Add this case for the price bubble block:

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

Make sure the snippet `snippets/sl-price-bubble.liquid` is in your theme.

---

## Example: Complete Block Rendering Pattern

Your product section might have something like this:

```liquid
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'title' %}
      <h1>{{ product.title }}</h1>
    
    {% when 'price' %}
      <div class="product-price">{{ product.price | money }}</div>
    
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
    
    {% when 'description' %}
      <div>{{ product.description }}</div>
  {% endcase %}
{% endfor %}
```

---

## Result

After adding this:
1. Go to Theme Editor → Product template
2. Open the main product section
3. Click **Add block** → **Price Bubble**
4. Configure all settings in the sidebar (text, icon, colors, padding, etc.)
5. Drag the block to position it (e.g., right under the Price block)

All settings are editable in the theme editor — no Custom Liquid code needed!
