"use client";

/**
 * next/image loader for this site (roadmap 419). Set once in next.config.ts
 * (`images.loaderFile`), so every <Image> uses it with no change to components.
 *
 * Every srcset entry becomes a plain file in /public, cut ahead of time by
 * `npm run image-variants`, instead of a `/_next/image?...` URL. Those are
 * cached at Cloudflare's edge; `/_next/image` is bypassed there and was
 * re-encoded on our Hostinger CPU per request, sometimes into a bigger file.
 *
 * For a requested width it returns the smallest pre-cut file at least that
 * wide, so a picked candidate is never blurrier than asked. Above the largest
 * cut it returns the original, or its full-width AVIF copy when that was kept.
 * SVGs and anything not in the manifest are returned as they are.
 *
 * `?v=` is a hash of the source's contents: replacing an image in place gives
 * it a new URL, so neither Cloudflare nor a browser can keep the old one.
 */
import manifest from "@/data/imageVariants.json";

type Entry = { w: number; v: string; widths: number[] };
const variants = manifest as Record<string, Entry>;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const e = variants[src];
  if (!e) return src;
  const pick = e.widths.find((w) => w >= width);
  if (pick !== undefined) return `${src.replace(/\.[^./]+$/, `.${pick}w.avif`)}?v=${e.v}`;
  // Wider than every cut: the source itself, unless a full-width AVIF copy was
  // kept because it is smaller (always for a JPG/PNG, often for an AVIF saved
  // at a higher quality than the site needs), which is then the last entry.
  const top = e.widths[e.widths.length - 1];
  if (top === e.w) return `${src.replace(/\.[^./]+$/, `.${top}w.avif`)}?v=${e.v}`;
  return `${src}?v=${e.v}`;
}
