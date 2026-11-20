import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const [,, outDir] = process.argv;
const cat = JSON.parse(await fs.readFile('scripts/.crawl/catalogo-bruto.json', 'utf8'));
cat.sort((a, b) => a.archivo.localeCompare(b.archivo));
const list = cat.map((c, i) => ({ i, f: c.archivo }));
await fs.writeFile(path.join(outDir, 'index.json'), JSON.stringify(list));
const W = 300, H = 220, COLS = 5, ROWS = 4, PER = COLS * ROWS;
for (let s = 0; s * PER < list.length; s++) {
  const items = list.slice(s * PER, (s + 1) * PER);
  const comps = [];
  for (const [k, it] of items.entries()) {
    const x = (k % COLS) * W, y = Math.floor(k / COLS) * H;
    const buf = await sharp(path.join('src/assets/fotos/original', it.f)).flatten({ background: '#ffffff' }).resize(W - 8, H - 30, { fit: 'contain', background: '#eeeeee' }).toBuffer();
    comps.push({ input: buf, left: x + 4, top: y + 26 });
    const label = Buffer.from(`<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#000"/><text x="6" y="17" font-family="Arial" font-size="15" fill="#ff0">${it.i}</text><text x="48" y="17" font-family="Arial" font-size="11" fill="#fff">${it.f.slice(0, 40)}</text></svg>`);
    comps.push({ input: label, left: x, top: y });
  }
  await sharp({ create: { width: W * COLS, height: H * ROWS, channels: 3, background: '#ffffff' } }).composite(comps).jpeg({ quality: 80 }).toFile(path.join(outDir, `sheet-${String(s).padStart(2, '0')}.jpg`));
}
console.log('sheets', Math.ceil(list.length / PER));
