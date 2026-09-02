import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = sorted.map(post => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${context.site || 'https://newspaper-clipping-generator.example.com'}/blog/${post.slug.replace(/^en\//, '')}</link>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <guid>${context.site || 'https://newspaper-clipping-generator.example.com'}/blog/${post.slug.replace(/^en\//, '')}</guid>
    </item>
  `).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Vintage Press — Newspaper Clipping Blog</title>
    <description>Guides, history, typography secrets, and creative ideas for vintage newspaper clippings.</description>
    <link>${context.site || 'https://newspaper-clipping-generator.example.com'}</link>
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
