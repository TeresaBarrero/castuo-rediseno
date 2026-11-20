// Genera src/assets/fotos/catalogo.json: archivo, URL de origen, páginas de origen, dimensiones,
// descripción (revisada a mano con hojas de contactos) y si se usa o por qué se descarta.
import fs from 'node:fs/promises';

const raw = JSON.parse(await fs.readFile('scripts/.crawl/catalogo-bruto.json', 'utf8'));

// Descripciones revisadas manualmente
const D = {
  '2014-11-foto-aerea.jpg': 'Vista aérea panorámica de las instalaciones de la cooperativa (naves, depósitos y patio) en el casco de Guareña.',
  '2015-05-sin-t-tulo-1.jpg': 'Vista aérea cercana de las naves de cubierta roja y los depósitos de la cooperativa.',
  '2015-07-cabecero-aereo-castuo.jpg': 'Vista aérea de las instalaciones con naves, depósitos y aparcamiento.',
  '2015-07-cabecero-aereo-castuo2.jpg': 'Vista aérea de Guareña con las instalaciones de la cooperativa en primer término.',
  '2021-02-finca-inicio.jpg': 'Viñedo en espaldera en invierno, cepas podadas y cubierta vegetal.',
  '2021-02-fincas-en-espaldera-1.jpg': 'Viña en espaldera con postes y alambres, cepas podadas en invierno.',
  '2021-02-fincas-en-espaldera-2.jpg': 'Calle de viñedo en espaldera con hierba verde y una caseta al fondo.',
  '2021-02-fincas-en-espaldera-3.jpg': 'Hilera de viña en espaldera bajo cielo azul.',
  '2025-05-premios-extrema-seleccion-aove-2025-1.jpg': 'Los tres trofeos de los Premios Extrema Selección 2025 (Maestro Almazara, Medalla de Oro y Mejor AOVE de cooperativa) sobre un muro de piedra, con depósitos blancos detrás.',
  '2025-05-premios-extrema-seleccion-aove-2025-2.jpg': 'Botellas y garrafas El Castúo junto a los trofeos Extrema Selección 2025 sobre un muro de piedra.',
  '2025-05-premios-extrema-seleccion-aove-2025-3.jpg': 'Composición vertical de garrafas El Castúo y trofeo ante las letras «CAMPO».',
  '2025-05-premios-extrema-seleccion-aove-2025-4.jpg': 'Garrafas y botellas de AOVE El Castúo con trofeo, junto a letras de acero «CAMPO» y un olivo.',
  '2025-05-premios-extrema-seleccion-aove-2025-5.jpg': 'Depósitos blancos de la almazara con el logo de la cooperativa; en primer término, trofeo Maestro Almazara y botella de AOVE.',
  '2025-05-premios-extrema-seleccion-aove-2025-6.jpg': 'Trofeo verde «Mejor AOVE producido en una cooperativa» con botellas ante los depósitos.',
  '2025-05-premios-extrema-seleccion-aove-2025-7.jpg': 'Medalla de Oro Extrema Selección 2025 con botella de AOVE ante los depósitos.',
  '2025-05-premios-extrema-seleccion-aove-2025-8.jpg': 'Botella de AOVE y trofeos junto a un olivo, depósitos al fondo.',
  '2025-05-premios-extrema-seleccion-aove-2025-9.jpg': 'Equipo de la cooperativa con los diplomas ante los grandes depósitos blancos (vertical).',
  '2025-05-premios-extrema-seleccion-aove-2025-10.jpg': 'Equipo de la almazara posando con los diplomas y trofeos de Extrema Selección 2025 frente a los depósitos.',
  '2025-05-premios-extrema-seleccion-aove-2025-11.jpg': 'Equipo de la cooperativa con diplomas y trofeos frente a las instalaciones.',
  '2025-05-premios-extrema-seleccion-aove-2025-12.jpg': 'Depósitos blancos de la almazara con el logo de la cooperativa y el equipo, bajo cielo azul.',
  '2025-05-premios-extrema-seleccion-aove-2025-13.jpg': 'Trabajador de la almazara con el trofeo Maestro Almazara junto a un olivo.',
  '2025-05-premios-extrema-seleccion-aove-2025-14.jpg': 'Representante de la cooperativa con la Medalla de Oro.',
  '2025-05-premios-extrema-seleccion-aove-2025-15.jpg': 'Representante de la cooperativa con la Medalla de Oro ante los depósitos.',
  '2025-04-1-imagen-de-whatsapp-2025-04-04-a-las-11.41.59_68f7981b.jpg': 'Mesa con mantel verde: AOVE El Castúo, trofeos y aperitivos en la gala de entrega.',
  '2025-04-2-imagen-de-whatsapp-2025-04-04-a-las-11.39.56_a3bd8cea.jpg': 'Mesa con productos de la cooperativa y trofeos en la gala de entrega.',
  '2025-04-3-imagen-de-whatsapp-2025-04-04-a-las-11.38.45_67544b66.jpg': 'Representantes de la cooperativa en el escenario de la gala Extrema Selección 2025.',
  '2025-04-4-imagen-de-whatsapp-2025-04-04-a-las-11.38.29_7459131f.jpg': 'Mesa con AOVE y trofeos en la gala (vertical).',
  '2025-04-5-imagen-de-whatsapp-2025-04-04-a-las-11.36.25_5211cb80.jpg': 'Estantería con los tres trofeos Extrema Selección 2025 y, debajo, garrafas y botellas de AOVE El Castúo.',
  '2025-05-aceite-de-oliva-virgen-extra-cosecha-temprana-6-garrafas-de-2-l.jpg': 'Garrafa de 2 L de AOVE El Castúo cosecha temprana junto a su caja.',
  '2021-02-aceite-el-castuo-0.25-l-1.jpg': 'Botella de 250 ml de AOVE El Castúo sobre fondo gris.',
  '2021-02-aceite-el-castuo-0.5-l-1.jpg': 'Botella de 500 ml de AOVE El Castúo sobre fondo gris.',
  '2021-02-aceite-el-castuo-0.75-l-1.jpg': 'Botella de 750 ml de AOVE El Castúo sobre fondo gris.',
  '2021-02-aceite-el-castuo-2-l-2.jpg': 'Garrafa de 2 L de AOVE El Castúo con su caja de 6 unidades.',
  '2021-02-aceite-el-castuo-3-l-2.jpg': 'Garrafa de 3 L de AOVE El Castúo con su caja de 6 unidades.',
  '2021-02-aceite-el-castuo-5-l-2.jpg': 'Garrafa de 5 L de AOVE El Castúo con su caja de 3 unidades.',
  '2021-02-vino-tinto-el-castuo-0.75-l-1.jpg': 'Botella de 0,75 L de vino tinto El Castúo.',
  '2021-02-vino-tinto-el-castuo-5-l-1.jpg': 'Garrafa de 5 L de vino tinto El Castúo.',
  '2021-02-vino-de-mesa-blanco-el-castuo-0.75-l-1.jpg': 'Botella de 0,75 L de vino de mesa blanco El Castúo.',
  '2021-02-vino-de-mesa-blanco-el-castuo-5-l-1.jpg': 'Garrafa de 5 L de vino de mesa blanco El Castúo.',
  '2025-01-vino-tinto-el-castuo.jpg': 'Botella de vino tinto El Castúo, etiqueta roja.',
  '2025-01-vino-de-mesa-blanco-el-castuo.jpg': 'Botella de vino de mesa blanco El Castúo.',
  '2025-01-vino-de-mesa-semi-dulce-el-castuo.jpg': 'Botella de vino de mesa semidulce El Castúo con cápsula rosa.',
  '2022-12-vino-de-mesa-semi-dulce-el-castuo-categoria.jpg': 'Botella de vino semidulce El Castúo sobre superficie de piedra clara, fondo oscuro.',
  '2022-12-img_0329.jpg': 'Botella de vino semidulce El Castúo tumbada sobre su estuche negro.',
  '2022-12-img_0330.jpg': 'Botella de vino semidulce El Castúo en diagonal sobre estuche negro.',
  '2022-12-img_0331.jpg': 'Botella de vino semidulce El Castúo apoyada en su estuche negro abierto.',
  '2021-11-estuches-categoria.jpg': 'Estuches regalo El Castúo de 1, 2 y 3 botellas con aceite y vinos.',
  '2021-11-estuche-2-botellas-categoria.jpg': 'Estuche regalo negro de 2 botellas El Castúo.',
  '2021-11-estuche-3-botellas-categoria.jpg': 'Estuche regalo negro de 3 botellas El Castúo con aceite, tinto y blanco.',
  '2021-11-aceite-750-ml-10.jpg': 'Estuche unitario negro con botella de AOVE de 750 ml.',
  '2021-11-vino-blanco.jpg': 'Estuche unitario con botella de vino blanco de 750 ml.',
  '2021-11-blanco-de-mesa-2.jpg': 'Estuche unitario con botella de vino blanco de mesa de 750 ml.',
  '2021-11-tinto-de-mesa-1-1.jpg': 'Estuche unitario con botella de vino tinto de mesa de 750 ml.',
  '2021-11-tinto-de-mesa-1.jpg': 'Estuche unitario con botella de vino tinto de mesa (variante).',
  '2015-07-cooperativa-de-san-pedro-011.jpg': 'Cartel del 50 aniversario con botellas de la cooperativa en la entrada de la nave.',
  '2015-07-cooperativa-de-san-pedro-257.jpg': 'Cartel del 50 aniversario con botellas, iluminado de noche.',
  '2015-07-cooperativa-de-san-pedro-115.jpg': 'Socios y vecinos sentados en el patio de la cooperativa durante el 50 aniversario, vistos desde lo alto de un depósito.',
  '2015-07-cooperativa-de-san-pedro-116.jpg': 'Patio lleno de socios en el 50 aniversario, vista elevada.',
  '2015-07-cooperativa-de-san-pedro-117.jpg': 'Vista desde un depósito: carpas, naves y sierra al fondo en el 50 aniversario.',
  '2015-07-cooperativa-de-san-pedro-118.jpg': 'Vista desde un depósito del recinto preparado para el 50 aniversario.',
  '2015-07-cooperativa-de-san-pedro-119.jpg': 'Público del 50 aniversario visto desde lo alto, con el pueblo detrás.',
  '2015-07-cooperativa-de-san-pedro-127.jpg': 'Socios entre los depósitos de acero durante el acto del 50 aniversario.',
};

