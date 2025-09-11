# Theme Implementation (Deprecated)

This document is deprecated and retained only for historical context.

Canonical, up-to-date documentation:
- Tokens and theme sprites: [config/theme-tokens.json](config/theme-tokens.json:1)
- Runtime provider and toggle: [js/theme-provider.js](js/theme-provider.js:1)
- Site architecture and how themes are applied: [docs/site-overview.md](docs/site-overview.md:1)
- Project overview and usage: [README.md](README.md:1)

Summary of current approach:
- Five themes (sunsetGlow, midnightAurora, forestMist, cosmicDust, oceanBreeze) are defined in [config/theme-tokens.json](config/theme-tokens.json:1).
- The ThemeProvider reads tokens at runtime, applies CSS variables to :root, and injects the per-theme SVG icon sprite.
- The header exposes a single theme toggle target (.theme-switcher), which ThemeProvider populates when ready.

Notes:
- Any future changes to themes should update token values in [config/theme-tokens.json](config/theme-tokens.json:1) and (if needed) sprites in [assets/icons/compiled/](assets/icons/compiled/sunsetGlow.svg:1).
- Examples and long-form guidance have moved to [docs/site-overview.md](docs/site-overview.md:1) to avoid duplication and drift.

Changelog:
- 2025‑09‑11: Document deprecated in favor of a single authoritative overview (docs/site-overview.md) and the token file (config/theme-tokens.json).