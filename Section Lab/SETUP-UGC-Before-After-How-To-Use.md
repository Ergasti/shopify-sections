# Setup: UGC, Before & After, and How to Use

Use this guide to set up the **UGC** section (homepage + product page), **Before and After**, and **How to Use** on your new site. Order matters: create metaobjects and metafields first, then add the sections.

---

## Part 1 — Metaobjects & metafields (do this once)

These definitions are shared by the sections below.

### 1.1 UGC Video metaobject (for UGC + Before/After)

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. Set:
   - **Name:** `UGC Video`
   - **Type:** `ugc_video`
   - **Storefront API access:** enabled
3. Add fields:

   | Field label | Key       | Type             |
   |-------------|-----------|------------------|
   | Video       | `video`   | File (video)     |
   | Caption     | `caption` | Single line text |
   | Username    | `username`| Single line text |

4. Save.

### 1.2 Product metafields for UGC and Before/After

Create **two** product metafield definitions:

**Social proof videos (product-page UGC)**

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `Social proof videos`  
   **Namespace and key:** `custom.social_proof_videos`  
   **Type:** List of metaobject references → **UGC Video**  
   **Storefront API access:** enabled  
3. Save.

**Before and after videos**

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `Before and after videos`  
   **Namespace and key:** `custom.before_after_videos`  
   **Type:** List of metaobject references → **UGC Video**  
   **Storefront API access:** enabled  
3. Save.

### 1.3 How to use step metaobject (for How to Use)

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. Set:
   - **Name:** `How to use step`
   - **Type:** `how_to_use_step`
   - **Storefront API access:** enabled
3. Add fields:

   | Field label      | Key              | Type              |
   |------------------|------------------|-------------------|
   | Product          | `product`        | Product reference |
   | Step title (EN)  | `step_title_en`  | Single line text  |
   | Step title (AR)  | `step_title_ar`  | Single line text  |
   | Step title       | `step_title`     | Single line text  |
   | Description (EN) | `description_en` | Multi-line text   |
   | Description (AR) | `description_ar` | Multi-line text   |
   | Description      | `description`    | Multi-line text   |

4. Save.

### 1.4 Product metafield for How to Use

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `How to use steps`  
   **Namespace and key:** `custom.how_to_use_steps`  
   **Type:** List of metaobject references → **How to use step**  
   **Storefront API access:** enabled  
3. Save.

---

## Part 2 — Create content (metaobject entries)

### UGC Video entries

1. **Content** → **Metaobjects** → **UGC Video**
2. **Add entry** for each video: upload **Video**, optional **Caption** and **Username**
3. Save each.

### How to use step entries

1. **Content** → **Metaobjects** → **How to use step**
2. **Add entry** for each step: set **Product**, **Step title (EN/AR)**, **Description (EN/AR)**
3. Save each.

---

## Part 3 — Copy theme files into your theme

Copy these into your theme (same folder names: `sections/`, `snippets/`, `locales/` as needed).

| Section            | Copy from → into theme |
|--------------------|-------------------------|
| UGC Homepage       | `Section Lab/UGC Videos Homepage/sections/sl-ugc-videos-homepage.liquid` → `sections/` |
|                    | `Section Lab/UGC Videos Homepage/locales/` → `locales/` (merge or add keys) |
| Social Proof (UGC on product) | `Section Lab/Social Proof Video/sections/sl-social-proof-video.liquid` → `sections/` |
|                    | `Section Lab/Social Proof Video/snippets/sl-social-proof-video.liquid` → `snippets/` |
| Before and After   | `Section Lab/Before And After/sections/sl-before-after-video.liquid` → `sections/` |
|                    | `Section Lab/Before And After/snippets/sl-before-after-video.liquid` → `snippets/` |
|                    | `Section Lab/Before And After/locales/` → `locales/` (merge or add keys) |
| How to Use         | `Section Lab/How To Use/sections/sl-how-to-use.liquid` → `sections/` |
|                    | `Section Lab/How To Use/snippets/sl-how-to-use.liquid` → `snippets/` |

---

## Part 4 — Assign data to products

For each product that should show UGC, before/after, or how-to-use:

1. **Products** → open the product
2. **Metafields:**
   - **Social proof videos** — add UGC Video entries (for product-page UGC)
   - **Before and after videos** — add UGC Video entries (for before/after slider)
   - **How to use steps** — add How to use step entries in order
3. Save.

---

## Part 5 — Add sections in the theme editor

### Homepage — UGC section

1. **Online Store** → **Themes** → **Customize**
2. Open the **Homepage** (or the template that uses the index)
3. **Add section** → **SL - UGC Videos Homepage**
4. Choose **Video source:**
   - **Section blocks** — add “Video + product” blocks (no metaobjects needed for this mode)
   - **Product metafield** — pick **Products** in settings; videos come from each product’s **Social proof videos** or **Before and after videos**
5. Set heading, subheading, slider options (slides per view, gap), and styling. Save.

### Product page — UGC (Social Proof Video)

1. In **Customize**, go to a **Product** page
2. **Add section** → **SL - Social Proof Video**
3. Set **Video source** to **Product metaobject (per product)**
4. Set heading and styling. Save.

**Alternative (inside product info):** Add a **Custom Liquid** block and use:
`{% render 'sl-social-proof-video', product: product, block_id: block.id %}`

### Product page — Before and After

1. In **Customize**, go to a **Product** page
2. **Add section** → **SL - Before And After**
3. Set heading, “Before”/“After” labels, and slide width. Save.

**Alternative (inside product info):** Add a **Custom Liquid** block and use:
`{% render 'sl-before-after-video', product: product, block_id: block.id %}`

### Product page — How to Use

1. In **Customize**, go to a **Product** page
2. **Add section** → **SL - How to Use**
3. Choose **Step source:**
   - **Product metaobject** — steps from this product’s **How to use steps** metafield
   - **Manual steps** — add **Step** blocks in the section (same steps for every product that uses this section)
4. Set heading (EN/AR if needed), layout (vertical/horizontal), and styling. Save.

**Alternative (inside product info):** Add a **Custom Liquid** block and use:
`{% render 'sl-how-to-use', product: product, block_id: block.id %}`
(Only works with **Product metaobject**; steps must be in the product’s metafield.)

---

## Quick reference

| Where        | Section / Snippet                    | Main data |
|-------------|--------------------------------------|-----------|
| Homepage    | SL - UGC Videos Homepage             | Blocks or products with `social_proof_videos` / `before_after_videos` |
| Product     | SL - Social Proof Video              | Product metafield `custom.social_proof_videos` (UGC Video) |
| Product     | SL - Before And After                | Product metafield `custom.before_after_videos` (UGC Video) |
| Product     | SL - How to Use                      | Product metafield `custom.how_to_use_steps` (How to use step) or manual blocks |

---

## Locales (optional)

If you use Arabic (or other RTL) or want to translate strings:

- **UGC Homepage:** `sections.sl_ugc_hp.close_video`, `sections.sl_ugc_hp.loading`
- **Before And After:** `sections.sl_before_after.heading`, `before_label`, `after_label`, `no_videos`
- **How to Use:** section/snippet use EN/AR metaobject fields and optional heading_en / heading_ar in section settings

Merge the JSON from each section’s `locales/` into your theme’s `locales/en.default.json` and `locales/ar.json` (or your locale files).

---

**Related READMEs:**  
[UGC Videos Homepage](UGC%20Videos%20Homepage/README.md) · [Social Proof Video](Social%20Proof%20Video/README.md) · [Before And After](Before%20And%20After/README.md) · [How To Use](How%20To%20Use/README.md)
