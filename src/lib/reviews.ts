import { getCollection, type CollectionEntry } from 'astro:content';

const showDrafts = import.meta.env.DEV || Boolean(process.env.SHOW_DRAFTS);

/** All visible reviews and logged items, newest first. */
export async function getAllReviews(): Promise<CollectionEntry<'reviews'>[]> {
  const reviews = await getCollection('reviews', ({ data }) => showDrafts || !data.draft);
  return reviews.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Visible entries with a verdict, newest first. */
export async function getReviewedReviews(): Promise<CollectionEntry<'reviews'>[]> {
  const reviews = await getAllReviews();
  return reviews.filter((review) => review.data.verdict);
}

/** Visible books assigned to a shelf, newest first. */
export async function getShelf(): Promise<CollectionEntry<'reviews'>[]> {
  const reviews = await getAllReviews();
  return reviews.filter((review) => review.data.kind === 'book' && review.data.shelf);
}
