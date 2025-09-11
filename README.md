# Midnight Shine – Portfolio Site

A minimalist, fast portfolio built with vanilla HTML, CSS, and JS. Themes, a Netflix‑style Interests carousel with MP4 previews, and a ruler‑style Projects carousel are included. Build is handled by esbuild; no framework required.

- Entry point: [index.html](index.html:1)
- Main runtime logic: [js/main.js](js/main.js:266)
- Projects carousel module: [js/projects-carousel.js](js/projects-carousel.js:1)
- Global styles: [css/styles.css](css/styles.css:1)
- Theme tokens: [config/theme-tokens.json](config/theme-tokens.json:1)
- Theme provider: [js/theme-provider.js](js/theme-provider.js:1)

## What’s in this repo

- Interests carousel (horizontal, auto‑scroll, posters + MP4 preview on hover/focus)
- Projects carousel (ruler‑style, category tabs, accessible, no dependencies)
- Theme system (five themes, tokenized colors, icons via per‑theme SVG sprite)
- Microblog pages, Donate page, and basic static pages
- Asset policy optimized for simplicity (original PNG posters only; no AVIF/WebP pipeline)

## Recent changes (high‑level)

- Restored Interests carousel MP4 previews (art&design, astro, bjj, ea, meditation, mathematics&physics).
- Added new topic “Mathematics & Physics” to the carousel order.
- Removed optimized image variants (AVIF/WebP) and their HTML sources; use original PNG posters only.
- Standardized poster filenames to URL‑safe names that map 1:1 to keys via encodeURIComponent:
  - [assets/posters/art&design.png](assets/posters/art&design.png:1)
  - [assets/posters/ea.png](assets/posters/ea.png:1)
  - [assets/posters/mathematics&physics.png](assets/posters/mathematics&physics.png:1)

See implementation details in [docs/site-overview.md](docs/site-overview.md:1).

## Quick start

Prerequisites:
- Node 18+ (for esbuild) and a local HTTP server (Python 3 or any static server).

Install deps and build:

```bash
npm install
npm run build
```

Serve locally (two options):
- Preferred: `npm run serve` (serves from repo root at http://localhost:5501/)
- Or manually: `python3 -m http.server 5502` then open http://localhost:5502/index.html

## Scripts

See [package.json](package.json:6).

- `npm run clean` – reset dist/
- `npm run build` – bundle all JS and CSS, then inject hashed filenames into HTML (via [scripts/inject-hashes.js](scripts/inject-hashes.js:1))
- `npm run serve` – local static server on port 5501
- Contracts utilities for DonationVault (optional): `npm run contracts:*`

## Architecture at a glance

- Interests carousel is created at runtime by [main.buildSet()](js/main.js:310) and autoscrolled via rAF loop in [main.step()](js/main.js:421). Media paths are computed with [main.moviePath()](js/main.js:280) and [main.posterPath()](js/main.js:281), both using `encodeURIComponent` to support names with ampersands.
- Projects carousel is bootstrapped from JSON in [js/projects-carousel.js](js/projects-carousel.js:25) and exposes [initRulerCarousel()](js/projects-carousel.js:303). It renders a centered, infinite ruler with accessible roving tabindex and category tabs.

## Asset policy

- Posters: original PNGs only in `assets/posters/`. The code references PNG posters directly (no AVIF/WebP `<source>` elements).
- Videos: 1:1 short MP4 previews in `assets/movies/`.
- Filenames: ensure keys in JS order/copy map match poster and movie filenames after URL encoding (e.g., “art&design” → `art%26design.png` and `art%26design.mp4` in HTTP requests).

## Accessibility and performance notes

- Focus-visible styles and keyboard navigation are implemented across widgets.
- Interests preview video plays on hover/focus and respects reduced motion.
- Performance observers collect basic field metrics in [js/main.js](js/main.js:660).
- No third‑party runtime dependencies; small, cacheable bundles.

## Contributing

- Keep UI logic vanilla and accessible.
- Add new Interests by updating the `order` and `copy` map in [js/main.js](js/main.js:269), and by placing poster/video in the corresponding `assets` directories.
- Follow coding standards in `.kilocode/rules`.

## License and attributions

- Typeface Recursive by Arrow Type – see [assets/Typography/ArrowType-Recursive-1.085/README.md](assets/Typography/ArrowType-Recursive-1.085/README.md:1) and [assets/Typography/ArrowType-Recursive-1.085/Recursive_Desktop/README.md](assets/Typography/ArrowType-Recursive-1.085/Recursive_Desktop/README.md:1).
- Icon sprites per theme under [assets/icons/compiled/](assets/icons/compiled/sunsetGlow.svg:1).
