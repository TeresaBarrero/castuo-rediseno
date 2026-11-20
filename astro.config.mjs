// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// URL pública del concepto (cámbiala o usa SITE_URL al desplegar).
const site = process.env.SITE_URL || 'https://teresabarrero.github.io';

export default defineConfig({
  site,
  trailingSlash: 'always',
  output: 'static',
  integrations: [mdx(), sitemap({ filter: (p) => !/\/(carrito|buscar|legal)\/$/.test(p) })],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  build: { inlineStylesheets: 'always', format: 'directory' },
});
