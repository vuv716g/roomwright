import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://roomwright.co.uk',
  integrations: [sitemap()],
  output: 'static',
});
