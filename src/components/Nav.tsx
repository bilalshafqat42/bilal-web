"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, Search } from "lucide-react";
import { openSearchPanel } from "@/lib/searchPanel";
import { accentClasses, megaMenuGroups, slugify } from "@/data/pillars";

/**
 * Site header.
 *
 * The design's bar — logo, four links, studio location, CTA — with the services
 * mega-menu restored on top of it.
 *
 * The panel is driven by CSS transitions rather than the GSAP timeline it used
 * to have. The timeline was doing a clip-path unroll with staggered columns,
 * which looked good but pulled GSAP, ScrollTrigger and useGSAP into the header
 * on every page for one dropdown. A fade and a short lift reads almost the
 * same and costs nothing. The bar itself does now respond to scroll — it
 * collapses into a floating pill — but in CSS, driven by one boolean, not by a
 * scroll-linked timeline.
 *
 * The interaction details below are the parts worth keeping and are easy to
 * lose in a rewrite — each one exists because of a specific failure.
 */
/** `mega` names which panel a link opens rather than being a boolean, so the
 *  header can drive any number of panels off one piece of state — two
 *  booleans would mean two timers, two triggers and the possibility of both
 *  being open at once.
 *
 *  Only "services" remains. The Portfolio panel was removed from `links` on
 *  2026-09-17 when /portfolio became a grid of case studies, but its component
 *  and its mobile `<details>` twin were left behind — ~160 lines behind a
 *  condition that could never be true, still compiled into the client bundle
 *  and rendering nowhere. Deleted 2026-09-24 (roadmap 213.13). */
type MegaId = "services";

/**
 * Trimmed on 2026-09-17 from seven items to four.
 *
 * "Portfolio" became "Work" and lost its mega menu: /portfolio is now a grid of
 * case studies (item 198), so the label names what is behind it and the link
 * goes straight there rather than opening a panel of disciplines first.
 *
 * Pricing, FAQ and "Book a call" all came out of the bar. None of the pages
 * changed and all three are still linked from the footer on every route, so they
 * lose a nav slot rather than internal link equity. "Book a call" was also a
 * duplicate: the gold button beside it points at the same /appointment page.
 */
const links: { label: string; href: string; mega?: MegaId }[] = [
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services", mega: "services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];

/** The panel shell both mega menus render inside. Extracted when the second
 *  menu was added: the visibility rules below are the parts that took real
 *  debugging, and having two copies of them would guarantee they drift. */
