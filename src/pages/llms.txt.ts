// https://llmstxt.org — LLM-friendly index of the site.
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';
import { getReviewedReviews } from '../lib/reviews';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const reviews = await getReviewedReviews();
  const lines = [
    '# Sanjay Bhagia',
    '',
    '> Personal site and blog of Sanjay Bhagia — a software engineer in Sydney writing about .NET, Azure, DevOps, Pulumi and technology in general since 2012. Full post content for language models is available at /llms-full.txt. Every blog post, review and page below also has a plain-markdown version: append `.md` to its path (e.g. /blog/some-post.md, /about.md).',
    '',
    '## Blog posts',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](https://sanjaybhagia.com/blog/${p.id})${p.data.description ? `: ${p.data.description}` : ''}`,
    ),
    '',
    '## Reviews',
    '',
    ...reviews.map(
      (r) =>
        `- [${r.data.title}](https://sanjaybhagia.com/reviews/${r.id}) — ${r.data.kind}, verdict: ${r.data.verdict}${r.data.oneLiner ? `. ${r.data.oneLiner}` : ''}`,
    ),
    '',
    '## Pages',
    '',
    '- [About](https://sanjaybhagia.com/about): Who Sanjay is and what he works on',
    '- [Now](https://sanjaybhagia.com/now): What he is focused on right now',
    '- [Uses](https://sanjaybhagia.com/uses): The tools, apps and hardware he uses',
    '- [ParkingQuest](https://sanjaybhagia.com/projects/parkingquest): iOS app — live Park&Ride occupancy for Sydney commuters',
    '- [Calendar on Your Wall](https://sanjaybhagia.com/projects/calendar-on-your-wall): Web app — printable yearly calendars with your events',
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
