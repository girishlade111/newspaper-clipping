// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://newspaper-clipping-generator.example.com',
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          zh: 'zh-CN',
          'pt-BR': 'pt-BR',
          ru: 'ru-RU',
          ja: 'ja-JP',
          tr: 'tr-TR',
          ko: 'ko-KR',
          de: 'de-DE',
          es: 'es-ES',
          fr: 'fr-FR',
          hi: 'hi-IN',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'zh',
      'pt-BR',
      'ru',
      'ja',
      'tr',
      'ko',
      'de',
      'es',
      'fr',
      'hi',
    ],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  // /editor deprecated in favor of /studio (draft drawer merged there).
  // /generator kept as-is (distinct canvas-based advanced mode).
  redirects: {
    '/editor': { status: 301, destination: '/studio' },
    '/zh/editor': { status: 301, destination: '/zh/studio' },
    '/pt-BR/editor': { status: 301, destination: '/pt-BR/studio' },
    '/ru/editor': { status: 301, destination: '/ru/studio' },
    '/ja/editor': { status: 301, destination: '/ja/studio' },
    '/tr/editor': { status: 301, destination: '/tr/studio' },
    '/ko/editor': { status: 301, destination: '/ko/studio' },
    '/de/editor': { status: 301, destination: '/de/studio' },
    '/es/editor': { status: 301, destination: '/es/studio' },
    '/fr/editor': { status: 301, destination: '/fr/studio' },
    '/hi/editor': { status: 301, destination: '/hi/studio' },
  },
});
