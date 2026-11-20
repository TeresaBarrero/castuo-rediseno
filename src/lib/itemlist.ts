import type { Card } from './shop';

export function itemList(site: URL, cards: Card[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: cards.length,
    itemListElement: cards.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: new URL(c.href, site).href,
      name: c.name,
    })),
  };
}
