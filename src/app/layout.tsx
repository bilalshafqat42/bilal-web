import type { Metadata } from "next";
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
        <Analytics />
        <MetaPixel />
        {children}
        <SpotlightSearch />
        <LeadFormPopup />
        <CookieConsent />
      </body>
    </html>
  );
}
