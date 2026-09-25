import Image from "next/image";
import Reveal from "./Reveal";
import type { Capture, Gallery } from "@/data/caseStudies";

/** A full-page screenshot shown inside browser chrome, scrollable so a very tall
 *  capture (these run 6,000px+) can be viewed without dominating the page. */
export function CaptureFrame({
  capture,
  variant = "browser",
}: {
  capture: Capture;
  variant?: "browser" | "phone";
}) {
  const isPhone = variant === "phone";
  return (
    <div
      className={`overflow-hidden border border-border panel ${
        isPhone ? "rounded-[1.75rem]" : "rounded-2xl"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {isPhone ? (
          <span className="mx-auto h-1 w-14 rounded-full bg-white/15" />
        ) : (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 truncate text-xs text-muted">{capture.label}</span>
          </>
        )}
      </div>
      {/* A focusable, named scroll region.
       *
       * These captures run to ~6,000px inside a 70vh window. It had no
       * `tabindex`, so Chrome and Safari would not focus it and a keyboard user
       * could not scroll it at all — WCAG 2.1.1 (roadmap 213.10) — and
       * `.no-scrollbar` hid the only cue that there was more to see, on the one
       * element holding the actual work. Both are gone: the scrollbar now shows
       * (inside browser chrome that reads as correct anyway) and the frame takes
       * focus.
       *
       * `role="region"` with a name is what makes a screen reader announce it
       * as something enterable rather than an unlabelled box. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={`${capture.label} — scrollable full-page capture`}
        className="max-h-[70vh] overflow-y-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold"
      >
        <Image
          src={capture.src}
          alt={capture.alt}
          width={capture.width}
          height={capture.height}
          // A phone capture is only ever a narrow column, so asking for a
          // full-width variant would fetch several times the pixels needed.
          sizes={isPhone ? "(min-width: 1024px) 320px, 60vw" : "(max-width: 1280px) 100vw, 1230px"}
          className="w-full"
        />
      </div>
      {isPhone ? (
        <p className="border-t border-border px-4 py-2.5 text-center text-xs text-muted">
          {capture.label}
        </p>
      ) : (
        // Discoverability, not decoration. Nothing told a visitor the frame
        // scrolled, so most never saw past the top 70vh of a 6,000px capture.
        <p className="border-t border-border px-4 py-2.5 text-center text-xs text-muted/70">
          Scroll inside the frame to read the full page
        </p>
      )}
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
