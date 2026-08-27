import type { Metadata } from "next";
import LeadFormPopup from "@/components/LeadFormPopup";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bilalshafqat.com"),
  title: "Bilal Shafqat — Freelance Digital Marketer & Developer Dubai",
  description:
    "One senior partner for paid marketing and lead generation, website and app development, design and content, and CRM and marketing automation. Based in Dubai, UAE, working with founders, real estate developers, and agencies worldwide.",
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
    title: "Bilal Shafqat — Freelance Digital Marketer & Developer Dubai",
    description:
      "Paid marketing and lead generation, website and app development, design and content, and CRM and marketing automation — one senior partner, four pillars.",
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
        <StructuredData />
        {children}
        <WhatsAppButton />
        <LeadFormPopup />
        <CookieConsent />
      </body>
    </html>
  );
}
