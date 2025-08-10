---
title: "Pantone Microblog — Implementation Tasklist"
description: "Actionable checklist to implement the Pantone-inspired microblog layout."
version: "1.0.0"
lastUpdated: "2025-08-10"
---

# Pantone Microblog — Implementation Tasklist

Scope: Implement the Pantone-style card layout for the microblog per the architecture in [pantone-microblog-architecture.md](pantone-microblog-architecture.md).

Links to key files:
- Template: [microblog.html](microblog.html)
- Styles: [css/microblog.css](css/microblog.css)
- Logic: [js/microblog.js](js/microblog.js)
- Data: [data/microblog/posts.json](data/microblog/posts.json)
- Theme tokens: [config/theme-tokens.json](config/theme-tokens.json)

## Milestones

### M1 — Color System and Data
- [ ] Create tag mapping source file with Pantone-like entries
  - File: config/tag-pantone-map.json
  - Shape: `{ "design": { "code": "17-3938", "name": "Very Peri", "color": "#6667AB" }, ... }`
- [ ] Load mapping in JS and expose helpers
  - Add module or inline map in [js/microblog.js](js/microblog.js) with:
    - getPantoneForTag(tag)
    - primaryTagFor(post)
    - fallbackPantoneFromString(seed)
- [ ] Deterministic fallback generator for unknown tags
  - Hash → hue; produce code like `12-1234`
  - Ensure high contrast foreground via idealTextColor()
- [ ] Document mapping maintenance notes inside the JSON file

Acceptance:
- [ ] Known tags map to expected color/code
- [ ] Unknown tag always maps to the same generated color/code

### M2 — Placeholder & Media
- [ ] SVG placeholder generator (encoded XML data URI)
  - Inputs: hex, emoji (by type), label (derived title)
  - Accessibility: role="img", aria-label set to title
- [ ] Use placeholder when post has no image/video
- [ ] Blur-up or solid-color background to avoid layout shift

Acceptance:
- [ ] All imageless posts render a tasteful placeholder
- [ ] No broken image icons; CLS remains minimal

### M3 — Card Template & Rendering
- [ ] Replace feed item with Pantone card structure
  - Card sections: image (4:3) + label block
  - Label block includes: PANTONE®, code, title, meta, tags, share
- [ ] Render code suffix using secondary tags (e.g., `17-3938-DR` for design+reading)
  - Suffix rule: first letters of up to 3 secondary tags (A–Z only)
- [ ] Wire tags to filter on click

Acceptance:
- [ ] Each post displays as a Pantone card
- [ ] Secondary tags generate deterministic suffixes

### M4 — CSS & Grid
- [ ] Grid layout for feed (auto-fill, min 260–320px columns)
- [ ] Pantone card styles (image area, label section, typography)
- [ ] Card entry animation (reveal)
- [ ] Colored tag chips (border/bg derived from tag color)

Acceptance:
- [ ] Mobile: 1 column; Tablet: 2–3; Desktop: 4–5 columns
- [ ] Cards visually consistent across themes

### M5 — Accessibility & Theme
- [ ] Ensure color contrast AA for text on label and chips
- [ ] Keyboard: tab to tag chips; Enter/Space to filter
- [ ] Respect reduced motion
- [ ] Works in both light and dark themes

Acceptance:
- [ ] Axe/Pa11y reports no critical issues
- [ ] Keyboard-only flow matches mouse flow

### M6 — Performance & QA
- [ ] Lazy-load images and placeholders
- [ ] Containment (`contain: content;`) on card wrappers where safe
- [ ] Verify LCP/CLS within targets
- [ ] Cross-device QA (iOS Safari, Android Chrome, Desktop)

Acceptance:
- [ ] No asset > 300KB uncompressed (images)
- [ ] Smooth scrolling and loading

## Detailed Task Checklist

- [ ] config/tag-pantone-map.json — author mapping dataset
- [ ] js/microblog.js — introduce helpers:
  - [ ] JavaScript.function() getPantoneForTag(tag)
  - [ ] JavaScript.function() primaryTagFor(post)
  - [ ] JavaScript.function() fallbackPantoneFromString(seed)
  - [ ] JavaScript.function() idealTextColor(hex)
  - [ ] JavaScript.function() deriveTitle(post)
  - [ ] JavaScript.function() svgPlaceholder({hex, emoji, label})
- [ ] microblog.html — ensure Pantone template in `#micro-post-template`
- [ ] js/microblog.js — render pipeline:
  - [ ] apply CSS custom properties on card: `--card-color`, `--card-fg`
  - [ ] compute code + suffix and inject into `.pantone-card__code`
  - [ ] content title into `.pantone-card__title`
  - [ ] fallback media via svgPlaceholder() when absent
  - [ ] colored chips with inline CSS variables
- [ ] css/microblog.css — styles:
  - [ ] `.microblog-feed` grid with `repeat(auto-fill, minmax(...))`
  - [ ] `.pantone-card` block styles + reveal animation
  - [ ] `.pantone-card__image` 4:3 with object-fit: cover
  - [ ] `.pantone-card__label` typography and spacing
  - [ ] Tag chips: colored bg/border/fg variables
- [ ] Accessibility tasks:
  - [ ] Add aria-labels to code, title, and placeholder images
  - [ ] Focus styles on chips and share button
  - [ ] Respect `prefers-reduced-motion`
- [ ] QA & Performance:
  - [ ] Lighthouse (Performance/Accessibility/Best Practices/SEO)
  - [ ] Pa11y/axe-core run
  - [ ] Verify no layout shift on load

## Definition of Done (DoD)

All items below must be true:
- [ ] Cards render with correct color, code, and title for all posts
- [ ] Imageless posts have meaningful placeholders
- [ ] Tag chips filter on click and are keyboard accessible
- [ ] Layout is responsive and visually consistent across themes
- [ ] Performance and accessibility checks pass (no critical issues)
- [ ] Code adheres to repo standards (2-space indent, separation of concerns)

## Rollout Plan

1. Implement M1–M2 behind branch `feature/pantone-cards`
2. Land M3–M4 and verify on local server
3. Run audits (Lighthouse, Pa11y)
4. Merge to main and monitor