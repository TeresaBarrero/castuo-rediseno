# PLAN · Rediseño conceptual castuo.es

Pieza de porfolio. No sustituye a la web oficial (https://castuo.es). `noindex`, sin pagos ni envío de datos.

## Fases

1. **Lectura del diseño** (`./diseno/*.dc.html` + `canvas.json`) ✔
2. **Base del proyecto**: Astro 7 + TS estático, `tokens.css`, `@fontsource`, layout, cabecera, pie, aviso de concepto, carrito (drawer) ✔
3. **Fotografías**: rastreo de castuo.es (pausas de 1 s, respetando robots.txt) → 320 imágenes en `src/assets/fotos/original/` + `catalogo.json` ✔
4. **Páginas**: Inicio · Tienda (+3 categorías) · Producto (×11) · Cooperativa · Fincas (+6) · Calidad · Visitas · Blog (+7 MDX) · FAQ · Socios · Contacto · Carrito · Buscar · Legal · 404 ✔
5. **Animaciones**: las 14 del brief ✔
6. **SEO**: titles/descriptions, JSON-LD, migas, OG 1200×630, sitemap, canónicas ✔
7. **Verificación**: build, enlaces, 35 pruebas de interacción, Lighthouse, capturas 390/1440 (+768/1024) ✔
8. **README** + caso de estudio + `PENDIENTE.md` ✔

## Decisiones ante ambigüedades del diseño

- **Nombre del autor** del porfolio: centralizado en `src/config.ts` (`PORTFOLIO_AUTHOR`) para cambiarlo en un solo sitio.
- **Contacto**: el diseño enlaza a `Main#contacto`; se crea `/contacto/` con el mismo bloque «Dónde estamos» y el menú apunta ahí.
- **Mapa**: no se incrusta Google Maps (cookies de terceros y peso en Lighthouse). Se muestra un bloque estático con enlace «Cómo llegar» a Google Maps con la dirección.
- **Buscador** de cabecera: el diseño tiene el icono pero no la página. Abre un diálogo con búsqueda en cliente sobre productos y artículos (índice JSON estático pequeño).
- **«Mi cuenta»** enlaza a `/socios/`, como en el diseño.
- **Ficha de producto**: el diseño es una plantilla de AOVE con 4 formatos. Se implementa como **una ficha de AOVE con variaciones** (500 ml, 6×2 L, 6×3 L, 3×5 L; URL `/producto/aceite-de-oliva-virgen-extra/`) y una ficha propia para cada uno del resto de productos (cosecha temprana, vino, estuches). Los estuches de 2 y 3 botellas tienen variaciones de composición si la tienda real las ofrece.
- **Tarjetas de producto en Inicio/Tienda** siguen apuntando a una ficha por producto; las variaciones de AOVE abren la ficha con el formato preseleccionado (`?formato=`).
- **Filtros de la Tienda**: los chips de categoría son enlaces reales a `/tienda/<categoria>/` (indexables por diseño SEO) y, dentro de `/tienda/`, filtran en cliente y sincronizan `?categoria=`. Los checkboxes de formato y precio filtran en cliente.
- **Producto agotado**: nunca aparece en Inicio (nota SEO). En la tienda lleva «Agotado · avísame»; el botón abre un mini-formulario ficticio.
- **Opiniones**: se mantiene el bloque vacío; «Escribir una opinión» abre un aviso de concepto. Sin `AggregateRating`.
- **Fincas «Ver finca»**: no hay subpáginas en el diseño. Se crea `/fincas/[slug]/` con el contenido ampliado (nota SEO de Fincas) y enlace a Visitas.
- **Cifra 4,5 M**: el diseño indica «[confirmar periodo]». Se usa el texto de castuo.es si lo da; si no, «Litros de AOVE, según la cooperativa».
- **Barra de servicio**: «consulta precio» enlaza a la FAQ de envíos.
- **Logos de ayudas y subvenciones** del pie: se usan solo si aparecen en la web como imagen limpia; si no, se omite el hueco (PENDIENTE).
- **Redes sociales**: la web real enlaza a `http://url`. Sin perfiles verificados no se inventan: los iconos se muestran como «Próximamente» deshabilitados y se anota en PENDIENTE.
- **Galería de Cooperativa**: las 4 tarjetas llevan foto real de cada subgalería; «Ver galería» abre un lightbox con las fotos del catálogo.
- **Móvil de Inicio**: se sigue `Movil.dc.html` (cifras 2×2 con ISO en lugar de litros, tarjetas de categoría horizontales, carrusel de «Los más pedidos», FAQ resumida).

## Decisiones tomadas durante la construcción

- **Catálogo real**: la tienda de castuo.es tiene más productos que el brief (AOVE de 250 y 750 ml y vinos tinto y blanco de mesa en caja de 6 × 0,75 L y en garrafa de 5 L). Se incluyen todos, con sus precios del 20/11/2026. Resultan 11 fichas: AOVE (6 formatos), cosecha temprana (agotado), vino tinto (2), vino de mesa blanco (2), semidulce, estuches de 3 (20 composiciones) y de 2 botellas (10), y 4 estuches unitarios. Los estuches usan un desplegable porque 20 botones serían inmanejables.
- **Premio Extrema Selección 2025**: la categoría se ha leído en las fotos de los trofeos (Medalla de Oro · Mejor aceite convencional; Mejor AOVE producido en una cooperativa; Maestro Almazara). «Comprar el aceite premiado» lleva a la ficha de cosecha temprana, que está agotada: muestra «Avísame» y el AOVE disponible como alternativa.
- **Fotos de banco en la web oficial**: se descartan aunque estén en castuo.es, porque no muestran a la cooperativa.
- **Sellos ISO**: los oficiales son logos de la certificadora (un tercero), así que se sustituyen por insignias tipográficas. Los enlaces «Descargar certificado» apuntan a los PDF reales de castuo.es.
- **«Ver más artículos»** (Blog): se omite, porque con 7 artículos no hay más que cargar. Volverá cuando haya paginación.
- **Píldoras de filtro en móvil**: una fila con desplazamiento horizontal en lugar de varias líneas (altura estable, sin CLS, gesto natural).
- **Sin iframe de Google Maps**: un mapa ilustrativo en SVG enlaza a Google Maps (sin cookies de terceros ni peso extra).
- **Socios**: el formulario avisa de que es una demostración y pide no introducir credenciales reales; los boletines y descargas enlazan a castuo.es.
- **Rendimiento**: CSS incrustado en el HTML, AVIF con `<img>` WebP, recorte en servidor al formato visible (`crop`), fuentes de reserva con `size-adjust` medido y la foto del hero con animación solo CSS para no retrasar el LCP.
