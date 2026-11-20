import type { ImageMetadata } from 'astro';
// original/: fotos de castuo.es · externas/: fotos con licencia libre (Wikimedia Commons), con crédito en FOTOS
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/fotos/{original,externas}/*.{jpg,jpeg,png,webp}', { eager: true });
export function fotoSrc(file: string | null | undefined): ImageMetadata | null {
  if (!file) return null;
  return (files[`/src/assets/fotos/original/${file}`] ?? files[`/src/assets/fotos/externas/${file}`])?.default ?? null;
}
