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
