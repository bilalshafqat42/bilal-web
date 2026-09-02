import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  BackdropGrid,
  BackdropAurora,
  BackdropBeams,
  BackdropContours,
} from "@/components/backdrops";

export const metadata: Metadata = {
  title: "Backdrop options",
  // An internal comparison page. It would rank for nothing, and letting it into
  // the index would put four near-duplicate copies of the homepage headline
  // into search results against the homepage itself.
  robots: { index: false, follow: false },
};

/** Each option rendered behind the real hero copy, at the real column widths.
 *  Comparing them against placeholder text would be useless: the whole question
 *  is whether the backdrop competes with this headline. */
const OPTIONS = [
  {
    id: "A",
    name: "Dot grid with pointer spotlight",
    note: "Currently live. Dots brighten around the cursor. Linear's approach.",
    Backdrop: BackdropGrid,
  },
  {
    id: "B",
    name: "Aurora",
    note: "Three blurred masses drifting on unrelated periods. Warmest and softest of the four.",
    Backdrop: BackdropAurora,
  },
  {
    id: "C",
    name: "Light beams",
    note: "Shafts descending from top-left over a fine line grid. Most directional.",
    Backdrop: BackdropBeams,
  },
  {
    id: "D",
    name: "Contours",
    note: "Concentric topographic rings with a slow shimmer. Most distinctive, cheapest to render.",
    Backdrop: BackdropContours,
  },
];

export default function PreviewBackdropPage() {
  return (
    <main className="bg-bg">
      <div className="mx-auto max-w-3xl px-6 pb-10 pt-16">
        <h1 className="text-2xl font-bold text-ink">Hero backdrop options</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Each option sits behind the real headline at the real column widths. Move your mouse across
          option A to see the spotlight. Scroll to compare.
        </p>
      </div>

      {OPTIONS.map(({ id, name, note, Backdrop }) => (
        <section key={id} className="relative overflow-hidden border-t border-border bg-bg">
          <div className="relative z-10 mx-auto max-w-[1400px] px-6">
            <div className="pt-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                Option {id}
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{name}</p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted">{note}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 pb-24 pt-16 lg:grid-cols-[7fr_3fr] lg:gap-10">
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                15 years of marketing, design, and development experience, in{" "}
                <span className="underline decoration-gold decoration-4 underline-offset-8">
                  one senior partner
                </span>
              </h2>
              <div className="lg:pt-3">
                <p className="text-base leading-relaxed text-muted">
                  Direct access to senior-level expertise, no account managers, no junior staff, &amp;
                  no handoffs between departments. Trusted by businesses across the UAE for paid
                  marketing, web &amp; app development, design, &amp; automation, delivered personally
                  from strategy to launch.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <span className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
                    Book a free consultation <ArrowRight size={15} />
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink">
                    View my work
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Backdrop />
        </section>
      ))}
    </main>
  );
}
