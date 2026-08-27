"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { accentClasses, megaMenuGroups, slugify } from "@/data/pillars";

gsap.registerPlugin(useGSAP);

const links = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#engagement" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
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
      <div
        className={`mx-auto transition-all duration-500 ease-out ${
          scrolled ? "max-w-7xl px-6" : "max-w-full px-4 sm:px-8"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "rounded-2xl px-4 py-2.5 glass-strong shadow-lg shadow-black/20"
              : "rounded-none px-0 py-2.5 bg-transparent"
          }`}
          style={{ borderWidth: 0 }}
        >
          <a href="/#home" className="flex items-center">
            <Image
              src="/logo/bs-logo.svg"
              alt="Bilal Shafqat"
              width={161}
              height={63}
              priority
              className="h-9 w-auto"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) =>
              link.label === "Services" ? (
                <div key={link.href} onMouseEnter={openServicesMenu} onMouseLeave={closeServicesMenu}>
                  <a
                    href={link.href}
                    className="flex items-center gap-1 px-3.5 py-2 text-sm text-muted hover:text-ink transition-colors rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </a>

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
                      className="glass-nav border-t border-border shadow-2xl shadow-black/40"
                    >
                        <div className="mx-auto max-w-7xl px-6 py-10">
                          <div className="grid grid-cols-4 gap-x-8 gap-y-8">
                            {megaMenuGroups.map((group) => {
                              const accent = accentClasses[group.accent];
                              return (
                                <div key={group.title} data-mega-group>
                                  <a
                                    href={`/services/${group.slug}`}
                                    className="group/head flex items-center gap-2"
                                  >
                                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                                    <span className="text-sm font-semibold text-ink group-hover/head:text-gold transition-colors">
                                      {group.title}
                                    </span>
                                  </a>

                                  <ul className="mt-3 space-y-2.5">
                                    {group.items.map((item) => (
                                      <li key={item.title}>
                                        <a
                                          href={`/services/${group.slug}#${slugify(item.title)}`}
                                          className="text-sm text-muted hover:text-ink transition-colors"
                                        >
                                          {item.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>

                          <div data-mega-footer className="mt-8 border-t border-border pt-6">
                            <a
                              href="/services"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:opacity-80 transition-opacity"
                            >
                              View all services <ArrowRight size={15} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm text-muted hover:text-ink transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/contact"
              className="hidden sm:inline-flex btn-primary items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-shadow"
            >
              Book a free consultation
            </a>
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
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted hover:text-ink rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 btn-primary text-center rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Book a free consultation
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
