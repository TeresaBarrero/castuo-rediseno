// Genera src/content/products.json con los datos actuales de la tienda de castuo.es (rastreados el 20/11/2026).
import fs from 'node:fs/promises';

const files = new Set(await fs.readdir('src/assets/fotos/original'));
const img = (name) => { const f = `2021-11-${name.toLowerCase()}`; if (!files.has(f)) throw new Error('Falta ' + f); return f; };

const WORD = (w) => w === 'aceite' ? 'aceite' : /blanco-(de-)?mesa/.test(w) ? 'vino blanco de mesa' : /blanco/.test(w) ? 'vino blanco' : /tinto/.test(w) ? 'vino tinto' : w;
function labelFromImg(name) {
  const parts = name.replace(/\.jpg$/, '').match(/(\d)-([a-z-]+?)(?=-\d|$)/g) ?? [];
  return parts.map((p) => { const [, n, w] = p.match(/(\d)-(.+)/); return `${n} × ${WORD(w)}`; }).join(' + ');
}
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const est3 = [
  ['2-vino-blanco-1-aceite-1.jpg', 20.2], ['2-blanco-mesa-1-aceite.jpg', 18.2], ['2-tinto-1-aceite.jpg', 18.7], ['2-tinto-1-blanco.jpg', 12.7],
  ['2-tinto-1-blanco-mesa.jpg', 11.7], ['2-blanco-1-tinto.jpg', 13.7], ['2-blanco-mesa-1-tinto.jpg', 11.7], ['2-aceite-1-blanco.jpg', 26.2],
  ['2-blanco-mesa-1-blanco.jpg', 12.2], ['1-blanco-1-aceite-1-blanco-mesa.jpg', 19.2], ['1-blanco-1-blanco-mesa-1-tinto.jpg', 12.7],
  ['2-aceite-1-blanco-mesa.jpg', 25.5], ['2-blanco-1-blanco-mesa.jpg', 13.2], ['1-tinto-1-blanco-1-aceite.jpg', 19.7],
  ['1-tinto-1-blanco-mesa-1-aceite.jpg', 18.7], ['1-tinto-2-aceite.jpg', 25.7], ['3-aceite.jpg', 32.2], ['3-blanco.jpg', 14.2],
  ['3-blanco-mesa.jpg', 11.2], ['3-tinto.jpg', 12.7],
];
const est2 = [
  ['1-aceite-1-blanco.jpg', 16.1], ['1-aceite-1-tinto.jpg', 15.6], ['1-aceite-1-blanco-de-mesa-1.jpg', 15.1], ['1-blanco-1-blanco-de-mesa.jpg', 9.1],
  ['1-blanco-1-tinto.jpg', 9.6], ['1-tinto-1-blanco-mesa.jpg', 8.6], ['2-aceite.jpg', 22.1], ['2-blanco.jpg', 10.1], ['2-blanco-de-mesa.jpg', 8.1], ['2-tinto-1.jpg', 8.6],
];
const variants = (list) => list.map(([f, price]) => {
  const label = labelFromImg(f);
  return { key: slug(label.replace(/×/g, 'x')), label, title: `estuche con ${label}`, short: label, price, img: img(f) };
}).sort((a, b) => a.price - b.price);

const AOVE_SPEC = (fmt) => [
  ['Categoría', 'Aceite de oliva virgen extra'],
  ['Variedad', 'Aceitunas de los socios · consultar variedades de la campaña'],
  ['Campaña', 'Campaña en curso · consultar'],
  ['Acidez', '≤ 0,8º (límite legal de la categoría virgen extra)'],
  ['Origen', 'Guareña y municipios de los socios (Badajoz)'],
  ['Elaboración', 'Almazara de la cooperativa · extracción por procedimientos mecánicos'],
  ['Formato', fmt],
];

