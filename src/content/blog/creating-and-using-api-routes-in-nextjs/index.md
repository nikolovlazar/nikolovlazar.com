---
title: Creating and using API Routes in Next.js
description: How to create and use API Routes in Next.js
tags: ["next.js"]
date: February 10, 2022
isExternal: false
---

Since Next.js is built on top of Node.js, it also allows us to define our own
API routes. The API routes are functions that are part of the server, but
instead of rendering HTML, they're returning JSON data.

Any file inside `pages/api` is mapped to `/api/*` and it will be treated as an
API endpoint instead of a page. These functions are server-side, and will not
bundled with your client-side code. That means we can safely open DB
connections, and use secret environment variables.

For new projects, we can build our entire API with API routes, but if we
already have an existing API we don't need to forward our API calls through an
API route. We could also use API calls if we want to mask our API or an external
service (instead of `https://mycompany.com/secret-api-url`, we can send requests
to `/api`).

To create an API handler, we need to create a file in `pages/api` and export a
default async function:

```typescript
// pages/api/user.ts

import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  return res.status(200).json({ name: 'John Doe' });
};

export default handler;
```

The function receives 2 arguments:

- `req`: An instance of http.IncomingMessage, plus some pre-built middlewares
- `res`: An instance of http.ServerResponse, plus some helper functions

The `req` contains the `method`, `body` and `query` properties that we can use
to handle the request. Here's how we can handle different HTTP methods in our
API:

```typescript
const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    // process the GET request
  }
  if (req.method === 'POST') {
    // process the POST request
  }
};
```

To get the data sent from the client, we can use the `body` property:

```typescript
const handler: NextApiHandler = async (req, res) => {
  const { body } = req;
  // body: { name: 'Lazar Nikolov', profession: 'Software Engineer' }

  if (req.method === 'POST') {
    // save data (body) in database
  }
};
```

> We can also use a dynamic route when building API handlers.

