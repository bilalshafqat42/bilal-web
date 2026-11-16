import Link from "next/link";
import Image from "next/image";
import { megaMenuGroups, serviceMenuColumns, subPagesOf } from "@/data/pillars";
import SocialLinks from "@/components/ui/SocialLinks";
import CtaButton from "@/components/ui/CtaButton";
import FooterWordmark from "@/components/layout/FooterWordmark";
import FooterSection from "@/components/layout/FooterSection";
import { SITE_NAME } from "@/lib/site";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_HREF, SITE_PHONE_ALT, SITE_PHONE_ALT_HREF } from "@/lib/contact";

/**
 * The site footer, rebuilt 2026-11-16 because Bilal said it looked like a mess.
 *
 * What it was: two office cards above the footer, the oversized wordmark in
 * the middle, then six uneven columns (about 60 links) with mono sub-labels,
 * platform names nested under their hubs, page counts beside the disciplines,
 * a plain-text Industries list, and Pricing, FAQ and Contact repeated in the
 * bottom row.
 *
 * What it is now, in the pattern studio sites use: the brand and how to reach
 * Bilal on the left, four even link columns on the right, one quiet row of
 * platform pages, a legal row, and the wordmark closing the page.
 *
 * Three things were kept on purpose, because they are why the old footer was
 * the shape it was:
 *
 * - The description links home with "freelance digital marketer in Dubai".
 *   The footer is on every page, so it is the site's strongest single vote
 *   for the homepage on the main keyword.
 * - Every service page is still linked. The fifteen menu pages are the two
 *   service columns; the platform pages (WordPress, Wix, the CRM and app
 *   pages, Figma) are not in the header menu at all, so they moved to the
 *   Platforms row rather than being dropped.
 * - LEOS is not named. The footer renders on every blog article, and LEOS is
 *   named only on the portfolio itself.
 *
 * Dropped: the five discipline links with counts (one click away on
 * /portfolio, under "Browse by discipline") and the Industries list (plain
 * text, not links, and stated on /about).
 */

/** The two Services columns: Marketing as the menu orders it, then Design and
 *  Development together so the two columns are close in height. */
function menuLinks(title: string) {
  const column = serviceMenuColumns.find((c) => c.title === title);
  return (column?.slugs ?? [])
    .map((slug) => megaMenuGroups.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ label: g.title, href: `/services/${g.slug}` }));
}

const marketingLinks = menuLinks("Marketing");
const buildLinks = [...menuLinks("Design"), ...menuLinks("Development")];

/** Pages reached only from their hub and here: derived, so a new platform page
 *  appears without this file being touched. */
const platformLinks = serviceMenuColumns
  .flatMap((c) => c.slugs)
  .flatMap((slug) => subPagesOf(slug))
  .filter((g, i, all) => all.findIndex((x) => x.slug === g.slug) === i)
  .map((g) => ({ label: g.shortTitle ?? g.title, href: `/services/${g.slug}` }));

const workLinks = [
  { label: "Homemaid", href: "/portfolio/homemaid" },
  { label: "AKS Chemicals", href: "/portfolio/aks-chemicals" },
  { label: "Texdale", href: "/portfolio/texdale" },
  { label: "NextGen HR", href: "/portfolio/nextgen-hr" },
  { label: "Real estate marketing", href: "/real-estate-marketing" },
  { label: "All work", href: "/portfolio" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Writing", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Free website health check", href: "/free-website-health-check" },
  { label: "Contact", href: "/contact" },
];

// Every link is at least 24px tall (WCAG 2.5.8), as the old footer was.
const LINK =
  "inline-flex min-h-6 items-center text-sm text-muted transition-colors hover:text-gold";

function LinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2 md:mt-5">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={LINK}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* The bottom padding clears the floating WhatsApp and Quick Enquiry
          buttons fixed to the bottom right: 10rem on a phone, where they stack,
          and 5.5rem from `sm`. */}
      <div className="site-container pb-40 pt-16 sm:pb-[5.5rem] lg:pt-20">
        <div className="grid gap-x-10 md:grid-cols-2 md:gap-y-12 lg:grid-cols-[1.35fr_2fr_0.9fr_0.9fr]">
          {/* Brand and contact. */}
          <div className="mb-10 max-w-sm md:col-span-2 md:mb-0 lg:col-span-1">
            <Image
              src="/logo/bilal-square-light.svg"
              alt="Bilal Shafqat"
              width={382}
              height={642}
              className="h-14 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Bilal Shafqat is a{" "}
              {/* `py-1` grows the inline link's tap area without changing the
                  paragraph's line height. */}
              <Link href="/" className="py-1 text-ink underline-offset-4 transition-colors hover:text-gold hover:underline">
                freelance digital marketer in Dubai
              </Link>
              : paid marketing, websites and apps, design, and the CRM automation
              that connects them, from one senior partner.
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a href={`mailto:${SITE_EMAIL}`} className="inline-flex min-h-6 items-center text-ink transition-colors hover:text-gold">
                  {SITE_EMAIL}
                </a>
              </li>
              <li className="flex flex-wrap gap-x-4">
                <a href={`tel:${SITE_PHONE_HREF}`} className="inline-flex min-h-6 items-center text-ink transition-colors hover:text-gold">
                  {SITE_PHONE}
                </a>
                <a href={`tel:${SITE_PHONE_ALT_HREF}`} className="inline-flex min-h-6 items-center text-ink transition-colors hover:text-gold">
                  {SITE_PHONE_ALT}
                </a>
              </li>
              <li className="text-muted">Dubai, UAE · Monday to Friday, 9am to 6pm</li>
              <li className="text-muted">Second base in Pakistan, same working week</li>
            </ul>

            <CtaButton href="/appointment" size="sm" className="mt-7">
              Book a free consultation
            </CtaButton>
          </div>

          {/* Link columns. Below `md` each folds into a row (`FooterSection`),
              so the phone footer is four short rows, not 30 links. */}
          <div className="grid gap-x-10 md:col-span-2 md:grid-cols-2 lg:col-span-1">
            <FooterSection title="Marketing">
              <LinkList links={marketingLinks} />
            </FooterSection>
            <FooterSection title="Design & Development">
              <LinkList links={buildLinks} />
            </FooterSection>
          </div>
          <FooterSection title="Work">
            <LinkList links={workLinks} />
          </FooterSection>
          <FooterSection title="Company">
            <LinkList links={companyLinks} />
          </FooterSection>
        </div>

        {/* Platform pages, one quiet row. */}
        {platformLinks.length ? (
          <div className="mt-14 border-t border-border pt-6">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <span className="mr-1 text-faint">Platforms</span>
              {platformLinks.map((l) => (
                <Link key={l.href} href={l.href} className={LINK}>
                  {l.label}
                </Link>
              ))}
            </p>
          </div>
        ) : null}

        {/* Legal and social. `sm:pr-14` keeps the icons out from under the
            WhatsApp button. */}
        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-5 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:pr-14">
          {/* The build year: the footer is prerendered, so this is fixed when
              the site is built, which is wrong for at most a few days each
              January and costs no JavaScript. */}
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>© {new Date().getFullYear()} {SITE_NAME}</span>
            <Link href="/privacy" className="inline-flex min-h-6 items-center transition-colors hover:text-gold">
              Privacy Policy
            </Link>
          </p>
          <SocialLinks />
        </div>

        {/* The oversized mark closes the page. */}
        <FooterWordmark />
      </div>
    </footer>
  );
}
