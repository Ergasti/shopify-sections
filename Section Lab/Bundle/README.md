# SL - Bundle

Section and snippet that display bundle “included products” in an Yves Rocher–style layout: a grid of clickable product cubes that open a product detail popup (image, title, description, “View product” link).

## Files

- **sections/sl-bundle.liquid** — Section for theme editor. Add to product template or any page.
- **snippets/sl-bundle.liquid** — Reusable snippet (grid + popups + CSS/JS). Can be used inside the section or via a Custom Liquid block.

## Bundle data

Bundle items can come from:

1. **Product metafield**  
   - Set **Bundle source** to “Product metafield (custom.bundle_products)”.  
   - On the bundle product, add a metafield:
     - Namespace: `custom`
     - Key: `bundle_products`
     - Type: **List of product references**  
   - Add the products that belong to the bundle.  
   - On the product page, the section uses the current product’s `custom.bundle_products`.  
   - Off the product page, use the section setting **Bundle product** to choose which product’s metafield to use.

2. **Section blocks**  
   - Set **Bundle source** to “Manual (section blocks)”.  
   - Add **Product** blocks and pick one product per block. Order of blocks = order of items in the grid and popups.

## Section settings

- **Bundle source** — Metafield vs manual blocks (see above).  
- **Bundle product** — Optional. Used when the section is not on a product page; leave blank to use the current product.  
- **Heading** / **Subheading** / **Included products subtitle** (e.g. “This set includes X products”; `X` is replaced by the count).  
- **Product image border color** — Border around each product image (default pink).  
- **Hover label** — Text on hover over a cube (e.g. “More Details”).  
- Layout: full width, content width, background, padding.

## Snippet usage

Use the snippet on its own (e.g. in a Custom Liquid block or inside another section):

```liquid
{% comment %} From a product metafield (e.g. on product template) {% endcomment %}
{% assign bundle_items = product.metafields.custom.bundle_products.value %}
{% render 'sl-bundle',
  bundle_products: bundle_items,
  section_id: 'my-bundle',
  subtitle: 'This set includes X products',
  border_color: '#FE2C55',
  hover_text: 'More Details'
%}
```

Or with a section that uses blocks, the section passes `bundle_section` and `use_block_products: true` (see `sections/sl-bundle.liquid`).

## Popup behavior

- Clicking a product cube opens a modal with that product’s featured image, title, truncated description (“Show more” / “Show less”), and “View product” link.  
- Close via the X button or by clicking the overlay.  
- Body scroll is locked while a popup is open.  
- Styling follows the Yves Rocher–inspired layout (rounded image border, overlay, scrollable content).

## Requirements

- Theme supports sections and snippets (Shopify 2.0).  
- For metafield bundles: create metafield definition `custom.bundle_products` (list.product_reference) under Settings → Custom data → Products (or your app).
