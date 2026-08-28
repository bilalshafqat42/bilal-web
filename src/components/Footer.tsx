import Image from "next/image";
import { Globe, MapPin, Sunrise } from "lucide-react";
import SocialLinks from "./SocialLinks";
import FooterWordmark from "./FooterWordmark";

const EMAIL = "bilalshafqat42@gmail.com";

/**
 * Where he works and how the hours line up. There are no branch offices to
 * list, so these describe coverage and overlap honestly rather than implying
 * a presence that does not exist. The time differences answer the first
 * objection an overseas client raises.
 */
const regions = [
  {
    icon: MapPin,
    name: "Middle East",
    meta: "Dubai, UAE · UTC+4",
    line: "Based here. Monday to Friday, 9am to 6pm.",
    action: { label: "+971 52 976 6006", href: "tel:+971529766006" },
  },
  {
    icon: Globe,
    name: "United Kingdom & Europe",
    meta: "Remote · 3 to 4 hours ahead of London",
    line: "Most of your working day overlaps mine.",
    action: { label: EMAIL, href: `mailto:${EMAIL}` },
  },
  {
    icon: Sunrise,
    name: "North America",
    meta: "Remote · 8 to 9 hours ahead of New York",
    line: "Your morning calls land in my evening. That works.",
    action: { label: "Book a call", href: "/contact" },
  },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Paid Marketing", href: "/services/paid-marketing" },
  { label: "Website & App Development", href: "/services/website-app-development" },
  { label: "UI/UX Design", href: "/services/ui-ux-design" },
  { label: "Social Media Marketing", href: "/services/social-media-marketing" },
  { label: "Graphic Design & Branding", href: "/services/graphic-design-branding" },
  { label: "CRM & MarTech Integration", href: "/services/crm-marketing-automation" },
];

// Sectors worked in rather than pages that exist, so these are plain text. The
// moment any of them earns a real page, it becomes a link.
const industries = [
  "Real Estate & Property",
  "Technology & SaaS",
  "Professional Services",
  "Hospitality",
  "E-commerce & Retail",
  "Media & Production",
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Coverage strip, above the footer proper and visually set back from it. */}
      <div className="border-b border-border bg-white/[0.02]">
        <div className="site-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {regions.map(({ icon: Icon, name, meta, line, action }) => (
            <div key={name} className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-gold">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-ink">{name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted/80">{meta}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{line}</p>
                <a
                  href={action.href}
                  className="mt-2 inline-block break-words text-sm font-medium text-gold transition-opacity hover:opacity-75"
                >
                  {action.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-container pb-6 pt-12">
        {/* The oversized mark now opens the footer instead of closing it. */}
        <FooterWordmark />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr_1fr]">
          <div>
            <Image
              src="/logo/bilal-square-light.svg"
              alt="Bilal Shafqat"
              width={382}
              height={642}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              One senior partner for paid marketing, website and app
              development, design, and the CRM automation that connects them.
              Working with founders, developers and agencies from Dubai to
              London and New York.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Company</p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Services</p>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Industries</p>
            <ul className="mt-4 space-y-2.5">
              {industries.map((i) => (
                <li key={i} className="text-sm text-muted">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Bilal Shafqat. All rights reserved.</p>
          <p className="flex items-center gap-5">
            <a href="/privacy" className="transition-colors hover:text-gold">Privacy Policy</a>
            <a href="/contact" className="transition-colors hover:text-gold">Contact</a>
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
