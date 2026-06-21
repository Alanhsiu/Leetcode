import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://alanhsiu.github.io',
  base: '/Leetcode',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  markdown: {
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
