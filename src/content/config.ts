import { defineCollection, z } from 'astro:content'

const BlogPosts = defineCollection({
    schema: z.object({
        title: z.string(),
        tags: z.array(z.string()),
        date: z.string().transform(str => new Date(str)),
        isExternal: z.boolean().optional(),
        externalUrl: z.string().optional(),
        externalLabel: z.string().optional(),
    }),
})

const Courses = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        numberOfLessons: z.number(),
        date: z.string().transform(str => new Date(str)),
    }),
})

const Talks = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        date: z.string().transform(str => new Date(str)),
    }),
})

const Videos = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        date: z.string().transform(str => new Date(str)),
    }),
})

export const collections = {
    blog: BlogPosts,
    courses: Courses,
    talks: Talks,
    videos: Videos,
}
