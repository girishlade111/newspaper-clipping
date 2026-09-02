// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://newspaper-clipping-generator.example.com',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          zh: 'zh-CN',
          'pt-br': 'pt-BR',
          ru: 'ru-RU',
          ja: 'ja-JP',
          tr: 'tr-TR',
          ko: 'ko-KR',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'zh',
      {
        path: 'pt-br',
        codes: ['pt-BR', 'pt'],
      },
      'ru',
      'ja',
      'tr',
      'ko',
    ],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
