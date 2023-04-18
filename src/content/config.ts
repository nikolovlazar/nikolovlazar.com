import { defineCollection, z } from "astro:content";

const BlogPosts = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    publishDate: z.string().transform((str) => new Date(str)),
    isExternal: z.boolean().optional(),
    externalUrl: z.string().optional(),
    externalLabel: z.string().optional(),
  }),
});

const Courses = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string(),
    numberOfLessons: z.number(),
    publishDate: z.string().transform((str) => new Date(str)),
  }),
});

export const collections = {
  blog: BlogPosts,
  courses: Courses,
};
