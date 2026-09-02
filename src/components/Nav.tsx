"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { accentClasses, megaMenuGroups, slugify } from "@/data/pillars";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const links = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/pricing" },
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

  const headerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // The panel state as it was before the current press. Focus and hover both
  // open the panel and both land before `click`, so a plain toggle in the click
  // handler would undo them and the panel could never be opened by pressing.
  const openBeforePress = useRef(false);
  const barWrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // One paused timeline built on mount, played forward to open and reversed to
  // close. Building it once (rather than animating on each render) is what lets
  // the menu animate OUT as well as in — the previous version mounted/unmounted
  // the panel, so it could only ever appear and vanish instantly.
  useGSAP(
    () => {
      const wrap = panelWrapRef.current;
      const panel = panelRef.current;
      if (!wrap || !panel) return;

      const groups = gsap.utils.toArray<HTMLElement>("[data-mega-group]", panel);
      const footer = panel.querySelector<HTMLElement>("[data-mega-footer]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      if (reduce) {
        // No travel, no clip reveal — just a short cross-fade.
        tl.to([backdropRef.current, wrap], { autoAlpha: 1, duration: 0.15 }, 0).fromTo(
          [...groups, footer].filter(Boolean),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15 },
          0
        );
      } else {
        tl.to(wrap, { autoAlpha: 1, duration: 0.2 }, 0)
          .fromTo(backdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0)
          // clip-path unrolls the panel downward instead of scaling it, so the
          // text inside is never distorted mid-animation.
          .fromTo(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)", y: -12 },
            { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.55, ease: "power4.out" },
            0
          )
          .fromTo(
            groups,
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.045 },
            0.12
          );

        if (footer) {
          tl.fromTo(footer, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.34);
        }
      }

      tlRef.current = tl;
    },
    { scope: headerRef }
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (servicesOpen) tl.play();
    else tl.reverse();
  }, [servicesOpen]);

  const openServicesMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const closeServicesMenu = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 250);
  };

  // The bar used to swap between `site-container` (width 83.3333%) and
  // `max-w-full` (width auto). CSS cannot interpolate to `auto`, so the width
  // jumped while everything else faded, which is what read as "no animation".
  // Driving it with a scrubbed timeline over explicit values fixes that and
  // ties the morph to scroll position rather than a one-shot transition.
  useGSAP(
    () => {
      const wrap = barWrapRef.current;
      const bar = barRef.current;
      const header = headerRef.current;
      if (!wrap || !bar || !header) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as Record<string, boolean>;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              start: 0,
              end: 150,
              // Reduced motion still gets the end state, just without the
              // scroll-linked interpolation.
              scrub: reduce ? false : 0.4,
              toggleActions: reduce ? "play none none reverse" : undefined,
            },
          });

          tl.fromTo(header, { paddingTop: 20, paddingBottom: 20 }, { paddingTop: 12, paddingBottom: 12 }, 0)
            .fromTo(
              wrap,
              { width: "100%", paddingLeft: desktop ? 32 : 16, paddingRight: desktop ? 32 : 16 },
              { width: desktop ? "83.3333%" : "100%", paddingLeft: desktop ? 0 : 12, paddingRight: desktop ? 0 : 12 },
              0
            )
            .fromTo(
              bar,
              {
                borderRadius: 0,
                paddingLeft: 0,
                paddingRight: 0,
                backgroundColor: "rgba(18, 18, 24, 0)",
                backdropFilter: "blur(0px)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              },
              {
                borderRadius: 16,
                paddingLeft: 16,
                paddingRight: 16,
                backgroundColor: "rgba(18, 18, 24, 0.72)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              },
              0
            );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: headerRef }
  );

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      {/* Blurred, dimmed scrim behind the mega menu. Negative z-index keeps it
          under the nav bar's own content (a fixed element would otherwise paint
          over the statically-positioned bar regardless of DOM order), while the
          header's z-50 keeps the whole thing above the page. */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="mega-backdrop pointer-events-none fixed inset-0 -z-10"
        style={{ visibility: "hidden", opacity: 0 }}
      />
      <div ref={barWrapRef} className="mx-auto">
        <div
          ref={barRef}
          className="flex items-center justify-between py-2.5"
          style={{ borderWidth: 0 }}
        >
          <Link href="/#home" className="flex items-center">
            <Image
              src="/logo/bs-logo.svg"
              alt="Bilal Shafqat"
              width={161}
              height={63}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) =>
              link.label === "Services" ? (
                <div
                  key={link.href}
                  // Pointer events rather than mouse events, so the pointerType
                  // can be checked. A tap fires a synthetic mouseenter, which
                  // used to open the panel a moment before the tap toggled it
                  // shut again, so touch could never open it at all.
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") openServicesMenu();
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") closeServicesMenu();
                  }}
                  onFocus={() => {
                    if (suppressFocusOpen.current) {
                      suppressFocusOpen.current = false;
                      return;
                    }
                    openServicesMenu();
                  }}
                  onBlur={(e) => {
                    // Close only once focus has left the whole group, otherwise
                    // tabbing between the links inside would shut the panel.
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setServicesOpen(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && servicesOpen) {
                      suppressFocusOpen.current = true;
                      setServicesOpen(false);
                      triggerRef.current?.focus();
                    }
                  }}
                >
                  <div className="flex items-center rounded-lg transition-colors hover:bg-white/5">
                    <Link
                      ref={triggerRef}
                      href={link.href}
                      className="py-2 pl-3.5 pr-1 text-sm text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                    {/* Separate control, so clicking the chevron opens the panel
                        and clicking the label still goes to /services. */}
                    <button
                      type="button"
                      onPointerDown={() => {
                        openBeforePress.current = servicesOpen;
                      }}
                      onClick={() => setServicesOpen(!openBeforePress.current)}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      aria-label={servicesOpen ? "Close services menu" : "Open services menu"}
                      className="py-2 pl-0.5 pr-3 text-muted transition-colors hover:text-ink"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Always mounted, hidden via inline styles at first paint so it
                      cannot flash before GSAP takes over, then driven by the
                      timeline above. autoAlpha also toggles `visibility`, which
                      keeps the 28 links out of the tab order while closed. */}
                  <div
                    ref={panelWrapRef}
                    className={`absolute inset-x-0 top-full ${
                      servicesOpen ? "" : "pointer-events-none"
                    }`}
                    style={{ visibility: "hidden", opacity: 0 }}
                  >
                    <div
                      ref={panelRef}
                      role="group"
                      aria-label="Services menu"
                      className="glass-nav border-t border-border shadow-2xl shadow-black/40"
                    >
                        <div className="site-container py-10">
                          <div className="grid grid-cols-4 gap-x-8 gap-y-8">
                            {megaMenuGroups.map((group) => {
                              const accent = accentClasses[group.accent];
                              return (
                                <div key={group.title} data-mega-group>
                                  <Link
                                    href={`/services/${group.slug}`}
                                    className="group/head flex items-center gap-2"
                                  >
                                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                                    <span className="text-sm font-semibold text-ink group-hover/head:text-gold transition-colors">
                                      {group.title}
                                    </span>
                                  </Link>

                                  <ul className="mt-3 space-y-2.5">
                                    {group.items.map((item) => (
                                      <li key={item.title}>
                                        <Link
                                          href={`/services/${group.slug}#${slugify(item.title)}`}
                                          className="text-sm text-muted hover:text-ink transition-colors"
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

                          <div data-mega-footer className="mt-8 border-t border-border pt-6">
                            <Link
                              href="/services"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:opacity-80 transition-opacity"
                            >
                              View all services <ArrowRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm text-muted hover:text-ink transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex btn-primary items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-shadow"
            >
              Book a free consultation
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="mt-2 lg:hidden glass-strong rounded-2xl p-4 flex flex-col gap-1">
            {links.map((link) =>
              link.label === "Services" ? (
                // Services expands in place rather than linking straight out:
                // previously none of the 28 service links were reachable at all
                // on a phone. <details> is used deliberately — it is keyboard
                // accessible and works without any JS state.
                <details key={link.href} className="group rounded-lg">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm text-muted marker:hidden hover:text-ink">
                    Services
                    <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 space-y-1 pb-2">
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-6 py-2 text-xs font-semibold text-gold hover:bg-white/5"
                    >
                      All services
                    </Link>
                    {megaMenuGroups.map((group) => (
                      <details key={group.slug} className="group/sub">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-6 py-2 text-sm text-ink marker:hidden hover:bg-white/5">
                          <span className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentClasses[group.accent].dot}`} />
                            {group.title}
                          </span>
                          <ChevronDown size={14} className="transition-transform group-open/sub:rotate-180" />
                        </summary>
                        <div className="space-y-0.5 pb-1">
                          <Link
                            href={`/services/${group.slug}`}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-10 py-1.5 text-xs font-medium text-gold hover:bg-white/5"
                          >
                            Overview
                          </Link>
                          {group.items.map((item) => (
                            <Link
                              key={item.title}
                              href={`/services/${group.slug}#${slugify(item.title)}`}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-10 py-1.5 text-xs text-muted hover:text-ink hover:bg-white/5"
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
                  className="px-3 py-2.5 text-sm text-muted hover:text-ink rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 btn-primary text-center rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Book a free consultation
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
