"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { pillars, accentClasses, slugify } from "@/data/pillars";

const links = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#engagement" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
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
                <div
                  key={link.href}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
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

                  {servicesOpen ? (
                    <div className="absolute inset-x-0 top-full">
                      <div className="glass-nav border-t border-border shadow-2xl shadow-black/40">
                        <div className="mx-auto max-w-7xl px-6 py-10">
                          <div className="grid grid-cols-4 gap-8">
                            {pillars.map((pillar) => {
                              const accent = accentClasses[pillar.accent];
                              return (
                                <div key={pillar.slug}>
                                  <a
                                    href={`/services/${pillar.slug}`}
                                    className="flex items-center gap-2.5 group"
                                  >
                                    <span
                                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg} border border-border ${accent.icon}`}
                                    >
                                      <pillar.icon size={16} />
                                    </span>
                                    <span className="text-sm font-semibold text-ink group-hover:text-gold transition-colors">
                                      {pillar.label}
                                    </span>
                                  </a>

                                  <ul className="mt-4 space-y-2.5 border-l border-border pl-4">
                                    {pillar.sections.map((section) => (
                                      <li key={section.title}>
                                        <a
                                          href={`/services/${pillar.slug}#${slugify(section.title)}`}
                                          className="text-sm text-muted hover:text-ink transition-colors"
                                        >
                                          {section.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-8 border-t border-border pt-6">
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
                  ) : null}
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
              href="/#contact"
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
              href="/#contact"
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
