import type { Metadata } from "next";
import HeroYellowTest from "@/components/HeroYellowTest";

// Internal design-comparison route, not part of the public site. Kept out of
// the index so it can't compete with the real homepage as duplicate content.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewHeroYellowPage() {
  return (
    <main>
      <HeroYellowTest />
      <div style={{ height: "150vh" }} className="bg-bg" />
    </main>
  );
}
