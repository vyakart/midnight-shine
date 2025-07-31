# Auditing Guidelines

- In CI, run:  
  - `npm run seo-audit` (Lighthouse SEO)  
  - `npx pa11y-ci` (accessibility)  
  - `npm run link-check` (broken links)
- Fail the build on any critical violation.
- Publish JSON/HTML reports as artifacts.
