import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CaseStudies from "@/components/CaseStudies";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies — Bilal Shafqat",
  description:
    "Detailed case studies across paid marketing, real estate lead generation, MERN stack development, and mobile app launches, with real goals, execution, and outcomes.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-28">
        <section className="site-container">
          <Link
            href="/portfolio/leos-developments"
            className="card-hover group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border panel px-7 py-6"
          >
            <span>
              <span className="text-xs font-medium uppercase tracking-wide text-gold">
                Featured case study
              </span>
              <span className="mt-1.5 block text-xl font-semibold text-ink">
                LEOS Developments — website, brand social &amp; the Hadley Heights launch
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              View case study →
            </span>
          </Link>
        </section>
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
