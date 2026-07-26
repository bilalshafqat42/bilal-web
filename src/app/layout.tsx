import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bilal Shafqat — Growth Strategist, Performance Marketer & Digital Builder",
  description:
    "I help brands grow through performance marketing, UX/UI design, web & mobile development, and automation. Digital Marketing Manager & Growth Strategist based in Dubai, UAE, working with founders, real estate developers, and agencies worldwide.",
  keywords: [
    "performance marketing",
    "growth strategist",
    "UX UI designer",
    "web developer",
    "UAE real estate marketing",
    "freelance digital marketer Dubai",
  ],
  openGraph: {
    title: "Bilal Shafqat — Growth Strategist, Performance Marketer & Digital Builder",
    description:
      "Bridging marketing leadership with hands-on design, development, and AI. Available for freelance, consulting, and full-time growth roles.",
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
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
