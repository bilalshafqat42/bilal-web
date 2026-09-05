"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
 * same and costs nothing. The scroll-shrink animation on the whole bar is not
 * restored: the design has a fixed bordered bar, so there is nothing to shrink.
 *
 * The interaction details below are the parts worth keeping and are easy to
 * lose in a rewrite — each one exists because of a specific failure.
 */
const links = [
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services", mega: true },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
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
  const openServicesMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServicesMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 250);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      suppressFocusOpen.current = true;
      setServicesOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

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
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-[68px] w-full items-center justify-between px-6 lg:h-[84px] lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Bilal Shafqat — home">
          <Image
            src="/logo/bs-logo.svg"
            alt="Bilal Shafqat"
            width={161}
            height={63}
            priority
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-9">
          {links.map((link) =>
            link.mega ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={openServicesMenu}
                onMouseLeave={closeServicesMenu}
              >
                <div className="flex items-center gap-1">
                  <Link
                    ref={triggerRef}
                    href={link.href}
                    onFocus={() => {
                      if (suppressFocusOpen.current) {
                        suppressFocusOpen.current = false;
                        return;
                      }
                      openServicesMenu();
                    }}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                  {/* A separate control, so pressing the chevron opens the panel
                      while pressing the label still navigates to /services. */}
                  <button
                    type="button"
                    onPointerDown={() => {
                      openBeforePress.current = servicesOpen;
                    }}
                    onClick={() => setServicesOpen(!openBeforePress.current)}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-label={servicesOpen ? "Close services menu" : "Open services menu"}
                    className="p-1 text-muted transition-colors hover:text-ink"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-5">
          {/* Dubai does not observe daylight saving, so the offset is fixed and
              safe as static text. Reading it from a clock would mean client JS
              and a hydration mismatch for no gain. */}
          {/* Was a floating pill in the bottom-left corner, where it sat over the
              project strip on a 14-inch screen. Cmd+K still works from
              anywhere; this is the discoverable route to the same panel. */}
          <button
            type="button"
            onClick={openSearchPanel}
            aria-label="Search this site"
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-muted transition-colors hover:border-gold/40 hover:text-ink lg:inline-flex"
          >
            <Search size={15} />
            <kbd className="hidden font-sans text-[10px] text-muted/70 xl:inline">⌘K</kbd>
          </button>

          <span className="hidden text-sm text-muted xl:inline">Dubai, UTC+4</span>
          <Link
            href="/appointment"
            className="btn-primary hidden rounded-full px-6 py-3 text-sm font-semibold lg:inline-flex"
          >
            Book a free consultation
          </Link>
          <button
            type="button"
            onClick={openSearchPanel}
            aria-label="Search this site"
            className="p-1 text-ink lg:hidden"
          >
            <Search size={20} />
          </button>

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

      {/* Mega-menu panel. Always in the DOM so it can animate both ways, but
          `invisible` while closed — that keeps its links out of the tab order,
          which `opacity-0` alone would not do. Verified by pressing Tab rather
          than by inspecting styles: 0 stops land inside it while closed.

          Only `opacity` and `transform` are transitioned, deliberately.
          `transition-all` also animates `visibility`, and that left the panel
          mid-transition on the Tab press immediately after focusing the
          trigger — so a keyboard user opened the panel and then tabbed straight
          past it into the page, reaching its links about ten stops later. */}
      <div
        onMouseEnter={openServicesMenu}
        onMouseLeave={closeServicesMenu}
        className={`absolute inset-x-0 top-full hidden transition-[opacity,transform] duration-200 lg:block ${
          servicesOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div
          role="group"
          aria-label="Services menu"
          className="glass-nav border-t border-border shadow-2xl shadow-black/40"
        >
          <div className="px-10 py-10">
            <div className="grid grid-cols-4 gap-x-8 gap-y-8">
              {megaMenuGroups.map((group) => {
                const accent = accentClasses[group.accent];
                return (
                  <div key={group.slug}>
                    <Link
                      href={`/services/${group.slug}`}
                      className="group/head flex items-center gap-2"
                      onClick={() => setServicesOpen(false)}
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
                            onClick={() => setServicesOpen(false)}
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
                onClick={() => setServicesOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
              >
                View all services <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

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
              link.mega ? (
                // Native <details> rather than more state: it is keyboard
                // accessible for free and needs no JavaScript to expand.
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
            <span className="mt-5 pb-10 text-sm text-muted">Dubai, UTC+4</span>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