function MegaPanel({
  id,
  label,
  megaOpen,
  onEnter,
  onLeave,
  children,
}: {
  id: MegaId;
  label: string;
  megaOpen: MegaId | null;
  onEnter: () => void;
  onLeave: () => void;
  children: React.ReactNode;
}) {
  const isOpen = megaOpen === id;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`mega-panel absolute inset-x-0 top-full hidden transition-[opacity,transform] duration-200 lg:block ${
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      {/* `mega-panel-inner` picks up the pill's width and radius while the
          header is floating, so the dropdown stays visually attached to the bar
          it came from instead of spanning the viewport under an inset pill. */}
      <div
        role="group"
        aria-label={label}
        className="mega-panel-inner glass-nav border-t border-border shadow-2xl shadow-black/40"
      >
        <div className="px-10 py-10">{children}</div>
      </div>
    </div>
  );
}

/** Contents of the Services panel. */
function ServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      {/* Three columns, not four. Nine groups across four gives 4 + 4 + 1 and
          strands a single card on the third row — the same shape `ProofLoop`
          already fixed for the discipline cards (roadmap 213.36). Three gives
          3 + 3 + 3. */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-8">
        {megaMenuGroups.map((group) => {
          const accent = accentClasses[group.accent];
          return (
            <div key={group.slug}>
              <Link
                href={`/services/${group.slug}`}
                className="group/head flex items-center gap-2"
                onClick={() => onNavigate()}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                <span className="text-sm font-semibold text-ink transition-colors group-hover/head:text-gold">
                  {group.title}
                </span>
              </Link>
              <ul className="mt-3 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={`/services/${group.slug}#${slugify(item.title)}`}
                      onClick={() => onNavigate()}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Link
          href="/services"
          onClick={() => onNavigate()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
        >
          View all services <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}

export default function Nav() {
  // One instance now lives in the root layout for the whole visit, so anything
  // that used to be re-derived by remounting has to watch the path instead.
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /** True once the page has scrolled far enough for the bar to collapse into a
   *  floating pill. */
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaId | null>(null);

  /** The bar is light while it sits over a light band, and dark the moment it
   *  lifts into its floating pill.
   *
   *  Keyed on the route because the homepage is the only page that opens on a
   *  white section (`DisciplineStatement`); every other route opens on
   *  `--color-bg`. If a second page ever gets a light opener, replace this with
   *  a data attribute the page sets, rather than adding a second pathname. */
  const light = !scrolled && pathname === "/";

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Partial<Record<MegaId, HTMLAnchorElement | null>>>({});
  // Escape closes the panel and returns focus to the trigger — but that focus
  // would immediately re-open it. This suppresses exactly one focus-open.
  const suppressFocusOpen = useRef(false);
  // The panel state as it was before the current press. Focus and hover both
  // open the panel and both land before `click`, so a plain toggle in the click
  // handler would undo them and the panel could never be opened by pressing.
  const openBeforePress = useRef(false);

  // Hover intent. Closing on a 250ms delay rather than immediately, so moving
  // the pointer from the trigger down into the panel does not dismiss it in the
  // gap between the two.
  const openMega = (id: MegaId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(id);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(null), 250);
  };

  // Collapse the bar into a floating pill on scroll, expand it back at the top.
  //
  // The trigger is 70% of the way down the page's first section, not a fixed
  // pixel value, so the change happens as the hero leaves rather than a few
  // pixels into the scroll. Measured rather than assumed, because the hero is a
  // different height on every template and different again on a phone.
  //
  // Clamped at both ends: a page whose first section is very short would
  // otherwise trigger almost immediately, and a full-height hero would keep the
  // bar expanded for most of a screen.
  //
  // Two thresholds, not one. Collapsing at the trigger and expanding again at
  // 60% of it leaves a gap; with a single threshold, a trackpad resting exactly
  // on it flips the header back and forth on every stray pixel.
  //
  // `passive: true` tells the browser the handler will never call
  // preventDefault, so scrolling is not blocked waiting on it. State is only set
  // when the boolean actually changes, so this does not re-render on every
  // scroll event.
  useEffect(() => {
    const trigger = { current: 200 };

    const measure = () => {
      const first = document.querySelector("main section");
      const h = first instanceof HTMLElement ? first.offsetHeight : 0;
      trigger.current = Math.min(Math.max(h * 0.7, 120), 620);
    };

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > trigger.current * 0.6 : y > trigger.current));
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
    // Re-measured on every route change, which this did not have to do while
    // the header was imported into each page and therefore remounted with it
    // (roadmap 213.17). Now that one instance lives in the root layout for the
    // whole visit, a mount-only measurement would keep the first page's hero
    // height forever and collapse the pill at the wrong point on every page
    // after it. The hero is a different height on every template.
  }, [pathname]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Close both menus on navigation.
  //
  // Every link inside them already calls this on click, so in normal use it
  // changes nothing. It matters for the routes that do not go through a link —
  // browser back and forward — which used to be covered for free by the header
  // remounting per page (roadmap 213.17). With one instance for the whole
  // visit, an open drawer would otherwise survive a back button press and sit
  // over the previous page.
  //
  // Adjusted during render rather than in an effect. This is derived state, and
  // React documents this pattern for it; an effect would trip
  // `react-hooks/set-state-in-effect` and render one frame with the menu still
  // open before correcting itself. Same shape as the query/highlight reset in
  // `SpotlightSearch`.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMegaOpen(null);
  }

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      suppressFocusOpen.current = true;
      const trigger = triggerRefs.current[megaOpen];
      setMegaOpen(null);
      trigger?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  // Mobile drawer: Escape closes it, and the scroll lock stops the page moving
  // underneath on iOS. Both are undone on unmount, so a route change with the
  // drawer open cannot leave the page unscrollable.
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
    // The header keeps a constant height in both states. The pill is inset
    // *within* that height rather than adding margin to it, so nothing below
    // ever moves — a sticky header that changes height shifts the whole page.
    <header
      className={`header-enter nav-header sticky top-0 z-50 h-[68px] lg:h-[84px] ${
        scrolled ? "is-floating" : ""
      } ${light ? "is-light" : ""}`}
    >
      <div className="nav-shell mx-auto flex w-full items-center justify-between px-6 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Bilal Shafqat — home">
          {/* The wordmark is white, so it needs a dark cut for the light bar.
              Same file with the 15 white fills swapped; the gold badge is
              untouched in both. */}
          <Image
            key={light ? "dark" : "light"}
            src={light ? "/logo/bs-logo-dark.svg" : "/logo/bs-logo.svg"}
            alt="Bilal Shafqat"
            width={161}
            height={63}
            priority
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        {/* Tighter gaps between 1024 and 1280, full spacing above it. Adding
            Portfolio as a seventh item overfilled the bar at exactly `lg`: the
            logo and the nav met with zero gap and the CTA wrapped to two lines.
            Measured, not eyeballed — the button was 64px tall instead of 44. */}
        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-8">
          {links.map((link) =>
            link.mega ? (
              <div
                key={link.href}
                onMouseEnter={() => openMega(link.mega!)}
                onMouseLeave={closeMega}
              >
                <div className="flex items-center gap-1">
                  <Link
                    ref={(el) => {
                      triggerRefs.current[link.mega!] = el;
                    }}
                    href={link.href}
                    onFocus={() => {
                      if (suppressFocusOpen.current) {
                        suppressFocusOpen.current = false;
                        return;
                      }
                      openMega(link.mega!);
                    }}
                    className={`text-[0.75rem] uppercase tracking-[0.06em] transition-colors ${
                      light ? "text-[#54545c] hover:text-[#14140f]" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {/* A separate control, so pressing the chevron opens the panel
                      while pressing the label still navigates to the hub. */}
                  <button
                    type="button"
                    onPointerDown={() => {
                      openBeforePress.current = megaOpen === link.mega;
                    }}
                    onClick={() => setMegaOpen(openBeforePress.current ? null : link.mega!)}
                    aria-expanded={megaOpen === link.mega}
                    aria-haspopup="true"
                    aria-label={`${megaOpen === link.mega ? "Close" : "Open"} ${link.label.toLowerCase()} menu`}
                    className={`p-1 transition-colors ${
                      light ? "text-[#54545c] hover:text-[#14140f]" : "text-muted hover:text-ink"
                    }`}
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${megaOpen === link.mega ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* The panel lives inside its own trigger, which is what keeps
                    the tab order sane. Rendered as siblings after the whole bar
                    — where they were when there was only one — a keyboard user
                    tabbing off the Portfolio trigger reached the Services link
                    next, whose focus handler closed the Portfolio panel before
                    its links were ever reachable. Verified by counting Tab
                    stops, not by reading the markup.

                    The wrapper is deliberately not `relative`: the panel is
                    full-bleed and positions against the sticky header, so a
                    positioned ancestor here would shrink it to the width of the
                    trigger. */}
                <MegaPanel
                  id={link.mega}
                  label={`${link.label} menu`}
                  megaOpen={megaOpen}
                  onEnter={() => openMega(link.mega!)}
                  onLeave={closeMega}
                >
                  <ServicesMenu onNavigate={() => setMegaOpen(null)} />
                </MegaPanel>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.75rem] uppercase tracking-[0.06em] transition-colors ${
                  light ? "text-[#54545c] hover:text-[#14140f]" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-5">
          {/* No search control in the bar.
           *
           * Taken out in item 202 for an overfull row, put back in 213.24
           * because Cmd+K was the only desktop route in, and taken out again
           * here at Bilal's instruction after seeing it on the light bar. His
           * call, recorded rather than re-argued.
           *
           * The consequence stands: on desktop the panel is reachable only by
           * Cmd+K, which is undiscoverable to a non-developer. The mobile
           * drawer keeps its visible "Search this site" entry, so phones are
           * unaffected. */}

          <Link
            href="/appointment"
            // `whitespace-nowrap` so the label can never wrap: a two-line
            // primary button is how an overfull bar shows itself first.
            className="btn-primary hidden whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold lg:inline-flex xl:px-6"
          >
            Book a free consultation
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className={`-mr-1 p-1 lg:hidden ${light ? "text-[#14140f]" : "text-ink"}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mega-menu panels. Always in the DOM so they can animate both ways, but
          `invisible` while closed — that keeps their links out of the tab order,
          which `opacity-0` alone would not do. Verified by pressing Tab rather
          than by inspecting styles: 0 stops land inside them while closed.

          Only `opacity` and `transform` are transitioned, deliberately.
          `transition-all` also animates `visibility`, and that left the panel
          mid-transition on the Tab press immediately after focusing the
          trigger — so a keyboard user opened the panel and then tabbed straight
          past it into the page, reaching its links about ten stops later. */}
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-bg lg:hidden">
          <div className="sticky top-0 flex h-[68px] items-center justify-between border-b border-border bg-bg px-6">
            <Image
              src="/logo/bs-logo.svg"
              alt="Bilal Shafqat"
              width={161}
              height={63}
              className="h-8 w-auto"
            />
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
            {links.map((link) =>
              link.mega === "services" ? (
                <details key={link.href} className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold text-ink marker:hidden">
                    Services
                    <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pb-3">
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm font-semibold text-gold"
                    >
                      All services
                    </Link>
                    {megaMenuGroups.map((group) => (
                      <details key={group.slug} className="group/sub">
                        <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm text-ink marker:hidden">
                          <span className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentClasses[group.accent].dot}`}
                            />
                            {group.title}
                          </span>
                          <ChevronDown
                            size={14}
                            className="transition-transform group-open/sub:rotate-180"
                          />
                        </summary>
                        <div className="pb-1 pl-4">
                          <Link
                            href={`/services/${group.slug}`}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 text-xs font-medium text-gold"
                          >
                            Overview
                          </Link>
                          {group.items.map((item) => (
                            <Link
                              key={item.title}
                              href={`/services/${group.slug}#${slugify(item.title)}`}
                              onClick={() => setOpen(false)}
                              className="block py-1.5 text-xs text-muted"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 text-lg font-semibold text-ink"
                >
                  {link.label}
                </Link>
              )
            )}

            <Link
              href="/appointment"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 inline-flex justify-center rounded-full px-6 py-4 text-sm font-semibold"
            >
              Book a free consultation
            </Link>
            {/* The only visible route to search on a phone, now that the bar
                does not carry the icon. */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSearchPanel();
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <Search size={16} />
              Search this site
            </button>
            <span className="mt-5 pb-10 text-sm text-muted">Dubai, UTC+4</span>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
