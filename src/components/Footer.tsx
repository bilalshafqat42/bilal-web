import Link from "next/link";
import { disciplinesWithPages, disciplineItems } from "@/data/disciplines";
import { megaMenuGroups, serviceMenuColumns } from "@/data/pillars";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import SocialLinks from "./SocialLinks";
import FooterWordmark from "./FooterWordmark";
import Eyebrow from "@/components/Eyebrow";

const EMAIL = "bilalshafqat42@gmail.com";

/**
 * Real locations only. An earlier version listed UK and North America as
 * coverage regions; Bilal asked for them out, since they are not addresses he
 * holds. Anything added here has to be somewhere he actually is.
 */
const regions = [
  {
    icon: MapPin,
    name: "United Arab Emirates",
    meta: "Dubai · UTC+4",
    line: "Monday to Friday, 9am to 6pm.",
    actions: [
      { label: "+971 52 976 6006", href: "tel:+971529766006" },
      { label: "+971 56 604 7396", href: "tel:+971566047396" },
    ],
  },
  {
    icon: Building2,
    name: "Pakistan",
    meta: "UTC+5",
    line: `Second base, on the same working week. ${EMAIL}`,
    actions: [{ label: "Book a call", href: "/appointment" }],
  },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Book a call", href: "/appointment" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Writing", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/**
 * Every service, grouped the way the Services menu groups them.
 *
 * **Was six hardcoded links out of fifteen.** Nine service pages had no footer
 * link at all, which on a site whose strongest signal is its own internal
 * linking meant nine pages were being vouched for by the menu and nothing else.
 * The footer renders on all 119 pages, so a link here is the cheapest sitewide
 * vote a page can get, and it was the same omission the Portfolio column above
 * was derived to avoid.
 *
 * Derived from `serviceMenuColumns` rather than listed, for the reason that
 * column already records: a hardcoded list drifts the moment a service is added
 * or renamed and nobody remembers this file. That is exactly how it got to six
 * of fifteen.
 *
 * Grouped rather than flattened so the footer states the same taxonomy as the
 * menu and the homepage. One taxonomy everywhere is worth more over a year than
 * any per-surface cleverness (roadmap 363).
 */
const serviceGroups = serviceMenuColumns.map((column) => ({
  title: column.title,
  links: column.slugs
    .map((slug) => megaMenuGroups.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ label: g.title, href: `/services/${g.slug}` })),
}));

// Sectors worked in rather than pages that exist, so these are plain text. The
// moment any of them earns a real page, it becomes a link.
const industries = [
  "Real Estate & Property",
  "Technology & SaaS",
  "Professional Services",
  "Hospitality",
  "E-commerce & Retail",
  "Manufacturing & Industrial",
  "Media & Production",
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Coverage strip, above the footer proper and visually set back from it. */}
      <div className="border-b border-border bg-white/[0.02]">
        <div className="site-container grid gap-8 py-10 sm:grid-cols-2 lg:gap-16">
          {regions.map(({ icon: Icon, name, meta, line, actions }) => (
            <div key={name} className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-gold">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-ink">{name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted/80">{meta}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{line}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {actions.map((a) => {
                    // This array mixes `tel:` with a real route, so it cannot
                    // be one or the other wholesale — `next/link` on a `tel:`
                    // breaks it, and a plain anchor on `/appointment` reloads
                    // the document. Split on the href instead.
                    const cls =
                      "break-words text-sm font-medium text-gold transition-opacity hover:opacity-75";
                    return a.href.startsWith("/") ? (
                      <Link key={a.href} href={a.href} className={cls}>
                        {a.label}
                      </Link>
                    ) : (
                      <a key={a.href} href={a.href} className={cls}>
                        {a.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-container pb-6 pt-12">
        {/* The oversized mark now opens the footer instead of closing it. */}
        <FooterWordmark />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_2.4fr_1.1fr_0.9fr]">
          <div>
            <Image
              src="/logo/bilal-square-light.svg"
              alt="Bilal Shafqat"
              width={382}
              height={642}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Bilal Shafqat is a{" "}
              <Link href="/" className="text-muted underline-offset-2 transition-colors hover:text-gold">
                freelance digital marketer in Dubai
              </Link>
              , and one senior partner for paid marketing, website and app
              development, design, and the CRM automation that connects them.
              Working with founders, developers and agencies from Dubai and
              Pakistan.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Company</p>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* All fifteen, in two sub-columns under their menu headings. One flat
              list of fifteen would run seven rows past every neighbour and make
              the footer look broken; two sub-columns keep it the same height as
              Company and Portfolio. */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-ink">Services</p>
            <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {serviceGroups.map((group) => (
                <div key={group.title}>
                  <Eyebrow as="p" size="sm" tone="muted">
                    {group.title}
                  </Eyebrow>
                  <ul className="mt-2.5 space-y-2.5">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-sm text-muted transition-colors hover:text-gold"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio, added when the discipline pages shipped. These are new
              URLs and the footer is the one place every page links from, which
              is what gets them crawled. Derived, so a discipline that gains a
              page appears here without this file being touched — and one that
              has no page never does. */}
          <div>
            <p className="text-sm font-semibold text-ink">Portfolio</p>
            <ul className="mt-4 space-y-2.5">
              {disciplinesWithPages().map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/portfolio/${d.slug}`}
                    className="flex items-baseline gap-2 text-sm text-muted transition-colors hover:text-gold"
                  >
                    {d.title}
                    <span className="font-mono text-[0.65rem] text-muted/50">
                      {disciplineItems(d).length}
                    </span>
                  </Link>
                </li>
              ))}
              {/* The off-plan vertical. Hand-written rather than derived, because
                  it is an industry page and `disciplinesWithPages()` only knows
                  about disciplines. Without a link here it was an orphan — no
                  page on the site pointed at it. */}
              <li>
                <Link
                  href="/real-estate-marketing"
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  Real Estate Marketing
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted transition-colors hover:text-gold">
                  All work
                </Link>
              </li>
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
            <Link href="/pricing" className="transition-colors hover:text-gold">Pricing</Link>
            <Link href="/faq" className="transition-colors hover:text-gold">FAQ</Link>
            <Link href="/privacy" className="transition-colors hover:text-gold">Privacy Policy</Link>
            <Link href="/contact" className="transition-colors hover:text-gold">Contact</Link>
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
