// Índice de búsqueda del blog, generado en build. Lo carga el buscador de la cabecera editorial (scripts/blog.ts).
import type { APIRoute } from 'astro';
import { catLabel, getPosts, plainText } from '@/lib/blog';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const docs = posts.map((p) => ({
    t: p.data.title,
    u: p.url,
    c: catLabel(p.data.category),
    d: p.data.excerpt,
    k: [p.data.description, ...p.data.tags, p.data.recipe ? 'receta' : ''].join(' '),
    b: plainText(p.body).slice(0, 4000),
  }));
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
