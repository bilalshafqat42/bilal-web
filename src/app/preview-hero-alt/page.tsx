import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HeroAlt from "@/components/HeroAlt";

// Internal design-comparison route, not part of the public site. Kept out of
// the index so it can't compete with the real homepage as duplicate content.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewHeroAltPage() {
  return (
    <main>
      <Nav />
      <div className="bg-bg-soft px-6 py-3 text-center text-xs uppercase tracking-wide text-muted">
        Current Hero (live on the homepage)
      </div>
      <Hero />

      <div className="bg-[#e8e2d8] px-6 py-3 text-center text-xs uppercase tracking-wide text-black/50">
        New Hero concept — for comparison only, not live anywhere else
      </div>
      <HeroAlt />
    </main>
  );
}
