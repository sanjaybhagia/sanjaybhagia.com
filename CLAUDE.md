# sanjaybhagia.com

Personal site of Sanjay Bhagia. Astro static site deployed to Cloudflare Pages
(project `sanjaybhagia-com`). Replaced a deprecated Wyam/.NET build in July 2026.

## Commands

- `npm run dev` — dev server (search UI won't work in dev; it needs the built index)
- `npm run build` — builds to `dist/` (includes Pagefind index + OG card images)
- `npx wrangler pages deploy dist --project-name sanjaybhagia-com --branch <name>` — manual
  deploy. `master` is the Pages **production** branch; any other `--branch` value lands on
  a preview URL (`https://<name>.sanjaybhagia-com.pages.dev`) and does NOT touch the live
  site. The old documented `--branch astro` was therefore a preview, not a deploy.
- `node scripts/send-newsletter.mjs <post-slug> [--send]` — Kit broadcast for a post
  (draft unless `--send`; needs `KIT_API_KEY` in `.env`, gitignored)

GitHub Actions (`.github/workflows/deploy.yml`) deploys to production on every
push to `master`, and deploys every pull request to a preview URL, posting it as a
sticky comment on the PR — that comment is how reviews get approved from a phone. sanjaybhagia.com + www are custom domains on the Pages
project (DNS proxied via Cloudflare; Web Analytics auto-injected at the edge).

## Publishing a post

1. Create `src/content/blog/<slug>.md` — the filename is the URL (`/blog/<slug>`).
   Frontmatter: `title`, `description` (100–160 chars, required by convention —
   it feeds Google snippets, RSS, and OG cards), `date` (YYYY-MM-DD), `tags`,
   optional `image` (else an OG card is generated at `/og/<slug>.png`).
2. Images: preferred in `src/assets/` referenced relatively (Astro optimizes);
   `public/images/` with absolute `/images/...` paths also works. Compress large
   screenshots first (`sips` is available on macOS).
3. Build, deploy, then send the newsletter (draft first, review in Kit, send).

## Publishing a review

When Sanjay dumps an opinion about something he read, watched, ate, visited, or bought —
unstructured text, a voice-note transcript, photos with a caption — use the `review` skill
(`.claude/skills/review/SKILL.md`). It fires without being asked for; he will never type a
command. Reviews go to `src/content/reviews/<slug>.md` on a branch + PR, never straight to
`master`.

## Structure notes

- `src/content/blog/` — 34 migrated posts + new ones. Dates come from
  frontmatter, NOT filenames (two legacy posts differ — don't "fix" them).
  Posts from 2012–2015 contain raw WordPress HTML — intentional, leave as-is.
- `src/content/reviews/` — books, films, TV, restaurants, places, gear. `verdict` is the
  switch: without one an entry is a shelf item (shows on `/reading`, no page, absent from
  `/reviews`); with one it gains a page, joins `/reviews` + `/reviews/rss.xml`, and
  `/reading` links inward. `/reading` reads from this collection — `reading.json` is gone.
- `public/_redirects` — Cloudflare 301s mapping the old Wyam URL scheme
  (`/YYYY/MM/DD/slug` and root-level `/slug`) to `/blog/slug`. Load-bearing
  for SEO; old `/images/...` URLs are likewise load-bearing — never rename.
- `src/components/Comments.astro` — giscus (GitHub Discussions), configured.
- `src/components/Subscribe.astro` — Kit signup form (form 9700488), on all pages.
- `src/components/Analytics.astro` — Cloudflare Web Analytics, dormant until a
  beacon token is pasted in.
- RSS at `/rss.xml` AND `/feed.xml` (legacy subscriber path) — keep both.
- AI-agent surface: `/llms.txt` (index incl. reviews) + `/llms-full.txt` (all post
  bodies), and a markdown variant of every page at `<path>.md` (`/blog/<slug>.md`,
  `/reviews/<slug>.md`, `/about.md`, …) advertised via `<link rel="alternate"
  type="text/markdown">`. New root `src/pages/*.md` pages get theirs automatically
  via `src/pages/[page].md.ts`.
- Design system lives entirely in `src/styles/global.css` (custom, no theme).

## Verification

See `.claude/skills/verify/SKILL.md` for the build-and-curl checklist.
