# Asset Optimization Guidelines

Keep bundle sizes low and load times fast.

## Images
- **Format**: WebP preferred; fallback JPEG/PNG.  
- **Compression**:  
  - Lossy: quality 70–80%  
  - Lossless for icons/graphics  
- **Responsive**:  
  - Generate `srcset` variants.  
  - Inline small SVG icons.

## CSS & JS
- Inline critical CSS in `<head>`.  
- Lazy‑load non‑critical bundles.  
- Minify in production.  
- Append content hashes for cache busting.

## Fonts
- Use `font-display: swap`.  
- Self‑host or preload key fonts.

## Media
- Lazy‑load videos/images below viewport.  
- Use `<picture>` for art direction.

## Build Automation
Integrate bundler (Webpack/Rollup/Vite) to:  
1. Compress & hash assets.  
2. Purge unused CSS (PurgeCSS/Tailwind JIT).  
3. Emit `asset-manifest.json` for SSR/service workers.

## Auditing
- Run `npm run audit-assets` in CI to ensure:  
  - No asset > 300 KB uncompressed.  
  - All images have resized variants.
