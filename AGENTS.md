# Agent instructions — Shopify Sections Library

This repo is a **library of Shopify theme sections and snippets**. Copy sections into merchants' themes; it is not a full theme.

## Quick context

- **Structure**: Each section lives in its own folder with `sections/`, optional `snippets/`, `assets/`, `locales/`, and `README.md`. See root [README.md](README.md) for the full list and categories.
- **Section Lab**: Sections under `Section Lab/` use `sl-`-prefixed files, shared Swiper/card patterns, metaobjects, and locale namespaces like `sections.sl_volume_discount`.
- **Attribution**: Preserve source repo and license in each section README and in the main README tables.

## Project rules

Detailed, scoped instructions live in **`.cursor/rules/`**:

| Rule | When it applies |
|------|------------------|
| **project-overview.mdc** | Always — repo structure, README/conventions, adding new sections. |
| **shopify-liquid-sections.mdc** | When editing `**/*.liquid` — schema, snippets, accessibility, performance, locales. |
| **section-lab.mdc** | When editing `Section Lab/**/*` — SL naming, metaobjects, design system, README structure. |

Refer to those rules for schema conventions, RTL/locales, Swiper usage, and README format. When adding or changing sections, update the section README and the root README.md tables as needed.

## Cursor Cloud specific instructions

### Overview

This is a **Shopify Sections Library** — a static, zero-dependency collection of reusable Shopify Liquid theme sections and snippets. There is **no build system, no package manager, no test framework, and no runnable backend**. The `.liquid`, `.js`, `.css`, and `.json` files are the final product.

### Key facts

- **No dependencies to install**: No `package.json`, `Gemfile`, `requirements.txt`, or any build tooling exists.
- **No linting configured**: There is no linter config in the repo. You could install `@shopify/theme-check-node` for Liquid linting, but the repo doesn't use it.
- **No automated tests**: None exist in the repo.
- **Not a runnable app**: The code runs inside Shopify's Liquid templating engine on a Shopify store, not standalone.

### How to preview sections locally

The `_dev/` directory contains standalone HTML previews that render components with hardcoded data (simulating what Shopify's Liquid engine produces). Serve the repo root with any static file server:

```
python3 -m http.server 8080
```

Then visit `http://localhost:8080/_dev/preview-faq.html` to see the FAQ component.

### Working with Shopify (requires a Shopify Partners store)

To test sections in a real Shopify theme, you need the Shopify CLI (`npm install -g @shopify/cli @shopify/theme`). Copy section files into an OS 2.0 theme, then run `shopify theme dev` against a development store. This requires Shopify Partners credentials and is **not available in the cloud agent environment**.

### File structure

See `README.md` for the categorized table of all sections. Each section lives in its own folder:
```
SectionName/
├── sections/     # .liquid section files
├── snippets/     # .liquid snippets (if any)
├── assets/       # .js, .css (if any)
└── README.md     # Description, install steps, source
```
