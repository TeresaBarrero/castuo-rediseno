# Castuo · Concepto de rediseño web

> **Concepto de rediseño no oficial** de la web de la Cooperativa del Campo San Pedro (Guareña, Badajoz). Proyecto de porfolio: no es un encargo del cliente ni sustituye a la web real, que es **[castuo.es](https://castuo.es)**.
>
> Fotografías y marca propiedad de Cooperativa del Campo San Pedro (castuo.es), usadas solo con fines de demostración.

- Todas las páginas llevan `noindex, nofollow`, `robots.txt` con `Disallow: /` y cabecera `X-Robots-Tag` (Vercel y Netlify).
- No hay pago real: el carrito vive en `localStorage` y «Finalizar compra» abre un aviso que remite a castuo.es.
- Los formularios (newsletter, reservas, socios, avisos de stock) validan en el navegador y muestran una confirmación ficticia. **No se envía ni se guarda ningún dato.**

---

## Arrancar

Requisitos: Node 20 o superior (probado con Node 24).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/ (41 páginas estáticas)
npm run preview    # sirve dist/
```

El nombre de la autora está en `src/config.ts` (`PORTFOLIO_AUTHOR`) y la URL pública se define con la variable `SITE_URL`.

## Desplegar

**Demo publicada:** https://teresabarrero.github.io/castuo-rediseno/

**GitHub Pages** (configuración actual): cada `push` a `main` lanza `.github/workflows/deploy.yml`, que ejecuta `npm run build:pages` y publica `dist/`. Como el sitio vive en una subruta, `scripts/base-path.mjs` reescribe tras el build todas las rutas internas y las URL absolutas (canónicas, Open Graph, JSON-LD, sitemap) con el prefijo `BASE_PATH=/castuo-rediseno`. GitHub Pages no permite cabeceras propias: el `noindex` va en la meta robots de cada página (el `robots.txt` de una subruta no lo leen los buscadores).

Para probarlo en local igual que en Pages:

```bash
SITE_URL=https://teresabarrero.github.io BASE_PATH=/castuo-rediseno npm run build:pages
```

Alternativas sin subruta (no hace falta `base-path.mjs`):

**Vercel** (`vercel.json` incluido): importa el repositorio en vercel.com, añade la variable `SITE_URL=https://tu-dominio` y despliega. Desde la terminal: `npx vercel --prod`.

**Netlify** (`netlify.toml` incluido): «Add new site → Import from Git», o `npx netlify deploy --prod --dir=dist` tras `npm run build`. Añade `SITE_URL` en las variables de entorno.

Ambas configuraciones añaden `X-Robots-Tag: noindex, nofollow` y caché inmutable para `/_astro/*`.

## Stack

- **Astro 7** con TypeScript, salida estática, View Transitions (`<ClientRouter />`).
- **CSS propio** con custom properties (`src/styles/tokens.css`). Sin Tailwind ni librerías de UI.
- **Tipografías auto-alojadas** con `@fontsource`: Bricolage Grotesque (500/600/700) e Inter (400/500/600), subconjunto latino, `font-display: swap`, precarga de Bricolage 600 e Inter 400 y fuentes de reserva con `size-adjust` medido para evitar saltos de maquetación.
- **Imágenes** con `astro:assets` (`<Picture>`): AVIF con `<img>` en WebP, `srcset` responsive, `width`/`height` explícitos, `loading="lazy"` salvo la foto principal (`fetchpriority="high"`) y recorte en servidor al formato en que se muestra (prop `crop` de `<Foto>`).
- **Content Collections**: `products` (JSON), `posts` (MDX), `fincas`, `faqs` y `visitas`.
- **JavaScript vanilla**: unos 14,5 KB gzip por página en total, de los que ~5 KB son el router de Astro y ~9 KB el código propio (un único módulo con delegación de eventos que sobrevive a las View Transitions). Sin jQuery, GSAP ni Motion: no hizo falta.

```
src/
  assets/fotos/original/   320 fotos rastreadas de castuo.es
  assets/fotos/catalogo.json
  components/              Header, Footer, Foto, ProductCard, ShopListing, Accordion, Lightbox…
  content/                 products.json, fincas.json, faqs.json, visitas.json, campo.json, posts/*.mdx
  data/fotos.ts            hueco del diseño → foto real (o null → placeholder)
  lib/                     tienda, JSON-LD, blog
  pages/                   rutas
  scripts/                 cart, header, motion, filters, product, forms, tabs, blog
scripts/                   rastreo, catálogo, OG, capturas, pruebas y Lighthouse
diseno/                    diseño aprobado (.dc.html) y canvas.json
capturas/                  capturas a 390 y 1440 px de cada página
```

## Páginas

`/` · `/tienda/` (+ `/tienda/aceite-de-oliva-virgen-extra/`, `/tienda/vinos/`, `/tienda/estuches-regalo/`) · `/producto/[slug]/` (11 fichas, 46 formatos) · `/cooperativa/` · `/fincas/` (+ 6 subpáginas) · `/calidad-y-premios/` · `/visitas-almazara-guarena/` · `/blog/` «Cuaderno Castúo» (+ 22 artículos, 6 categorías, paginación en `/blog/[categoria]/`, RSS en `/blog/rss.xml`) · `/preguntas-frecuentes/` · `/socios/` · `/contacto/` · `/carrito/` · `/buscar/` · `/legal/` · `404`.

Los productos y precios son los de la tienda de castuo.es a 20/11/2026: coinciden con el brief y además se han añadido los que la tienda tiene hoy (AOVE de 250 y 750 ml y vino tinto y blanco de mesa en caja de 6 × 0,75 L y en garrafas de 5 L). Los estuches de 2 y 3 botellas tienen sus 10 y 20 composiciones reales con precio y foto.

## Fotografías

`npm run fotos` rastrea castuo.es (respeta `robots.txt` y espera 1 s entre peticiones), descarga los originales sin sufijo de tamaño y genera el catálogo. `src/assets/fotos/catalogo.json` recoge, para cada imagen, el archivo, la URL y las páginas de origen, sus dimensiones, una descripción revisada a mano y si se usa, está disponible o se descarta (y por qué). Cuando no había una foto adecuada no se ha inventado ni se ha recurrido a bancos de imágenes. Las dos recetas del blog usan fotos de Wikimedia Commons con licencia CC BY 4.0, con crédito visible (en `src/assets/fotos/externas/`). La tarjeta «Oficinas» de la galería, sin foto disponible, se sustituyó por «Vista aérea». Las fotos con el lettering «El Castúo de Guareña» de la propuesta previa del blog no están en castuo.es ni en su mediateca: el artículo destacado usa un viñedo real de la web y la foto «manos en la vid» queda como hueco documentado (ver [`PENDIENTE.md`](PENDIENTE.md)).

## Animaciones: decisión técnica de cada una

Todas respetan `prefers-reduced-motion: reduce`: una regla global reduce cualquier transición o animación a 0,01 ms y el JS muestra el estado final directamente.

| # | Animación | Implementación | Por qué |
|---|---|---|---|
| 1 | Entrada del hero | JS parte el H1 en líneas reales según su posición (`offsetTop`), cada una dentro de una máscara con `overflow: hidden`; `translateY(105% → 0)`, 700 ms, escalonado 80 ms, `cubic-bezier(.2,.7,.2,1)`. Párrafo y botones con fundido posterior. La foto usa una animación **solo CSS** (`clip-path` desde abajo + `scale(1.06 → 1)`) que arranca al pintar. | Las líneas dependen del ancho, así que hay que medirlas. La foto no espera al JS ni empieza oculta del todo para no retrasar el LCP. Si el JS tardara más de 2,5 s, el texto aparece igualmente. |
| 2 | Revelado al hacer scroll | `IntersectionObserver` (una sola vez por elemento) + `transform`/`opacity`; escalonado de 80 ms dentro de cada `[data-reveal-group]`. | Solo propiedades del compositor. Nada por encima del pliegue usa revelado, para no penalizar el LCP. |
| 3 | Contadores | `IntersectionObserver` + `requestAnimationFrame`, 1,2 s con *ease-out* cúbico y `Intl.NumberFormat('es-ES')` (`useGrouping: 'always'` para «+1.100»; sin agrupar en «1965»). | El HTML ya trae la cifra final (accesible y útil sin JS). |
| 4 | Parallax | CSS scroll-driven (`animation-timeline: view()`, ±20 px = 40 px de recorrido) con *fallback* en `requestAnimationFrame` si el navegador no lo soporta. | Sin JS en Chrome/Edge; sin coste en el hilo principal. |
| 5 | Cabecera | `position: sticky` con `top` negativo igual al alto de la barra de servicio (que así se va con el scroll); al pasar de ella, fondo `--bg` al 85 % con `backdrop-filter: blur(12px)` y borde. Se oculta al bajar y reaparece al subir (`transform`). Subrayado activo con `scaleX`. | Un solo listener pasivo con `rAF`. |
| 6 | Menú móvil | Panel a pantalla completa en `--ink`; enlaces Bricolage con entrada escalonada (`animation-delay` por índice). Bloquea el scroll, cierra con Esc, atrapa el foco y lo devuelve al botón. | — |
| 7 | Tarjetas de producto y carrito | *Zoom* 1,04 y segunda foto en `:hover`; el «+» se rellena con un `::before` escalado. Al añadir, un clon de la miniatura vuela al icono del carrito con la **Web Animations API**, el contador rebota y se abre un mini-carrito lateral (`<dialog>`). | WAAPI permite calcular origen y destino en tiempo real sin librerías. |
| 8 | Filtros (Tienda, Fincas, Blog) | Técnica **FLIP**: se miden las posiciones antes y después de filtrar u ordenar y se anima la diferencia con WAAPI; las tarjetas que entran, con fundido. Sincronizado con `?categoria=`. En la Tienda las píldoras son enlaces reales a cada categoría (indexables) y con JS filtran sin recargar. | FLIP funciona con cualquier navegador; `view-transition-name` por tarjeta habría chocado con los nombres que se usan para la transición entre páginas. |
| 9 | Ficha de producto | El formato actualiza precio, €/L, total, migas y foto (fundido cruzado entre capas); galería con miniaturas y *lightbox* en `<dialog>` (flechas, Esc, contador). Barra fija «Añadir» en móvil cuando el botón principal sale por arriba. | La barra se comprueba en `scroll` + `rAF`: un `IntersectionObserver` no se dispara si un salto de scroll pasa por encima del botón sin llegar a cruzarlo (lo detectaron las pruebas). |
| 10 | Acordeones | `<button aria-expanded>` + `grid-template-rows: 0fr → 1fr`; el icono + gira a −. Sin JS, todos abiertos. | Altura animable sin medir en JS. |
| 11 | Transiciones entre páginas | View Transitions de Astro con `transition:name` compartido: la foto de cada tarjeta de producto, blog o finca se transforma en la foto principal de su página. | Nativo en Chrome/Edge/Safari 18; en el resto, navegación normal. |
| 12 | Línea de tiempo | Una línea oliva se escala en `scaleY` según el progreso de scroll y cada hito se ilumina al cruzarla (punto relleno y año en tinta). | El texto mantiene siempre el contraste AA: solo cambian el punto y el color del año. |
| 13 | Trazabilidad | Al entrar en pantalla, la línea superior de cada paso se llena de izquierda a derecha en secuencia (`transition-delay` por índice). | CSS puro disparado por una clase. |
| 14 | Detalles | Subrayado animado en `.lnk`, flecha del botón primario que se desplaza 4 px y cursor por defecto. | — |
| 15 | Blog · «Cuaderno Castúo» | Cada palabra del título entra desde abajo dentro de una máscara (`overflow: hidden`), **solo CSS**, escalonada 110 ms. | Sin JS que medir (cada palabra es una línea), así no retrasa el LCP. |
| 16 | Blog · cita y cifras | La cita destacada usa el revelado al hacer scroll (n.º 2) y las cifras del artículo, los contadores (n.º 3). | Mismo código que el resto de la web. |
| 17 | Blog · el año en el campo | Los 12 paneles se apilan en la misma celda del grid y cambian con un **fundido cruzado** (`opacity` + `visibility` diferida) y un leve desplazamiento de las tarjetas. | Sin medir alturas ni duplicar nodos; los paneles ocultos salen del árbol de accesibilidad. |
| 18 | Blog · progreso de lectura | Barra de 3 px en `--olive` con `animation-timeline: scroll(root)`; si no hay soporte o hay *reduced motion*, JS fija `--p` en `scroll` + `rAF`. | Sin coste en el hilo principal en Chrome/Edge. El minificador fundía `animation-timeline` en el *shorthand* `animation` (Chrome lo descarta), así que va en una regla aparte; el mismo arreglo recuperó el parallax n.º 4. |

## SEO on-page (demostración)

El sitio es `noindex` a propósito (comentario explicativo en el `<head>` de cada página). Aun así, todo el SEO on-page está implementado como se haría en producción:

- `<title>` y `<meta name="description">` únicos en las 63 páginas (los de `canvas.json` donde existían). Un solo H1 por página y jerarquía H2/H3 correcta.
- HTML semántico (`header`, `nav`, `main`, `section` con `aria-labelledby`, `article`, `aside`, `footer`, `address`), `lang="es"`, URL limpias en minúsculas con guiones, canónicas y `@astrojs/sitemap` (excluye carrito, búsqueda y aviso legal).
- Migas de pan visibles + `BreadcrumbList`.
- JSON-LD: `WebSite` (con `SearchAction`) en todas; `Organization` + `LocalBusiness` (NAP, geo, `foundingDate: 1965`, premios y certificaciones) en Inicio y Contacto; `Organization` en Cooperativa y Calidad; `Product` + `Offer`/`AggregateOffer` (precio, `EUR`, IVA incluido, disponibilidad) en las 11 fichas, **sin `AggregateRating`**; `ItemList` en la Tienda; `FAQPage`; `Blog` en la portada del blog, `CollectionPage` en sus categorías, `BlogPosting` (autor como `Organization`, `datePublished`, `dateModified`, `image`), `FAQPage` en los artículos con preguntas y `Recipe` (migas y tostadas); `TouristAttraction` en Visitas. Validado: 0 errores de sintaxis.
- Open Graph y Twitter Card con una imagen 1200 × 630 por página y por artículo, con el estilo de la marca (`npm run og`). Feed RSS del blog con `@astrojs/rss`.
- Enlazado interno según el diseño: el blog enlaza a fichas de producto, las fichas a Calidad y las fincas a Visitas.
- 1.503 enlaces internos comprobados con `linkinator`: 0 rotos.

## Verificación

| Comprobación | Resultado |
|---|---|
| `astro build` | 64 páginas (63 + una redirección del blog antiguo), sin errores ni avisos |
| Enlaces internos | 1.503 comprobados, 0 rotos |
| Pruebas de interacción (`node scripts/test-interacciones.mjs`, Playwright) | 35/35: carrito, mini-carrito, modal de compra, acordeones, filtros + URL, orden, formatos, €/L, lightbox, estuches, «Avísame», formularios, pestañas FAQ, menú móvil (foco atrapado, Esc), barra fija, sin scroll horizontal a 360 y 390 px, 0 errores de consola |
| Pruebas del blog (`node scripts/test-blog.mjs`) | 58/58 (incluye paginación y aviso de contenido de ejemplo): H1 único, title y JSON-LD, pestañas + `?categoria=` + estado vacío, buscador (tildes, flechas, Esc, `?q=`), meses con flechas/Fin y vuelta, newsletter, índice activo, cifras, progreso, copiar enlace, acordeón, móvil (`<details>`, barra inferior, sin scroll horizontal), categorías, RSS, redirección y *reduced motion* |
| Capturas | `capturas/` a 390 y 1440 px de 18 páginas; revisión adicional a 768 y 1024 px. Blog: `capturas/blog/` |

### Lighthouse (móvil)

Medido el 20/11/2026 sobre la **web publicada** (https://teresabarrero.github.io/castuo-rediseno/) con `node scripts/lighthouse.mjs`: Lighthouse 12, configuración móvil por defecto (Moto G Power y 4G lenta simuladas).

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Inicio | 99 | 100 | 100 | 69* | 1,8 s | 0,009 | 0 ms |
| Tienda | 100 | 100 | 100 | 69* | 1,5 s | 0 | 10 ms |
| Ficha AOVE | 99 | 100 | 100 | 69* | 1,8 s | 0 | 30 ms |
| Cooperativa | 100 | 100 | 100 | 69* | 1,7 s | 0 | 20 ms |
| Fincas | 100 | 100 | 100 | 69* | 1,3 s | 0,009 | 40 ms |
| Calidad y premios | 100 | 100 | 100 | 69* | 1,6 s | 0 | 20 ms |
| Visitas | 100 | 100 | 100 | 69* | 1,6 s | 0 | 10 ms |
| Blog (`/blog/`) | 99 | 100 | 100 | 69* | 2,0 s | 0,009 | 10 ms |
| Artículo (`/blog/que-significa-castuo/`) | 99 | 100 | 100 | 69* | 2,0 s | 0 | 10 ms |
| FAQ | 100 | 100 | 100 | 69* | 1,4 s | 0,009 | 10 ms |
| Socios | 100 | 100 | 100 | 69* | 1,5 s | 0,009 | 0 ms |
| Contacto | 100 | 100 | 100 | 69* | 1,4 s | 0,009 | 0 ms |

* **SEO 69 por el `noindex`** (la auditoría `is-crawlable` falla a propósito). Con una copia del build sin `noindex` (`node scripts/seo-demo.mjs`, que nunca se despliega) el SEO es **100** en todas las páginas medidas.

Nota de medición: Lighthouse se lanza con `--disable-gpu`. En Chrome *headless* de Windows sin GPU, la rasterización por software (SwiftShader) bloqueaba el hilo principal más de 1 s en cualquier página larga, incluida una copia sin CSS ni JS. Es un artefacto del entorno (lo confirmó una traza: un `GPUTask` paralelo a la tarea larga) y `--disable-gpu` es la configuración habitual en integración continua.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run fotos` | Rastrea castuo.es y descarga las fotos originales |
| `node scripts/catalogo.mjs` | Genera `src/assets/fotos/catalogo.json` |
| `node scripts/gen-products.mjs` | Genera `src/content/products.json` con los datos de la tienda |
| `npm run og` | Imágenes Open Graph 1200 × 630 y favicon |
| `npm run shots` | Capturas a 390 y 1440 px (`--widths`, `--only`, `--base`) |
| `node scripts/test-interacciones.mjs` | Pruebas de interacción con Playwright |
| `node scripts/test-blog.mjs` | Pruebas del blog «Cuaderno Castúo» |
| `node scripts/og.mjs --blog` | Solo las imágenes Open Graph del blog |
| `node scripts/lighthouse.mjs` | Lighthouse móvil de las páginas principales |
| `node scripts/seo-demo.mjs` | Copia sin `noindex` solo para medir el SEO |

## Pendiente

Ver [`PENDIENTE.md`](PENDIENTE.md): fotos que faltan, logo en SVG, variedades, hectáreas por sistema, precios de visitas, horarios, redes sociales y lo necesario para pasar a producción. Las decisiones tomadas ante ambigüedades del diseño están en [`PLAN.md`](PLAN.md).

---

## Caso de estudio

**El problema.** La web de la Cooperativa del Campo San Pedro vende AOVE, vino y estuches, pero no transmite lo que la hace distinta: 1.100 familias de socios, una almazara premiada y más de sesenta años de historia. Además arrastra errores que restan confianza y visibilidad. No tiene meta description y usa varios H1, hay imágenes sin `alt`, los iconos de redes enlazan a `http://url` y el banner de cookies muestra `{title}` sin rellenar. Las noticias más recientes son de 2014 y el copyright de 2021, la portada destaca un producto agotado, el menú duplica TIENDA y VINOS y hay dos teléfonos sin explicar para qué sirve cada uno.

**Objetivos.** Vender mejor (catálogo claro, precios y formatos visibles, compra en pocos pasos), contar el origen con datos reales y captar búsquedas locales e informativas con secciones nuevas: Calidad y premios, Visitas, Blog y Preguntas frecuentes.

**Decisiones.** La dirección «Campo contemporáneo» combina fondo piedra, tinta y oliva, tipografía Bricolage Grotesque y fotografía real de la cooperativa, sin degradados ni adornos. La arquitectura elimina el menú duplicado (los vinos viven en la Tienda) y diferencia los teléfonos («Oficinas» y «Atención al cliente»). Los productos agotados nunca aparecen en portada. Las 320 fotos de castuo.es se catalogaron a mano: lo que no existía se deja como hueco documentado en lugar de rellenarlo con imágenes de banco. Las animaciones son contenidas y sirven al producto: contadores, el carrito que recibe el producto, filtros con FLIP y la foto de la tarjeta que se convierte en la de la ficha.

**Resultados.** 41 páginas estáticas con unos 14,5 KB de JavaScript comprimido por página. En Lighthouse móvil, sobre la web publicada: rendimiento de 99 a 100, accesibilidad 100 y buenas prácticas 100 en todas las páginas, LCP de 1,3 a 1,8 s y CLS de 0 a 0,009. El SEO on-page llega a 100 al retirar el `noindex`, que se mantiene a propósito porque es un concepto.

---

## Caso de estudio · Blog

**Punto de partida.** castuo.es no tenía blog: sus «Noticias» eran accesos a otras secciones. Había una propuesta previa con fotos rotuladas «El Castúo de Guareña», pero con dos titulares grandes, texto blanco pequeño en negrita sobre verde y frases genéricas («mucho más que un nombre»).

**Decisiones de diseño.** El blog tiene nombre propio, *Cuaderno Castúo*, y un solo H1 por página. El texto va en una columna de 720 px a 19 px. El artículo suma índice, cita, cifras, producto integrado, preguntas, autoría y relacionados. Se conservan el verde oscuro y las fotos rotuladas, y «Noticias» pasa a ser una categoría real.

**Decisiones de contenido.** El primer artículo responde a una búsqueda real, «qué significa castúo», con datos verificables: Luis Chamizo, 1921, la fundación en 1965 y el paso de 137 socios a más de 1.100. Se corrige el relato (la cooperativa nació para vender uva de mesa, no «para dar visibilidad a pequeños productores») y se evita «artesanal», que no encaja con 4,5 millones de litros.

**Resultados.** En Lighthouse móvil, la portada y el artículo obtienen 99 en rendimiento, 100 en accesibilidad y 100 en buenas prácticas (LCP 2,0 s, CLS ≤ 0,009). El SEO marca 69 solo por el `noindex`.
