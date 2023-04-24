import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeCodeBlockEnhancer from './src/markdown-plugins/rehype-code-block-enhancer'
import remarkReadingTime from './src/markdown-plugins/remark-reading-time'

import vercel from '@astrojs/vercel/static'

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
  integrations: [mdx(), sitemap()],
  output: 'static',
  adapter: vercel({
    analytics: true,
  }),
})
