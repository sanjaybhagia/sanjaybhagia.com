import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('blog');

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: Object.fromEntries(posts.map((post) => [post.id, post.data])),
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description ?? 'sanjaybhagia.com',
    bgGradient: [
      [18, 23, 20],
      [31, 49, 41],
    ],
    border: { color: [124, 201, 162], width: 16, side: 'block-end' },
    padding: 72,
    font: {
      title: {
        size: 60,
        weight: 'SemiBold',
        color: [231, 236, 232],
        lineHeight: 1.2,
      },
      description: {
        size: 28,
        color: [147, 162, 154],
        lineHeight: 1.5,
      },
    },
  }),
});
