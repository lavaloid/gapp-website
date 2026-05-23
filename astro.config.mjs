// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://gapp-puzzles.com',
  integrations: [mdx(), sitemap()],
  output: "server",
  adapter: vercel(),
});