import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LeadFormPopup from "@/components/LeadFormPopup";
import CookieConsent from "@/components/CookieConsent";
import SpotlightSearch from "@/components/SpotlightSearch";
import Analytics from "@/components/Analytics";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bilalshafqat.com"),
  // Shortened 2026-09-23 from "Bilal Shafqat — Freelance Digital Marketer &
  // Developer Dubai". That was 60 characters and inside the usual limit, but
  // Google truncates by *pixel width*, not character count — a live search
  // showed it cut to "…Digital Marketer & Developer …", losing "Dubai"
  // entirely. Dropping "Freelance" buys the room back and keeps the one word
  // that carries local intent.
  title: "Bilal Shafqat — Digital Marketer & Developer, Dubai",
  // 233 characters before this, the longest on the site — Google cuts around
  // 160, so roughly the last third was being dropped mid-sentence.
  description:
    "One senior partner for paid marketing, web and app development, design and CRM automation. Dubai-based, working with founders and property developers.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "paid marketing Dubai",
    "lead generation UAE",
    "MERN stack developer",
    "web design and development",
    "mobile app development Dubai",
    "CRM setup Dubai",
    "HubSpot Zoho Salesforce freelancer",
    "marketing automation UAE",
    "graphic design freelancer",
    "social media management UAE",
  ],
  openGraph: {
    title: "Bilal Shafqat — Digital Marketer & Developer, Dubai",
    description:
      // Was a different sentence from the meta description: a list of four
      // services ending "one senior partner, four pillars". A share card is
      // read in a chat window in under a second, so it gets the same clear
      // sentence the search result does.
      "One senior partner for paid marketing, web and app development, design and CRM automation. Dubai-based, working with founders and property developers.",
    type: "website",
  },
  icons: {
    icon: "/logo/bs.svg",
  },
  // Search Console verification. Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the
  // token Google gives you under the "HTML tag" method; leaving it unset simply
  // omits the tag. Verifying in the app itself means verification survives every
  // rebuild and redeploy, unlike an uploaded HTML file that a deploy can wipe.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    // Bing Webmaster Tools. Same reasoning as Google: proving ownership from
    // the app means it survives rebuilds, unlike an uploaded BingSiteAuth.xml.
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">
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
        <LeadFormPopup />
        <CookieConsent />
      </body>
    </html>
  );
}
