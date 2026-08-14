// Markdown variant of each review at /reviews/<slug>.md — mirrors the pages
// that exist (verdict-only, same rule as [...slug].astro).
import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getReviewedReviews } from '../../lib/reviews';

export const getStaticPaths: GetStaticPaths = async () => {
  const reviewed = await getReviewedReviews();
  return reviewed.map((review) => ({ params: { slug: review.id }, props: { review } }));
};

export const GET: APIRoute<{ review: CollectionEntry<'reviews'> }> = ({ props }) => {
  const { review } = props;
  const { data } = review;
  const facts = Object.entries(data.facts).map(([key, value]) => `${key}: ${value}`);
  const lines = [
    `# ${data.title}`,
    '',
    ...(data.oneLiner ? [`> ${data.oneLiner}`, ''] : []),
    `Kind: ${data.kind}`,
    `Verdict: ${data.verdict}`,
    `Date: ${data.date.toISOString().slice(0, 10)}`,
    ...(data.creator ? [`Creator: ${data.creator}`] : []),
    ...(data.location ? [`Location: ${data.location}`] : []),
    ...(data.url ? [`Link: ${data.url}`] : []),
    ...(data.tags.length ? [`Tags: ${data.tags.join(', ')}`] : []),
    ...facts,
    `Canonical: https://sanjaybhagia.com/reviews/${review.id}/`,
    '',
    review.body ?? '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
