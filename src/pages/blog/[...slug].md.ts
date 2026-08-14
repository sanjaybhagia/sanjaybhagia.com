// Markdown variant of each post at /blog/<slug>.md — for AI agents and
// anyone who'd rather read the source. Advertised via <link rel="alternate">.
import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from '../../lib/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute<{ post: CollectionEntry<'blog'> }> = ({ props }) => {
  const { post } = props;
  const lines = [
    `# ${post.data.title}`,
    '',
    ...(post.data.description ? [`> ${post.data.description}`, ''] : []),
    `Published: ${post.data.date.toISOString().slice(0, 10)}`,
    ...(post.data.tags.length ? [`Tags: ${post.data.tags.join(', ')}`] : []),
    `Canonical: https://sanjaybhagia.com/blog/${post.id}/`,
    '',
    post.body ?? '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
