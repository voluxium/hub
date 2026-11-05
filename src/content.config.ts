import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    subtags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

export const collections = { posts };
