import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const format = z.object({
  key: z.string(), label: z.string(), title: z.string(), short: z.string(),
  price: z.number(), litres: z.number().optional(), img: z.string(), fmt: z.string().optional(),
  out: z.boolean().optional(), best: z.number().optional(),
});

const products = defineCollection({
  loader: file('src/content/products.json'),
  schema: z.object({
    order: z.number(), category: z.enum(['aceite', 'vino', 'estuches']), tipo: z.string().optional(), catLabel: z.string(),
    name: z.string(), fullName: z.string(), eyebrow: z.string(), intro: z.string(), tasting: z.string(), uses: z.string(),
    sourceUrl: z.string(), out: z.boolean().optional(), awardLink: z.boolean().optional(), wine: z.boolean().optional(),
    listing: z.enum(['perFormat', 'single']), defaultFormat: z.string().optional(),
    formats: z.array(format).min(1), gallery: z.array(z.string()), related: z.array(z.string()),
    spec: z.array(z.tuple([z.string(), z.string()])),
  }),
});

// Blog «Cuaderno Castúo». readingTime no va en el frontmatter: se calcula del cuerpo en src/lib/blog.ts.
import { BLOG_CATEGORIES } from './lib/blog-cats';
const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),           // <title> si difiere del H1 (≤ 60 caracteres)
    description: z.string(),                   // meta description
    lead: z.string(),                          // entradilla bajo el H1
    excerpt: z.string(),                       // texto corto de las tarjetas
    category: z.enum(BLOG_CATEGORIES),
    subcategory: z.string().optional(),        // segundo término del eyebrow («La cooperativa · Historia»)
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().nullable(),          // archivo de src/assets/fotos (original/ o externas/); null = hueco pendiente
    heroAlt: z.string(),
    heroCaption: z.string().optional(),
    heroPos: z.string().optional(),            // object-position
    heroCredit: z.object({ author: z.string(), title: z.string(), source: z.string(), license: z.string(), licenseUrl: z.string() }).optional(),
    example: z.boolean().default(false),        // contenido de ejemplo (hechos inventados): aviso visible
    featured: z.boolean().default(false),
    guide: z.boolean().default(false),         // «Empieza por aquí»
    guideOrder: z.number().optional(),
    toc: z.array(z.string()).optional(),       // etiquetas cortas del índice, en el orden de los H2
    recipe: z.object({
      prepTime: z.string(), cookTime: z.string(), totalTime: z.string(), // ISO 8601 (schema Recipe)
      time: z.string(),                        // etiqueta visible («55 min + reposo»)
      difficulty: z.enum(['Muy fácil', 'Fácil', 'Media', 'Difícil']),
      servings: z.number().int().positive(),
      servingsLabel: z.string().default('personas'),
      cuisine: z.string(), recipeCategory: z.string(),
      ingredients: z.array(z.string()).min(1),
      steps: z.array(z.string()).min(1),
    }).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    relatedProducts: z.array(z.object({ id: z.string(), format: z.string().optional() })).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

// «El año en el campo»: 12 meses, orientativo (validar con los técnicos de la cooperativa).
const campo = defineCollection({
  loader: file('src/content/campo.json'),
  schema: z.object({
    month: z.number().int().min(1).max(12), short: z.string(), name: z.string(),
    olivar: z.string(), vina: z.string(),
    postTitle: z.string(),                     // título del artículo que lo cuenta (texto del diseño)
    post: reference('posts').nullable(),       // null = artículo aún no publicado
  }),
});

const fincas = defineCollection({
  loader: file('src/content/fincas.json'),
  schema: z.object({
    order: z.number(), group: z.enum(['olivar', 'vina', 'almendro']), groupLabel: z.string(), name: z.string(),
    desc: z.string(), body: z.array(z.string()), area: z.string(), varieties: z.string(), harvest: z.string(),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs.json'),
  schema: z.object({ order: z.number(), label: z.string(), items: z.array(z.object({ q: z.string(), a: z.string(), home: z.boolean().optional() })) }),
});

const visitas = defineCollection({
  loader: file('src/content/visitas.json'),
  schema: z.object({ order: z.number(), name: z.string(), foto: z.string(), desc: z.string(), dur: z.string(), price: z.string(), who: z.string() }),
});

export const collections = { products, posts, campo, fincas, faqs, visitas };
