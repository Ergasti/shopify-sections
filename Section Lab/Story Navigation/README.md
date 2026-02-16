# SL Story Navigation (Section Lab)

Horizontal “story” strip of circular (or rounded) icons with labels and links—similar to Instagram story rings. Optional badge per item from a collection metafield. Responsive with horizontal scroll on small screens.

**Category:** Navigation / Content  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Blocks:** Each “SL Story Item” has image, link URL, and link text. Optional collection picker for badge metafield.
- **Badge:** If a block has a collection set and that collection has `metafields.custom.insta_story_badge`, it shows as a small badge on the icon.
- **Section settings:** Background color, padding (top/bottom), font size, image ratio (0.5–1), border radius, border color/width.
- **Responsive:** Centered on desktop; horizontal scroll on mobile; item width and font size adjust by breakpoint.

## Installation

1. Copy `sections/sl-story-navigation.liquid` to your theme **sections** folder.
2. In Theme Editor, add the **SL Story Navigation** section.
3. Add **SL Story Item** blocks: set **Image**, **Link**, and **Link text**. Optionally set **Collection** and add the collection metafield `custom.insta_story_badge` for a badge.

## Optional: collection badge metafield

1. In Shopify Admin: **Settings → Custom data → Collections** (or Metafields).
2. Add a metafield definition for collections, namespace `custom`, key `insta_story_badge` (single-line text or similar).
3. On a collection, set the badge text (e.g. “New” or “Sale”).
4. In the section block, pick that **Collection** so the badge appears on the story icon.

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
