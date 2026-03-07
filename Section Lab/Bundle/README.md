# SL - Bundle

Section and snippets for bundle UIs on the product page. **Behavior is conditional:**

1. **Product is a bundle** → “Included in this set”: grid of product cubes + clickable popups (Yves Rocher style).
2. **Product is part of one or more bundles** → “Bundle Up and Save!”: horizontal carousel of related bundle products.
3. **Neither** → Section renders nothing (or a design-mode hint).

## Relating products to bundles

**Yes — the section can relate one product to another where one acts as a bundle composed of other products:**

- **Product as bundle**: One product (the “bundle”) is composed of other products. Set `custom.bundle_products` on the bundle product to a list of the included products. On that product’s page you see “Included in this set” and the grid of items.
- **Product as part of bundles**: Any product can be related to bundle products that contain it. Set `custom.part_of_bundles` on that product to a list of the bundle product(s). On its page you see “Bundle Up and Save!” and the carousel of those bundles.
- A product can be **both**: e.g. a bundle that itself is included in a larger bundle. Use both metafields; the section shows included products first, then related bundles.

Data can also come from section blocks (Bundle item / Related bundle) instead of metafields.

## Files

- **sections/sl-bundle.liquid** — Section for theme editor. Add to product template (or any page with **Bundle product** set).
- **snippets/sl-bundle.liquid** — Included products grid + popups (used when product is a bundle).
- **snippets/sl-bundle-related.liquid** — Related bundles carousel (used when product is part of a bundle).
- **snippets/sl-bundle-combined.liquid** — Single snippet that shows both blocks when data exists (included products + related bundles). **No section required** — use it on its own (e.g. Custom Liquid block on product page).
- **locales/en.default.json**, **locales/ar.json** — Translation keys under `sections.sl_bundle` (see Localization below).

---

## When the product is a bundle

Shows “Included in this set” and the grid of items inside the bundle.

### Data source

- **Product metafield**  
  - **Bundle source** = “Product metafield (custom.bundle_products)”.  
  - On the bundle product, add metafield:
    - Namespace: `custom`
    - Key: `bundle_products`
    - Type: **List of product references**  
  - Add the products that belong to the bundle.  
  - Use **Bundle product** when the section is not on that product’s page.

- **Section blocks**  
  - **Bundle source** = “Manual (section blocks)”.  
  - Add **Bundle item** blocks and pick one product per block. Order = order in grid and popups.

### Settings (bundle mode)

- **Heading** / **Subheading** / **Included products subtitle** (use `X` for the count).  
- **Product image border color** / **Hover label** (e.g. “More Details”).

### Popup

- Each cube opens a modal: image, title, description (Show more/less), “View product” link.  
- Close with X button, overlay click, or **Escape**. Focus moves into the popup when opened and returns to the trigger when closed.

---

## When the product is part of a bundle

Shows “Bundle Up and Save!” and a horizontal scroll of bundle products that contain the current product.

### Data source

- **Product metafield**  
  - On the **current** product (the one that is *inside* a bundle), add:
    - Namespace: `custom`
    - Key: `part_of_bundles`
    - Type: **List of product references**  
  - Add the **bundle product(s)** that include this product.

- **Section blocks**  
  - Add **Related bundle** blocks and pick the **bundle product** for each.  
  - Use this when you don’t use `part_of_bundles`.

### Settings (related bundles mode)

- **Related bundles heading** (default: “Bundle Up and Save!”).  
- **Related bundles subtitle** — use `[product]` as placeholder for the current product title (e.g. “Bundle [product] to complete the routine.”).  
- **Card button label** (default: “View”).

### Carousel

- Horizontal scroll, prev/next buttons (hidden on small screens).  
- Each card: image, title, price, “View” (or custom label) link.  
- Styling matches the provided Yves Rocher–style layout.

---

## Section layout

- Full width / content width, background color, padding top/bottom and inline.

---

## Snippet-only usage

**Combined (no section needed):** Add the snippet in a **Custom Liquid** block on your product template (or in `product.liquid`). It reads metafields from the current product. Use any unique string for `section_id` if you don’t have a section (e.g. `'bundle-combined'`).

```liquid
{% render 'sl-bundle-combined',
  product: product,
  section_id: 'bundle-combined',
  subtitle: 'This set includes X products',
  border_color: '#FE2C55',
  hover_text: 'More Details',
  related_title: 'Bundle Up and Save!',
  related_subtitle: 'Bundle [product] to complete the routine.',
  related_quick_add_label: 'View'
%}
```

With explicit lists (e.g. when not on product page):

```liquid
{% render 'sl-bundle-combined',
  bundle_products: product.metafields.custom.bundle_products.value,
  related_bundles: product.metafields.custom.part_of_bundles.value,
  current_product_title: product.title,
  section_id: 'bundle-combined'
%}
```

To see why nothing shows, add `debug: true` or open the theme editor (debug appears automatically).

**Included products only (product is a bundle):**

```liquid
{% assign bundle_items = product.metafields.custom.bundle_products.value %}
{% render 'sl-bundle',
  bundle_products: bundle_items,
  section_id: 'my-bundle',
  subtitle: 'This set includes X products',
  border_color: '#FE2C55',
  hover_text: 'More Details'
%}
```

**Related bundles only (product is part of bundles):**

```liquid
{% assign bundles = product.metafields.custom.part_of_bundles.value %}
{% render 'sl-bundle-related',
  related_bundles: bundles,
  current_product_title: product.title,
  section_id: 'related-1',
  title: 'Bundle Up and Save!',
  subtitle: 'Bundle [product] to complete the routine.',
  quick_add_label: 'View'
%}
```

---

## Localization

Locale namespace: **`sections.sl_bundle`**. Copy `locales/en.default.json` and `locales/ar.json` into your theme and translate as needed.

| Key | Purpose |
|-----|--------|
| `close` | Popup close button (aria-label) |
| `hover_label` | Cube hover text (e.g. “More Details”) |
| `about_product` | Popup “About the product” heading |
| `show_more` / `show_less` | Description expand/collapse |
| `view_product` | Link text in popup |
| `included_heading` | “Included in this set” (section heading default) |
| `subtitle` | “This set includes X products” (X = count) |
| `empty_included` | Design-mode message when no bundle products |
| `related_heading` | “Bundle Up and Save!” |
| `related_subtitle` | “Bundle [product] to complete the routine.” |
| `related_button` | Card button (e.g. “View”) |
| `empty_related` | Design-mode message when no related bundles |
| `empty_combined` | Message when snippet has no bundle data |

**RTL:** The section and snippets set `dir="rtl"` automatically for `ar`, `he`, `fa`, `ur`, `yi`. Add `.sl-bundle-rtl` / `.sl-bundle-section-rtl` / `.sl-bundle-related-rtl` overrides if you need to flip layout or icons.

## Metafield definitions

Create in **Settings → Custom data → Products** (or via your app):

| Key                 | Type                     | Use case                    |
|---------------------|--------------------------|-----------------------------|
| `custom.bundle_products`  | List of product references | Products *in* this bundle  |
| `custom.part_of_bundles` | List of product references | Bundle products that *contain* this product |

---

## Requirements

- Theme supports sections and snippets (Shopify 2.0).  
- For metafield modes: create the definitions above so the section can read them.
