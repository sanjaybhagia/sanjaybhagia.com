---
name: verify
description: Build and drive the Astro site locally to verify changes end-to-end.
---

# Verifying sanjaybhagia.com (Astro static site)

Build, serve, and curl the built output:

```bash
npm run build                      # ~1.5s, 173 pages into dist/
npm run preview -- --port 4399 &   # serves dist/ on localhost:4399
```

Flows worth driving after a change:
- `/` — landing (hero, apps cards, recent posts)
- `/blog` — year-grouped index; `/blog/we-all-should-be-bit-more-like-dogs` — a modern markdown post
- `/blog/paged-custom-search-query-using-keywordquery` — WordPress-era post with inline HTML (must render, no highlighting expected)
- `/blog/handling-order-processing-with-azure-api-servicebus-topics` — post with shiki-highlighted fenced code (`grep -c astro-code` > 0)
- `/rss.xml` and `/feed.xml` — both must return the full RSS feed (34+ items)
- `/tags/sharepoint-search` — tag whose display name contains a space
- bogus path — must return HTTP 404 with the styled page

Gotchas:
- Post dates come from frontmatter, not filenames — two legacy posts differ; don't "fix" filenames.
- `public/_redirects` is Cloudflare-only; it can't be exercised locally, only inspected.
- Old WP-era posts (2012–2015) contain raw HTML in markdown — intentional, leave as-is.
