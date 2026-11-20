// Añade la prop `crop` a los usos de <Foto> según la caja en que se muestran.
import fs from 'node:fs';
const edits = {
  'src/pages/index.astro': [
    ['<Foto slot="heroInicio" priority', '<Foto slot="heroInicio" crop={1} priority'],
    ['<Foto slot={c.slot} sizes="(max-width: 960px) 88px, 390px"', '<Foto slot={c.slot} crop={1} sizes="(max-width: 960px) 88px, 390px"'],
    ['<Foto slot="historiaInicio"', '<Foto slot="historiaInicio" crop={1.05}'],
    ['<Foto slot={f.slot} sizes="(max-width: 960px) 100vw, 390px"', '<Foto slot={f.slot} crop={1.5} sizes="(max-width: 960px) 100vw, 390px"'],
    ['<Foto slot="visitasInicio"', '<Foto slot="visitasInicio" crop={1.23}'],
    ['<Foto slot={p.id} sizes="(max-width: 960px) 100vw, 390px"', '<Foto slot={p.id} crop={1.6} sizes="(max-width: 960px) 100vw, 390px"'],
  ],
  'src/pages/calidad-y-premios.astro': [['<Foto slot="premioCalidad"', '<Foto slot="premioCalidad" crop={1.29}']],
  'src/pages/visitas-almazara-guarena.astro': [
    ['<Foto slot="heroVisitas" priority', '<Foto slot="heroVisitas" crop={1.14} priority'],
    ['<Foto slot={e.data.foto}', '<Foto slot={e.data.foto} crop={1.6}'],
  ],
  'src/pages/blog/index.astro': [
    ['<Foto slot={featured.id} priority', '<Foto slot={featured.id} crop={1.26} priority'],
    ['<Foto slot={p.id} sizes="(max-width: 960px) 100vw, 390px"', '<Foto slot={p.id} crop={1.6} sizes="(max-width: 960px) 100vw, 390px"'],
  ],
  'src/pages/blog/[slug].astro': [
    ['<Foto slot={post.id} priority', '<Foto slot={post.id} crop={1.8} priority'],
    ['<Foto slot={p.id} sizes="(max-width: 960px) 100vw, 390px"', '<Foto slot={p.id} crop={1.7} sizes="(max-width: 960px) 100vw, 390px"'],
  ],
  'src/pages/fincas/index.astro': [['<Foto slot={f.id} sizes', '<Foto slot={f.id} crop={1.4} sizes']],
  'src/pages/fincas/[slug].astro': [['<Foto slot={f.id} priority', '<Foto slot={f.id} crop={1.29} priority']],
  'src/pages/cooperativa.astro': [['<Foto slot={g.slot} sizes', '<Foto slot={g.slot} crop={1.2} sizes']],
  'src/pages/producto/[slug].astro': [['<Foto slot={relPost.slot}', '<Foto slot={relPost.slot} crop={1.2}']],
};
for (const [file, list] of Object.entries(edits)) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of list) {
    if (!s.includes(a)) { console.log('NO ENCONTRADO', file, a); continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(file, s);
}
// Logo del menú móvil (oculto al cargar): diferido
const h = 'src/components/Header.astro';
let hs = fs.readFileSync(h, 'utf8');
hs = hs.replace('<Logo height={40} light />', '<Logo height={40} light eager={false} />');
fs.writeFileSync(h, hs);
console.log('ok');
