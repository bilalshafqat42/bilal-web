import Link from "next/link";
import { industriesWorkedIn } from "@/data/industries";
import { disciplinesWithPages, disciplineItems } from "@/data/disciplines";
import { megaMenuGroups, serviceMenuColumns, subPagesOf } from "@/data/pillars";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import SocialLinks from "@/components/ui/SocialLinks";
import FooterWordmark from "@/components/layout/FooterWordmark";
import Eyebrow from "@/components/ui/Eyebrow";
import { SITE_NAME } from "@/lib/site";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_HREF, SITE_PHONE_ALT, SITE_PHONE_ALT_HREF } from "@/lib/contact";

const EMAIL = SITE_EMAIL;

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
      { label: SITE_PHONE, href: `tel:${SITE_PHONE_HREF}` },
      { label: SITE_PHONE_ALT, href: `tel:${SITE_PHONE_ALT_HREF}` },
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
    .map((g) => ({
      label: g.title,
      href: `/services/${g.slug}`,
      // "Paid" above Paid Marketing, as in the header (2026-10-24).
      subLabel: column.subLabels?.[g.slug],
      // The CMS platform pages (2026-10-16), as one short row under their hub
      // rather than four full rows: four more lines would run the Development
      // column far past its neighbours, which is what the two sub-columns
      // exist to prevent. The same day the CRM integration pages, the four app
      // pages and Figma joined the same way, each row under its menu page.
      // `subPagesOf` descends through CRM Integration, so its four platforms
      // sit in the CRM row beside it rather than nowhere.
      children: subPagesOf(g.slug).map((sub) => ({
        label: sub.shortTitle ?? sub.title,
        href: `/services/${sub.slug}`,
      })),
    })),
}));

// Sectors worked in rather than pages that exist, so these are plain text. The
// moment any of them earns a real page, it becomes a link. Read from
// `industries.ts` since 2026-10-19, so the footer and /about cannot disagree;
// the old hand-written list named sectors (SaaS, hospitality) with no work
// behind them.
const industries = industriesWorkedIn.map((i) => i.sector);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Coverage strip, above the footer proper and visually set back from it. */}
      <div className="border-b border-border bg-white/[0.02]">
        <div className="site-container grid gap-8 py-10 sm:grid-cols-2 lg:gap-16">
          {regions.map(({ icon: Icon, name, meta, line, actions }) => (
            <div key={name} className="flex gap-4">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl surface-2 text-gold">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-ink">{name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted/80">{meta}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{line}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-0.5">
                  {actions.map((a) => {
                    // This array mixes `tel:` with a real route, so it cannot
                    // be one or the other wholesale — `next/link` on a `tel:`
                    // breaks it, and a plain anchor on `/appointment` reloads
                    // the document. Split on the href instead.
                    const cls =
                      "inline-flex min-h-6 items-center break-words text-sm font-medium text-gold transition-opacity hover:opacity-75";
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

      {/* The bottom padding clears the floating WhatsApp and Quick Enquiry
          buttons, fixed to the bottom right. Without it they sat over the
          last row (Contact, Pinterest, YouTube, Behance, Dribbble) once a
          visitor scrolled to the very end. Mobile clears both buttons
          (10rem); from `sm` it clears Quick Enquiry, and the last row's right
          padding below keeps it clear of WhatsApp. */}
      <div className="site-container pb-40 pt-12 sm:pb-[5.5rem]">
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
              {/* `py-1` on an inline link grows its tap area to 25px without
                  changing the paragraph's line height. */}
              <Link href="/" className="py-1 text-muted underline-offset-2 transition-colors hover:text-gold">
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
            <ul className="mt-4 space-y-1.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-flex min-h-6 min-w-6 items-center text-sm text-muted transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Every footer link is at least 24px tall (WCAG 2.5.8): on
              2026-10-16, 39 of 62 measured 17 to 20px on a phone. Rows went
              from 20px with 10px gaps to 24px with 6px gaps, so the pitch and
              the footer's height are unchanged.

              All fifteen, in two sub-columns under their menu headings. One flat
              list of fifteen would run seven rows past every neighbour and make
              the footer look broken; two sub-columns keep it the same height as
              Company and Portfolio. */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-ink">Services</p>
            {/* Marketing fills the first sub-column (eight pages), Design and
                Development stack in the second, so the three groups read in
                the homepage's order and the two halves stay a similar height
                (2026-10-24, when Paid Marketing folded into Marketing). */}
            <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {[serviceGroups.slice(0, 1), serviceGroups.slice(1)].map((stack, si) => (
                <div key={si} className="space-y-6">
                  {stack.map((group) => (
                    <div key={group.title}>
                      <Eyebrow as="p" size="sm" tone="muted">
                        {group.title}
                      </Eyebrow>
                      <ul className="mt-2.5 space-y-1.5">
                        {group.links.map((l) => (
                          <li key={l.href} className={l.subLabel ? "pt-2" : undefined}>
                            {l.subLabel ? (
                              <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                                {l.subLabel}
                              </span>
                            ) : null}
                            <Link
                              href={l.href}
                              className="inline-flex min-h-6 min-w-6 items-center text-sm text-muted transition-colors hover:text-gold"
                            >
                              {l.label}
                            </Link>
                            {l.children.length ? (
                              <ul className="mt-1 flex flex-wrap gap-x-4 pl-3">
                                {l.children.map((c) => (
                                  <li key={c.href}>
                                    <Link
                                      href={c.href}
                                      className="inline-flex min-h-6 min-w-6 items-center text-[0.8125rem] text-muted transition-colors hover:text-gold"
                                    >
                                      {c.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
            <ul className="mt-4 space-y-1.5">
              {disciplinesWithPages().map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/portfolio/${d.slug}`}
                    className="flex min-h-6 items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
                  >
                    {d.title}
                    <span className="font-mono text-[0.65rem] text-faint">
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
                  className="inline-flex min-h-6 min-w-6 items-center text-sm text-muted transition-colors hover:text-gold"
                >
                  Real Estate Marketing
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="inline-flex min-h-6 min-w-6 items-center text-sm text-muted transition-colors hover:text-gold">
                  All work
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Industries</p>
            <ul className="mt-4 space-y-1.5">
              {industries.map((i) => (
                <li key={i} className="flex min-h-6 items-center text-sm text-muted">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* `sm:pr-14` keeps the right end of this row (the social icons) out
            from under the WhatsApp button, which sits 92px to 148px above the
            bottom edge. Bottom padding alone would need about 9.5rem here. */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:pr-14">
          {/* The build year, not the visitor's: the footer is a server
              component on prerendered pages, so this is fixed when the site is
              built. The site deploys several times a week, so it is wrong for
              at most a few days each January. A client component reading the
              clock would fix those days at the price of a hydration mismatch
              and JavaScript on every page, which is not worth it. */}
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-5">
            <Link href="/pricing" className="inline-flex min-h-6 min-w-6 items-center transition-colors hover:text-gold">Pricing</Link>
            <Link href="/faq" className="inline-flex min-h-6 min-w-6 items-center transition-colors hover:text-gold">FAQ</Link>
            <Link href="/privacy" className="inline-flex min-h-6 min-w-6 items-center transition-colors hover:text-gold">Privacy Policy</Link>
            <Link href="/contact" className="inline-flex min-h-6 min-w-6 items-center transition-colors hover:text-gold">Contact</Link>
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
