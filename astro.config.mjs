// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {Map<string, Date> | null} */
let blogDateMap = null;

function getBlogDateMap() {
  if (blogDateMap) return blogDateMap;
  blogDateMap = new Map();
  const blogDir = path.resolve('src/content/blog');
  if (fs.existsSync(blogDir)) {
    const langs = fs.readdirSync(blogDir);
    for (const lang of langs) {
      const langPath = path.join(blogDir, lang);
      if (!fs.statSync(langPath).isDirectory()) continue;
      const files = fs.readdirSync(langPath);
      for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        const fullPath = path.join(langPath, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const slug = file.replace(/\.(md|mdx)$/, '');
        const mtime = fs.statSync(fullPath).mtime;
        const pubMatch = content.match(/pubDate:\s*([^\r\n]+)/);
        const updatedMatch = content.match(/updatedDate:\s*([^\r\n]+)/);
        const dateStr = updatedMatch ? updatedMatch[1].trim() : (pubMatch ? pubMatch[1].trim() : null);
        const date = dateStr ? new Date(dateStr) : mtime;
        blogDateMap.set(`${lang}:${slug}`, date);
      }
    }
  }
  return blogDateMap;
}

/**
 * @param {string} urlStr
 * @returns {Date | undefined}
 */
function resolveLastmod(urlStr) {
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    const blogDates = getBlogDateMap();

    // Blog URLs: /blog/<slug> (en) or /<lang>/blog/<slug>
    const blogEnMatch = pathname.match(/^\/blog\/([^/]+)$/);
    if (blogEnMatch) {
      const date = blogDates.get(`en:${blogEnMatch[1]}`);
      if (date) return date;
    }

    const blogLangMatch = pathname.match(/^\/([a-zA-Z-]+)\/blog\/([^/]+)$/);
    if (blogLangMatch) {
      const date = blogDates.get(`${blogLangMatch[1]}:${blogLangMatch[2]}`);
      if (date) return date;
    }

    // Static pages
    let candidateFiles = [];
    if (pathname === '/') {
      candidateFiles = ['src/pages/index.astro'];
    } else {
      const parts = pathname.slice(1).split('/');
      if (parts.length === 1) {
        const p = parts[0];
        if (['zh', 'pt-BR', 'ru', 'ja', 'tr', 'ko', 'de', 'es', 'fr', 'hi'].includes(p)) {
          candidateFiles = ['src/pages/[lang]/index.astro', 'src/pages/index.astro'];
        } else {
          candidateFiles = [`src/pages/${p}.astro`, `src/pages/${p}/index.astro`];
        }
      } else if (parts.length === 2) {
        const [lang, page] = parts;
        candidateFiles = [
          `src/pages/[lang]/${page}.astro`,
          `src/pages/[lang]/${page}/index.astro`,
          `src/pages/${page}.astro`,
          `src/pages/${page}/index.astro`,
        ];
      }
    }

    for (const candidate of candidateFiles) {
      const full = path.resolve(candidate);
      if (fs.existsSync(full)) {
        return fs.statSync(full).mtime;
      }
    }
  } catch {
    // fallback
  }
  return undefined;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://newspaper-clipping-generator.example.com',
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/editor'),
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
      serialize(item) {
        const lastmod = resolveLastmod(item.url);
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        }
        return item;
      },
    }),
    {
      name: 'sitemap-xml-alias',
      hooks: {
        'astro:server:setup': ({ server }) => {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';
            if (urlPath === '/sitemap.xml' || urlPath === '/sitemap-index.xml' || urlPath === '/sitemap-0.xml') {
              const fileName = urlPath === '/sitemap.xml' ? 'sitemap-index.xml' : urlPath.slice(1);
              const filePath = path.resolve('dist', fileName);
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
            next();
          });
        },
        'astro:build:done': async ({ dir, logger }) => {
          const destDir = fileURLToPath(dir);
          const indexFile = path.join(destDir, 'sitemap-index.xml');
          const aliasFile = path.join(destDir, 'sitemap.xml');
          if (fs.existsSync(indexFile)) {
            fs.copyFileSync(indexFile, aliasFile);
            logger.info('`sitemap.xml` alias created from `sitemap-index.xml`');
          }
        },
      },
    },
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
