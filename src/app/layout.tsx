import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import LeadFormPopup from "@/components/forms/LeadFormPopup";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import CookieConsent from "@/components/layout/CookieConsent";
import LogoIntro from "@/components/ui/LogoIntro";
import SpotlightSearch from "@/components/layout/SpotlightSearch";
import Analytics from "@/components/seo/Analytics";
import MetaPixel from "@/components/seo/MetaPixel";
import { SITE_URL, OG_IMAGES, OG_IMAGE_URL, HOME_TITLE, HOME_DESCRIPTION as SITE_DESCRIPTION } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Reordered 2026-10-02. "Freelance" is back, and this time it costs nothing:
  // at 457px this is *narrower* than the 461px it replaces, because moving the
  // name to the end removes a dash and its spacing. The 2026-09-23 note below
  // is why that matters.
  //
  //   Shortened 2026-09-23 from "Bilal Shafqat — Freelance Digital Marketer &
  //   Developer Dubai". That was 60 characters and inside the usual limit, but
  //   Google truncates by *pixel width*, not character count — a live search
  //   showed it cut to "…Digital Marketer & Developer …", losing "Dubai".
  //
  // Keyword first, name second, which is what every competing freelance site in
  // Dubai does and what this one did not (roadmap 319). The brand ranking is
  // safe: the name is still in the title and the domain is the name.
  title: HOME_TITLE,
  // 233 characters before this, the longest on the site — Google cuts around
  // 160, so roughly the last third was being dropped mid-sentence.
  //
  // Reworded 2026-10-13 to carry the positioning line used everywhere else
  // (roadmap 397): marketing leads, building is how it gets delivered.
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    // Site-wide, so a reader's "subscribe" button finds the feed from any page
    // rather than only from /blog. Next replaces `alternates` whole, so a page
    // that sets its own canonical drops this; `pageMetadata()` in lib/site.ts
    // repeats it. Pages building `alternates` by hand need the same.
    types: { "application/rss+xml": [{ url: "/rss.xml", title: "Bilal Shafqat: Writing" }] },
  },
  // No `keywords`, removed 2026-10-13. Google has said publicly that it ignores
  // the meta keywords tag, so it bought nothing, and the list still said "MERN
  // stack developer": the old positioning, in the source of every page.
  openGraph: {
    title: HOME_TITLE,
    description:
      // Was a different sentence from the meta description: a list of four
      // services ending "one senior partner, four pillars". A share card is
      // read in a chat window in under a second, so it gets the same clear
      // sentence the search result does.
      SITE_DESCRIPTION,
    type: "website",
    // **The site-wide share card, and it did not exist before 2026-09-25.**
    //
    // Measured across the sitemap: 6 of 30 routes carried an `og:image` — the
    // case studies, which set their own — and the other 24 carried none,
    // including the homepage, /services and every service page. A link with no
    // og:image shares as a bare text row on WhatsApp, LinkedIn and Slack, which
    // for a designer's portfolio is the worst possible first impression.
    //
    // Declared here rather than per page because Next's metadata inherits: the
    // six pages with their own image keep it, and the other 24 pick this up
    // without being touched.
    //
    // **JPEG, not AVIF.** WhatsApp and Facebook share one link-preview crawler
    // and it renders JPEG, PNG, GIF and WebP only — an AVIF og:image is fetched
    // and then silently not drawn. That is the same trap the LEOS card hit in
    // the 2026-09-23 commit.
    //
    // 1200x630 is the size both Facebook and LinkedIn crop to. An absolute URL
    // because several crawlers will not resolve a relative one.
    images: OG_IMAGES,
  },
  // `summary_large_image`, not the default `summary`.
  //
  // Every route was serving `twitter:card: summary`, which renders a small
  // square thumbnail beside the text. With a 1200x630 card that means the image
  // is centre-cropped to a square and most of it is thrown away. X, and every
  // other client that reads Twitter card tags, honours this.
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: "/logo/bs.svg",
    apple: "/apple-touch-icon.png",
  },
  // Search Console verification. Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the
  // token Google gives you under the "HTML tag" method; leaving it unset simply
  // omits the tag. Verifying in the app itself means verification survives every
  // rebuild and redeploy, unlike an uploaded HTML file that a deploy can wipe.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    // One merged `other`, not two spreads. Bing and Pinterest both render
    // through this key, so a second `...{ other: ... }` would silently replace
    // the first rather than adding to it, and whichever came last would be the
    // only tag on the page.
    other: {
      // Bing Webmaster Tools. Same reasoning as Google: proving ownership from
      // the app means it survives rebuilds, unlike an uploaded BingSiteAuth.xml.
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
      // Pinterest domain verification, hardcoded rather than env-gated like the
      // two above. This is deliberate and it is not a secret: the token only
      // works by being served publicly in the HTML, so anyone who can read the
      // page can read it, and keeping it in an environment variable would hide
      // nothing while adding a way for the tag to go missing. Verification
      // fails silently when the tag is absent, and a silent failure in a deploy
      // variable is exactly the thing worth avoiding here.
      //
      // Claiming the domain is what makes Pinterest attribute every pin made
      // from bilalshafqat.com to this account, and it is a precondition for
      // Rich Pins reading the Open Graph tags the site already carries.
      "p:domain_verify": "7b313ea4f2bddf04c3c63c7c002ca422",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-scroll-behavior="smooth"`: globals.css sets `scroll-behavior:
    // smooth` for in-page anchors, and since Next 16 the router no longer
    // switches it off during a route change unless this attribute is present,
    // so every page change smooth-scrolled to the top (Next 16 upgrade guide,
    // "Scroll Behavior Override"; audit batch 2).
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {/* The logo splash. First in <body> so it arrives in the first bytes
         * of HTML, before the page it covers can paint. In the layout, not the
         * homepage, so a client-side navigation back to "/" never remounts it
         * and replays it; its own script limits it to a first homepage load.
         * Nothing in it is focusable, so the skip link below is still the
         * first tab stop. */}
        <LogoIntro />
        {/* Skip link — WCAG 2.4.1 Bypass Blocks, Level A.
         *
         * The site had none on any of its 31 routes, so a keyboard or screen
         * reader user tabbed the whole header — logo, four nav items, the
         * Services chevron, the CTA — before reaching content, on every page
         * (roadmap 213.8). Phase 3 item 13 proposes selling WCAG 2.2
         * conformance audits; a prospect running axe here would have found a
         * Level A failure in seconds.
         *
         * First child of `<body>` so it is the first tab stop. Visually hidden
         * until focused rather than hidden outright: `display: none` would take
         * it out of the tab order and defeat the point. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#14140f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg"
        >
          Skip to content
        </a>

        <Analytics />
        <MetaPixel />
        {/* The header and footer live here, not in each page.
         *
         * They were imported individually into all 17 page templates plus
         * `DisciplinePage`, so every client-side navigation unmounted and
         * remounted them: the `.header-enter` drop-in from item 199 replayed on
         * every route change and the floating-pill state from item 201 reset,
         * which is not what a persistent header does. Rendering them around
         * `{children}` keeps one instance for the life of the visit, so the
         * entrance plays once, as designed.
         *
         * `not-found.tsx` gets them from here too, which is why it no longer
         * renders its own. */}
        <Nav />
        {children}
        <Footer />
        <SpotlightSearch />
        <WhatsAppFloat />
        <LeadFormPopup />
        <CookieConsent />
      </body>
    </html>
  );
}
