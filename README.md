# Shopify Sections Library

A comprehensive, categorized library of Shopify sections and snippets. Copy what you need into your theme.

**Library last updated:** 2025-02-28

---

## Contents

- [Quick reference (by category)](#quick-reference-by-category)
- [All sections & snippets](#all-sections--snippets)
- [Section Lab (all sections)](#section-lab-all-sections)
- [Folder structure](#folder-structure-per-section)
- [Categories overview](#categories-overview)
- [Source repositories](#source-repositories-included-in-this-library)
- [Original sections (this repo)](#original-sections-this-repo)
- [Plan and progress](#plan-and-progress)
- [Authors & license](#authors--license)

---

## Quick reference (by category)

Within each category, entries are sorted by **Updated** (oldest first, most recent at bottom).

| Category | Section / Snippet | Source | Updated |
|----------|-------------------|--------|---------|
| **Carousels & Sliders** | [Fancy Slick Carousel](Fancy%20Slick%20Carousel/README.md) | patrickbolle/shopify-snippets | 2025-02-14 |
| | [Hero Slider (rocklss)](Hero%20Slider%20(rocklss)/README.md) | rocklss/shopify_section | 2025-02-14 |
| | [Marquee Products](Marquee%20Products/README.md) | bstroshek/marquee-section | 2026-02-14 |
| **Content & Layout** | [Double Block Section](Double%20Block%20Section/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| **Forms & Contact** | [Sectioned Contact Form](Sectioned%20Contact%20Form/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| **Snippets & Utilities** | [IP Redirection](IP%20Redirection/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| | [Pagination With Numbers](Pagination%20With%20Numbers/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| | [Tabbed Description](Tabbed%20Description/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| **Product & Collection** | [Collection Page Swatches](Collection%20Page%20Swatches/README.md) | patrickbolle/shopify-snippets | 2026-02-14 |
| | [SL – Price Bubble Widget](Section%20Lab/Price%20Bubble%20Widget/README.md) | Section Lab (paid) | 2026-02-16 |
| | [SL – Icon List (Product Bullets)](Section%20Lab/Icon%20List/README.md) | Section Lab (paid) | 2026-02-18 |
| | [SL – Payment Icons](Section%20Lab/Payment%20Icons/README.md) | Section Lab (paid) | 2026-02-18 |
| | [SL – Bundle](Section%20Lab/Bundle/README.md) | Section Lab (this repo) | 2026-02-25 |
| | [Scarcity Bar](Scarcity%20Bar/README.md) | Custom (this repo) | 2026-02-25 |
| | [SL – How to Use](Section%20Lab/How%20To%20Use/README.md) | Section Lab (metaobjects) | 2026-02-27 |
| | [SL – Frequently Bought Together](Section%20Lab/Frequently%20Bought%20Together/README.md) | Section Lab (paid) | 2026-02-27 |
| | [SL – Volume Discount](Section%20Lab/Volume%20Discount/README.md) | Section Lab (this repo) | 2026-02-28 |
| | [SL – Active Ingredients](Section%20Lab/Active%20Ingredients/README.md) | Section Lab (this repo) | 2026-03-07 |
| **Media & Gallery** | [Image Gallery (BoldizArt)](Image%20Gallery%20(BoldizArt)/README.md) | BoldizArt/Shopify-Image-Gallery | 2025-02-14 |
| **Video & Media** | [YouTube Section](YouTube%20Section/README.md) | prowebcoder/shopify-sections-youtube | 2025-02-14 |
| | [Media Slider Snap](Media%20Slider%20Snap/README.md) | Custom (video-section2) | 2026-02-14 |
| | [Videos Slider (Mixed Media Carousel)](Videos%20Slider/README.md) | Custom (SS section) | 2026-02-14 |
| | [Video Slider](Video%20Slider/README.md) | Meetanshi blog | 2026-02-14 |
| | [SL – Native Video Slider](Section%20Lab/Native%20Video%20Slider/README.md) | Section Lab (paid) | 2026-02-16 |
| | [SL – Before And After](Section%20Lab/Before%20And%20After/README.md) | Section Lab (paid) | 2026-02-26 |
| | [SL – Real Results](Section%20Lab/Real%20Results/README.md) | Section Lab (paid) | 2026-02-26 |
| | [SL – UGC Videos Homepage](Section%20Lab/UGC%20Videos%20Homepage/README.md) | Section Lab (paid) | 2026-02-27 |
| | [SL – Social Proof Video](Section%20Lab/Social%20Proof%20Video/README.md) | Section Lab (paid) | 2026-02-27 |
| **Specialized** | [Timeline (rocklss)](Timeline%20(rocklss)/README.md) | rocklss/shopify_section | 2025-02-14 |
| | [Pricing Table (rocklss)](Pricing%20Table%20(rocklss)/README.md) | rocklss/shopify_section | 2025-02-14 |
| | [FAQ](FAQ/readme.md) | Sections.Design (this repo) | 2026-02-14 |
| | [Quiz](Quiz/README.md) | Sections.Design (this repo) | 2026-02-14 |
| | [Tooltips](Tooltips/README.md) | Sections.Design (this repo) | 2026-02-14 |
| | [App Optimization](App%20Optimization/readme.md) | Sections.Design (this repo) | 2026-02-14 |
| **Navigation & Content** | [SL – Story Navigation](Section%20Lab/Story%20Navigation/README.md) | Section Lab (paid) | 2026-02-16 |
| | [SL – Scrolling Content](Section%20Lab/Scrolling%20Content/README.md) | Section Lab (paid) | 2026-02-24 |
| **Promotional** | [SL – Announcement Bar](Section%20Lab/Announcement%20Bar/README.md) | Section Lab (paid) | 2026-02-16 |
| | [SL – Delivery Countdown](Section%20Lab/Delivery%20Countdown/README.md) | Section Lab (paid) | 2026-02-18 |
| | [SL – Free Shipping Progress Bar](Section%20Lab/Free%20Shipping%20Progress%20Bar/README.md) | Section Lab (this repo) | 2026-02-28 |
| **Marketing & Social Proof** | [SL – Face Proof Bubble](Section%20Lab/Face%20Proof%20Bubble/README.md) | Section Lab (paid) | 2026-02-18 |
| | [SL – Sales Nudge Widget](Section%20Lab/Nudges%20Widget/README.md) | Section Lab (paid) | 2026-02-28 |
| **Maps & Local** | [Shop by State Map](Shop%20by%20State%20Map/README.md) | bhoomikakanwarchouhan2104-cpu/shop-by-state-Map-Feature- | 2025-02-14 |

---


## All sections & snippets

Every folder that contains `.liquid` section or snippet files. Sorted by last updated (oldest first, most recent at bottom). Each folder has a README with install steps and source.

| Section / Snippet | Description | Updated |
|------------------|-------------|---------|
| [App Optimization](App%20Optimization/readme.md) | Optimize ScriptTag-loaded apps (block or load on interaction). | 2026-02-14 |
| [Collection Page Swatches](Collection%20Page%20Swatches/README.md) | Color swatches on collection pages (snippet). | 2026-02-14 |
| [Double Block Section](Double%20Block%20Section/README.md) | Two-block hero: 3/4 + 1/4 image layout. | 2026-02-14 |
| [FAQ](FAQ/readme.md) | Accessible FAQ with SEO FAQ schema. | 2026-02-14 |
| [IP Redirection](IP%20Redirection/README.md) | Redirect by IP / geo (snippet). | 2026-02-14 |
| [Marquee Products](Marquee%20Products/README.md) | Horizontal scrolling product marquee. | 2026-02-14 |
| [Media Slider Snap](Media%20Slider%20Snap/README.md) | Video/media slider with snap scroll. | 2026-02-14 |
| [Pagination With Numbers](Pagination%20With%20Numbers/README.md) | Numbered pagination (snippet). | 2026-02-14 |
| [Quiz](Quiz/README.md) | Product recommendation quiz section. | 2026-02-14 |
| [Sectioned Contact Form](Sectioned%20Contact%20Form/README.md) | Drag-and-drop contact form builder. | 2026-02-14 |
| [Tabbed Description](Tabbed%20Description/README.md) | Product description in tabs by H6 (snippet). | 2026-02-14 |
| [Tooltips](Tooltips/README.md) | Product tooltips section. | 2026-02-14 |
| [Video Slider](Video%20Slider/README.md) | Horizontal video slider (Swiper.js). | 2026-02-14 |
| [Videos Slider](Videos%20Slider/README.md) | Mixed media carousel (images + videos). | 2026-02-14 |
| [SL – Announcement Bar](Section%20Lab/Announcement%20Bar/README.md) | Top announcement bar. | 2026-02-16 |
| [SL – Native Video Slider](Section%20Lab/Native%20Video%20Slider/README.md) | Native video slider. | 2026-02-16 |
| [SL – Price Bubble Widget](Section%20Lab/Price%20Bubble%20Widget/README.md) | Price bubble / badge. | 2026-02-16 |
| [SL – Story Navigation](Section%20Lab/Story%20Navigation/README.md) | Story-style navigation. | 2026-02-16 |
| [SL – Delivery Countdown](Section%20Lab/Delivery%20Countdown/README.md) | Delivery countdown timer. | 2026-02-18 |
| [SL – Face Proof Bubble](Section%20Lab/Face%20Proof%20Bubble/README.md) | Social proof bubble. | 2026-02-18 |
| [SL – Icon List](Section%20Lab/Icon%20List/README.md) | Product bullets / icon list. | 2026-02-18 |
| [SL – Payment Icons](Section%20Lab/Payment%20Icons/README.md) | Payment method icons. | 2026-02-18 |
| [SL – Scrolling Content](Section%20Lab/Scrolling%20Content/README.md) | Horizontal scrolling marquee text. | 2026-02-24 |
| [Product Card Label](Product%20Card%20Label/README.md) | On-card label from metafield (snippet). | 2026-02-25 |
| [Scarcity Bar](Scarcity%20Bar/README.md) | "Only X left" urgency bar with progress. | 2026-02-25 |
| [SL – Bundle](Section%20Lab/Bundle/README.md) | Bundle products grid + detail popups (Yves Rocher style). | 2026-02-25 |
| [SL – Before And After](Section%20Lab/Before%20And%20After/README.md) | Before/after video or media. | 2026-02-26 |
| [SL – Real Results](Section%20Lab/Real%20Results/README.md) | Real results / testimonials. | 2026-02-26 |
| [SL – Frequently Bought Together](Section%20Lab/Frequently%20Bought%20Together/README.md) | Product slider (recommendations or manual). | 2026-02-27 |
| [SL – How to Use](Section%20Lab/How%20To%20Use/README.md) | Product "how to use" steps (metaobject or blocks). | 2026-02-27 |
| [SL – Social Proof Video](Section%20Lab/Social%20Proof%20Video/README.md) | Social proof video section. | 2026-02-27 |
| [SL – UGC Videos Homepage](Section%20Lab/UGC%20Videos%20Homepage/README.md) | UGC videos on homepage. | 2026-02-27 |
| [SL – Free Shipping Progress Bar](Section%20Lab/Free%20Shipping%20Progress%20Bar/README.md) | Cart free-shipping threshold progress bar. | 2026-02-28 |
| [SL – Sales Nudge Widget](Section%20Lab/Nudges%20Widget/README.md) | Sales nudge / urgency widget. | 2026-02-28 |
| [SL – Volume Discount](Section%20Lab/Volume%20Discount/README.md) | Volume/quantity discount tiers (metaobject). | 2026-02-28 |
| [SL – Active Ingredients](Section%20Lab/Active%20Ingredients/README.md) | Product active botanical ingredients accordion + popup (Yves Rocher style). | 2026-03-07 |

---

## Section Lab (all sections)

Section Lab sections live under `Section Lab/`. Each has a `sections/` folder and often `snippets/` and/or `locales/`. Sorted by last updated (oldest first, most recent at bottom).

| Section | Description | Updated |
|---------|-------------|---------|
| [SL – Announcement Bar](Section%20Lab/Announcement%20Bar/README.md) | Top announcement bar. | 2026-02-16 |
| [SL – Native Video Slider](Section%20Lab/Native%20Video%20Slider/README.md) | Native video slider. | 2026-02-16 |
| [SL – Price Bubble Widget](Section%20Lab/Price%20Bubble%20Widget/README.md) | Price bubble / badge. | 2026-02-16 |
| [SL – Story Navigation](Section%20Lab/Story%20Navigation/README.md) | Story-style navigation. | 2026-02-16 |
| [SL – Delivery Countdown](Section%20Lab/Delivery%20Countdown/README.md) | Delivery countdown timer. | 2026-02-18 |
| [SL – Face Proof Bubble](Section%20Lab/Face%20Proof%20Bubble/README.md) | Social proof bubble. | 2026-02-18 |
| [SL – Icon List](Section%20Lab/Icon%20List/README.md) | Product bullets / icon list. | 2026-02-18 |
| [SL – Payment Icons](Section%20Lab/Payment%20Icons/README.md) | Payment method icons. | 2026-02-18 |
| [SL – Scrolling Content](Section%20Lab/Scrolling%20Content/README.md) | Horizontal scrolling marquee text. | 2026-02-24 |
| [SL – Bundle](Section%20Lab/Bundle/README.md) | Bundle products grid + detail popups (Yves Rocher style). | 2026-02-25 |
| [SL – Before And After](Section%20Lab/Before%20And%20After/README.md) | Before/after video or media. | 2026-02-26 |
| [SL – Real Results](Section%20Lab/Real%20Results/README.md) | Real results / testimonials. | 2026-02-26 |
| [SL – Frequently Bought Together](Section%20Lab/Frequently%20Bought%20Together/README.md) | Product slider (recommendations or manual). | 2026-02-27 |
| [SL – How to Use](Section%20Lab/How%20To%20Use/README.md) | Product "how to use" steps (metaobject or blocks). | 2026-02-27 |
| [SL – Social Proof Video](Section%20Lab/Social%20Proof%20Video/README.md) | Social proof video section. | 2026-02-27 |
| [SL – UGC Videos Homepage](Section%20Lab/UGC%20Videos%20Homepage/README.md) | UGC videos on homepage. | 2026-02-27 |
| [SL – Free Shipping Progress Bar](Section%20Lab/Free%20Shipping%20Progress%20Bar/README.md) | Cart free-shipping threshold progress bar. | 2026-02-28 |
| [SL – Sales Nudge Widget](Section%20Lab/Nudges%20Widget/README.md) | Sales nudge / urgency widget. | 2026-02-28 |
| [SL – Volume Discount](Section%20Lab/Volume%20Discount/README.md) | Volume/quantity discount tiers (metaobject). | 2026-02-28 |
| [SL – Active Ingredients](Section%20Lab/Active%20Ingredients/README.md) | Product active botanical ingredients accordion + popup (Yves Rocher style). | 2026-03-07 |

---

## Folder structure (per section)

Each section or snippet group lives in its own folder. Section Lab sections use a shared parent folder:

```
SectionName/                    # or Section Lab/SubSectionName/
├── sections/                   # .liquid section files (if section)
├── snippets/                   # .liquid snippets (if used)
├── assets/                     # .js, .css (if used)
├── locales/                    # .json translations (optional, e.g. Section Lab)
└── README.md                   # Description, install steps, source, last updated
```

**Using a section:** Copy the section’s `sections/` (and any `snippets/`, `assets/`, `locales/`) into your theme, then add the section via the theme editor or template JSON.

---

## Categories overview

| Category | Contents |
|----------|----------|
| **Carousels & Sliders** | Marquee, hero sliders, fancy carousels |
| **Content & Layout** | Double block, image/text, grids |
| **Forms & Contact** | Contact form builders |
| **Snippets & Utilities** | Tabbed description, pagination, IP redirect |
| **Product & Collection** | Bundle, how to use, price bubble, icon list, payment icons, FBT, volume discount, scarcity bar, swatches |
| **Media & Gallery** | Image galleries, grid banners |
| **Video & Media** | Native video slider, UGC, social proof video, before/after, real results, media snap, video sliders, YouTube |
| **Specialized** | Timeline, pricing table, FAQ, quiz, tooltips, app optimization |
| **Navigation & Content** | Story navigation, scrolling content |
| **Promotional** | Announcement bar, delivery countdown, free shipping progress bar |
| **Marketing & Social Proof** | Face proof bubble, sales nudge |
| **Maps & Local** | Shop by state/region |

---

## Source repositories (included in this library)

| Repo | Contents |
|------|----------|
| [bstroshek/marquee-section](https://github.com/bstroshek/marquee-section) | Marquee Products |
| [patrickbolle/shopify-snippets](https://github.com/patrickbolle/shopify-snippets) | Tabbed description, pagination, double block, sectioned contact form, fancy slick carousel, collection swatches, IP redirection |
| [rocklss/shopify_section](https://github.com/rocklss/shopify_section) | Hero slider, timeline, pricing table (and more: 360°, catalog, color, discount campaign, grid banner, Instagram, team member) |
| [BoldizArt/Shopify-Image-Gallery](https://github.com/BoldizArt/Shopify-Image-Gallery) | Image gallery |
| [prowebcoder/shopify-sections-youtube](https://github.com/prowebcoder/shopify-sections-youtube) | YouTube section |
| [bhoomikakanwarchouhan2104-cpu/shop-by-state-Map-Feature-](https://github.com/bhoomikakanwarchouhan2104-cpu/shop-by-state-Map-Feature-) | Shop by state (India) map |
| [Safranlive/sections-gallery](https://github.com/Safranlive/sections-gallery) | Sample marketplace sections (reference) |
| [I-K-M/shopify-custom-sections](https://github.com/I-K-M/shopify-custom-sections) | Custom FAQ, grid, slideshow, etc. (reference) |
| [bilalnaseer/shopify-sections](https://github.com/bilalnaseer/shopify-sections) | Animated banner, FAQ, timeline, video carousel, etc. (reference) |
| [TamimOp/Shopify_storecodes](https://github.com/TamimOp/Shopify_storecodes) | Announcement bar, sliders, marquee, etc. (reference) |
| [Vinu108/Shopify-Sections](https://github.com/Vinu108/Shopify-Sections) | Hero, timeline (reference) |
| [iShopifyExpert/custom-slider](https://github.com/iShopifyExpert/custom-slider) | Custom / gallery slider (reference) |
| [uxhacks/shopify-sections](https://github.com/uxhacks/shopify-sections) | Sections (reference) |
| [jydykun/Shopify-Sections](https://github.com/jydykun/Shopify-Sections) | Skeleton theme (reference) |
| **Section Lab** (this repo / paid bundle) | Active Ingredients, Bundle, How to Use, FBT, Volume Discount, Free Shipping Progress Bar, Price Bubble, Icon List, Payment Icons, Announcement Bar, Delivery Countdown, Face Proof Bubble, Nudges, Story Navigation, Scrolling Content, Native Video Slider, UGC Videos, Social Proof Video, Before And After, Real Results |

---

## Original sections (this repo)

- **App Optimization** — Optimize ScriptTag-loaded apps (block or load on interaction). [Demo](https://sections.design/blogs/shopify/app-optimization)
- **FAQ** — Accessible FAQ with SEO FAQ schema. [Demo](https://sections.design/blogs/shopify/faq-rich-snippets-section#demo)
- **Tooltips** — Product tooltips. [Demo](https://sections.design/blogs/shopify/product-tooltips#shopify-section-tooltips)
- **Quiz** — Product recommendation quiz (type, tags, vendor, price, options). [Demo](https://sections.design/blogs/shopify/quiz#shopify-section-Quiz)

---

## Plan and progress

See **[PLAN.md](PLAN.md)** for the build plan, repo mapping, and progress log.

---

## Authors & license

- **Mircea Piturca** — [Sections.Design](https://sections.design) (original sections)
- Sections from other repos are attributed in each section’s README and in the tables above.

**License:** This project is licensed under the MIT License. Individual section sources may have different licenses; see each section’s README and the source repository.
