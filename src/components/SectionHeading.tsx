import Reveal from "./Reveal";
import Eyebrow from "@/components/Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  /** Every page needs exactly one <h1>. A page whose only heading comes from
   *  this component (e.g. /portfolio) must pass as="h1", or it ships with none —
   *  which is exactly the defect Bing's site scan reported. */
  as?: "h1" | "h2";
};

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  // Default changed to "left" on 2026-10-06. Measured at 1440: every section
  // heading on the homepage sat at x=40 except "Work that shipped" at x=336,
  // because this defaulted to centre and most callers never pass `align`. Three
  // different left edges on one page is what Bilal spotted on /pricing, and
  // this component was one of the two causes. Centring is still available; it
  // now has to be asked for, which is the right way round for a default.
  align = "left",
  as: Heading = "h2",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <Reveal className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      <div>
        {eyebrow ? (
          <Eyebrow>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Heading
          className={
            // An h1 is the page title and takes the h1 step; the same component
            // used as a section title takes the h2 step. Without this split,
            // /portfolio and /process shipped a section-sized h1 while every
            // other page had a page-sized one.
            //
            // The size itself lives in the scale in `globals.css`, not here.
            // These used to be two hard-coded strings, which is how this
            // component ended up half a step out from headings written inline
            // elsewhere.
            Heading === "h1" ? "t-h1 mt-4 text-ink" : "t-h2 mt-4 text-ink"
          }
        >
          {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
        </Heading>
        {description ? (
          <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">{description}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
