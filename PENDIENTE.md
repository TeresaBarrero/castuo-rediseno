# PENDIENTE · datos y fotos que habría que pedir a la cooperativa

Todo lo marcado `[ENTRE CORCHETES]` en el diseño se ha resuelto con datos publicados en castuo.es (rastreo del 20/11/2026) o, si no existían, con un texto genérico **sin cifras inventadas**. Esta es la lista de lo que quedaría por confirmar en un proyecto real.

## 0. Antes de publicar el porfolio

- [x] Nombre de la autora (María Teresa Barrero) en `src/config.ts`: aparece en el aviso fijo, en el pie y en el aviso legal.
- [x] URL pública: https://teresabarrero.github.io/castuo-rediseno/ (GitHub Pages).

## 1. Fotografías sin sustituto real (se muestra un bloque `--placeholder` con etiqueta)

| Hueco | Dónde | Motivo |
|---|---|---|
| Oficinas | Galería de Cooperativa | La galería «Oficinas» de castuo.es no contiene imágenes en el HTML. |
| Migas extremeñas | Blog | No hay fotos de recetas en la web oficial. |
| Tostadas con AOVE | Blog | Ídem. |
| Cata de aceite en la almazara / socios en la recepción de aceituna | Inicio | No existen; se han usado en su lugar fotos reales del equipo ante los depósitos y de los socios en el 50 aniversario. |
| Sellos (Extrema Selección, ISO) | Inicio, Calidad, fichas | Los sellos ISO de castuo.es son logos de la certificadora (Applus+), un tercero: se han sustituido por insignias tipográficas. Pedir los sellos oficiales y su manual de uso. |

**Fotos de fincas en baja resolución**: olivar (tradicional, intensivo y superintensivo), viña en vaso, almendro y la ruta por el olivar usan las miniaturas de 400 × 400 px de castuo.es, que llevan el logo superpuesto. Un recorte en servidor deja el logo fuera, pero a 2× se ven algo blandas. Habría que pedir los originales sin logo.

**Fotos a encargar**: olivar aéreo al amanecer, almazara en campaña, cata, bodegón de producto con fondo neutro (las fotos de la tienda tienen el logo superpuesto y fondo gris) y recetas.

## 2. Logo

- [ ] Logo en **SVG**. Solo existe en PNG (770 × 520). Tampoco hay versión en negativo: en el pie se muestra sobre una pastilla clara, sin modificar.
- [ ] Logos de ayudas y subvenciones: en castuo.es son carteles completos con texto (Junta de Extremadura / FEADER), no logos. Se ha retirado el hueco del pie.

## 3. Datos

| Dato | Estado en el concepto |
|---|---|
| Variedades de aceituna y uva | «Consultar». Única variedad confirmada: **Picual** (AOVE de cosecha temprana monovarietal, según la ficha de producto). |
| Hectáreas por finca o sistema | «Consultar». Se muestran los totales publicados en /produccion/: **7.000 ha de olivo y 600 ha de vid**. |
| Periodo de los «4,5 M de litros» | castuo.es no indica el periodo; se presenta como «litros de AOVE obtenidos, según los datos de producción de la cooperativa». |
| Errata en castuo.es | /produccion/ indica para el tomate «10.000.0000» kilos; se ha interpretado como 10.000.000. Confirmar. |
| Años de la historia (olivar, vino, maíz y tomate) | Se sustituyen por «Después», «Más tarde» y «Luego». |
| Categoría del premio Extrema Selección 2025 | **Resuelto** con las fotos de los trofeos: Medalla de Oro · Mejor aceite convencional; Mejor AOVE producido en una cooperativa; Maestro Almazara. Confirmar a qué aceite corresponde cada galardón. |
| Ficha técnica de cada aceite (acidez, campaña, cata) | Acidez: «≤ 0,8º (límite legal de la categoría)». Campaña y nota de cata: «consultar». |
| Plazo de entrega de Envialia | No publicado; se remite al teléfono de atención al cliente. |
| Precios, duración y horarios de las visitas | «Consultar» / «A medida». La web oficial no ofrece visitas: es una sección nueva de la propuesta. |
| Horario de oficina y tienda | No publicado; se remite al teléfono. No se publica `openingHoursSpecification` en el JSON-LD. |
| Coordenadas | Aproximadas al centro de Guareña (38,8597, −6,0886). Pedir las de la ficha de Google Business Profile. |
| Requisitos para hacerse socio | Se remite a oficinas y teléfono. |
| Boletines A.T.R.I.A, balances y descargas | Se enlaza a las páginas oficiales de castuo.es; no se reproducen documentos. |
| Perfiles de redes sociales | La web oficial enlaza a `http://url`. Los iconos se muestran desactivados hasta tener perfiles verificados. |
| Cifra «50 años» de /historia/ | Fundada en 1965 → 61 años en 2026. El concepto evita la cifra y usa «desde 1965». |

## 4. Fotos con aspecto de banco de imágenes en castuo.es

Se han descartado (ver `catalogo.json`, `motivo_descarte`) porque no muestran a la cooperativa: jarras con girasol, copa con barrica, aceitunas sobre pizarra, olivar al atardecer de los banners de 2021, viñedo al atardecer, maizal, portátil de «contacto», periódicos de «noticias» y cajas en cinta transportadora.

## 5. Para producción (fuera del alcance del concepto)

- Redirecciones 301 de las URL antiguas (`/categoria-producto/…`, `/tienda/aceite-castuo/…`, `/historia/`, `/nuestras-fincas/`, `/galeria/`, `/vinos/`, `/noticias/`…) a la nueva arquitectura.
- Pasarela de pago real (PayPal y transferencia), cálculo de portes de Envialia y gestión de stock.
- Envío real de formularios (reservas, newsletter, avisos de stock) con consentimiento RGPD y doble opt-in.
- Área privada de socios con autenticación.
- Opiniones verificadas de compradores; solo entonces, `AggregateRating` en el JSON-LD.
- Quitar `noindex`, `X-Robots-Tag` y `Disallow: /`.
