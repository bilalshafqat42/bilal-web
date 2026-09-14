"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Gallery } from "@/data/caseStudies";

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
    const onClick = (e: MouseEvent) => {
      const fig = (e.target as HTMLElement).closest("figure");
      if (!fig) return;
      const all = [...host.querySelectorAll("figure")];
      const i = all.indexOf(fig as HTMLElement);
      if (i < 0) return;
      lastTrigger.current = fig as HTMLElement;
      setOpen(i);
    };
    // Enter/Space on a focused tile, so this is not pointer-only.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const fig = (e.target as HTMLElement).closest("figure");
      if (!fig) return;
      e.preventDefault();
      const i = [...host.querySelectorAll("figure")].indexOf(fig as HTMLElement);
      if (i >= 0) {
        lastTrigger.current = fig as HTMLElement;
        setOpen(i);
      }
    };
    host.addEventListener("click", onClick);
    host.addEventListener("keydown", onKey);
    // Tiles are not links, so they need to be reachable and announced.
    for (const fig of host.querySelectorAll("figure")) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-haspopup", "dialog");
      (fig as HTMLElement).style.cursor = "zoom-in";
    }
    return () => {
      host.removeEventListener("click", onClick);
      host.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open === null) return;
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
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  useEffect(() => {
    if (open === null) lastTrigger.current?.focus();
  }, [open]);

  const item = open === null ? null : gallery.items[open];

  return (
    <>
      <div ref={hostRef}>{children}</div>

      {item ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${gallery.heading}, slide ${open! + 1} of ${count}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          {/* Capped at the source width. The sources are 800x800, so a wider
              dialog only upscales — more screen, no more detail. */}
          <div className="relative w-full max-w-[min(88vh,800px)]">
            <Image
              key={item.file}
              src={`${gallery.basePath}/${item.file}.avif`}
              alt={item.alt}
              width={gallery.width}
              height={gallery.height}
              sizes="(min-width: 900px) 800px, 92vw"
              priority
              className="w-full rounded-xl"
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {item.caption}
              <span className="ml-3 font-mono text-xs text-white/40">
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
