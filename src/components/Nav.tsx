"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

/**
 * Site header.
 *
 * Rebuilt to the supplied design: text wordmark, four links, the studio
 * location, and the primary CTA. Replaces a 459-line version that carried a
 * services mega-menu, a GSAP scroll-shrink animation and an SVG logo.
 *
 * Two consequences of that reduction, both deliberate and both flagged rather
 * than absorbed quietly:
 *
 *   Pricing and FAQ are no longer in the header. The footer previously linked
 *   only /contact and /privacy, so without a change there they would have had
 *   no internal links at all. They are now in the footer.
 *
 *   The mega-menu linked every service category from every page. Those pages
 *   are now one hop away via /services, which lists all of them, rather than
 *   linked directly. That is a real reduction in internal linking and worth
 *   revisiting if those categories lose positions.
 *
 * Still a client component: the mobile drawer needs state. GSAP and the
 * mega-menu are gone, so this is far lighter than what it replaces.
 */
const links = [
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Escape closes the drawer, and the body scroll lock stops the page moving
  // underneath it on iOS. Both are removed on unmount so a route change while
  // the drawer is open cannot leave the page unscrollable.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-[68px] w-full items-center justify-between px-6 lg:h-[84px] lg:px-10">
        {/* Wordmark. Plain text rather than the previous SVG: one less request,
            and it stays crisp at any size. The dot is the only mark. */}
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-1.5 text-[15px] font-bold tracking-tight text-ink lg:text-base"
        >
          Bilal Shafqat
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {/* Dubai does not observe daylight saving, so this offset is fixed
              and safe as static text. Rendering it from a clock would mean
              client JS and a hydration mismatch for no gain. */}
          <span className="hidden text-sm text-muted xl:inline">Dubai, UTC+4</span>
          <Link
            href="/contact"
            className="btn-primary hidden rounded-full px-6 py-3 text-sm font-semibold lg:inline-flex"
          >
            Book a free consultation
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="-mr-1 p-1 text-ink lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-bg lg:hidden">
          <div className="flex h-[68px] items-center justify-between border-b border-border px-6">
            <span className="flex items-baseline gap-1.5 text-[15px] font-bold tracking-tight text-ink">
              Bilal Shafqat
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-1 p-1 text-ink"
            >
              <X size={24} />
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg font-semibold text-ink"
              >
                {l.label}
              </Link>
            ))}
            {/* Kept in the drawer even though they are out of the desktop bar:
                on a phone there is room, and it keeps the two pages reachable
                without hunting in the footer. */}
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 text-lg font-semibold text-ink"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 text-lg font-semibold text-ink"
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 inline-flex justify-center rounded-full px-6 py-4 text-sm font-semibold"
            >
              Book a free consultation
            </Link>
            <span className="mt-5 text-sm text-muted">Dubai, UTC+4</span>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
