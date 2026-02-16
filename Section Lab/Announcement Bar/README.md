# SL Announcement Bar (Section Lab)

Top-of-page announcement bar with optional **countdown timer**. Rich text message, optional link for the whole bar, and a message shown when the countdown ends. Timer can appear before or after the text.

**Category:** Promotional / Navigation  
**Source:** Section Lab (paid bundle) — **internal use only**  
**Last updated in library:** 2025-02-14

## Features

- **Content:** Rich text (e.g. “FINAL SALE up to 70%”), optional **link for entire bar**.
- **Countdown:** Target date/time in `YYYY-MM-DD HH:MM`; shows Days, Hours, Minutes until then.
- **After countdown:** Rich text “Message after countdown ends” (stored as plain text for the script).
- **Layout:** Timer position **before text** or **after text**.
- **Style:** Font size, countdown number size, background color, border (color, width, radius).

## Installation

1. Copy `sections/sl-announcement-bar.liquid` to your theme **sections** folder.
2. In Theme Editor, add the **SL Announcement Bar** section (usually at the top of the theme or in a header group).
3. Set **Text**, **Countdown target time** (e.g. `2025-04-10 18:00`), **Message after countdown ends**, optional **Link for entire bar**, timer position, and styling.

## Countdown format

Use **YYYY-MM-DD HH:MM** in the store’s timezone (e.g. `2025-04-10 18:00`). When the countdown reaches zero, the timer is replaced by “Message after countdown ends” (HTML is stripped for the script; plain text only).

## License

**Section Lab (paid).** For internal use only. Do not redistribute. Use according to your Section Lab bundle terms.
