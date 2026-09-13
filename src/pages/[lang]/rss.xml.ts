import { getCollection } from 'astro:content';
import { languages, type SupportedLanguage } from '../../i18n/ui';

export function getStaticPaths() {
  return Object.keys(languages)
    .filter(lang => lang !== 'en')
    .map(lang => ({
      params: { lang }
    }));
}

export async function GET(context: any) {
  const locale = (context.params as any)?.lang as SupportedLanguage | undefined;
  const siteBase = (context.site?.toString() ?? 'https://newspaper-clipping-generator.example.com').replace(/\/$/, '');
  const lang: SupportedLanguage = locale && locale in languages ? locale : 'en';
  const prefix = lang === 'en' ? '' : `/${(languages as any)[lang].subpath || lang}`;
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.language === lang);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = sorted.map(post => {
    const slug = post.slug.replace(new RegExp(`^${post.data.language}/`), '');
    const url = `${siteBase}${prefix}/blog/${slug}`;
    return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${url}</link>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <author><![CDATA[${post.data.author || 'The Press Editorial Team'}]]></author>
      <category><![CDATA[${post.data.category || 'Design'}]]></category>
      <guid>${url}</guid>
    </item>
  `;}).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Vintage Press — Newspaper Clipping Blog (${lang})</title>
    <description>Guides, history, typography secrets, and creative ideas for vintage newspaper clippings.</description>
    <link>${siteBase}${prefix}/blog</link>
    <language>${(languages as any)[lang]?.hreflang || lang}</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}