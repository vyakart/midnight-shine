# Performance Signals Guidelines

Ensure fast, smooth user experiences.

## Core Web Vitals
- **LCP** (Largest Contentful Paint) ≤ 2.5 s  
- **FID** (First Input Delay) ≤ 100 ms  
- **CLS** (Cumulative Layout Shift) ≤ 0.1

## Mobile‑First Optimizations
- Inline critical above‑the‑fold CSS/JS.  
- Lazy‑load images/videos below the fold.  
- Serve responsive images via `srcset`.

## Build‑Time Best Practices
- Code‑split by route/page.  
- Prefetch key assets.  
- Set far‑future caching headers on static files.