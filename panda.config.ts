import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  // Whether to include css reset styles in the generated css
  preflight: true,

  // Whether to clean the output directory before generating new css
  clean: true,

  // Files to watch for changes
  include: ["./src/**/*.astro"],

  // Reusable config presets
  presets: ["@pandacss/dev/presets"],

  // The framework to use for generating elements
  jsxFramework: "solid",

  // Output directory
  outdir: "panda",

  theme: {
    extend: {
      tokens: {
        colors: {
          bg: {
            light: {
              value: '#FFF8E7'
            },
            dark: {
              value: '#000718'
            },
          }
        }
      }
    }
  }
})
