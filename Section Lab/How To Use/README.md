# SL - How to Use

Product-level **“How to use it the right way”** steps, inspired by Yves Rocher. Each step shows a number, optional title, a **related product** (image + name, linked), and an expandable **description**. Available as a **section** (metaobject or manual steps) or a **snippet** (metaobject only, for Custom Liquid blocks).

**Category:** Product / Content  
**Templates:** Product (section and snippet are used on product pages)

**English & Arabic:** Step titles and descriptions can be entered in both languages. The section and snippet use the store’s current locale (`request.locale`): Arabic (`ar`) shows `*_ar` fields with fallback to `*_en`; all other locales show `*_en` with fallback to `*_ar`. Optional fallback fields (e.g. `step_title`, `description`) are used when the locale is neither en nor ar. In Arabic locale, the step content gets `dir="rtl"` where relevant.

---

## Two ways to use it

| Use | Data source | When to use |
|-----|-------------|-------------|
| **Section** | Product metaobject **or** manual step blocks | Add section to product template; choose per-product steps (metaobject) or same steps for all (blocks). |
| **Snippet** | Product metaobject only | Add a Custom Liquid block in product info and render the snippet; steps come from the product’s metafield. |

---

## Section: Step source

The section has two modes:

1. **Product metaobject (per product)**  
   Steps come from the current product’s metafield `custom.how_to_use_steps` (list of How to use step metaobjects). Each product can have different steps.

2. **Manual steps (section blocks)**  
   You add **Step** blocks in the theme editor. Each block has: related product; step title and description in **English** and **Arabic** (optional fallback). Same steps for every product that uses this section.

**Section settings:** Optional heading (EN/AR + fallback), alignment/size/color; step styling (background/text color, gap); **Steps layout** (Vertical = stacked column, Horizontal = row with wrap); **Section layout**: full width (screen width) by default, padding top/bottom and left/right, optional content max width when not full width.

**Install section:** Copy `sections/sl-how-to-use.liquid` into your theme **sections** folder. In **Customize** → product template → **Add section** → **SL - How to Use**. Choose **Step source** (Product metaobject or Manual steps). If Manual steps, add **Step** blocks and set product, title, and description for each.

---

## Snippet: Custom Liquid block

Use when you want “how to use” inside the product info area (e.g. inside an accordion), with steps from the product’s metaobject only.

**Usage:** In a **Custom Liquid** block in the product block:

```liquid
{% render 'sl-how-to-use', product: product, block_id: block.id %}
```

**Install snippet:** Copy `snippets/sl-how-to-use.liquid` into your theme **snippets** folder.

---

## Setup: Metaobjects (for metaobject mode)

Only needed if you use **Product metaobject** (section or snippet).

### Step 1 — Create the “How to use step” metaobject definition

1. **Shopify Admin** → **Settings** → **Custom data** → **Metaobjects**
2. Click **Add definition**
3. Set:
   - **Name:** `How to use step`
   - **Type:** `how_to_use_step`
   - **Storefront API access:** enabled
4. Add fields (English & Arabic for title and description):

   | Field label      | Key             | Type              | Notes                                    |
   |------------------|-----------------|-------------------|------------------------------------------|
   | Product          | `product`       | Product reference | Product to show for this step            |
   | Step title (EN)  | `step_title_en` | Single line text  | Optional, e.g. "Step 1"                  |
   | Step title (AR)  | `step_title_ar` | Single line text  | Optional                                  |
   | Step title       | `step_title`    | Single line text  | Optional fallback (other locales)        |
   | Description (EN) | `description_en` | Multi-line text   | Step instructions in English             |
   | Description (AR) | `description_ar` | Multi-line text  | Step instructions in Arabic              |
   | Description      | `description`   | Multi-line text   | Optional fallback (other locales)        |

5. Save.

### Step 2 — Create “How to use step” entries

1. **Content** → **Metaobjects** → **How to use step**
2. For each step: **Add entry** → set Product; **Step title (EN)** and **Step title (AR)** (optional); **Description (EN)** and **Description (AR)**. Optionally set the fallback **Step title** and **Description** for other locales. Save.

### Step 3 — Add the product metafield

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `How to use steps`  
   **Namespace and key:** `custom.how_to_use_steps`  
   **Type:** **List of metaobject references** → **How to use step**  
   **Storefront API access:** enabled  
3. Save.

### Step 4 — Assign steps to products

1. **Products** → open a product → **Metafields** → **How to use steps**
2. Add references to your How to use step entries in the desired order.
3. Save.

---

## Data summary

| What                | Where | Type / Notes |
|---------------------|--------|--------------|
| One step (metaobject) | Metaobject `how_to_use_step` | Fields: `product`; `step_title_en`, `step_title_ar` (optional `step_title`); `description_en`, `description_ar` (optional `description`) |
| Steps per product   | Product metafield | `custom.how_to_use_steps` = list of metaobject references |
| Manual steps        | Section blocks   | Block type **Step**: product; step_title_en, step_title_ar (optional step_title); description_en, description_ar (optional description) |
| Section heading     | Section settings | heading_en, heading_ar (optional heading for other locales) |

---

## File structure

```
Section Lab/How To Use/
├── sections/
│   └── sl-how-to-use.liquid   ← Section (metaobject or manual steps)
├── snippets/
│   └── sl-how-to-use.liquid   ← Snippet (metaobject only; use in Custom Liquid)
└── README.md
```

---

## Requirements

- **Section:** Product template. For metaobject mode, product metafield and metaobject setup above (with EN/AR fields). For manual mode, no metaobjects needed; use block fields for EN/AR.
- **Snippet:** Product template; product metafield `custom.how_to_use_steps` and metaobject type `how_to_use_step` with `step_title_en`, `step_title_ar`, `description_en`, `description_ar` (and optional fallbacks).

---

## Design mode

- **Section:** If there are no steps (empty metafield and no blocks, or metaobject chosen but metafield empty), the section shows a short message: add steps via metafield or add Step blocks.
- **Snippet:** If the product has no steps, it shows a message to add the **How to use steps** metafield.

---

## Styling

- **Section:** CSS is scoped to `#sl-htu-section-{{ section.id }}`. Step colors and gap are in section settings (step background, step text color, gap between steps).
- **Snippet:** CSS is scoped to `#sl-htu-block-{{ block_id }}`. Override with CSS variables: `--sl-htu-bg`, `--sl-htu-text`, `--sl-htu-radius`, `--sl-htu-step-gap`.
