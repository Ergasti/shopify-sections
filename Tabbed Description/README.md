# Tabbed Description (Snippet)

Product description split into tabs, typically by H6 headings. Easy for merchants to manage.

**Category:** Snippets & Utilities  
**Source:** [patrickbolle/shopify-snippets](https://github.com/patrickbolle/shopify-snippets)  
**Last updated in library:** 2025-02-14

## Features

- Splits product description into tabs (structure depends on content/format).
- Optional text above all tabs vs. in first tab (`combine_pretext`).
- Inline styles and script (jQuery required for tab switching).

## Installation

1. Copy `snippets/tabbed-description.liquid` to your theme **snippets** folder.
2. In your product template, use: `{% render 'tabbed-description' %}` or pass a custom description: `{% render 'tabbed-description', tabbed-description: product.description %}`.
3. Ensure jQuery is loaded if using the included tab script.

## References

- [Shopify forum: Adding tabs on product page](https://ecommerce.shopify.com/c/ecommerce-design/t/adding-tabs-on-product-page-simple-entry-451503)
- [Shopify: Add tabs to product descriptions](https://help.shopify.com/themes/customization/products/features/add-tabs-to-product-descriptions)

## License

MIT (see source repo).
