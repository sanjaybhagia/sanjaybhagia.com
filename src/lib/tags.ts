import type { CollectionEntry } from 'astro:content';

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Collect all tags across posts, deduped by slug, with display name and post list. */
export function collectTags(posts: CollectionEntry<'blog'>[]) {
  const tags = new Map<string, { name: string; posts: CollectionEntry<'blog'>[] }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      if (!tags.has(slug)) tags.set(slug, { name: tag, posts: [] });
      tags.get(slug)!.posts.push(post);
    }
  }
  return tags;
}
