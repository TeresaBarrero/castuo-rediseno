// Genera imágenes Open Graph 1200×630 (public/og/*.png) con el estilo de la marca, y el favicon.
// Uso: node scripts/og.mjs
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const FOTOS = 'src/assets/fotos/original';
const OUT = 'public/og';
await fs.mkdir(OUT, { recursive: true });

// Favicon y apple-touch-icon a partir del logo cuadrado oficial (solo redimensionado)
const sq = path.join(FOTOS, '2014-11-cropped-logotipo-nuevo.png');
await sharp(sq).resize(48, 48).png().toFile('public/favicon.png');
await sharp(sq).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('public/apple-touch-icon.png');

const b64 = async (file, w = 700, h = 630) => 'data:image/jpeg;base64,' + (await sharp(path.join(FOTOS, file)).resize(w, h, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer()).toString('base64');
const font = async (f) => 'data:font/woff2;base64,' + (await fs.readFile(f)).toString('base64');
const logo = 'data:image/png;base64,' + (await sharp('src/assets/logo/logotipo-castuo.png').resize(240).png().toBuffer()).toString('base64');
const bric = await font('node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2');
const inter = await font('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2');

const products = JSON.parse(await fs.readFile('src/content/products.json', 'utf8'));
const posts = (await fs.readdir('src/content/posts')).map((f) => f.replace('.mdx', ''));
const fotosTs = await fs.readFile('src/data/fotos.ts', 'utf8');
const slotFile = (k) => fotosTs.match(new RegExp(`'?${k}'?: \\{ file: '([^']+)'`))?.[1] ?? null;
const titleOf = async (id) => (await fs.readFile(`src/content/posts/${id}.mdx`, 'utf8')).match(/title: "([^"]+)"/)[1];

const items = [
  ['default', 'Cooperativa del Campo San Pedro', 'Aceite de oliva virgen extra y vino de Extremadura, directos del campo.', slotFile('heroInicio')],
  ['inicio', 'Guareña, Badajoz · Desde 1965', 'Aceite de oliva virgen extra y vino de Extremadura, directos del campo.', slotFile('heroInicio')],
  ['tienda', 'Tienda online', 'Aceite de oliva virgen extra, vinos y estuches regalo', slotFile('catAceite')],
  ['tienda-aceite', 'Tienda · Aceite', 'Aceite de oliva virgen extra de cooperativa', slotFile('catAceite')],
  ['tienda-vino', 'Tienda · Vinos', 'Vinos de la cooperativa: tinto, blanco y semidulce', slotFile('catVino')],
  ['tienda-estuches', 'Tienda · Estuches', 'Estuches regalo de aceite y vino', slotFile('catEstuches')],
  ['cooperativa', 'La cooperativa', 'Agricultores de Guareña desde 1965', slotFile('heroCooperativa')],
  ['fincas', 'Nuestras fincas', 'Olivar, viñedo y almendro en Guareña', slotFile('fincaVinedo')],
  ['calidad', 'Calidad y premios', 'Premios Extrema Selección 2025 · ISO 9001 · ISO 14001', slotFile('premioCalidad')],
  ['visitas', 'Visitas y oleoturismo', 'Visitas a la almazara y fincas en Guareña', slotFile('heroVisitas')],
  ['blog', 'Blog', 'Cultura del aceite, recetas y vida en el campo', slotFile('como-elegir-aceite-de-oliva-virgen-extra')],
  ['faq', 'Preguntas frecuentes', 'Envíos, pagos, aceite y vino', slotFile('heroInicio')],
  ['socios', 'Área de socios', 'Boletines A.T.R.I.A, descargas y balances', slotFile('galInstalaciones')],
  ['contacto', 'Contacto', 'Calle Don Benito, 13 · 06470 Guareña (Badajoz)', slotFile('heroCooperativa')],
  ...products.map((p) => [`producto-${p.id}`, p.catLabel, p.name, p.formats.find((f) => f.key === p.defaultFormat)?.img ?? p.formats[0].img, true]),
  ...(await Promise.all(posts.map(async (id) => [`blog-${id}`, 'Blog', await titleOf(id), slotFile(id)]))),
];

const html = (eyebrow, title, img, product) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(${bric})}@font-face{font-family:I;src:url(${inter})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#F6F5F0;font-family:I;color:#17201A;display:flex;overflow:hidden}
.l{flex:1;padding:64px 56px 56px 72px;display:flex;flex-direction:column;justify-content:space-between}
.e{font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#3F5B2E}
h1{font-family:B;font-weight:600;font-size:${title.length > 60 ? 50 : 60}px;line-height:1.04;letter-spacing:-.025em;margin-top:22px}
.f{display:flex;align-items:center;justify-content:space-between}.f img{height:72px}.u{font-size:18px;color:#4B4F45}
.r{width:500px;height:630px;${product ? 'background:#EEECE4;display:grid;place-items:center' : ''}}.r img{width:100%;height:100%;object-fit:${product ? 'contain;mix-blend-mode:multiply;padding:40px' : 'cover'}}
.tag{position:absolute;left:72px;bottom:150px;font-size:14px;color:#55594F}
</style></head><body><div class="l"><div><p class="e">${eyebrow}</p><h1>${title}</h1></div><div class="f"><img src="${logo}"><span class="u">Concepto de rediseño · castuo.es</span></div></div>
<div class="r">${img ? `<img src="${img}">` : ''}</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [name, eyebrow, title, file, product] of items) {
  const img = file ? await b64(file, product ? 800 : 700, product ? 1000 : 630) : null;
  await page.setContent(html(eyebrow, title, img, product), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await sharp(buf).png({ compressionLevel: 9, palette: false }).toFile(path.join(OUT, `${name}.png`));
}
await browser.close();
console.log('OG:', items.length, 'imágenes en', OUT);
