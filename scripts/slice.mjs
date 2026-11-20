// Corta una captura a página completa en tramos para revisarla.
import sharp from 'sharp';
const [,, file, segH = '1600', scale = '0.6'] = process.argv;
const m = await sharp(file).metadata();
const H = Number(segH); let i = 0;
for (let y = 0; y < m.height; y += H, i++) {
  const h = Math.min(H, m.height - y);
  await sharp(file).extract({ left: 0, top: y, width: m.width, height: h }).resize(Math.round(m.width * Number(scale))).jpeg({ quality: 70 }).toFile(file.replace(/\.png$/, `-${i}.jpg`));
}
console.log(file, m.width + 'x' + m.height, i, 'tramos');
