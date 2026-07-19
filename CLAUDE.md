# sanjaybhagia.com

Personal site of Sanjay Bhagia. Astro static site deployed to Cloudflare Pages
(project `sanjaybhagia-com`). Replaced a deprecated Wyam/.NET build in July 2026.

## Status caveat (remove after DNS cutover)

sanjaybhagia.com DNS still points at the OLD Wyam site on Netlify, which deploys
on any push to `master` — do not push to `master`. All work happens on the
`astro` branch; the new site lives at https://sanjaybhagia-com.pages.dev.
The old Wyam sources (`input/`, `config.wyam`) are kept until cutover, then deleted.

## Commands

- `npm run dev` — dev server (search UI won't work in dev; it needs the built index)
- `npm run build` — builds to `dist/` (includes Pagefind index + OG card images)
- `npx wrangler pages deploy dist --project-name sanjaybhagia-com --branch astro` — deploy
- `node scripts/send-newsletter.mjs <post-slug> [--send]` — Kit broadcast for a post
  (draft unless `--send`; needs `KIT_API_KEY` in `.env`, gitignored)

GitHub Actions (`.github/workflows/deploy.yml`) deploys on push once the
`CLOUDFLARE_API_TOKEN` secret exists; until then deploy manually with wrangler.

## Publishing a post

1. Create `src/content/blog/<slug>.md` — the filename is the URL (`/blog/<slug>`).
   Frontmatter: `title`, `description` (100–160 chars, required by convention —
   it feeds Google snippets, RSS, and OG cards), `date` (YYYY-MM-DD), `tags`,
   optional `image` (else an OG card is generated at `/og/<slug>.png`).
2. Images: preferred in `src/assets/` referenced relatively (Astro optimizes);
   `public/images/` with absolute `/images/...` paths also works. Compress large
   screenshots first (`sips` is available on macOS).
3. Build, deploy, then send the newsletter (draft first, review in Kit, send).

## Structure notes

- `src/content/blog/` — 34 migrated posts + new ones. Dates come from
  frontmatter, NOT filenames (two legacy posts differ — don't "fix" them).
  Posts from 2012–2015 contain raw WordPress HTML — intentional, leave as-is.
- `public/_redirects` — Cloudflare 301s mapping the old Wyam URL scheme
  (`/YYYY/MM/DD/slug` and root-level `/slug`) to `/blog/slug`. Load-bearing
  for SEO; old `/images/...` URLs are likewise load-bearing — never rename.
- `src/components/Comments.astro` — giscus (GitHub Discussions), configured.
- `src/components/Subscribe.astro` — Kit signup form (form 9700488), on all pages.
- `src/components/Analytics.astro` — Cloudflare Web Analytics, dormant until a
  beacon token is pasted in.
- RSS at `/rss.xml` AND `/feed.xml` (legacy subscriber path) — keep both.
- Design system lives entirely in `src/styles/global.css` (custom, no theme).

## Verification

See `.claude/skills/verify/SKILL.md` for the build-and-curl checklist.
