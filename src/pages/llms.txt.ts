// https://llmstxt.org — LLM-friendly index of the site.
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const lines = [
    '# Sanjay Bhagia',
    '',
    '> Personal site and blog of Sanjay Bhagia — a software engineer in Sydney writing about .NET, Azure, DevOps, Pulumi and technology in general since 2012. Full post content for language models is available at /llms-full.txt.',
    '',
    '## Blog posts',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](https://sanjaybhagia.com/blog/${p.id})${p.data.description ? `: ${p.data.description}` : ''}`,
    ),
    '',
    '## Pages',
    '',
    '- [About](https://sanjaybhagia.com/about): Who Sanjay is and what he works on',
    '- [Now](https://sanjaybhagia.com/now): What he is focused on right now',
    '- [Tools](https://sanjaybhagia.com/tools): The tools he uses',
    '- [ParkingQuest](https://sanjaybhagia.com/projects/parkingquest): iOS app — live Park&Ride occupancy for Sydney commuters',
    '- [Calendar on Your Wall](https://sanjaybhagia.com/projects/calendar-on-your-wall): Web app — printable yearly calendars with your events',
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
