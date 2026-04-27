# Prompt: Generate a Non-Technical Team Presentation on Claude Code + Shopify CLI

> Copy everything below the line into any AI (ChatGPT, Gemini, Claude, etc.) to generate the deck.
> Add screenshots / brand colors after the AI returns the slides.

---

## YOUR ROLE

You are an expert presentation designer and storyteller. Your audience is **non-technical** — marketing managers, operations leads, e-commerce managers, customer service, and company leadership. Many have never written code and may not know what a "CLI" or a "Shopify theme" is. Your job is to make the value **obvious, visual, and exciting** — not to teach engineering.

Produce a **complete slide-by-slide presentation** in clean markdown. For each slide give me:
- **Slide title**
- **Visual direction** (what image, screenshot, diagram, or layout should be there)
- **Body content** (the actual on-slide text — keep it tight, max ~40 words per slide)
- **Speaker notes** (what the presenter will say out loud, conversational, ~3–5 sentences)

Total deck length: **18–22 slides**. End with a strong call to action.

---

## THE BIG IDEA OF THE TALK

> "Using **Claude Code** (an AI coding assistant) plus the **Shopify CLI** (a command-line tool that talks directly to our store), one person can build, customize, and ship Shopify features in **minutes** that traditionally take a developer **days or weeks**. We've already used it to build 25+ store sections, custom labels, WhatsApp automation, and a full Help Center page — without writing code from scratch."

The point of the talk is to:
1. Demystify what Claude Code is (an AI that reads/writes code on demand).
2. Show **real, recently-shipped examples** the team will recognize.
3. Translate technical wins into business outcomes (faster A/B tests, cheaper iterations, more campaigns shipped, fewer dependencies on outside developers).
4. Get the team excited and ready to **request changes** instead of working around limitations.

---

## CONTEXT YOU NEED ABOUT WHAT WE'VE ALREADY BUILT

This is a real Shopify store ecosystem. Two stores are involved:
- **Uncovered** (live, production e-commerce store)
- **Hawk Socks** (newer store under development)

All the work below was done **interactively, in plain English**, by describing what we wanted to a Claude Code agent. The agent wrote the code, pushed it to the live Shopify theme via the Shopify CLI, and previewed the result — with no code written by hand by the operator.

### 1. Help Center Page (Hawk Socks) — built end-to-end in one short session

- Researched the brand colors and fonts from the Shopify theme settings automatically
- Studied a reference (Bombas help center) for inspiration
- Built a fully responsive Help Center page with:
  - Hero headline + subheading
  - Quick-action buttons (**Track My Order**, **Start a Return**)
  - 6 Category cards with icons (**Shipping & Delivery**, **Orders**, **Returns & Exchanges**, **Payment**, **Size Details**, **Contact Us**)
  - 13 FAQ entries grouped by category, in expandable accordions
  - Smooth scroll-to-section when a card is clicked
  - WhatsApp deep links with **pre-written messages** for "Start a Return" and "Size Details" (clicking opens WhatsApp with the message already typed)
  - Internal links for "Track My Order" → customer account, "Contact Us" → contact page
- Branding-matched: same heading font (Bricolage Grotesque), same body font (Poppins), same color palette (light bg + black + navy accent), same button radius
- Pushed live to Shopify in real time
- **Fully editable in Shopify's theme editor** — non-technical staff can change text, colors, FAQ content, and links without touching code

### 2. Section Lab — 27+ reusable Shopify sections

This is a library of plug-and-play store features. Each one can be added to any page in seconds. Categories:

**Discount & Offer mechanics** (core revenue drivers)
- Bundle (multi-product bundles with savings)
- Buy 2 Get 1
- Buy 3 Offer
- Volume Discount (tiered pricing)
- Stacked Offers (combine multiple deals)
- Free Gift (free item over a threshold)
- Frequently Bought Together
- Free Shipping Progress Bar (motivates customers to add more to hit free shipping)

