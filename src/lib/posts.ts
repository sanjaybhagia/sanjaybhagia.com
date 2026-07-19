import { getCollection, type CollectionEntry } from 'astro:content';

/** All non-draft posts, newest first. Draft posts (`draft: true`) never build. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
