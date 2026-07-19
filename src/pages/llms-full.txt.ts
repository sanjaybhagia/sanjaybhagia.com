// https://llmstxt.org — full post content in one LLM-friendly file.
import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const chunks = posts.map((p) =>
    [
      `# ${p.data.title}`,
      '',
      `URL: https://sanjaybhagia.com/blog/${p.id}`,
      `Published: ${p.data.date.toISOString().slice(0, 10)}`,
      p.data.tags.length ? `Tags: ${p.data.tags.join(', ')}` : '',
      '',
      p.body ?? '',
    ]
      .filter(Boolean)
      .join('\n'),
  );
  return new Response(chunks.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
