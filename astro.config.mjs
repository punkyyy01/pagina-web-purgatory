import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://purg4t0ry.com',
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'never',
  compressHTML: true,
});
