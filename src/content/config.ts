import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('The Press Editorial Team'),
    authorAvatar: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).default(['vintage', 'design']),
    category: z.string().default('Design'),
    language: z.enum(['en', 'zh', 'pt-BR', 'ru', 'ja', 'tr', 'ko', 'es', 'fr', 'de', 'hi']).default('en'),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