// Descripción genérica de la galería del 50 aniversario (julio 2015) según rangos revisados
function aniversario(n) {
  if (n <= 106) return 'Acto del 50 aniversario (2015): autoridades y socios conversan en el patio de la cooperativa.';
  if (n <= 152) return 'Acto del 50 aniversario (2015): celebración y discursos ante el photocall, con público sentado.';
  if (n <= 206) return 'Acto del 50 aniversario (2015): descubrimiento de la placa conmemorativa en las oficinas y fotos de grupo.';
  return 'Acto del 50 aniversario (2015): cena de gala de socios en el recinto de la cooperativa.';
}

const DESCARTE = [
  [/logo|logotipo|paypal|transferencia|envialia/, 'Logo (propio o de terceros): no es fotografía.'],
  [/subvenciones|cartel\.jpg|politica-calidad|rgb_es|pag-13|consumo-responsable|seleccion-extremena|image-0044/, 'Cartel o documento con texto incrustado.'],
  [/banner|maiz-banner|vino-blanco-2|vinos-categoria|aceite-categoria|2014-12-vino-blanco|contacto\.jpg|noticia-inicio|descargas-inicio|mipaquete/, 'Banner o imagen con aspecto de banco de imágenes / texto incrustado: no representa a la cooperativa.'],
];

