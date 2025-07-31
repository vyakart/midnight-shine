**Run Lighthouse**  
   npx lighthouse https://staging.your-site.com \
     --output=json --output-path=./reports/lighthouse.json

**Compare Against Baseline**  
   npm run compare-lighthouse --report=./reports/lighthouse.json

**Extract Action Items**  
   npm run generate-action-items --report=./reports/lighthouse.json

**Fail on Regression**
Exit non‑zero if any vital metric degrades.