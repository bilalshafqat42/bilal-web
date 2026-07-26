import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <Reveal className={`max-w-2xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      <div>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="mt-5 text-3xl sm:text-4xl font-semibold leading-tight text-ink">
          {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
        </h2>
        {description ? (
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">{description}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
