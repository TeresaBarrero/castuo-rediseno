import { defineCollection } from 'astro:content';
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

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(), description: z.string(), excerpt: z.string(),
    category: z.enum(['Cultura del AOVE', 'Recetas', 'Vino', 'Vida en la cooperativa', 'Noticias']),
    date: z.coerce.date(), readingTime: z.number(), featured: z.boolean().default(false),
    products: z.array(z.string()).default([]),
    recipe: z.object({
      prepTime: z.string(), cookTime: z.string(), totalTime: z.string(), yield: z.string(),
      ingredients: z.array(z.string()), steps: z.array(z.string()), cuisine: z.string(), category: z.string(),
    }).optional(),
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

export const collections = { products, posts, fincas, faqs, visitas };
