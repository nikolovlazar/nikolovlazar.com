import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";

import rehypeExternalLinks from "rehype-external-links";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { remarkReadingTime } from "./src/utils/content";

// https://astro.build/config
export default defineConfig({
  site: "https://nikolovlazar.com",

  experimental: {
    contentCollections: true,
    assets: true,
  },

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      lazyLoadPlugin,
      rehypeSlug,
      [rehypeExternalLinks, {
        target: "_blank",
        rel: "external nofollow noopener",
      }],
      [rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: {
          ariaHidden: false,
        },
      }],
    ],
    extendDefaultPlugins: true,
  },

  integrations: [
    mdx(),
  ],
});
