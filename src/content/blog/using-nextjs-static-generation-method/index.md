---
title: Using Next.js's Static Generation method
description: How to use Next.js's Static Generation method to provide data in your pages at build time.
tags: ["next.js"]
date: February 10, 2022
isExternal: false
---


In Next.js, there are two forms of pre-rendering, **Static Generation** and
**Server-side Rendering**. We can apply these methods for each page
individually.

The Static Generation method fetches the page's data on **build-time**, and
renders static HTML files. To apply the Static Generation method, we need to
export a `getStaticProps` method from our page:

```typescript
// pages/index.tsx

import type { GetStaticProps } from 'next'

import type { Lesson } from 'types/lesson'
import { fetchLessons } from 'utils/lessons'

type Props = {
  lessons: Lesson[]
}

const Home = ({ lessons }: Props) => {
  return (
    <ul>
      {lessons.map((lesson) => (...))}
    </ul>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const lessons = await fetchLessons()

  const props: Props = {
    lessons
  }

  return {
    props
  }
}

export default Home
```

For our Home page, Next.js will execute the `fetchLessons` method
asynchroniously, and pass the lessons array as a prop in our `Home` component.
If there is no data for the given query, we need to return `notFound: true`
instead of the props. If the lessons data changes and we want to update the
page, we can either rebuild our website, or use the
[Incremental Static Regeneration](#incremental-static-regeneration) method.

In our `getStaticProps` method we can also obtain the `context`, which holds
data like:

- `params`: the route parameters for pages that use dynamic routes
- `preview`: a boolean which is `true` if the page is in the
[Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode),
otherwise `undefined`
- `previewData`: an object that holds the preview data set by `setPreviewData`
- `locale`: the active locale, if you've enabled
[Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing)
- `locales`: an array that contains all of the locales
- `defaultLocale`: the default configured locale

## Incremental Static Regeneration

The ISR method is an extension of the Static Generation method. We can enable
ISR if we provide a `revalidate` property in our `getStaticProps` result:

```typescript
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  return {
    props: {...},
    revalidate: 60 * 60,
  }
}
```

The `revalidate` property will tell Next.js to "revalidate" our data maximum one
time in the given timeframe (in our case is 1 hour, 60 seconds times 60).

## Building pages with dynamic routes

Since the Static Generation happens on build-time, if we have a page that uses
Dynamic Routes we also need to export the `getStaticPaths` method. The
`getStaticPaths` method returns a list of paths that have to be rendered to HTML
at build-time.

```typescript
import type { GetStaticProps, GetStaticPaths } from 'next'

...

export const getStaticPaths: GetStaticPaths = async () => {
  const lessons = await fetchLessons()

  return {
    paths: lessons.map({ slug } => ({ params: { slug } })),
    fallback: false
  }
}
```

The `paths` key determines which paths will be pre-rendered. If for example we
had 3 lessons, Next.js will pre-render the following URLs:

- `/lessons/getting-started`
- `/lessons/create-pages`
- `/lessons/create-dynamic-routes`

For each lesson, Next.js will execute the `getStaticProps` method. That
pre-renders every page and generates static HTML files for them.

The `fallback` key is a boolean key that we must include in our `getStaticPaths`
result. If it's set to `false`, then any paths that are not returned by the
`getStaticPaths` method will result in a 404 page. If it's set to `true`,
Next.js will render a "fallback" page while it statically generates the HTML and
JSON (this includes running the `getStaticProps` method). When it's done, the
page will receive the brand new data in its props and it will render its
contents. At the end of the process, Next.js will add the new path to the list
of pre-rendered pages.

If our page supports a fallback, we can use Next.js's router to check if Next.js
wants us to render a fallback page:

```typescript
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  ...
}
```

If we don't want to display a Loading page, we can set the `fallback` property
in `getStaticPaths` to `'blocking'`. This will make the browser wait for Next.js
to pre-render the HTML.

