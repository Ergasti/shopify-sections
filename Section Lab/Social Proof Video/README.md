# SL - Social Proof Video Slider

Product-specific UGC video slider for social proof. Uses **metaobjects** for per-product videos or **section blocks** for static videos. Add to product template.

**Category:** Media / Social Proof  
**Source:** Based on SL Native Video Slider

---

## Features

- **Video source:** Product metaobject (different videos per product) or section blocks (static)
- **Per-product UGC:** Each product shows its own social proof videos via metafield
- **Metaobject fields:** Video, caption, username for rich social proof
- **Lazy loading** and `preload="metadata"` for performance
- **Autoplay active slide only** — other videos stay paused
- No external libraries

---

## Setup: Metaobjects (Product-Specific Videos)

### Step 1 — Create metaobject definition

1. **Shopify Admin** → **Settings** → **Custom data** → **Metaobjects**
2. Click **Add definition**
3. Set:
   - **Name:** `UGC Video`
   - **Type:** `ugc_video` (used for metafield references)
   - **Storefront access:** enabled
4. Add fields:

   | Field label | Key      | Type                    |
   |-------------|----------|-------------------------|
   | Video       | `video`  | File (video)            |
   | Caption     | `caption`| Single line text        |
   | Username    | `username` | Single line text    |

5. Save

### Step 2 — Create UGC Video entries

1. **Content** → **Metaobjects** → **UGC Video**
2. **Add entry** for each video
3. Upload video, add optional caption and username
4. Save each entry

### Step 3 — Add product metafield

1. **Settings** → **Custom data** → **Products**
2. **Add definition**
3. Set:
   - **Name:** `Social proof videos`
   - **Namespace and key:** `custom.social_proof_videos`
   - **Type:** **List of metaobject references** → select **UGC Video**
   - **Storefront access:** enabled
4. Save

### Step 4 — Assign videos to products

1. **Products** → open a product
2. Scroll to **Metafields** → **Social proof videos**
3. Add references to your UGC Video entries
4. Save product

### Step 5 — Add section to product template

1. **Online Store** → **Themes** → **Customize**
2. Go to a product page
3. Add section **SL - Social Proof Video**
4. Set **Video source** to **Product metaobject (per product)**
5. Set heading (e.g. “Real reviews”) and styling
6. Save

---

## Video source modes

| Mode                    | Use case                    | Data source |
|-------------------------|-----------------------------|-------------|
| Product metaobject      | Different videos per product| `product.metafields.custom.social_proof_videos` |
| Section blocks          | Same videos everywhere      | Theme Editor blocks |

---

## File structure

```
Section Lab/Social Proof Video/
├── sections/
│   └── sl-social-proof-video.liquid
└── README.md
```

---

## Installation

1. Copy `sections/sl-social-proof-video.liquid` to your theme **sections** folder
2. Follow the setup above for metaobjects
3. Add the section to your product template

---

## Requirements

- Metafield namespace/key: `custom.social_proof_videos`
- Metaobject type: `ugc_video` with fields `video`, `caption`, `username`
- Section is limited to product template (`templates: ["product"]`)
