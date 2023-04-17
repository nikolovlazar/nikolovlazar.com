import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";

import { remarkReadingTime } from "./src/utils/content";

// https://astro.build/config
export default defineConfig({
  site: "https://nikolovlazar.com",

  experimental: {
    contentCollections: true,
  },

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [lazyLoadPlugin],
    extendDefaultPlugins: true,
  },

  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    mdx(),
  ],
});
