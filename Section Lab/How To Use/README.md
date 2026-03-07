# SL - How to Use

Product-level **“How to use it the right way”** steps, inspired by Yves Rocher. Each step shows a number, optional title, an optional **related product** (image + name, linked), and an expandable **description**. Available as a **section** (metaobject or manual steps) or a **snippet** (metaobject only, for Custom Liquid blocks).

**Main idea:** Steps live in a **single, named “How to use” object**. Multiple products can reference the **same** object, so you define one routine (e.g. “Daily face cream routine”) and assign it to many products. The **product object** (the current product page) is what the section/snippet depends on; each step can optionally link to a **related product** (e.g. “use with Moisturizer X”) for the pill.

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

1. **Product metaobject**  
   Steps come from the **current product’s** metafield. The product references **one** “How to use (SL)” entry (`custom.how_to_use`). That entry has a **name** (e.g. “Daily face cream routine”) so you can easily select it when assigning to products. Many products can share the same “How to use” entry.  
   *Legacy:* If `custom.how_to_use` is empty, the section falls back to `custom.how_to_use_steps` (list of step metaobjects) so existing setups keep working.

2. **Manual steps (section blocks)**  
   You add **Step** blocks in the theme editor. Each block has: optional related product; step title and description in **English** and **Arabic** (optional fallback). Same steps for every product that uses this section.

**Section settings:** Optional heading (EN/AR + fallback), alignment/size/color; step styling (background/text color, gap); **Steps layout** (Vertical = stacked column, Horizontal = row); **Steps per row** (horizontal only): choose 2–5 steps per row on desktop (mobile always 1 per row); **Section layout**: full width (screen width) by default, padding top/bottom and left/right, optional content max width when not full width.

**Install section:** Copy `sections/sl-how-to-use.liquid` into your theme **sections** folder. In **Customize** → product template → **Add section** → **SL - How to Use**. Choose **Step source** (Product metaobject or Manual steps). If Manual steps, add **Step** blocks and set optional **Step icon** (image), product, title, and description for each.

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

Only needed if you use **Product metaobject** (section or snippet). The setup uses a **named** “How to use” metaobject so you can create one routine (e.g. “Face cream – 3 steps”) and assign it to many products; the product metafield is named **“How to use (SL)”** so it’s easy to find when editing a product.

### Step 1 — Create the “How to use step” metaobject definition

1. **Shopify Admin** → **Settings** → **Custom data** → **Metaobjects**
2. Click **Add definition**
3. Set:
   - **Name:** `How to use step`
   - **Type:** `how_to_use_step`
   - **Storefront API access:** enabled
4. Add fields (English & Arabic for title and description):

   | Field label      | Key             | Type              | Notes                                                                 |
   |------------------|-----------------|-------------------|-----------------------------------------------------------------------|
   | Related product  | `product`       | Product reference | Optional. Product to show for this step (e.g. “use with Moisturizer”). |
   | Step icon        | `step_icon`     | File (image)      | Optional. Icon/image shown next to step number.                        |
   | Step title (EN)  | `step_title_en` | Single line text  | Optional, e.g. "Step 1"                                                |
   | Step title (AR)  | `step_title_ar` | Single line text  | Optional                                                              |
   | Step title       | `step_title`    | Single line text  | Optional fallback (other locales)                                     |
   | Description (EN) | `description_en` | Multi-line text   | Step instructions in English                                         |
   | Description (AR) | `description_ar` | Multi-line text   | Step instructions in Arabic                                           |
   | Description      | `description`   | Multi-line text   | Optional fallback (other locales)                                     |

5. Save.

### Step 2 — Create the “How to use (SL)” metaobject definition (named setup)

This is the **reusable, named** object that holds the steps. Multiple products can reference the same entry.

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. Set:
   - **Name:** `How to use (SL)`  
     *(This name appears in Content → Metaobjects and when assigning to products.)*
   - **Type:** `how_to_use`
   - **Storefront API access:** enabled
