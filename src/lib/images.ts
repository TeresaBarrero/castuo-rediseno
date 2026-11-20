import type { ImageMetadata } from 'astro';
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/fotos/original/*.{jpg,jpeg,png,webp}', { eager: true });
export function fotoSrc(file: string | null | undefined): ImageMetadata | null {
  if (!file) return null;
  return files[`/src/assets/fotos/original/${file}`]?.default ?? null;
}
