import type { Metadata } from "next";
import LeadFormPopup from "@/components/LeadFormPopup";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bilalshafqat.com"),
  title: "Bilal Shafqat — Paid Marketing, Web/Mobile Development & Design Studio",
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
    title: "Bilal Shafqat — Paid Marketing, Web/Mobile Development & Design Studio",
    description:
      "Paid marketing and lead generation, website and app development, design and content, and CRM and marketing automation — one senior partner, four pillars.",
    type: "website",
  },
  icons: {
    icon: "/logo/bs.svg",
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
