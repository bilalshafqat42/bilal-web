import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CaseStudies from "@/components/CaseStudies";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies — Bilal Shafqat",
  description:
    "Detailed case studies across paid marketing, real estate lead generation, MERN stack development, and mobile app launches, with real goals, execution, and outcomes.",
};

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-28">
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
