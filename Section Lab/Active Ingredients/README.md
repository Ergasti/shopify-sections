# SL - Active Ingredients

Product-page section for **active botanical ingredients** (Yves Rocher–style): accordion heading, list of ingredients with round image + title + info icon; each item opens a popup with image, subtitle, and description.

**Category:** Product  
**Source:** Section Lab (this repo)

---

## Features

- Accordion with configurable heading (e.g. “Active botanical ingredients”) and arrow icon
- List of ingredients as **horizontal cards** (same background, border, and radius as other Section Lab cards): circular image (64px), title, info icon
- Click an ingredient to open a modal: image, subtitle, full description
- Close popup via X button, overlay click, or Escape; focus management for accessibility
- Data from **section blocks** or **product metafield** (list of metaobject references)
- RTL support; locale keys for heading and UI strings

---

## Setup

### Option A — Section blocks (no metaobject)

1. **Online Store** → **Themes** → **Customize** → open a **Product** template.
2. **Add section** → **SL - Active Ingredients**.
3. In section settings, set **Data source** to “Section blocks”.
4. Add **Ingredient** blocks: set **Image**, **Title**, **Subtitle** (popup), **Description** (popup, rich text), and optionally **Products with this ingredient** (collection) and **Button label**.
5. Save.

### Option B — Product metafield (metaobject)

**Step 1 — Metaobject definition**

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**.
2. **Name:** `Active Ingredient`
3. **Fields:**
   - `title` — Single line text (required)
   - `subtitle` — Single line text (optional, for popup)
   - `description` — Multi-line or rich text (optional, for popup)
   - `image` — File (optional, image)
   - `collection` — **Collection reference** (optional); select the related collection for “Products with this ingredient” in the popup
4. Save.

**Step 2 — Product metafield**

1. **Settings** → **Custom data** → **Products** → **Add definition**.
2. **Name:** e.g. `Active ingredients`
3. **Namespace and key:** `custom.active_ingredients`
4. **Type:** List of metaobject references → **Active Ingredient**
5. **Storefront access:** Enabled
6. Save.

**Step 3 — Assign to products**

1. **Products** → open a product → **Metafields** → **Active ingredients**.
2. Add entries (or create new Active Ingredient metaobjects) with title, optional subtitle, description (rich text if your metaobject supports it), image, and optionally **collection** (the related collection for the “Products with this ingredient” button).
3. Save.

**Step 4 — Add section**

1. **Customize** → Product template → **Add section** → **SL - Active Ingredients**.
2. Set **Data source** to “Product metafield (custom.active_ingredients)”.
3. Save.

---

## Snippet-only usage

Use the snippet in a **Custom Liquid** block on the product template (no section):

```liquid
{% comment %} With section blocks (pass section from a parent section or use blocks in section) {% endcomment %}
{% render 'sl-active-ingredients',
  section: section,
  use_blocks: true,
  section_id: 'active-ing',
  heading: 'Active botanical ingredients'
%}
```

With a list from a metafield:

```liquid
{% assign ingredients = product.metafields.custom.active_ingredients.value %}
{% render 'sl-active-ingredients',
  ingredients: ingredients,
  section_id: 'active-ing',
  heading: 'Active botanical ingredients'
%}
```

Metaobject entries should have: `title`, optional `subtitle`, `description`, `image` (Shopify file/image).

---

## Files

- **sections/sl-active-ingredients.liquid** — Section for theme editor (product template).
- **snippets/sl-active-ingredients.liquid** — Accordion, list, and popup (used by section or Custom Liquid).
- **locales/en.default.json**, **locales/ar.json** — Keys under `sections.sl_active_ingredients`.

---

## Localization

| Key           | Purpose                          |
|---------------|-----------------------------------|
| `heading`     | Accordion title                   |
| `close`       | Popup close button (aria-label)   |
| `view_details` | Item button aria-label         |
| `empty`       | Design-mode message when no data  |
| `products_with_ingredient` | Default label for “Products with this ingredient” button |

---

## Popup

- The popup uses **z-index: 100001** so it appears above typical theme headers/menus.
- **Description** is rich text (section blocks) or plain text (metafield); line breaks are converted to paragraphs when plain.
- If you set a **Collection** on an ingredient block, the popup shows a **“Products with this ingredient”** button linking to that collection.

---

## Metafield reference

| Namespace and key           | Type                         | Use case                    |
|----------------------------|------------------------------|-----------------------------|
| `custom.active_ingredients` | List of metaobject references | Active Ingredient entries   |

Metaobject **Active Ingredient** fields: `title`, `subtitle`, `description`, `image` (file), `collection` (collection reference, optional — for “Products with this ingredient” button).

---

**Last updated:** 2026-03-07
