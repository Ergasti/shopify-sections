# SL - How to Use (Snippet)

Product-level **“How to use it the right way”** steps, inspired by Yves Rocher. Each step shows a number, optional title, a **related product** (image + name, linked), and an expandable **description**. Data is stored in **metaobjects** and a **product metafield**, so each product can have its own steps.

**Category:** Product / Content  
**Use:** Rendered inside a **Custom Liquid** block in the product block (product info area).

---

## Features

- **Per-product steps:** Each product has its own “how to use” steps via metafield.
- **Metaobject-driven:** One metaobject type for a single step (product + description + optional title).
- **Step layout:** Step number, optional step title, related product (image + title, link to product page), expandable description.
- **No extra JS:** Description expand/collapse uses `<details>` / `<summary>`.
- **Theme-agnostic:** Styling is scoped; link goes to product URL (no dependency on a specific popup).

---

## Setup: Metaobjects and product metafield

### Step 1 — Create the “How to use step” metaobject definition

1. **Shopify Admin** → **Settings** → **Custom data** → **Metaobjects**
2. Click **Add definition**
3. Set:
   - **Name:** `How to use step`
   - **Type:** `how_to_use_step` (this is the type you’ll reference in the metafield)
   - **Storefront API access:** enabled (so the theme can read it)
4. Add fields:

   | Field label   | Key          | Type              | Notes                          |
   |---------------|---------------|-------------------|--------------------------------|
   | Product       | `product`     | Product reference | Product to show for this step  |
   | Description   | `description` | Multi-line text   | Step instructions / copy       |
   | Step title    | `step_title`  | Single line text  | Optional, e.g. "Step 1"        |

5. Save.

### Step 2 — Create “How to use step” entries

1. **Content** → **Metaobjects** → **How to use step**
2. For each step, click **Add entry**:
   - **Product:** Choose the product for this step (e.g. serum, cream, eye cream).
   - **Description:** Full “how to use” text for this step.
   - **Step title:** Optional. If left blank, the snippet uses “Step 1”, “Step 2”, etc.
3. Save each entry.

### Step 3 — Add the product metafield (list of steps)

1. **Settings** → **Custom data** → **Products**
2. **Add definition**
3. Set:
   - **Name:** `How to use steps`
   - **Namespace and key:** `custom.how_to_use_steps`
   - **Type:** **List of metaobject references** → select **How to use step** (`how_to_use_step`)
   - **Storefront API access:** enabled
4. Save.

### Step 4 — Assign steps to products

1. **Products** → open the product that should show “how to use” steps (e.g. a routine or kit).
2. In **Metafields**, find **How to use steps**
3. Add references to your **How to use step** metaobject entries, in the order you want (Step 1, Step 2, …).
4. Save the product.

### Step 5 — Add the snippet in the product template

1. **Online Store** → **Themes** → **Customize**
2. Open a product page
3. In the product form / product info area, add a **Custom Liquid** block
4. In the block’s Liquid field, paste:

   ```liquid
   {% render 'sl-how-to-use', product: product, block_id: block.id %}
   ```

5. Save.

Copy `snippets/sl-how-to-use.liquid` into your theme’s **snippets** folder (e.g. `Section Lab/How To Use/snippets/sl-how-to-use.liquid` → theme `snippets/sl-how-to-use.liquid`).

---

## Usage (Custom Liquid block)

In the product block, in a **Custom Liquid** block:

```liquid
{% render 'sl-how-to-use', product: product, block_id: block.id %}
```

- **product** — Usually the current product (`product`). Required so the snippet can read `product.metafields.custom.how_to_use_steps`.
- **block_id** — Optional. Used for the wrapper `id` so multiple blocks don’t clash. Defaults to `htu` if omitted.

Example with explicit block id:

```liquid
{% render 'sl-how-to-use', product: product, block_id: 'how-to-use-1' %}
```

---

## Data summary

| What                | Where | Type / Notes |
|---------------------|--------|--------------|
| One step            | Metaobject `how_to_use_step` | Fields: `product`, `description`, `step_title` |
| All steps for a product | Product metafield | `custom.how_to_use_steps` = list of metaobject references |

---

## File structure

```
Section Lab/How To Use/
├── snippets/
│   └── sl-how-to-use.liquid
└── README.md
```

---

## Requirements

- **Product metafield:** `custom.how_to_use_steps` (list of metaobject references).
- **Metaobject type:** `how_to_use_step` with:
  - `product` — Product reference  
  - `description` — Multi-line text  
  - `step_title` — Single line text (optional)

---

## Design mode

If the product has no steps (metafield empty or not set), in the theme editor the snippet outputs a short message: *“How to Use — No steps. Add entries to this product’s How to use steps metafield.”*

---

## Styling

CSS is scoped to `#sl-htu-block-{{ block_id }}`. You can override with CSS variables:

- `--sl-htu-bg` — Background for step number and product pill (default `#EEEFE8`)
- `--sl-htu-text` — Text color (default `#272E0F`)
- `--sl-htu-radius` — Step number circle radius (default `44px`)
- `--sl-htu-step-gap` — Vertical gap between steps (default `24px`)

Place overrides in your theme’s CSS or in a separate asset included on the product template.
