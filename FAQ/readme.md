# Shopify FAQ Rich Snippets Section

**Last updated in library:** 2025-02-24

## Demo
https://sections.design/blogs/shopify/faq-rich-snippets-section#demo

## Files

```
FAQ/
├── sections/faq.liquid          # Full FAQ section (add via Theme Editor)
├── snippets/faq-item.liquid     # Reusable single FAQ item snippet
├── assets/faq.js                # Expand/collapse JS (required)
└── readme.md
```

## Installing the section

```
Copy sections/faq.liquid to your theme sections/ folder.
Copy assets/faq.js to your theme assets/ folder.
Add the FAQ section through the Theme Editor.
```

## Installing the snippet

The `faq-item` snippet renders a single FAQ accordion item. Use it to embed
FAQ items inside any section or template (e.g. a product page Custom Liquid block).

```
1. Copy snippets/faq-item.liquid to your theme snippets/ folder.
2. Copy assets/faq.js to your theme assets/ folder (if not already done).
3. Load faq.js once on the page (in your section or layout):
     <script src="{{ 'faq.js' | asset_url }}" defer></script>
```

### Snippet usage

Render individual items, then add the JSON config block so `faq.js` can
initialise the accordion:

```liquid
<div class="faq-container">
  {% render 'faq-item', title: 'What is your return policy?', content: '<p>30 days, no questions asked.</p>', block_id: 'ret-1', expanded: false %}
  {% render 'faq-item', title: 'Do you ship internationally?', content: '<p>Yes — we ship worldwide.</p>', block_id: 'ship-1', expanded: false %}
</div>

<script type="application/json" data-faq-config="my-faq">
  { "sectionId": "my-faq", "blockIds": ["ret-1", "ship-1"] }
</script>

<script src="{{ 'faq.js' | asset_url }}" defer></script>
```

### Snippet parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `title` | String | Yes | — | The question text |
| `content` | String | Yes | — | The answer HTML |
| `block_id` | String | No | `'faq-item'` | Unique ID for the accordion item |
| `expanded` | Boolean | No | `false` | Start the item expanded |

## Authors

* **Mircea Piturca** - [Sections.Design](https://sections.design)

## License

This project is licensed under the MIT License
