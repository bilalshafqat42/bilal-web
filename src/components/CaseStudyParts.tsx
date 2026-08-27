import Image from "next/image";
import Reveal from "./Reveal";
import type { Capture, Gallery } from "@/data/caseStudies";

/** A full-page screenshot shown inside browser chrome, scrollable so a very tall
 *  capture (these run 6,000px+) can be viewed without dominating the page. */
export function CaptureFrame({ capture }: { capture: Capture }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border glass">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 truncate text-xs text-muted">{capture.label}</span>
      </div>
      <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
        <Image
          src={capture.src}
          alt={capture.alt}
          width={capture.width}
          height={capture.height}
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="w-full"
        />
      </div>
    </div>
  );
}

/** Captioned image grid. Captions matter beyond decoration: they are extractable
 *  text, so an unlabelled gallery is invisible to search and AI systems. */
export function GalleryGrid({ gallery }: { gallery: Gallery }) {
  // Forced square tiles: without a fixed ratio the grid rows come out ragged.
  //
  // Two columns on phones, not one. A single full-width column made each tile
  // ~680 real pixels on a 2x phone, so mobile downloaded *more* image data than
  // desktop (where four tiles share the row and need ~580px each). Two columns
  // drops each tile to ~380px and roughly halves mobile image weight.
  return (
    <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {gallery.items.map((item, i) => (
        <Reveal key={item.file} delay={(i % 3) * 0.08}>
          <figure className="overflow-hidden rounded-2xl border border-border bg-surface/40">
            <Image
              src={`${gallery.basePath}/${item.file}.avif`}
              alt={item.alt}
              width={gallery.width}
              height={gallery.height}
              // Accurate `sizes` matters more than any other image setting: it is
              // what Next uses to pick a variant. "25vw" was wrong — the grid sits
              // inside max-w-7xl with padding and gaps, so a tile is ~293px fixed
              // on large screens, not 25% of a 1440px viewport (360px). That gap
              // alone made desktop fetch an 800px file instead of a 640px one.
              sizes="(min-width: 1024px) 300px, 45vw"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="border-t border-border px-4 py-3 text-xs text-muted">
              {item.caption}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export function FactStrip({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-xs uppercase tracking-wide text-gold">{f.label}</dt>
          <dd className="mt-1.5 text-sm text-ink leading-snug">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
