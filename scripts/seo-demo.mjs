// Copia el build a .seo-demo/ SIN noindex ni Disallow, solo para medir con Lighthouse el SEO on-page
// que tendría la web en producción. Esta copia no se despliega nunca (está en .gitignore).
import fs from 'node:fs';
import path from 'node:path';

const OUT = '.seo-demo';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
// (copia manual: fs.cpSync falla en Windows con rutas con «ñ»)
for (const f of walk('dist')) {
  const to = path.join(OUT, path.relative('dist', f));
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, fs.readFileSync(f));
}
let n = 0;
for (const f of walk(OUT).filter((x) => x.endsWith('.html'))) {
  const s = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, s.replace('<meta name="robots" content="noindex, nofollow">', ''));
  n++;
}
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log('Copia de demostración SEO en', OUT, '·', n, 'páginas');
