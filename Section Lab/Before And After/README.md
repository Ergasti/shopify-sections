# SL - Before And After Video

Product-specific before/after video slider. Uses **Swiper**, square aspect ratio, same play/mute strategy as Social Proof Video. Add to product template.

**Category:** Media  
**Metafield:** `custom.before_after_videos` (list of UGC Video metaobjects)

---

## Features

- **Square aspect ratio** (1:1)
- **Per-product videos** via metafield
- **Swiper** with prev/next arrows
- **Autoplay** focused slide; click to mute/unmute
- **Before / After badges** on each video
- Reuses **UGC Video** metaobject (same as Social Proof Video)

---

## Setup

### Step 1 — UGC Video metaobject

If you already use **Social Proof Video**, you have the UGC Video metaobject. If not:

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. **Name:** `UGC Video`
3. Add fields: **Video** (File), **Caption** (text), **Username** (text)
4. Save

### Step 2 — Product metafield

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `Before and after videos`
3. **Namespace and key:** `custom.before_after_videos`
4. **Type:** List of metaobject references → **UGC Video**
5. **Storefront access:** enabled
6. Save

### Step 3 — Assign videos to products

1. **Products** → open a product
2. **Metafields** → **Before and after videos**
3. Add UGC Video entries (or create new ones)
4. Save

### Step 4 — Add to product template

**Option A — Section**

1. **Online Store** → **Themes** → **Customize**
2. Product page → Add section **SL - Before And After**
3. Configure heading, badge labels, slide width
4. Save

**Option B — Snippet** (Custom Liquid block)

1. Add **Custom Liquid** block in product info
2. Paste: `{% render 'sl-before-after-video', product: product, block_id: block.id %}`
3. Save

---

## File structure

```
Section Lab/Before And After/
├── sections/
│   └── sl-before-after-video.liquid
├── snippets/
│   └── sl-before-after-video.liquid
└── README.md
```

---

## Requirements

- Metafield: `custom.before_after_videos`
- Metaobject: UGC Video (`video`, `caption`, `username`)
- Product template
- Swiper 11 (loaded from CDN)
