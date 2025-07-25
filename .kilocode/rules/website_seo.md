# SEO & Metadata Guidelines

Optimize for discoverability and social sharing.

## Page Metadata
- `<title>`: unique, 50–60 characters.
- `<meta name="description">`: unique, 120–155 characters.
- `<meta name="robots">`: `index, follow` (unless hiding a page).

## Open Graph & Twitter Cards
Include on every page:
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description.">
<meta property="og:image" content="/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">

## URLs & Structure
- Use kebab-case: `/blog/my-article/`  
- End folders with `/`, filenames only if framework needs `.html`

## Sitemap
- Auto‑generate `sitemap.xml` on deploy  
- Disallow sensitive paths in `robots.txt