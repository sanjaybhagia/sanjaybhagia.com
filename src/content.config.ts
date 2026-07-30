import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    kind: z.enum(['book', 'film', 'tv', 'restaurant', 'place', 'product']),
    verdict: z.enum(['loved', 'liked', 'fine', 'nope']).optional(),
    date: z.coerce.date(),
    oneLiner: z.string().optional(),
    creator: z.string().optional(),
    location: z.string().optional(),
    url: z.string().optional(),
    tags: z.array(z.string()).default([]),
    images: z.array(z.object({
      src: image(),
      alt: z.string(),
    })).default([]),
    facts: z.record(z.string()).default({}),
    shelf: z.enum(['reading', 'listening', 'finished']).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, reviews };
