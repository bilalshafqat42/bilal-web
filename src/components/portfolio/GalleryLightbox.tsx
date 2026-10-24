"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Gallery } from "@/data/caseStudies";
import { useFocusTrap } from "@/lib/focusTrap";

/**
 * Click-to-enlarge for the campaign gallery.
 *
 * The tiles render at ~283px. That is fine as an index but these slides carry
 * real copy — apartment sizes, specification, price — which is unreadable at
 * that size, so the creative was on the page without being viewable. The
 * sources are 800x800, so there is detail to show; nothing here upscales.
 *
 * A client island rather than a client page: only the overlay needs state, and
 * the tiles themselves stay server-rendered so the captions and alt text are in
 * the initial HTML where crawlers read them.
 */
export default function GalleryLightbox({
  gallery,
  children,
}: {
  gallery: Gallery;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Focus is returned here on close, so a keyboard user is not dropped at the
  // top of the document after viewing a slide.
  const lastTrigger = useRef<HTMLElement | null>(null);

  const count = gallery.items.length;
  const go = useCallback(
    (delta: number) => setOpen((i) => (i === null ? null : (i + delta + count) % count)),
    [count]
  );

  // Delegated rather than one handler per tile: the tiles are server-rendered
  // children, so this component never sees them as elements it can clone.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // The tiles are real <button>s (see `GalleryGrid`), so Enter and Space
    // already arrive here as clicks and no keydown handler is needed.
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-trigger]");
      if (!trigger) return;
      const all = [...host.querySelectorAll<HTMLElement>("[data-lightbox-trigger]")];
      const i = all.indexOf(trigger);
      if (i < 0) return;
      lastTrigger.current = trigger;
      setOpen(i);
    };
    host.addEventListener("click", onClick);
    return () => {
      host.removeEventListener("click", onClick);
    };
  }, []);

  // Keyed on whether the overlay is open, not on which slide it shows. It was
  // keyed on `open` (the index) and focused the close button on every run, so
  // each arrow press threw focus back to Close; a keyboard user on the Next
  // button lost their place every slide (audit batch 2, 2026-10-24). Focus
  // moving in on open is `useFocusTrap`'s job, below.
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    // Scroll lock, undone on close so a route change mid-overlay cannot leave
    // the page stuck.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, go]);

  useEffect(() => {
    if (open === null) lastTrigger.current?.focus();
  }, [open]);

  // This one already focused the close button and restored focus on exit — it
  // was the best of the three — and only ever needed the trap itself.
  useFocusTrap(dialogRef, isOpen, closeRef);

  const item = open === null ? null : gallery.items[open];

  return (
    <>
      <div ref={hostRef}>{children}</div>

      {item ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${gallery.heading}, slide ${open! + 1} of ${count}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          {/* Capped at the source width. The square carousel slides are 800x800,
              so a wider dialog only upscales — more screen, no more detail. The
              `screens` boards are 1600 wide and landscape, so they get the width
              and a viewport-height cap instead. */}
          <div
            className={
              gallery.layout === "screens"
                ? "relative w-full max-w-[min(150vh,1400px)]"
                : "relative w-full max-w-[min(88vh,800px)]"
            }
          >
            <Image
              key={item.file}
              src={`${gallery.basePath}/${item.file}.${gallery.ext ?? "avif"}`}
              alt={item.alt}
              width={gallery.width}
              height={gallery.height}
              sizes={gallery.layout === "screens" ? "(min-width: 1500px) 1400px, 92vw" : "(min-width: 900px) 800px, 92vw"}
              // Eager: the overlay opens on a click, so there is nothing to
              // preload in the head. Was the deprecated `priority`.
              loading="eager"
              className="w-full rounded-xl"
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {item.caption}
              <span className="ml-3 font-mono text-xs text-white/60">
                {open! + 1} / {count}
              </span>
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2.5 text-white/80 transition-colors hover:text-white sm:right-8 sm:top-8"
          >
            <X size={20} />
          </button>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="absolute left-2 rounded-full border border-white/20 bg-black/40 p-3 text-white/80 transition-colors hover:text-white sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="absolute right-2 rounded-full border border-white/20 bg-black/40 p-3 text-white/80 transition-colors hover:text-white sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
