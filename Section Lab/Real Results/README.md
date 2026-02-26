# SL - Real Results (Results you'll see)

**Accordion** section with heading “RESULTS YOU'LL SEE” and one or more **“how it affects”** boxes. Each box has: video (or image), title, bubble tags (with checkmark), and description. Clicking the video area toggles play/pause.

**Category:** Content  
**Templates:** Product

---

## Features

- **Accordion** — Collapsible “RESULTS YOU'LL SEE” (or custom heading) with arrow icon.
- **Result boxes** — Each block = one box: video URL or image, title, bubbles (one per line), description.
- **Bubbles** — Pill-style tags with green checkmark SVG (e.g. “Pearly Shimmer”, “Fast-Absorbing”).
- **Video** — Optional autoplay muted loop; click area toggles play/pause.
- **Styling** — Matches the provided design (border, radius, Montserrat-style typography, #F4F0E9 pills).

---

## Setup

### Option A — Section (recommended, block-based)

1. Copy `sections/sl-real-results.liquid` into your theme **sections** folder.
2. **Online Store** → **Themes** → **Customize** → Product template.
3. **Add section** → **SL - Real Results**.
4. **Section settings:**
   - **Accordion heading** — e.g. “RESULTS YOU'LL SEE” (default).
   - **Open by default** — Accordion expanded on load.
5. **Add blocks** — Click “Add block” → **Result box**. For each block set:
   - **Video URL** — Link to MP4 (e.g. from Files or CDN). Optional.
   - **Image** — Shown when Video URL is blank.
   - **Title** — e.g. “Instant glow, silky-soft skin”.
   - **Bubbles** — One tag per line, e.g.:
     ```
     Pearly Shimmer
     Fast-Absorbing
     Non-Greasy Feel
     ```
   - **Description** — Body text under the bubbles.
6. Add more **Result box** blocks if you want multiple boxes in one accordion.
7. Save.

### Option B — Snippet (product metafield, one box)

Uses the **first** entry from the product metafield `custom.real_results_highlights` (Product Highlight metaobject). Good when content is per product.

1. Copy `snippets/sl-real-results.liquid` into your theme **snippets** folder.
2. Create the **Product Highlight** metaobject and product metafield (see below).
3. In the product template, add a **Custom Liquid** block and paste:
   ```liquid
   {% render 'sl-real-results', product: product, block_id: block.id %}
   ```
4. Optional: override accordion heading or open state:
   ```liquid
   {% render 'sl-real-results', product: product, block_id: block.id, accordion_heading: "RESULTS YOU'LL SEE", accordion_open: true %}
   ```

---

## Metafield setup (for Option B / snippet)

### Step 1 — Product Highlight metaobject

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**
2. **Name:** `Product Highlight`
3. Add fields: **Title** (single line), **Description** (multi-line), **Image** (file), **Video** (file or URL if your theme supports it)
4. Save

### Step 2 — Product metafield

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** `Real results highlights`
3. **Namespace and key:** `custom.real_results_highlights`
4. **Type:** List of metaobject references → **Product Highlight**
5. **Storefront access:** enabled  
6. Save

### Step 3 — Assign to products

1. **Products** → open a product → **Metafields** → **Real results highlights**
2. Add at least one Product Highlight entry (title, description, image/video)
3. Save

The snippet uses the **first** entry only for the single “how it affects” box.

---

## File structure

```
Section Lab/Real Results/
├── sections/
│   └── sl-real-results.liquid   ← Section (accordion + Result box blocks)
├── snippets/
│   └── sl-real-results.liquid   ← Snippet (one box from metafield)
├── locales/
│   ├── en.default.json
│   └── ar.json
└── README.md
```

---

## Localization

- `sections.sl_real_results.no_highlights` — Message in theme editor when the section has no blocks and no metafield data.
- Accordion heading is set in section settings (or snippet parameter), not via locale.

---

## Design notes

- Accordion uses `<details>` / `<summary>`; arrow rotates when open.
- Container: `.how-it-affects-container` (border, radius, padding, shadow).
- Bubbles: `.bubles span` — pill background `#F4F0E9`, checkmark stroke `#7D8F3E`.
- Video: click on `.affect-image` toggles `.active` on the video and play/pause.
