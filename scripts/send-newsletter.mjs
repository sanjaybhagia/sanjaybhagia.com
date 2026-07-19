#!/usr/bin/env node
// Create a Kit broadcast announcing a blog post to subscribers.
// Draft by default so it can be reviewed in Kit; --send schedules it immediately.
//
// Usage: node scripts/send-newsletter.mjs <post-slug> [--send]
// Needs KIT_API_KEY (a Kit v4 API key) in .env at the repo root or in the environment.
import fs from 'node:fs';
import matter from 'gray-matter';

try {
  process.loadEnvFile(new URL('../.env', import.meta.url).pathname);
} catch {
  // no .env — rely on the environment (e.g. GitHub Actions secret)
}
const KEY = process.env.KIT_API_KEY;
if (!KEY) {
  console.error('KIT_API_KEY is not set (.env or environment).');
  process.exit(1);
}

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error('usage: node scripts/send-newsletter.mjs <post-slug> [--send]');
  process.exit(1);
}
const send = flags.includes('--send');

const file = new URL(`../src/content/blog/${slug}.md`, import.meta.url).pathname;
const { data } = matter(fs.readFileSync(file, 'utf8'));
const url = `https://sanjaybhagia.com/blog/${slug}`;

const content = `
<p>I just published a new post:</p>
<h2><a href="${url}">${data.title}</a></h2>
<p>${data.description ?? ''}</p>
<p><a href="${url}">Read the full post &rarr;</a></p>
`;

const res = await fetch('https://api.kit.com/v4/broadcasts', {
  method: 'POST',
  headers: { 'X-Kit-Api-Key': KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: data.title,
    preview_text: data.description ?? '',
    content,
    public: false,
    ...(send ? { send_at: new Date().toISOString() } : {}),
  }),
});
const body = await res.json();
if (!res.ok) {
  console.error('Kit API error:', res.status, JSON.stringify(body));
  process.exit(1);
}
console.log(`${send ? 'Scheduled to send' : 'Draft created'}: "${data.title}"`);
console.log(`Review in Kit: https://app.kit.com/campaigns/${body.broadcast?.id ?? ''}`);
