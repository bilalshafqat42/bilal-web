import Reveal from "./Reveal";

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
  align = "center",
  as: Heading = "h2",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <Reveal className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      <div>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
            {eyebrow}
          </span>
        ) : null}
        <Heading className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
          {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
        </Heading>
        {description ? (
          <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">{description}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
