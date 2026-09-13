import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const siteBase = (context.site?.toString() ?? 'https://newspaper-clipping-generator.example.com').replace(/\/$/, '');
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = sorted.map(post => {
    const lang = post.data.language;
    const cleanSlug = post.slug.replace(new RegExp(`^(${lang}|en)/`), '');
    const prefix = lang === 'en' ? '' : `/${lang}`;
    const url = `${siteBase}${prefix}/blog/${cleanSlug}`;
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
    <title>The Vintage Press — Newspaper Clipping Blog</title>
    <description>Guides, history, typography secrets, and creative ideas for vintage newspaper clippings.</description>
    <link>${siteBase}/blog</link>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
