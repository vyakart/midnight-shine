# Site Overview

Authoritative documentation for the Midnight Shine portfolio. This file reflects the current architecture, assets policy, and recent changes.

- Entry page: [index.html](index.html)
- Main runtime: [js/main.js](js/main.js)
- Projects carousel: [js/projects-carousel.js](js/projects-carousel.js)
- Global styles: [css/styles.css](css/styles.css)
- Theme tokens: [config/theme-tokens.json](config/theme-tokens.json)
- Theme provider: [js/theme-provider.js](js/theme-provider.js)

## Architecture

- Vanilla HTML/CSS/JS (no framework).
- Build via esbuild; hashed outputs written to `dist/`, then injected into HTML by [scripts/inject-hashes.js](scripts/inject-hashes.js).
- Two interactive carousels:
  - Interests: “Netflix‑style” horizontal row, auto‑scrolling, cards are poster PNGs with MP4 preview on hover/focus. Implemented in [js/main.js](js/main.js).
  - Projects (Questlog): Ruler‑style, infinite loop with accessible roving tabindex and category tabs. Implemented in [js/projects-carousel.js](js/projects-carousel.js).
- Theming: 5 themes using token JSON + per‑theme SVG sprite, driven at runtime by [js/theme-provider.js](js/theme-provider.js) and tokens from [config/theme-tokens.json](config/theme-tokens.json).

## Key UI surfaces

- Hero video: section in [index.html](index.html). Poster image is LCP; playback only after user intent per reduced‑motion preferences handled in [js/main.js](js/main.js).
- Interests section: container `#showcase-carousel` is prepared or rebuilt on load by [js/main.js](js/main.js). Cards are generated from an ordered list and a copy map.
- Questlog section: container `#projects-carousel`, bootstrapped from [data/timeline.json](data/timeline.json) or fallback data, via [js/projects-carousel.js](js/projects-carousel.js).

## Assets policy (current)

- Posters: Original PNGs only in [assets/posters/](assets/posters). There are no AVIF/WebP sources and no `<source>` tags for them.
- Videos: Short MP4 previews in [assets/movies/](assets/movies) with filenames that match the Interests keys after `encodeURIComponent`.
- Filenames:
  - Art & Design → poster [assets/posters/art&design.png](assets/posters) and movie [assets/movies/art&design.mp4](assets/movies)
  - Mathematics & Physics → poster [assets/posters/mathematics&physics.png](assets/posters) and movie [assets/movies/mathematics&physics.mp4](assets/movies)
  - EA → poster [assets/posters/ea.png](assets/posters) and movie [assets/movies/ea.mp4](assets/movies)
  - Plus: astro, bjj, meditation

## Interests carousel (how it works)

- Order and copy:
  - The ordered list includes: meditation, bjj, astro, art&design, mathematics&physics, ea.
  - Titles and subtitles live in a copy map alongside this list.
- Card build:
  - Each card contains:
    - `picture` with a single `<img.poster>` (PNG).
    - `<video.preview>` with `<source type="video/mp4">` for the short preview.
    - An overlay with title and subtitle.
  - Events:
    - `pointerenter`/`focusin`: start preview (muted, looped). Reduced motion: video reveal suppressed globally.
- Continuous scroll:
  - Three sets of cards (original + 2 clones) to create seamless loop.
  - `requestAnimationFrame` updates translateX; recentering occurs modulo one set width.

## Projects carousel (how it works)

- Fetches [data/timeline.json](data/timeline.json).
- Renders an infinite ruler with triplicated items for seamless loop; centers the active item.
- Category tabs (Work, Projects, Talks & shows, Easter eggs, Volunteering) update titles and hard re‑initialize the carousel for consistent layout.
- Accessible controls:
  - Keyboard arrows/Home/End on the viewport.
  - Visible focus, live region counter, and click to activate a target.

## Themes

- Theme tokens loaded from [config/theme-tokens.json](config/theme-tokens.json); values applied to CSS variables by [js/theme-provider.js](js/theme-provider.js).
- Theme icon sprites injected at runtime from [assets/icons/compiled/](assets/icons/compiled).
- The header’s theme switcher is rendered as a single toggle by the provider.

## Recent changes

- Restored MP4 previews for Interests cards: art&design, astro, bjj, ea, meditation, mathematics&physics.
- Added new Interests entry: “Mathematics & Physics”.
- Removed optimized image variants (AVIF/WebP); site now uses PNG posters only. Cleared `<source>` tags from HTML and JS.
- Standardized poster/movie filenames to match keys after URL encoding (supporting ampersands).

## Development

Build:

```bash
npm install
npm run build
```

Serve locally:
- `npm run serve` (http://localhost:5501/), or
- `python3 -m http.server 5502` and open http://localhost:5502/index.html

## Adding a new Interests card

1) Add a PNG poster into [assets/posters/](assets/posters) named after the key (lowercase, spaces/symbols allowed; runtime will URL‑encode).
2) Add an MP4 preview into [assets/movies/](assets/movies) with the same key.
3) Update the `order` array and `copy` map in [js/main.js](js/main.js).
4) `npm run build` and reload the site.

## Coding standards

- Two‑space indentation.
- Accessibility first: focus‑visible rings, keyboard nav, ARIA where needed.
- Keep JS modular (no frameworks), and avoid coupling UI with data beyond simple mapping.

## Files worth noting

- [index.html](index.html): structure, hero, sections, and script tags (hashed dist paths).
- [js/main.js](js/main.js): Interests carousel, theme injection, hero behavior, perf observers.
- [js/projects-carousel.js](js/projects-carousel.js): Ruler carousel and tabs.
- [css/styles.css](css/styles.css): Layout, components, accessibility and carousels’ styles.
- [config/theme-tokens.json](config/theme-tokens.json): Token source of truth.
- [js/theme-provider.js](js/theme-provider.js): Theme toggle and sprite loader.
- [scripts/inject-hashes.js](scripts/inject-hashes.js): Hash injection post‑build.

## Changelog snippet (latest)

- feat: restore Interests MP4s; add “Mathematics & Physics”; use PNG posters only; remove AVIF/WebP pipeline; rename posters to URL‑safe names; clean fallback `<source>` in HTML.
