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
          <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            {eyebrow}
          </span>
        ) : null}
        <Heading
          className={
            // An h1 is the page title and takes the site-wide h1 size; the same
            // component used as a section h2 takes the section size. Without
            // this split, /portfolio and /process shipped a 36px h1 while every
            // other page had 56px.
            Heading === "h1"
              ? "mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
              : "mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
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
