import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkBaseLinks } from './src/lib/remark-base-links.mjs';

const BASE = '/Leetcode';

// https://astro.build/config
export default defineConfig({
  site: 'https://alanhsiu.github.io',
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    // Auto-generates sitemap-index.xml + sitemap-0.xml from every built page.
    // The generated OG images and the JSON endpoints are excluded.
    sitemap({
      filter: (page) => !page.includes('/open-graph/'),
    }),
  ],
  markdown: {
    // Base-prefix root-absolute links in notes (e.g. [x](/behavioral/star-method))
    // so cross-note links are clean and work under the site base.
    remarkPlugins: [[remarkBaseLinks, { base: BASE }]],
    // Dual-theme Shiki for guide (md/mdx) code blocks, matching the rest of the
    // site (light default + .dark swap, see global.css `.astro-code`).
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
