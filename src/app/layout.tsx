import type { Metadata } from "next";
import LeadFormPopup from "@/components/LeadFormPopup";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bilal Shafqat — Paid Marketing, Web/Mobile Development & Design Studio",
  description:
    "One partner for paid marketing (Google & social), performance marketing, web design, MERN stack development, mobile app development, graphic design, and social media management. Based in Dubai, UAE, working with founders, real estate developers, and agencies worldwide.",
  keywords: [
    "paid marketing Dubai",
    "performance marketing UAE",
    "MERN stack developer",
    "web design and development",
    "mobile app development Dubai",
    "graphic design freelancer",
    "social media management UAE",
  ],
  openGraph: {
    title: "Bilal Shafqat — Paid Marketing, Web/Mobile Development & Design Studio",
    description:
      "Google & social ads, performance marketing, web design, MERN development, mobile apps, graphic design, and social media management — one partner, six disciplines.",
    type: "website",
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
        {children}
        <WhatsAppButton />
        <LeadFormPopup />
      </body>
    </html>
  );
}
