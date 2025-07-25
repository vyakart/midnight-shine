npm run seo-audit

**Lighthouse SEO**  
   npx lighthouse https://staging.your-site.com \
     --only-categories=seo \
     --output=json --output-path=./reports/seo.json

**Validate Meta Tags**
Run a script to check <title>, <meta name="description">, OG tags.

**Report Missing**
Exit non‑zero and list pages missing required metadata.