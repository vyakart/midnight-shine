---
title: "Design Thinking — Themes, Color System, and Visual Language"
description: "Consolidated rationale and decisions for gradients, theme tokens, and the Pantone-inspired microblog exploration."
version: "1.0.0"
lastUpdated: "2025-09-11"
---

# Design Thinking — Themes, Color System, and Visual Language

This document consolidates all prior theme-gradient and Pantone design notes into a single, authoritative reference. It replaces the following separate docs, which are now removed:
- pantone-microblog-architecture.md
- pantone-microblog-tasklist.md
- pantone-streams-architecture.md
- pantone-streams-implementation.md
- pantone-refinements-plan.md
- theme-gradient-design.md

For current implementation details of the site, see:
- Site Overview: [docs/site-overview.md](docs/site-overview.md:1)
- Runtime Theme Provider: [js/theme-provider.js](js/theme-provider.js:1)
- Theme Tokens: [config/theme-tokens.json](config/theme-tokens.json:1)
- Interests Carousel: [js/main.js](js/main.js:266)
- Global Styles: [css/styles.css](css/styles.css:1)

---

## 1) Principles

- Simplicity first: use native HTML/CSS/JS to keep interactions performant and predictable.
- Tokenized themes: colors live in JSON tokens and are reflected to CSS variables at runtime.
- Visual identity via gradients: gradients are utilities derived from tokens; no image assets.
- Accessibility: contrast, keyboard flows, focus-visible, and reduced-motion are non‑negotiable.

---

## 2) Theme System

- Canonical themes: sunsetGlow, midnightAurora, forestMist, cosmicDust, oceanBreeze.
- Source of truth: [config/theme-tokens.json](config/theme-tokens.json:1).
- Runtime application: [js/theme-provider.js](js/theme-provider.js:1) reads tokens, sets CSS variables, and injects the per‑theme icon sprite.

Design intents:
- Gradients are defined per theme (primary/secondary/accent/overlay) but used sparingly.
- The header exposes a single `.theme-switcher` target; the provider renders a toggle.

Related code touchpoints:
- Toggle wiring + sprite injection: [js/theme-provider.js](js/theme-provider.js:65)
- CSS variable consumption: [css/styles.css](css/styles.css:61)

---

## 3) Color and Assets Policy

- Posters: PNG originals only. AVIF/WebP sources and their `<source>` tags are intentionally removed for simplicity and to avoid 404s across environments.
  - Poster path helper: [js.main.posterPath()](js/main.js:281)
- Short previews: MP4 clips co‑named with their keys.
  - Video path helper: [js.main.moviePath()](js/main.js:280)
- Filenames with special characters are supported via `encodeURIComponent`, e.g.:
  - “Art & Design” → HTTP requests to `art%26design.png/mp4`.

Rationale:
- One format (PNG) keeps the authoring workflow clear and predictable.
- MP4 previews add motion on intent (hover/focus) without autoplaying heavy media.

---

## 4) Interests Carousel — Rationale and Shape

- Goal: lightweight “Netflix‑style” horizontal row that communicates interests at a glance.
- Anatomy per card:
  - Poster (PNG)
  - Title + subtitle overlay
  - Optional MP4 preview revealed on hover/focus

Key implementation notes:
- Builder and order/copy map: [js/main.js](js/main.js:269)
- Card construction (picture/img, video, overlay): [js/main.js](js/main.js:310)
- Continuous autoscroll loop with rAF: [js/main.js](js/main.js:421)
- Respect reduced‑motion; preview still exists but reveal avoids distractions at scale.

---

## 5) Pantone‑Inspired Microblog — Decision Log

We explored a Pantone‑style card language for the microblog (swatch‑like cards with color codes). That exploration is archived and distilled below, then merged into this single doc:

- Concept: represent posts as color swatches; deterministic color/code mapping for tags.
- Pros: distinct visual identity; strong typographic clarity; extensible mapping.
- Cons: extra cognitive overhead for users unfamiliar with swatch codes; additional CSS and content rules; narrative sometimes overwhelmed by presentation.

Final decision:
- Keep the Pantone concepts as a “design vocabulary,” not a mandatory layout.
- Maintain the tag→color mapping dataset for future use: [config/tag-pantone-map.json](config/tag-pantone-map.json:1)
- Retain the microblog’s pragmatic layout; incorporate color semantics where it aids scannability (chips, borders, subtle accents) without full swatch treatment.

Why consolidate:
- Multiple Pantone/gradient docs diverged and caused duplication. This single document captures the intent, the tradeoffs, and the present choices without fragmenting guidance.

---

## 6) Gradients — Practical Guidance

- Gradients remain utilities driven by tokens (no separate “gradient spec” doc).
- Use cases:
  - Background mesh for subtle depth (fixed layer after <body>)
  - Section overlays for gentle separation
  - Occasional accent animations with reduced‑motion fallbacks
- Keep gradients secondary to content. Prefer solid backgrounds for text‑heavy areas.

Where to look:
- Token gradients: [config/theme-tokens.json](config/theme-tokens.json:1)
- Utilities implemented in CSS: [css/styles.css](css/styles.css:895)

---

## 7) Accessibility

- Focus rings: explicit `:focus-visible` styling site‑wide.
- Keyboard interaction:
  - Interests carousel roving tabindex + arrow keys: [js/main.js](js/main.js:456)
  - Projects carousel keyboard handling in its viewport.
- Reduced motion:
  - Suppress/shorten transitions where they’re not essential; preview reveals avoid jarring effects.

---

## 8) Future Directions

- Theme authoring UI (token previewer) fed from [config/theme-tokens.json](config/theme-tokens.json:1).
- Optional per‑section accent gradients the author can toggle on/off at the document level.
- Color chips for tags that align with tokens while preserving legibility in both schemes.

---

## 9) Summary of Decisions

- One canonical doc for design thinking (this file).
- PNG posters only; AVIF/WebP pipeline removed.
- MP4 previews restored for Interests; “Mathematics & Physics” added.
- Pantone concept archived into this doc; not a separate spec nor a required layout.

For implementation status and changes, see the [Changelog](docs/CHANGELOG.md:1).