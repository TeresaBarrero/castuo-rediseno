# Prompt para Claude Code · Blog «Cuaderno Castúo»

> **Cuándo usar este archivo**
> - **Si todavía no has construido la web:** no lo pegues. Pega `PROMPT.md`, que ya remite a este archivo y construirá el blog junto al resto de la web.
> - **Si la web ya está construida con `PROMPT.md`:** copia la carpeta `diseno/` actualizada en el repositorio (sobrescribe los archivos) y pega en Claude Code todo lo que hay debajo de la línea.

---

## Tarea

Amplía el proyecto Astro existente del rediseño conceptual de Castuo con el blog **«Cuaderno Castúo»**. Sigue las mismas reglas del proyecto: aviso de concepto no oficial, `noindex`, tokens de diseño, cabecera y pie compartidos, fotos de castuo.es y nada de datos inventados. Si `PLAN.md` y `PENDIENTE.md` existen, léelos primero y actualízalos al terminar.

Referencias de diseño en `./diseno/`, que debes leer completas antes de empezar:

- `BlogPortada.dc.html` → `/blog/` y `/blog/[categoria]/`
- `BlogArticulo.dc.html` → plantilla `/blog/[slug]/` (escritorio)
- `BlogArticuloMovil.dc.html` → la misma plantilla a 390 px
- `canvas.json` → notas `s-bp`, `s-ba`, `mej` y `cal`: SEO, mejoras y calendario editorial
- `Blog.dc.html` es la versión antigua: **ignórala** y elimina su implementación si existe, redirigiendo a `/blog/`.

## Especificación del blog

**Identidad**
- Nombre: **Cuaderno Castúo**. Subtítulo: «Aceite, vino, recetas y vida de campo, contado por quienes trabajan la tierra en Guareña».
- Newsletter: **«La carta castúa»** (formulario ficticio: valida, muestra confirmación y no envía nada).
- Cabecera editorial con fondo `--ink`, título gigante en Bricolage y eyebrow en `--gold`.
- Enlace «Blog» del menú principal → `/blog/`.

**Contenido (Content Collections)**
- Colección `posts` (MDX) con frontmatter tipado: `title`, `description`, `category` (`del-campo` | `en-la-cocina` | `aceite` | `vino` | `la-cooperativa` | `noticias`), `pubDate`, `updatedDate?`, `heroImage`, `heroAlt`, `heroCaption?`, `readingTime` (calculado), `featured`, `guide` (para «Empieza por aquí»), `recipe?` (tiempo, dificultad, raciones, ingredientes y pasos para el schema `Recipe`), `faqs?`, `relatedProducts[]`, `tags[]`.
- Colección `campo` con los 12 meses de «El año en el campo»: olivar, viña y artículo enlazado. Copia los textos de `BlogPortada.dc.html`, marca el conjunto como orientativo y añade «Validar con la cooperativa» a `PENDIENTE.md`.
- **Artículo 1 (destacado): «Qué significa "castúo" y por qué da nombre a nuestro aceite y nuestro vino».** Reproduce **literalmente** el texto de `BlogArticulo.dc.html`. Incluye la cita de Luis Chamizo y la nota en `PENDIENTE.md`: «Confirmar la cita en una edición de *El miajón de los castúos* (1921)». Slug: `que-significa-castuo`.
- Artículos 2 a 6, según la nota `cal` de `canvas.json`: cosecha temprana, cómo leer la etiqueta de un AOVE, un día de campaña en la almazara, migas extremeñas (con `recipe`) y cómo conservar el aceite. Cada uno tendrá entre 600 y 900 palabras, con información general correcta, sin cifras inventadas sobre la cooperativa, firmado por «Equipo de la Cooperativa del Campo San Pedro». Debe llevar 1 enlace a un producto, 1 a una página de la web y 2 a otros artículos.
- Fotos: usa las de castuo.es. Las de la propuesta previa del blog con el lettering «El Castúo de Guareña» (viñedo, ramas de olivo, manos en la vid) están en la web o en su galería. Si no aparecen, deja el hueco y anótalo en `PENDIENTE.md`.

