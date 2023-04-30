import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel/static'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading'
import rehypeSlug from 'rehype-slug'

import rehypeCodeBlockEnhancer from './src/markdown-plugins/rehype-code-block-enhancer'
import remarkReadingTime from './src/markdown-plugins/remark-reading-time'

// https://astro.build/config
export default defineConfig({
  site: 'https://nikolovlazar.com',
  experimental: {
    assets: true,
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeCodeBlockEnhancer,
      lazyLoadPlugin,
      rehypeSlug,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: 'external nofollow noopener',
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            ariaHidden: false,
          },
        },
      ],
    ],
    extendDefaultPlugins: true,
    syntaxHighlight: 'prism',
  },
  integrations: [
    mdx(),
    sitemap({
      serialize: (item) => {
        item.url = item.url
          .split('/')
          .filter((p) => p.length > 0)
          .join('/')
        return item
      },
    }),
  ],
  output: 'static',
  adapter: vercel({
    analytics: true,
  }),
})