**Trust & social proof**
- Social Proof Video
- Real Results (before/after results)
- UGC Videos Carousel
- UGC Videos Homepage
- Face Proof Bubble (customer face/testimonial bubble)
- Highlights (product benefits/badges)

**Conversion nudges & urgency**
- Announcement Bar
- Delivery Countdown timer ("order in next 2h 12min for delivery tomorrow")
- Nudges Widget
- Price Bubble Widget
- Payment Icons (trust indicator at checkout)

**Content & product education**
- Active Ingredients
- How To Use
- Before/After Video
- Story Navigation (Instagram-story style nav)
- Scrolling Content
- Native Video Slider
- Icon List / Avatar Slider

### 3. Smart Product Card Labels (Uncovered)

- **BOGO label** — Auto-shows "Buy 2 Get 1" badge on any product tagged `bogo`
- **Gender label** — Reads a Shopify product metafield (`custom.signature_hims_hers`) and shows "For Him" / "For Her" / "Unisex"
- **Scent label** — Auto-displays scent profile from product metafield
- **Shipping bar restyle** — Custom-styled free-shipping progress, matched to brand

All four are smart: they only render where relevant, are bilingual (English / Arabic), and require zero per-product manual work.

### 4. WhatsApp Abandoned Cart Recovery

- Customers who add to cart but don't check out automatically receive a personalized WhatsApp message
- Powered by Shopify Flow + a self-hosted WhatsApp HTTP API
- Diagnosed and fixed an existing flow bug in minutes (a typo was preventing messages from sending — caught and corrected on the spot)

### 5. Shipping API Integrations

- **J&T Express Mexico** API client + browser dashboard for creating shipments, tracking, and zip-code coverage checks
- **ShipBlu** (Egypt courier) API explorer
- These let operations create and track shipments without logging into multiple courier portals

### 6. Live theme management via CLI

- Changes are pushed to the actual live store from the developer's machine
- A revision can be deployed in seconds and rolled back just as fast
- The Shopify theme editor still works on top — non-technical team members can keep editing the result through the standard UI

---

## HOW THE WORKFLOW ACTUALLY FEELS (use this for the "How it works" slides)

Describe it in this human-friendly way:

1. **You describe what you want, in plain English.**
   *Example: "Build me a Help Center page like Bombas, with our brand colors, FAQ accordions for shipping / orders / returns / payment, and a WhatsApp button for size questions."*
2. **The AI reads our store, our brand colors, and our existing code.** It understands the project — like a senior developer who's already onboarded.
3. **It writes the feature** (a Shopify section file, the page template, icons, styling) and saves it locally.
4. **It pushes the change to the live store** through the Shopify CLI, instantly.
5. **You review it in the browser**, ask for tweaks ("make Orders card scroll to the Orders FAQ", "the title isn't visible after scroll, add a highlight"), and the AI iterates.
6. The whole loop — request → code → live → adjust — **takes minutes, not days.**

The key insight for the audience: **They don't have to wait for a developer sprint.** Marketing or merchandising can request a discount banner today, see it live today, and A/B test it tomorrow.

---

## SUGGESTED SLIDE STRUCTURE

Build around this arc:

