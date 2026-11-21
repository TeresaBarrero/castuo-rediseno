// Utilidades del blog «Cuaderno Castúo».
import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_CATEGORIES } from '@/lib/blog-cats';
import { getProducts, cardsFor, productUrl, type Card } from '@/lib/shop';

export type CatId = (typeof BLOG_CATEGORIES)[number];
export type PostEntry = CollectionEntry<'posts'>;
export interface Post extends PostEntry { readingTime: number; url: string; words: number }

export const BLOG = {
  name: 'Cuaderno Castúo',
  tagline: 'Aceite, vino, recetas y vida de campo, contado por quienes trabajan la tierra en Guareña.',
  author: 'Equipo de la Cooperativa del Campo San Pedro',
  authorShort: 'Equipo Castuo',
  newsletter: 'La carta castúa',
  pageSize: 9,
  // Nota s-bp del diseño
  title: 'Cuaderno Castúo · Blog de aceite, vino y campo extremeño',
  description: 'Historias del campo de Guareña, guías para elegir y conservar aceite de oliva virgen extra y recetas extremeñas, contadas por la Cooperativa del Campo San Pedro.',
};

export const CATEGORIES: Record<CatId, { label: string; title: string; description: string; intro: string }> = {
  'del-campo': {
    label: 'Del campo',
    title: 'Del campo · Olivar y viña mes a mes | Cuaderno Castúo',
    description: 'La poda, la floración, la vendimia y la campaña de aceituna en Guareña, contadas por los socios y técnicos de la Cooperativa del Campo San Pedro.',
    intro: 'La poda, la floración, la vendimia y la campaña de aceituna, mes a mes.',
  },
  'en-la-cocina': {
    label: 'En la cocina',
    title: 'Recetas extremeñas con aceite de oliva | Cuaderno Castúo',
    description: 'Recetas extremeñas de siempre y otras nuevas con aceite de oliva virgen extra y vino de la cooperativa: migas, tostadas y más, paso a paso.',
    intro: 'Recetas extremeñas de siempre y otras nuevas, con el aceite como protagonista.',
  },
  aceite: {
    label: 'Aceite',
    title: 'Guías de aceite de oliva virgen extra | Cuaderno Castúo',
    description: 'Cómo elegir, leer la etiqueta, catar y conservar el aceite de oliva virgen extra. Guías prácticas de la Cooperativa del Campo San Pedro, en Guareña.',
    intro: 'Guías para elegir, catar y conservar el aceite de oliva virgen extra.',
  },
  vino: {
    label: 'Vino',
    title: 'Vino de mesa: cómo servirlo y maridarlo | Cuaderno Castúo',
    description: 'Temperatura, copa, conservación y maridajes sencillos para los vinos tinto, blanco y semidulce El Castúo de la cooperativa de Guareña.',
    intro: 'Temperatura, copa y maridajes sencillos para los vinos de la casa.',
  },
  'la-cooperativa': {
    label: 'La cooperativa',
    title: 'La cooperativa: socios, historia y premios | Cuaderno Castúo',
    description: 'La historia de la Cooperativa del Campo San Pedro desde 1965, sus socios, sus premios y lo que deciden juntos en Guareña (Badajoz).',
    intro: 'Nuestros socios, nuestros premios y lo que decidimos juntos.',
  },
  noticias: {
    label: 'Noticias',
    title: 'Noticias de la cooperativa | Cuaderno Castúo',
    description: 'Avisos de campaña, novedades de la tienda y noticias de la Cooperativa del Campo San Pedro en Guareña.',
    intro: 'Avisos de campaña y novedades de la cooperativa.',
  },
};
export const CAT_IDS = BLOG_CATEGORIES as readonly CatId[];
export const catLabel = (c: CatId) => CATEGORIES[c].label;
export const catUrl = (c: CatId) => `/blog/${c}/`;
export const postUrl = (id: string) => `/blog/${id}/`;

export const fmtDate = (d: Date) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Texto plano aproximado del cuerpo MDX (sin import, etiquetas JSX ni marcas de Markdown). */
export function plainText(body = '') {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
/** Minutos de lectura: 200 palabras por minuto (cuerpo + receta + preguntas). */
export function readingStats(p: PostEntry) {
  const extra = [...(p.data.recipe?.ingredients ?? []), ...(p.data.recipe?.steps ?? []), ...(p.data.faqs ?? []).flatMap((f) => [f.q, f.a])].join(' ');
  const words = (plainText(p.body) + ' ' + extra).split(/\s+/).filter(Boolean).length;
  return { words, readingTime: Math.max(1, Math.round(words / 200)) };
}

/** Todos los artículos, del más reciente al más antiguo, con tiempo de lectura calculado. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all
    .map((p) => Object.assign(p, { ...readingStats(p), url: postUrl(p.id) }) as Post)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Tarjeta de tienda para un producto relacionado (con el formato indicado o el destacado). */
export async function productCards(refs: { id: string; format?: string }[]): Promise<Card[]> {
  const products = await getProducts();
  const out: Card[] = [];
  for (const r of refs) {
    const p = products.find((x) => x.id === r.id);
    if (!p) throw new Error(`Producto relacionado inexistente: ${r.id}`);
    const cs = cardsFor(p);
    const byFmt = r.format ? cs.find((c) => c.key === `${p.id}-${r.format}`) : undefined;
    if (r.format && !byFmt && p.data.listing === 'perFormat') throw new Error(`Formato inexistente: ${r.id} · ${r.format}`);
    const c = byFmt ?? cs.find((x) => x.best === 1) ?? cs[0];
    out.push({ ...c, href: r.format ? productUrl(p.id, r.format) : c.href });
  }
  return out;
}

/** Hasta `n` artículos relacionados: primero de la misma categoría, después los más recientes. */
export function related(post: Post, all: Post[], n = 3) {
  const others = all.filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.data.category === post.data.category);
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, n);
}
