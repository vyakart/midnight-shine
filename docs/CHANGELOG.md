# Changelog

All notable changes to this project will be documented in this file.

## 2025-09-11

### Added
- Interests carousel topic: Mathematics & Physics.
- New documentation:
  - [README.md](README.md:1) – project overview, architecture, and usage.
  - [docs/site-overview.md](docs/site-overview.md:1) – authoritative site architecture and feature guide.

### Changed
- Interests carousel restored MP4 previews:
  - [assets/movies/art&design.mp4](assets/movies/art&design.mp4:1)
  - [assets/movies/astro.mp4](assets/movies/astro.mp4:1)
  - [assets/movies/bjj.mp4](assets/movies/bjj.mp4:1)
  - [assets/movies/ea.mp4](assets/movies/ea.mp4:1)
  - [assets/movies/meditation.mp4](assets/movies/meditation.mp4:1)
  - [assets/movies/mathematics&physics.mp4](assets/movies/mathematics&physics.mp4:1)
- Carousel now uses PNG posters only (no AVIF/WebP `<source>`):
  - Runtime card build simplified in [js.main.js](js/main.js:281).
  - No‑JS fallback `<source>` tags removed in [index.html](index.html:234).
- Poster filenames normalized to URL‑safe keys:
  - [assets/posters/art&design.png](assets/posters/art&design.png:1)
  - [assets/posters/ea.png](assets/posters/ea.png:1)
  - [assets/posters/mathematics&physics.png](assets/posters/mathematics&physics.png:1)

### Removed
- Optimized image variants and pipeline (AVIF/WebP) under `assets/posters/optimized/`.

### Deprecated
- The long “Theme Implementation Guide” has been deprecated in favor of concise, canonical docs:
  - See [docs/site-overview.md](docs/site-overview.md:1) and [config/theme-tokens.json](config/theme-tokens.json:1).
  - The file [theme-implementation.md](theme-implementation.md:1) now points to the canonical sources.