3. Add fields:

   | Field label | Key     | Type                    | Notes                                                                 |
   |-------------|---------|-------------------------|-----------------------------------------------------------------------|
   | Name        | `name`  | Single line text        | **Required.** Display name for this setup (e.g. “Daily face cream”, “Body lotion routine”). Shown when selecting which “How to use” to assign to a product. |
   | Steps       | `steps` | List of metaobject refs | **References:** How to use step. Order = step order.                 |

4. Save.

### Step 3 — Create “How to use step” entries and one “How to use (SL)” entry

1. **Content** → **Metaobjects** → **How to use step**  
   Create one entry per step: set optional **Related product**; optional **Step icon**; **Step title (EN)** / **(AR)**; **Description (EN)** / **(AR)**. Save each.

2. **Content** → **Metaobjects** → **How to use (SL)**  
   **Add entry** → set **Name** (e.g. “Daily face cream routine”) → add references to your How to use step entries in the desired order. Save.

You can create several “How to use (SL)” entries (e.g. one for face, one for body) and assign the same one to many products.

### Step 4 — Add the product metafield (easy to find by name)

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. Set:
   - **Name:** `How to use (SL)`  
     *(So merchants see “How to use (SL)” in the product metafields list and can select it easily.)*
   - **Namespace and key:** `custom.how_to_use`
   - **Type:** **Metaobject reference** → **How to use (SL)**
   - **Storefront API access:** enabled
3. Save.

### Step 5 — Assign one “How to use” to each product

1. **Products** → open a product → **Metafields** → **How to use (SL)**
2. Select **one** “How to use (SL)” entry (e.g. “Daily face cream routine”). Multiple products can share the same entry.
3. Save.

**Legacy:** If you already use a list of steps per product, the section and snippet still support the old metafield **How to use steps** (`custom.how_to_use_steps`, list of How to use step references). Prefer the new single reference `custom.how_to_use` for sharing one setup across products.

---

## Data summary

| What | Where | Type / Notes |
|------|--------|--------------|
| One step (metaobject) | Metaobject `how_to_use_step` | Fields: `product` (optional related product); `step_icon` (optional image); `step_title_en`, `step_title_ar` (optional `step_title`); `description_en`, `description_ar` (optional `description`) |
| Named setup (reusable) | Metaobject `how_to_use` | **Name:** `name` (single line, for easy selection). **Steps:** `steps` = list of How to use step references. |
| Product → one setup | Product metafield | `custom.how_to_use` = **one** metaobject reference to **How to use (SL)**. Metafield definition name: **How to use (SL)**. |
| Legacy steps per product | Product metafield | `custom.how_to_use_steps` = list of How to use step references (fallback). |
| Manual steps | Section blocks | Block type **Step**: step_icon (optional image); product; step_title_en, step_title_ar (optional step_title); description_en, description_ar (optional description) |
| Section heading | Section settings | heading_en, heading_ar (optional heading for other locales) |

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

- **Section:** Product template. For metaobject mode: product metafield `custom.how_to_use` (single “How to use (SL)” reference) or legacy `custom.how_to_use_steps`; metaobject type `how_to_use` with `name` and `steps`, and `how_to_use_step` with EN/AR fields. For manual mode, no metaobjects needed; use block fields for EN/AR.
- **Snippet:** Product template; same as above (prefers `custom.how_to_use`, fallback `custom.how_to_use_steps`).

---

## Design mode

- **Section:** If there are no steps (no “How to use (SL)” assigned, no legacy list, and no blocks when using manual steps), the section shows a short message: assign a **How to use (SL)** entry or add Step blocks.
- **Snippet:** If the product has no steps, it shows a message to assign **How to use (SL)** or use the legacy **How to use steps** metafield.

---

## Styling

- **Section:** CSS is scoped to `#sl-htu-section-{{ section.id }}`. Step colors and gap are in section settings (step background, step text color, gap between steps).
- **Snippet:** CSS is scoped to `#sl-htu-block-{{ block_id }}`. Override with CSS variables: `--sl-htu-bg`, `--sl-htu-text`, `--sl-htu-radius`, `--sl-htu-step-gap`.
