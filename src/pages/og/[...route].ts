import { OGImageRoute } from 'astro-og-canvas';
import { getPublishedPosts } from '../../lib/posts';
import { getReviewedReviews } from '../../lib/reviews';

const posts = await getPublishedPosts();
const reviews = await getReviewedReviews();
// Reviews are namespaced: a post and a review can share a slug, and a flat map would
// silently drop one of the two cards.
const pages = [
  ...posts.map((post) => [post.id, post.data] as const),
  ...reviews.map((review) => [`reviews/${review.id}`, review.data] as const),
];

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: Object.fromEntries(pages),
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: 'kind' in page
      ? `${page.kind[0].toUpperCase() + page.kind.slice(1)}${page.verdict
        ? ` · ${page.verdict[0].toUpperCase() + page.verdict.slice(1)}`
        : ''}`
      : page.description ?? 'sanjaybhagia.com',
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
