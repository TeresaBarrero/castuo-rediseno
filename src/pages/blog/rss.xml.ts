// Feed RSS del Cuaderno Castúo (@astrojs/rss).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { BLOG, catLabel, getPosts } from '@/lib/blog';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: BLOG.name,
    description: BLOG.description,
    site: context.site!,
    trailingSlash: true,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>es-ES</language><atom:link href="${new URL('/blog/rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: p.url,
      pubDate: p.data.pubDate,
      categories: [catLabel(p.data.category), ...p.data.tags],
      author: `info@castuo.es (${BLOG.author})`,
    })),
  });
}
