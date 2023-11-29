---
title: 'Fixing memoization-breaking re-renders in React'
description:
  "useMemo doesn't mean your React component won't rerender. 👉 Comp A renders B
  and passes down a callback through its props. B is memoized, but still
  rerenders every time A rerenders. You're missing 'useCallback' on the callback"
tags: ['performance']
date: November 28, 2023
isExternal: true
externalUrl: https://blog.sentry.io/fixing-memoization-breaking-re-renders-in-react/
externalLabel: on Sentry's blog
---
