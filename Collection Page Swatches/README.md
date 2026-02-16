# Collection Page Swatches (Snippet)

Shows color (or colour/couleur) option as clickable circles on collection pages. Each swatch links to the variant URL.

**Category:** Product & Collection  
**Source:** [patrickbolle/shopify-snippets](https://github.com/patrickbolle/shopify-snippets)  
**Last updated in library:** 2025-02-14

## Usage

Inside a collection product loop:

```liquid
{% for product in collection.products %}
  {% render 'collection-page-swatches', product: product %}
{% endfor %}
```

Product must have an option named **Color**, **Colour**, or **Couleur**. For true color preview you may need to map option values to hex (e.g. via CSS or metafields).

## Installation

1. Copy `snippets/collection-page-swatches.liquid` to your theme **snippets** folder.
2. Include it in your collection template or collection product card snippet as above.

## License

MIT (see source repo).
