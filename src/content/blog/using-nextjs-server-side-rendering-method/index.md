---
title: Using Next.js's Server-side Rendering method
description:
  How to use Next.js's Server-side Rendering method to render your pages on the
  server-side.
date: February 10, 2022
tags: ['next.js']
isExternal: false
---

Just like the [Static Generation](/blog/using-nextjs-static-generation-method),
SSR (Server-side Rendering) is another way of data fetching supported in
Next.js. The difference between SSR and SSG is that in SSR the data gets fetched
for every request, while in SSG the data used to be fetched on build-time. This
method is good for pages that have dynamic data, data that changes often.

When the user requests a SSR page, the server fetches the data (queries the DB,
uses third-party APIs etc...), generates the HTML, and then gets it back to the
browser. Compared to the SSG, the requests in SSR are slower, but that's the
price to pay to have dynamic data.

To apply the SSR method in Next.js, we need to export a `getServerSideProps`
method from our page:

```typescript
// pages/index.tsx

import type { GetServerSideProps } from 'next'

...

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return {
    props: {
      ...
    }
  }
}
```

The `context` object is similar to SSG's context, but it also includes:

- `req`: the HTTP IncomingMessage object, plus additional parsing helpers
- `res`: the HTTP response object
- `query`: an object representing the query string

Unlike SSG, with SSR we don't need to provide a method similar to the
`getStaticPaths`, because every request generates an HTML file, so no HTML files
need to be generated at build-time.
