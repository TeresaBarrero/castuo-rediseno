import { getCollection, type CollectionEntry } from 'astro:content';
import { eur } from '@/config';

export type Product = CollectionEntry<'products'>;

export interface Card {
  key: string; productId: string; name: string; catLabel: string; category: string; tipo?: string;
  price: number; priceLabel: string; img: string; hoverImg?: string; href: string; out: boolean;
  cta: 'Añadir' | 'Elegir' | 'Avísame'; fmts: string[]; order: number; isNew: boolean;
  addPayload?: string; transitionName: string; best?: number;
}

export const CATS = [
  { id: 'aceite', slug: 'aceite-de-oliva-virgen-extra', label: 'Aceite de oliva', title: 'Aceite de oliva virgen extra' },
  { id: 'vino', slug: 'vinos', label: 'Vinos', title: 'Vinos de la cooperativa' },
  { id: 'estuches', slug: 'estuches-regalo', label: 'Estuches regalo', title: 'Estuches regalo' },
] as const;

export const productUrl = (id: string, fmt?: string) => `/producto/${id}/${fmt ? `?formato=${fmt}` : ''}`;
const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export async function getProducts() {
  return (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);
}

export function cardsFor(p: Product): Card[] {
  const d = p.data;
  const hover = d.gallery[0];
  if (d.listing === 'perFormat') {
    return d.formats.map((f, i) => ({
      key: `${p.id}-${f.key}`, productId: p.id, name: `${d.name} · ${lc(f.short)}`, catLabel: d.catLabel, category: d.category, tipo: d.tipo,
      price: f.price, priceLabel: eur(f.price), img: f.img, hoverImg: hover, href: productUrl(p.id, d.formats.length > 1 ? f.key : undefined),
      out: !!(f.out || d.out), cta: f.out || d.out ? 'Avísame' : 'Añadir', fmts: [f.fmt ?? ''], order: d.order * 10 + i, isNew: false,
      addPayload: JSON.stringify({ id: p.id, name: d.name, variant: f.short, price: f.price, img: '', url: productUrl(p.id, f.key) }),
      transitionName: `prod-${p.id}-${f.key}`, best: f.best,
    }));
  }
  const prices = d.formats.map((f) => f.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const multi = d.formats.length > 1;
  const f = d.formats[0];
  const img = multi ? (d.gallery[0] ?? f.img) : f.img;
  return [{
    key: p.id, productId: p.id, name: d.name, catLabel: d.catLabel, category: d.category, tipo: d.tipo,
    price: min, priceLabel: multi ? `${eur(min)} – ${eur(max)}` : eur(min), img, hoverImg: multi ? d.gallery[1] : hover,
    href: productUrl(p.id), out: !!d.out, cta: d.out ? 'Avísame' : multi ? 'Elegir' : 'Añadir',
    fmts: [...new Set(d.formats.map((x) => x.fmt ?? ''))], order: d.order * 10, isNew: p.id.includes('cosecha'),
    addPayload: multi || d.out ? undefined : JSON.stringify({ id: p.id, name: d.name, price: f.price, img: '', url: productUrl(p.id) }),
    transitionName: `prod-${p.id}`,
  }];
}

export async function getCards() {
  return (await getProducts()).flatMap(cardsFor);
}
