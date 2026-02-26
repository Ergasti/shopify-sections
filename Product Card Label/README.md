# Product Card Label (Inspired By / Category)

On-image label on the **bottom-right** of the product card that shows a product metafield (e.g. "Inspired By" or category). Only shows when the metafield has a value.

---

## 1. Metafield in Shopify

1. **Settings** → **Custom data** → **Products** → **Add definition**
2. **Name:** e.g. `Inspired By` or `Category`
3. **Namespace and key:** `custom.inspired_by` (or `custom.category`)
4. **Type:** Single line text
5. **Storefront API access:** enabled → Save
6. On each product, set the value (e.g. "Inspired By Kayali - Vanilla 28")

---

## 2. Add snippet to your theme

- Copy `snippets/product-card-label.liquid` into your theme **snippets** folder. The snippet includes the CSS (bottom-right label styling); no separate CSS file needed.

---

## 3. Render the label on the card

In your theme’s **product card** snippet (e.g. `snippets/card-product.liquid` or the snippet used by your collection grid), find the **card image** block and add the render **inside** `card__media`, right after the closing `</div>` of the `.media` div.

**Exact placement (matches Dawn-style card markup):**

```liquid
<div class="card__media">
  <div class="media media--transparent media--hover-effect">
    <img srcset="..." src="..." sizes="..." alt="{{ product.title }}" ...>
  </div>
  {% render 'product-card-label', product: product %}
</div>
```

So the label render goes **after** the `</div>` that closes the `.media` div and **before** the `</div>` that closes `.card__media`. The snippet will only output when the product has the metafield, and the included CSS positions the label at the bottom-right of the image.

**Dawn `card-product.liquid`:** the snippet uses `card_product`. Add the render inside the `{%- if card_product.featured_media -%}` block, right after the `.media` div closes (after the secondary image `{%- endif -%}`) and before the `</div>` that closes `.card__media`:

```liquid
              {%- endif -%}
              
            </div>
          </div>
          {% render 'product-card-label', product: card_product %}
        {%- endif -%}
```

(Remove any render you added in the **placeholder** card block at the bottom (`{%- else -%}`) — the label should only be on real product cards.)

---

## 4. Use a different metafield

Default is `custom.inspired_by`. To use another metafield (e.g. category):

```liquid
{% render 'product-card-label', product: product, metafield_key: 'custom.category' %}
```

---

## File structure

```
Product Card Label/
├── snippets/
│   └── product-card-label.liquid
└── README.md
```