const products = [
  {
    id: 'aceite-de-oliva-virgen-extra', order: 1, category: 'aceite', catLabel: 'Aceite',
    name: 'AOVE Castuo', fullName: 'Aceite de oliva virgen extra El Castúo',
    eyebrow: 'Aceite de oliva virgen extra · Cooperativa de Guareña',
    intro: 'Virgen extra de nuestros socios, molturado en la almazara de la cooperativa y envasado en origen. Un aceite de uso diario, para el crudo y para la cocina de todos los días.',
    tasting: 'Cada campaña tiene su perfil. Consulta la nota de cata del panel en las fichas técnicas de la campaña.',
    uses: 'tostadas, ensaladas, gazpacho, migas, frituras y repostería.',
    sourceUrl: 'https://castuo.es/categoria-producto/aceite-castuo/',
    awardLink: true, listing: 'perFormat', defaultFormat: '3x5l',
    formats: [
      { key: '250ml', label: 'Botella 250 ml', title: 'botella de 250 ml', short: 'Botella 250 ml', price: 5.0, litres: 0.25, img: '2021-02-aceite-el-castuo-0.25-l-1.jpg', fmt: '250ml' },
      { key: '500ml', label: 'Botella 500 ml', title: 'botella de 500 ml', short: 'Botella 500 ml', price: 8.0, litres: 0.5, img: '2021-02-aceite-el-castuo-0.5-l-1.jpg', fmt: '500ml', best: 1 },
      { key: '750ml', label: 'Botella 750 ml', title: 'botella de 750 ml', short: 'Botella 750 ml', price: 10.0, litres: 0.75, img: '2021-02-aceite-el-castuo-0.75-l-1.jpg', fmt: '750ml' },
      { key: '6x2l', label: 'Caja 6 × 2 L', title: 'caja de 6 garrafas de 2 L', short: 'Caja 6 × 2 L', price: 52.8, litres: 12, img: '2021-02-aceite-el-castuo-2-l-2.jpg', fmt: '2l', best: 2 },
      { key: '6x3l', label: 'Caja 6 × 3 L', title: 'caja de 6 garrafas de 3 L', short: 'Caja 6 × 3 L', price: 78.3, litres: 18, img: '2021-02-aceite-el-castuo-3-l-2.jpg', fmt: '3l' },
      { key: '3x5l', label: 'Caja 3 × 5 L', title: 'caja de 3 garrafas de 5 L', short: 'Caja 3 × 5 L', price: 64.5, litres: 15, img: '2021-02-aceite-el-castuo-5-l-2.jpg', fmt: '5l', best: 3 },
    ],
    gallery: ['2025-05-premios-extrema-seleccion-aove-2025-4.jpg', '2025-04-5-imagen-de-whatsapp-2025-04-04-a-las-11.36.25_5211cb80.jpg', '2025-05-premios-extrema-seleccion-aove-2025-2.jpg'],
    related: ['estuche-unitario-aceite-750-ml', 'estuche-regalo-3-botellas', 'vino-de-mesa-semidulce-el-castuo'],
    specFn: 'aove',
  },
  {
    id: 'aove-cosecha-temprana-6x2l', order: 7, category: 'aceite', catLabel: 'Aceite · Cosecha temprana',
    name: 'AOVE cosecha temprana · caja 6 × 2 L', fullName: 'Aceite de oliva virgen extra cosecha temprana · caja de 6 garrafas de 2 L',
    eyebrow: 'Cosecha temprana · Edición limitada',
    intro: 'Aceite de aceitunas recogidas antes de su maduración completa. Monovarietal Picual, edición limitada y Medalla de Oro en el concurso Extrema Selección.',
    tasting: 'Más verde e intenso, con más amargor y picante que un aceite de recolección tardía. Consulta la nota de cata del panel en la ficha técnica.',
    uses: 'tostadas, ensaladas, carpaccios y platos en crudo donde el aceite sea protagonista.',
    sourceUrl: 'https://castuo.es/tienda/aceite-castuo/aceite-de-oliva-virgen-extra-cosecha-temprana-6-garrafas-de-2-l/',
    out: true, awardLink: true, listing: 'single',
    formats: [{ key: '6x2l', label: 'Caja 6 × 2 L', title: 'caja de 6 garrafas de 2 L', short: 'Caja 6 × 2 L', price: 66.0, litres: 12, img: '2025-05-aceite-de-oliva-virgen-extra-cosecha-temprana-6-garrafas-de-2-l.jpg', fmt: '2l', out: true }],
    gallery: ['2025-05-premios-extrema-seleccion-aove-2025-7.jpg'],
    related: ['aceite-de-oliva-virgen-extra', 'estuche-unitario-aceite-750-ml', 'estuche-regalo-2-botellas'],
    spec: [['Categoría', 'Aceite de oliva virgen extra · cosecha temprana'], ['Variedad', 'Picual (monovarietal)'], ['Campaña', 'Edición limitada · consultar'], ['Acidez', '≤ 0,8º (límite legal de la categoría virgen extra)'], ['Origen', 'Guareña y municipios de los socios (Badajoz)'], ['Reconocimiento', 'Medalla de Oro · Premios Extrema Selección 2025'], ['Formato', 'Caja de 6 garrafas de 2 L']],
  },
  {
    id: 'vino-tinto-el-castuo', order: 9, category: 'vino', tipo: 'tinto', catLabel: 'Vino tinto',
    name: 'Vino tinto El Castúo', fullName: 'Vino tinto El Castúo',
    eyebrow: 'Vino tinto · Bodega de la cooperativa',
    intro: 'Vino tinto elaborado con la uva de nuestros socios en la bodega de la cooperativa. En caja de 6 botellas o en garrafas de 5 litros.',
    tasting: 'Consulta la ficha del vino de la campaña.', uses: 'carnes, guisos, embutidos y quesos de la tierra.',
    sourceUrl: 'https://castuo.es/categoria-producto/vino-tinto/', listing: 'perFormat', wine: true,
    formats: [
      { key: '6x075l', label: 'Caja 6 × 0,75 L', title: 'caja de 6 botellas de 0,75 L', short: 'Caja 6 × 0,75 L', price: 21.0, litres: 4.5, img: '2021-02-vino-tinto-el-castuo-0.75-l-1.jpg', fmt: '750ml' },
      { key: '3x5l', label: 'Caja 3 × 5 L', title: 'caja de 3 garrafas de 5 L', short: 'Caja 3 × 5 L', price: 19.5, litres: 15, img: '2021-02-vino-tinto-el-castuo-5-l-1.jpg', fmt: '5l' },
    ],
    gallery: ['2025-01-vino-tinto-el-castuo.jpg'],
    related: ['vino-de-mesa-blanco-el-castuo', 'estuche-unitario-vino-tinto-de-mesa-750-ml', 'estuche-regalo-3-botellas'],
    spec: [['Tipo', 'Vino tinto'], ['Variedad', 'Uva de los socios · consultar'], ['Origen', 'Viñedos de los socios (Badajoz)'], ['Elaboración', 'Bodega de la cooperativa'], ['Formato', 'Caja de 6 botellas de 0,75 L']],
  },
  {
    id: 'vino-de-mesa-blanco-el-castuo', order: 10, category: 'vino', tipo: 'blanco', catLabel: 'Vino blanco',
    name: 'Vino de mesa blanco El Castúo', fullName: 'Vino de mesa blanco El Castúo',
    eyebrow: 'Vino de mesa blanco · Bodega de la cooperativa',
    intro: 'Vino de mesa blanco de la cooperativa, fresco y de diario. En caja de 6 botellas o en garrafas de 5 litros.',
    tasting: 'Consulta la ficha del vino de la campaña.', uses: 'pescados, arroces, ensaladas y aperitivos.',
    sourceUrl: 'https://castuo.es/categoria-producto/vino-blanco/', listing: 'perFormat', wine: true,
    formats: [
      { key: '6x075l', label: 'Caja 6 × 0,75 L', title: 'caja de 6 botellas de 0,75 L', short: 'Caja 6 × 0,75 L', price: 18.0, litres: 4.5, img: '2021-02-vino-de-mesa-blanco-el-castuo-0.75-l-1.jpg', fmt: '750ml' },
      { key: '3x5l', label: 'Caja 3 × 5 L', title: 'caja de 3 garrafas de 5 L', short: 'Caja 3 × 5 L', price: 18.0, litres: 15, img: '2021-02-vino-de-mesa-blanco-el-castuo-5-l-1.jpg', fmt: '5l' },
    ],
    gallery: ['2025-01-vino-de-mesa-blanco-el-castuo.jpg'],
    related: ['vino-de-mesa-semidulce-el-castuo', 'estuche-unitario-vino-blanco-de-mesa-750-ml', 'estuche-regalo-2-botellas'],
    spec: [['Tipo', 'Vino de mesa blanco'], ['Variedad', 'Uva de los socios · consultar'], ['Origen', 'Viñedos de los socios (Badajoz)'], ['Elaboración', 'Bodega de la cooperativa'], ['Formato', 'Caja de 6 botellas de 0,75 L']],
  },
  {
    id: 'vino-de-mesa-semidulce-el-castuo', order: 6, category: 'vino', tipo: 'semidulce', catLabel: 'Vino',
    name: 'Vino de mesa semidulce El Castuo', fullName: 'Vino de mesa semidulce El Castuo',
    eyebrow: 'Vino de mesa semidulce · Bodega de la cooperativa',
    intro: 'El vino de mesa semidulce de la casa, para servir fresco. Se vende por botella y sin estuche.',
    tasting: 'Sírvelo fresco, entre 6 y 8 ºC.', uses: 'aperitivos, quesos suaves y postres poco dulces.',
    sourceUrl: 'https://castuo.es/tienda/vino-de-mesa-semi-dulce/vino-de-mesa-semi-dulce-el-castuo/', listing: 'single', wine: true,
    formats: [{ key: 'botella', label: 'Botella', title: 'botella (sin estuche)', short: 'Botella', price: 3.0, img: '2025-01-vino-de-mesa-semi-dulce-el-castuo.jpg', fmt: '750ml' }],
    gallery: ['2022-12-img_0331.jpg', '2022-12-img_0330.jpg', '2022-12-vino-de-mesa-semi-dulce-el-castuo-categoria.jpg'],
    related: ['vino-de-mesa-blanco-el-castuo', 'estuche-regalo-2-botellas', 'aceite-de-oliva-virgen-extra'],
    spec: [['Tipo', 'Vino de mesa semidulce'], ['Temperatura de servicio', 'Entre 6 y 8 ºC'], ['Origen', 'Viñedos de los socios (Badajoz)'], ['Elaboración', 'Bodega de la cooperativa'], ['Formato', 'Botella, sin estuche']],
  },
  {
    id: 'estuche-regalo-3-botellas', order: 5, category: 'estuches', catLabel: 'Estuches regalo',
    name: 'Estuche regalo 3 botellas', fullName: 'Estuche regalo de 3 botellas El Castúo',
    eyebrow: 'Estuches regalo · Aceite y vino',
    intro: 'Estuche negro El Castúo con tres botellas de 750 ml. Elige la combinación de aceite y vinos: veinte composiciones posibles.',
    tasting: 'Una forma sencilla de regalar lo que sale de nuestra tierra.', uses: 'regalos de empresa, celebraciones y cestas de Navidad.',
    sourceUrl: 'https://castuo.es/tienda/estuches-regalo/estuche-de-3-botellas/estuches-de-3-botellas/', listing: 'single',
    formats: variants(est3).map((v) => ({ ...v, fmt: '750ml' })),
    gallery: ['2021-11-estuche-3-botellas-categoria.jpg', '2021-11-estuches-categoria.jpg'],
    related: ['estuche-regalo-2-botellas', 'estuche-unitario-aceite-750-ml', 'aceite-de-oliva-virgen-extra'],
    spec: [['Contenido', '3 botellas de 750 ml'], ['Composición', 'A elegir entre aceite, vino tinto, vino blanco y vino blanco de mesa'], ['Presentación', 'Estuche de cartón negro con asa']],
  },
  {
    id: 'estuche-regalo-2-botellas', order: 8, category: 'estuches', catLabel: 'Estuches regalo',
    name: 'Estuche regalo 2 botellas', fullName: 'Estuche regalo de 2 botellas El Castúo',
    eyebrow: 'Estuches regalo · Aceite y vino',
    intro: 'Estuche negro El Castúo con dos botellas de 750 ml. Diez combinaciones de aceite y vinos.',
    tasting: 'Una forma sencilla de regalar lo que sale de nuestra tierra.', uses: 'regalos de empresa, celebraciones y detalles.',
    sourceUrl: 'https://castuo.es/tienda/estuches-regalo/estuche-de-2-botellas/estuches-de-2-botellas/', listing: 'single',
    formats: variants(est2).map((v) => ({ ...v, fmt: '750ml' })),
    gallery: ['2021-11-estuche-2-botellas-categoria.jpg'],
    related: ['estuche-regalo-3-botellas', 'estuche-unitario-vino-blanco-750-ml', 'vino-de-mesa-semidulce-el-castuo'],
    spec: [['Contenido', '2 botellas de 750 ml'], ['Composición', 'A elegir entre aceite, vino tinto, vino blanco y vino blanco de mesa'], ['Presentación', 'Estuche de cartón negro con asa']],
  },
  ...[
    ['estuche-unitario-aceite-750-ml', 11, 'Estuche unitario · aceite 750 ml', 'Estuche unitario de aceite de oliva virgen extra 750 ml', 11.9, '2021-11-aceite-750-ml-10.jpg', 'Botella de 750 ml de aceite de oliva virgen extra en estuche individual negro.', 'https://castuo.es/tienda/estuches-regalo/estuche-unitario/estuche-unitario-aceite-750-ml/'],
    ['estuche-unitario-vino-blanco-750-ml', 12, 'Estuche unitario · vino blanco 750 ml', 'Estuche unitario de vino blanco 750 ml', 5.9, '2021-11-vino-blanco.jpg', 'Botella de 750 ml de vino blanco en estuche individual negro.', 'https://castuo.es/tienda/estuches-regalo/estuche-unitario/estuche-unitario-vino-blanco-750-ml/'],
    ['estuche-unitario-vino-tinto-de-mesa-750-ml', 13, 'Estuche unitario · vino de mesa tinto 750 ml', 'Estuche unitario de vino de mesa tinto 750 ml', 5.4, '2021-11-tinto-de-mesa-1-1.jpg', 'Botella de 750 ml de vino de mesa tinto en estuche individual negro.', 'https://castuo.es/tienda/estuches-regalo/estuche-unitario/estuche-unitario-vino-tinto-de-mesa-750-ml/'],
    ['estuche-unitario-vino-blanco-de-mesa-750-ml', 14, 'Estuche unitario · vino de mesa blanco 750 ml', 'Estuche unitario de vino de mesa blanco 750 ml', 4.9, '2021-11-blanco-de-mesa-2.jpg', 'Botella de 750 ml de vino de mesa blanco en estuche individual negro.', 'https://castuo.es/tienda/estuches-regalo/estuche-unitario/estuche-unitario-vino-blanco-de-mesa-750-ml/'],
  ].map(([id, order, name, fullName, price, im, intro, src]) => ({
    id, order, category: 'estuches', catLabel: 'Estuches regalo', name, fullName,
    eyebrow: 'Estuche unitario · Regalo', intro,
    tasting: 'Un detalle sencillo con producto de la cooperativa.', uses: 'regalos, detalles de empresa y celebraciones.',
    sourceUrl: src, listing: 'single', wine: !/aceite/.test(id), awardLink: /aceite/.test(id),
    formats: [{ key: '750ml', label: 'Estuche 750 ml', title: 'estuche con botella de 750 ml', short: 'Estuche 750 ml', price, litres: 0.75, img: im, fmt: '750ml' }],
    gallery: [],
    related: ['estuche-regalo-2-botellas', 'estuche-regalo-3-botellas', /aceite/.test(id) ? 'aceite-de-oliva-virgen-extra' : 'vino-de-mesa-semidulce-el-castuo'],
    spec: [['Contenido', '1 botella de 750 ml'], ['Presentación', 'Estuche individual de cartón negro']],
  })),
];

for (const p of products) {
  if (p.specFn === 'aove') { p.spec = AOVE_SPEC('Según el formato elegido'); delete p.specFn; }
  for (const f of p.formats) if (!files.has(f.img)) throw new Error('Falta imagen ' + f.img);
  for (const g of p.gallery) if (!files.has(g)) throw new Error('Falta imagen ' + g);
}
await fs.mkdir('src/content', { recursive: true });
await fs.writeFile('src/content/products.json', JSON.stringify(products, null, 2));
console.log('products.json:', products.length, 'productos,', products.reduce((n, p) => n + p.formats.length, 0), 'formatos');
console.log(products.find((p) => p.id === 'estuche-regalo-3-botellas').formats.map((f) => `${f.label} ${f.price}`).join('\n'));
