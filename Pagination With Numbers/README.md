# Pagination With Numbers (Snippet)

Pagination snippet with numbered pages and previous/next arrows.

**Category:** Snippets & Utilities  
**Source:** [patrickbolle/shopify-snippets](https://github.com/patrickbolle/shopify-snippets)  
**Last updated in library:** 2025-02-14

## Usage

Use inside a `paginate` block in a collection (or other paginated) template:

```liquid
{% paginate collection.products by 12 %}
  {% for product in collection.products %}
    {% comment %} product card {% endcomment %}
  {% endfor %}
  {% render 'pagination-with-numbers' %}
{% endpaginate %}
```

## Installation

1. Copy `snippets/pagination-with-numbers.liquid` to your theme **snippets** folder.
2. Replace or add this snippet where you output pagination in your theme.

## License

MIT (see source repo).
