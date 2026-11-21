// Índice de búsqueda estático (productos, artículos y páginas) para el buscador de la cabecera.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { catLabel, getPosts } from '@/lib/blog';
import { getCards } from '@/lib/shop';

export const GET: APIRoute = async () => {
  const cards = await getCards();
  const posts = await getPosts();
  const fincas = await getCollection('fincas');
  const pages = [
    ['Tienda online', '/tienda/', 'tienda comprar'], ['La cooperativa: historia', '/cooperativa/', 'historia socios 1965 municipios'],
    ['Nuestras fincas', '/fincas/', 'olivar viñedo almendro'], ['Calidad y premios', '/calidad-y-premios/', 'iso 9001 14001 extrema selección trazabilidad'],
    ['Visitas a la almazara', '/visitas-almazara-guarena/', 'oleoturismo cata reservar'], ['Preguntas frecuentes', '/preguntas-frecuentes/', 'envíos pago ayuda'],
    ['Área de socios', '/socios/', 'atria boletines balances descargas'], ['Contacto', '/contacto/', 'teléfono dirección correo'],
  ];
  const docs = [
    ...cards.map((c) => ({ t: c.name, u: c.href, c: `Tienda · ${c.priceLabel}`, k: `${c.catLabel} ${c.category} ${c.tipo ?? ''}` })),
    ...posts.map((p) => ({ t: p.data.title, u: p.url, c: `Blog · ${catLabel(p.data.category)}`, k: `${p.data.description} ${p.data.tags.join(' ')}` })),
    ...fincas.map((f) => ({ t: f.data.name, u: `/fincas/${f.id}/`, c: 'Fincas', k: f.data.desc })),
    ...pages.map(([t, u, k]) => ({ t, u, c: 'Página', k })),
  ];
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