const USADAS = new Set((await fs.readFile('src/data/fotos.ts', 'utf8').catch(() => '')).match(/'[^']+\.(jpg|png)'/g)?.map((s) => s.slice(1, -1)) ?? []);
for (const p of JSON.parse(await fs.readFile('src/content/products.json', 'utf8'))) {
  for (const f of p.formats) USADAS.add(f.img);
  for (const g of p.gallery) USADAS.add(g);
}
USADAS.add('2014-11-logotipo-nuevo.png'); // logo (copiado a src/assets/logo/)
USADAS.add('2014-11-cropped-logotipo-nuevo.png'); // favicon
const out = raw.map((r) => {
  let descripcion = D[r.archivo];
  const m = r.archivo.match(/cooperativa-de-san-pedro-(\d+)\.jpg$/);
  if (!descripcion && m) descripcion = aniversario(Number(m[1]));
  if (!descripcion && /^2021-11-\d/.test(r.archivo)) descripcion = `Estuche regalo El Castúo con la composición «${r.archivo.replace(/^2021-11-|\.jpg$/g, '').replace(/-/g, ' ')}» sobre fondo claro.`;
  if (!descripcion && /2021-03-/.test(r.archivo)) descripcion = `Miniatura de finca (${r.archivo.replace(/^2021-03-|\.jpg$/g, '').replace(/-/g, ' ')}) con el logo superpuesto.`;
  let descartada = null;
  for (const [re, why] of DESCARTE) if (re.test(r.archivo)) { descartada = why; break; }
  if (!descartada && r.ancho < 600) descartada = 'Menos de 600 px de ancho.';
  return {
    archivo: r.archivo,
    url_origen: r.url,
    paginas_origen: r.paginas,
    ancho: r.ancho,
    alto: r.alto,
    descripcion: descripcion ?? 'Imagen sin revisar en detalle.',
    estado: USADAS.has(r.archivo) ? 'usada' : descartada ? 'descartada' : 'disponible',
    ...(descartada && !USADAS.has(r.archivo) ? { motivo_descarte: descartada } : {}),
    ...(/logotipo/.test(r.archivo) ? { nota: 'Logo oficial, sin modificar: cabecera, pie y favicon.' } : {}),
  };
});
await fs.writeFile('src/assets/fotos/catalogo.json', JSON.stringify(out, null, 2));
const n = (s) => out.filter((o) => o.estado === s).length;
console.log(`catalogo.json: ${out.length} · usadas ${n('usada')} · disponibles ${n('disponible')} · descartadas ${n('descartada')}`);