**Portada `/blog/`** (en este orden; ver diseño):
1. Cabecera editorial con buscador (búsqueda en cliente sobre un índice JSON generado en build; muestra los resultados en un panel accesible).
2. Pestañas de categoría. Cada categoría tiene su propia página estática `/blog/[categoria]/`, y en la portada las pestañas filtran con animación (FLIP o View Transitions) y sincronizan `?categoria=`.
3. Destacado (`featured: true`).
4. «Empieza por aquí»: las guías (`guide: true`), numeradas 01 a 03.
5. «Lo último del cuaderno»: grid de 3 columnas con estado vacío.
6. «El año en el campo»: selector de 12 meses que abre por defecto el mes actual, con tarjetas de olivar y viña y enlace al artículo. Es un componente accesible: botones con `aria-pressed` y navegación con flechas.
7. Recetas: posts con `recipe`, mostrando tiempo, dificultad y raciones.
8. «Desde la tienda»: los productos de `relatedProducts` de los posts recientes.
9. La carta castúa.
10. Paginación a partir de 9 artículos.

**Artículo `/blog/[slug]/`:**
- Barra de progreso de lectura de 3 px en `--olive`, ligada al scroll (con CSS `animation-timeline: scroll()` y alternativa en JS).
- Migas de pan, eyebrow con categoría, un solo H1, entradilla, autoría con fecha y tiempo de lectura, y botones de compartir (Web Share API con alternativa de copiar enlace y aviso «Enlace copiado» en `aria-live`).
- Foto principal con `figcaption`.
- Dos columnas: índice lateral fijo generado desde los H2, que resalta la sección activa con `IntersectionObserver`, y una tarjeta de producto. En móvil, el índice pasa a un `<details>` y aparece una barra inferior fija con «Compartir» y el producto.
- Cuerpo: columna de 720 px como máximo, texto a 19 px con interlineado 1,75 y letra capital en el primer párrafo. Componentes MDX: `<Cita>`, `<Cifras>`, `<Figura>`, `<ProductoInline>` y `<Receta>`.
- Al final: preguntas rápidas (acordeón), etiquetas, caja de autor, «Sigue leyendo» (3 artículos de la misma categoría) y newsletter.
- Transición compartida: la imagen de la tarjeta se transforma en la foto principal del artículo (`transition:name`).

**Animaciones** (mismas reglas que el resto de la web, siempre respetando `prefers-reduced-motion`):
- La palabra «Cuaderno Castúo» entra por líneas con máscara.
- La cita destacada aparece al hacer scroll.
- Las cifras cuentan desde 0.
- Las tarjetas de olivar y viña hacen un fundido cruzado al cambiar de mes.
- La barra de progreso de lectura.

**SEO** (como demostración; el sitio sigue con `noindex`):
- Títulos y descripciones de las notas `s-bp` y `s-ba`.
- JSON-LD: `Blog` en la portada; `BlogPosting` (autor como `Organization`, `datePublished`, `dateModified`, `image`), `BreadcrumbList`, `FAQPage` cuando haya `faqs` y `Recipe` cuando haya `recipe`.
- Feed RSS en `/blog/rss.xml` (`@astrojs/rss`), imagen Open Graph por artículo, y las páginas de categoría con su propio title y descripción.

## Cierre

1. Ejecuta `astro build` y comprueba que no hay enlaces rotos.
2. Pasa Lighthouse en móvil a `/blog/` y `/blog/que-significa-castuo/` (objetivos: Rendimiento ≥ 95, Accesibilidad 100).
3. Haz capturas a 390 y 1440 px de ambas páginas y compáralas con el diseño.
4. Añade al README una sección **«Caso de estudio · Blog»** de unas 200 palabras. Debe cubrir el punto de partida (la web no tenía blog y había una propuesta previa), las decisiones de diseño y de contenido (usa la nota `mej` de `canvas.json`) y los resultados de Lighthouse.