1. **Title slide** — *e.g. "Shipping Faster: How AI + the Command Line Are Reshaping How We Build Our Stores"*
2. **The old way vs the new way** — A simple before/after comparison (developer ticket → 2-week sprint → maybe vs describe in English → live in 30 minutes)
3. **What is Claude Code? (in plain language)** — An AI assistant that can read, write, and ship code, working alongside us like a teammate
4. **What is the Shopify CLI?** — A direct line from our laptop to our live store; lets us push changes instantly
5. **The two together = our new workflow** — Diagram: Person → Claude Code → Shopify CLI → Live Store
6. **What we've already built (overview)** — A grid of all 27+ sections + Help Center + WhatsApp + shipping integrations. Visual impact.
7. **Deep dive: Help Center page** — Show the result; explain it was built in one short session
8. **Deep dive: Discounts & offers library** — Bundle, Buy 2 Get 1, Volume Discount, Free Gift — all reusable, configurable, brand-matched
9. **Deep dive: Trust & social proof modules** — UGC videos, Real Results, Face Proof Bubble
10. **Deep dive: Smart product labels** — Auto-rendering BOGO, gender, and scent labels, bilingual
11. **Deep dive: WhatsApp abandoned cart** — Catching lost revenue automatically
12. **Deep dive: Shipping integrations** — Operations team gets their own dashboards
13. **The real numbers** — *(use illustrative comparisons; replace with our real ones if available)*: typical agency cost for one Shopify section, vs what we paid in time using Claude Code; days saved per feature; number of variants we can now A/B test
14. **What this means for marketing** — Faster campaigns, more landing-page variants, faster reaction to bestsellers
15. **What this means for operations** — Custom internal tools without an engineering ticket
16. **What this means for customer service** — Self-service Help Center, WhatsApp pre-filled flows, fewer tickets
17. **What this means for leadership** — Lower per-change cost, less dependency on external dev shops, faster experimentation
18. **Live demo (optional placeholder slide)** — "Watch this: I'll build a new section live"
19. **What we are NOT replacing** — Designers still set the visual direction; brand voice still comes from us; AI still needs to be guided. This is augmentation, not replacement.
20. **How to request something new** — A simple intake (Slack channel, form, ticket): describe what you want in plain English, attach a reference if any, and the AI-assisted operator turns it around
21. **Roadmap / what's next** — More sections, broader CRO experiments, automated reporting, multi-store rollouts
22. **Closing slide / call to action** — *"What would you build first? Drop your ideas in #ai-store-requests."*

---

## TONE & STYLE GUIDELINES

- **No jargon.** Avoid: "repository," "commit," "schema," "Liquid," "merge conflict," "branch," "API endpoint." Replace with: "the project," "save," "structure of the section," "template language," "version conflict," "version," "connection point."
- **Concrete > abstract.** Every claim should have an example. "We can build sections fast" → "We built 27 sections this quarter."
- **Show, don't tell.** Heavy on screenshots, diagrams, and side-by-side comparisons. Light on bullet-point walls.
- **Confident, not over-promising.** Don't claim "no bugs ever" or "zero developer needed forever." Say: "dramatically faster, with the same quality bar."
- **Benefit-led headlines.** Bad: "Claude Code uses the Shopify CLI." Good: "From idea to live store, in one conversation."
- **One idea per slide.** If two ideas are on a slide, split it.

---

## VISUAL DIRECTION

- Use a clean, modern editorial style. Lots of whitespace.
- Suggest where to drop screenshots: the live Help Center page, the Shopify theme editor, the Section Lab folder, the WhatsApp message preview, the J&T dashboard.
- Where you can't suggest a real screenshot, describe a simple diagram (e.g. a 3-box flow: "Plain-English Request → AI writes code → Live Store").
- For the "What we built" overview slide, use a 5×6 grid of section name + tiny thumbnail/icon — visual impact matters more than reading every name.
- For numbers slides, use a single huge number per slide (e.g. **27** sections, **<30 min** average build time, **0** developer hires needed for these features).

---

## OUTPUT FORMAT

Return the entire deck as a single markdown document. For each slide:

```
## Slide N — <Title>

**Visual:** <description of image/diagram/layout>

**On-slide:**
<the actual text that appears on the slide — short, scannable>

**Speaker notes:**
<3–5 conversational sentences for the presenter>
```

Do not include any preamble, commentary, or "here is the deck" intro — just the slides, top to bottom.

When you're done with the slides, append one final section titled `## Suggested screenshots to capture before the meeting` listing the 6–8 specific screenshots the presenter should grab.

---

## ONE LAST THING

If anything in the brief above is missing or unclear, **make a confident, sensible assumption** rather than asking back — assume a polished, executive-ready deck for a 20-minute team meeting at an e-commerce company that runs multiple Shopify stores. Optimize for: clarity, momentum, and "I want to try this on my project."
