# SL - Highlights

Product-info style **highlights** block: accordion with a list of items (icon + label). Optional popup per item for extra detail (title, subtitle, description, image). Matches the “Highlights” accordion pattern used in product info (e.g. lightweight oil, pearly shimmer, recyclable glass, natural origin, made in France).

**Category:** Product  
**Source:** Section Lab (this repo)

---

## Features

- Accordion with configurable heading (e.g. “Highlights”) and arrow icon
- List of highlights: icon (sparkle, leaf, recyclable, natural origin, France) + label
- Optional popup per item: set popup title, subtitle, description, and image; clickable items open the modal
- Close popup via X, overlay click, or Escape; self-contained popup markup and script
- Data from **section blocks** or **product metafield** (list of metaobject references)
- RTL support; locale keys for heading and UI strings

---

## Setup

### Option A — Section blocks (no metaobject)

1. **Online Store** → **Themes** → **Customize** → open a **Product** template.
2. **Add section** → **SL - Highlights**.
3. In section settings, set **Data source** to “Section blocks”.
4. Add **Highlight** blocks: **Label**, **Icon** (sparkle, leaf, recyclable, natural_origin, france). Optionally set popup fields (Popup title, Subtitle, Description, Image) to make the item open a detail popup.
5. Save.

### Option B — Product metafield (metaobject)

**Step 1 — Metaobject definition**

1. **Settings** → **Custom data** → **Metaobjects** → **Add definition**.
2. **Name:** `Highlight`
3. **Fields:**
   - `label` — Single line text (required)
   - `icon` — Single line text (optional: `sparkle`, `leaf`, `recyclable`, `natural_origin`, `france`; default `sparkle`)
   - `popup_title` — Single line text (optional)
   - `popup_subtitle` — Single line text (optional)
   - `popup_description` — Multi-line text (optional)
   - `image` — File (optional, for popup)
4. Save.

**Step 2 — Product metafield**

1. **Settings** → **Custom data** → **Products** → **Add definition**.
2. **Name:** e.g. `Highlights`
3. **Namespace and key:** `custom.highlights`
4. **Type:** List of metaobject references → **Highlight**
5. **Storefront access:** Enabled
6. Save.

**Step 3 — Assign to products**

1. **Products** → open a product → **Metafields** → **Highlights**.
2. Add entries (or create new Highlight metaobjects) with label, optional icon and popup fields.
3. Save.

**Step 4 — Add section**

1. **Customize** → Product template → **Add section** → **SL - Highlights**.
2. Set **Data source** to “Product metafield (custom.highlights)”.
3. Save.

---

## Snippet-only usage (product info)

Use the snippet inside a product info accordion group or a Custom Liquid block. No section required.

**With section blocks** (e.g. from a parent section that includes this snippet and passes its blocks):

```liquid
{% render 'sl-highlights',
  section: section,
  use_blocks: true,
  section_id: 'product-highlights',
  heading: 'Highlights'
%}
```

**With a list of highlights** (e.g. from metafield or a hardcoded array):

```liquid
{% assign hl_list = product.metafields.custom.highlights.value %}
{% if hl_list != blank %}
  {% render 'sl-highlights',
    highlights: hl_list,
    section_id: 'product-highlights',
    heading: 'Highlights'
  %}
{% endif %}
```

For static data, build an array in Liquid (e.g. from a section with blocks or from metafield). The snippet does not accept raw JSON; use section blocks or a metafield list for dynamic data.

Snippet parameters:

| Parameter     | Description |
|--------------|-------------|
| `highlights` | Array of objects: `label` (required), `icon` (optional), `popup_title`, `popup_subtitle`, `popup_description`, `popup_image` or `image` |
| `section`    | Section object when using blocks |
| `use_blocks` | Set to `true` to use section blocks instead of `highlights` |
| `section_id` | Unique ID for the root element and popup (e.g. section.id or string) |
| `heading`    | Accordion heading text (or locale key) |

---

## File structure

```
Section Lab/Highlights/
├── sections/
│   └── sl-highlights.liquid
├── snippets/
│   ├── sl-highlights.liquid
│   └── sl-highlights-icon.liquid
├── locales/
│   ├── en.default.json
│   └── ar.json
└── README.md
```

---

## Localization

| Key | Purpose |
|-----|---------|
| `sections.sl_highlights.heading` | Accordion heading (default: “Highlights”) |
| `sections.sl_highlights.close` | Popup close button (accessibility) |
| `sections.sl_highlights.view_details` | Button/link accessibility text |
| `sections.sl_highlights.empty` | Message when no highlights (design mode) |

---

## Design notes

- Icons use brand color `#7D8F3E`; layout follows the existing product-info highlights pattern (grid 21px icon + label).
- Popup is self-contained (markup and script in the snippet); no shared theme popup required.
- Accordion uses native `<details>`/`<summary>`; arrow rotates when open.

**Last updated:** 2026-03-07
