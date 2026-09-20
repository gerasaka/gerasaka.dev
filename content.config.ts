import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    writes: defineCollection({
      type: 'page',
      source: 'writes/**/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
});
