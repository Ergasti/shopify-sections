# Shopify Sections Library — Build Plan

**Goal:** Create a comprehensive, tabulated, categorized sections library by copying sections from the listed GitHub repos into this repo, using the same folder structure and adding READMEs with last-updated dates.

**Last plan update:** 2025-02-14

---

## Folder structure (per section)

Each section lives in its own folder:

```
SectionName/
├── sections/           # .liquid section files
├── snippets/           # .liquid snippets (if needed)
├── assets/             # .js, .css (if needed)
└── README.md           # Description, install, source, last updated
```

---

## Categories

| Category | Description |
|----------|-------------|
| **Carousels & Sliders** | Marquee, custom sliders, hero sliders, gallery sliders |
| **Product & Collection** | Collection swatches, variants as products, catalog, color |
| **Content & Layout** | Double block, rich text, image-text, grid, highlights |
| **Forms & Contact** | Sectioned contact form, contact form builder |
| **Snippets & Utilities** | Tabbed description, pagination, IP redirection |
| **Media & Gallery** | Image gallery, grid banner, Instagram |
| **Video** | YouTube sections, video carousel, video sliders |
| **Navigation & UI** | Announcement bar, mega menu, icon with text |
| **Specialized** | Pricing table, team member, timeline, FAQ, discount campaign, 360° |
| **Maps & Local** | Shop by state (India map) |
| **Existing** | Tooltips, Quiz, FAQ, App Optimization (already in repo) |

---

## Repo → sections mapping

| Source repo | Section(s) to add | Category |
|-------------|-------------------|----------|
| bstroshek/marquee-section | Marquee Products | Carousels & Sliders |
| patrickbolle/shopify-snippets | Tabbed Description (snippet) | Snippets & Utilities |
| patrickbolle/shopify-snippets | Pagination with Numbers (snippet) | Snippets & Utilities |
| patrickbolle/shopify-snippets | Double Block Section | Content & Layout |
| patrickbolle/shopify-snippets | Sectioned Contact Form | Forms & Contact |
| patrickbolle/shopify-snippets | Fancy Slick Carousel | Carousels & Sliders |
| patrickbolle/shopify-snippets | Collection Page Swatches (snippet) | Product & Collection |
| patrickbolle/shopify-snippets | IP Redirection (snippet) | Snippets & Utilities |
| rocklss/shopify_section | 360 Degree, Catalog, Color, Discount Campaign | Various |
| rocklss/shopify_section | Grid Banner, Instagram, Pricing Table | Media / Specialized |
| rocklss/shopify_section | Slider, Team Member, Timeline | Carousels / Specialized |
| BoldizArt/Shopify-Image-Gallery | Image Gallery | Media & Gallery |
| Safranlive/sections-gallery | Sample sections (hero, product grid, etc.) | Various |
| prowebcoder/shopify-sections-youtube | YouTube section | Video |
| uxhacks/shopify-sections | Sections from repo | Various |
| iShopifyExpert/custom-slider | Custom Slider, Gallery Slider | Carousels & Sliders |
| bilalnaseer/shopify-sections | Animated Banner, FAQ, Story Timeline, etc. | Various |
| TamimOp/Shopify_storecodes | Announcement Bar, Marquee, Sliders, etc. | Various |
| Vinu108/Shopify-Sections | Hero Custom, Timeline Card Animation | Content & Layout |
| I-K-M/shopify-custom-sections | Custom sections (FAQ, grid, slideshow, etc.) | Various |
| bhoomikakanwarchouhan2104-cpu/shop-by-state-Map-Feature- | State Map (India) | Maps & Local |
| jydykun/Shopify-Sections | (Skeleton theme — reference only) | — |

---

## Progress log

| Date | Action |
|------|--------|
| 2025-02-14 | Plan created; repo list and categories defined |
| 2025-02-14 | Marquee Products section added (bstroshek) — full section + snippet + CSS |
| 2025-02-14 | Patrickbolle: Tabbed Description, Pagination With Numbers, Double Block Section, Sectioned Contact Form (full files) |
| 2025-02-14 | Patrickbolle: Collection Page Swatches, IP Redirection snippets; Fancy Slick Carousel (README reference) |
| 2025-02-14 | rocklss: Hero Slider, Timeline, Pricing Table (README + install link) |
| 2025-02-14 | Image Gallery (BoldizArt), Shop by State Map, YouTube Section (README + link) |
| 2025-02-14 | Existing sections (Tooltips, Quiz, FAQ, App Optimization) READMEs updated with last-updated date |
| 2025-02-14 | Main README updated with categorized table, quick reference, source repos, and library date |

---

## Main README updates

- Add **Categories** table with section names and last-updated date.
- Add **Quick reference** table: Section | Category | Source | Updated.
- Keep existing Authors & License.
