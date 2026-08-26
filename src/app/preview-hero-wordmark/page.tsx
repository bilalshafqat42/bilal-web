import type { Metadata } from "next";
import HeroWordmarkTest from "@/components/HeroWordmarkTest";

// Internal design-comparison route, not part of the public site. Kept out of
// the index so it can't compete with the real homepage as duplicate content.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewHeroWordmarkPage() {
  return (
    <main>
      <HeroWordmarkTest />
    </main>
  );
}
