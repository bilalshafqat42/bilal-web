import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ClientLogoRow from "./ClientLogoRow";

/**
 * The full "Trusted Across UK & UAE Real Estate" section.
 *
 * As of the homepage refactor this is the intro to `/portfolio` rather than a
 * homepage section — the homepage now shows only the logo row, inside the
 * merged proof section, so the same offer is not made three times.
 *
 * The logos themselves moved to `ClientLogoRow`, which renders them here in
 * exactly the layout they had before. This file is now just the framing around
 * them.
 */
export default function LogoWall() {
  return (
    <section id="companies" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="site-container">
        <SectionHeading
          eyebrow="Companies I've Worked With"
          title="Trusted Across"
          highlight="UK & UAE Real Estate"
          description="Property developers in the UK and UAE, across corporate websites, off-plan launch campaigns, and the brand work around them."
        />

        <ClientLogoRow className="mt-14" />

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
          >
            View full case studies <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
