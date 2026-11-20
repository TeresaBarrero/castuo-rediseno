// Reconstruye el catálogo bruto a partir del HTML guardado (scripts/.crawl/*.html) y las imágenes en disco.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const RAW = path.resolve('scripts/.crawl');
const OUT = path.resolve('src/assets/fotos/original');
const strip = (u) => u.replace(/-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp)$)/i, '').replace(/-scaled(?=\.(jpe?g|png|webp)$)/i, '');
const fileFor = (u) => { const name = decodeURIComponent(u.split('/').pop()).toLowerCase().replace(/[^a-z0-9.\-_]/g, '-'); const ym = u.match(/uploads\/(\d{4})\/(\d{2})\//); return (ym ? `${ym[1]}-${ym[2]}-` : '') + name; };
const map = new Map();
for (const f of (await fs.readdir(RAW)).filter((f) => f.endsWith('.html'))) {
  const page = decodeURIComponent(f.slice(0, -5));
  const html = await fs.readFile(path.join(RAW, f), 'utf8');
  const found = new Set();
  for (const m of html.matchAll(/(https?:\/\/castuo\.es\/wp-content\/uploads\/[^"'\s,)]+\.(?:jpe?g|png|webp))/gi)) found.add(strip(m[1].replace(/^http:/, 'https:')));
  for (const u of found) { if (!map.has(u)) map.set(u, new Set()); map.get(u).add(page); }
}
const files = new Set(await fs.readdir(OUT));
const cat = [];
const seenFile = new Set();
for (const [u, pages] of map) {
  let file = fileFor(u);
  if (!files.has(file)) { const alt = fileFor(u.replace(/(\.\w+)$/, '-scaled$1')); if (files.has(alt)) file = alt; else continue; }
  if (seenFile.has(file)) { cat.find((c) => c.archivo === file).paginas.push(...pages); continue; }
  seenFile.add(file);
  const m = await sharp(path.join(OUT, file)).metadata();
  cat.push({ archivo: file, url: u, paginas: [...pages], ancho: m.width, alto: m.height, formato: m.format });
}
const orphans = [...files].filter((f) => !seenFile.has(f));
await fs.writeFile(path.join(RAW, 'catalogo-bruto.json'), JSON.stringify(cat, null, 2));
console.log('catálogo:', cat.length, '· archivos sin página:', orphans.length, orphans.slice(0, 10));
