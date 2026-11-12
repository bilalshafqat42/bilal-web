import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ShowcaseBlock } from "@/data/caseStudies";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import DeviceFrame from "@/components/portfolio/DeviceFrame";

/**
 * The case-study sections a scope list cannot carry: the booking flow drawn
 * as steps, real screens with the reasoning beside them, the system behind
 * the site as a diagram, the automation as a timeline, and work still to come.
 *
 * Added 2026-11-12 for Homemaid, from the Version 1 design Bilal approved on
 * the canvas. The client template rendered every case study as scope cards,
 * captures, creatives and prose, so the parts that show how a product works,
 * which is what a UX reader looks for, had nowhere to go. Data-driven so any
 * later case study can use the same blocks without touching this file.
 *
 * Server component. Every value it shows comes from `caseStudies.ts`, where
 * the rule is the same as everywhere else on the page: only facts that can be
 * checked against the live site or the code, and no results without the
 * client's figures.
 */

function Head({ eyebrow, heading, body }: { eyebrow: string; heading: string; body?: string }) {
  return (
    <Reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="t-h2 mt-4 text-ink">{heading}</h2>
      {body ? <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{body}</p> : null}
    </Reveal>
  );
}

function Points({ points }: { points: { title: string; body: string }[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {points.map((p) => (
        <div key={p.title} className="h-full r-card surface-1 p-6">
          <h3 className="t-h5 text-ink">{p.title}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>
  );
}

function Block({ block }: { block: ShowcaseBlock }) {
  switch (block.kind) {
    case "stats":
      return (
        <Reveal>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {block.items.map((s) => (
              <div key={s.label} className="r-card surface-1 p-6">
                <dd className="t-h2 text-gold">{s.value}</dd>
                <dt className="mt-2 text-sm text-muted leading-relaxed">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      );

    case "flow":
      return (
        <>
          <Head eyebrow={block.eyebrow} heading={block.heading} body={block.body} />
          <Reveal delay={0.05}>
            <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
              {block.steps.map((step, i) => {
                const last = i === block.steps.length - 1;
                return (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                        last ? "bg-gold text-[#14140f]" : "border border-border text-ink"
                      }`}
                    >
                      {step}
                    </span>
                    {last ? null : <ArrowRight size={15} aria-hidden="true" className="text-muted" />}
                  </li>
                );
              })}
            </ol>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">
            {block.screens.map((s) => (
              <Reveal key={s.src}>
                <DeviceFrame capture={s} caption={s.label} />
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-6">
                {block.notes.map((n) => (
                  <div key={n.title}>
                    <h3 className="t-h5 text-ink">{n.title}</h3>
                    <p className="mt-2 text-base text-muted leading-relaxed">{n.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </>
      );

    case "screens":
      return (
        <>
          <Head eyebrow={block.eyebrow} heading={block.heading} body={block.body} />
          <Reveal delay={0.05}>
            <div
              className={`mt-10 grid grid-cols-1 items-start gap-8 ${
                block.desktop && block.phone ? "lg:grid-cols-[70fr_30fr] lg:gap-10" : ""
              }`}
            >
              {block.desktop ? (
                <figure className="overflow-hidden r-card border border-border">
                  <Image
                    src={block.desktop.src}
                    width={block.desktop.width}
                    height={block.desktop.height}
                    alt={block.desktop.alt}
                    sizes="(min-width: 1024px) 840px, 100vw"
                    className="h-auto w-full"
                  />
                </figure>
              ) : null}
              {block.phone ? <DeviceFrame capture={block.phone} caption={block.phone.label} /> : null}
            </div>
          </Reveal>
          {block.points ? <Points points={block.points} /> : null}
        </>
      );

    case "architecture":
      return (
        <>
          <Head eyebrow={block.eyebrow} heading={block.heading} body={block.body} />
          <Reveal delay={0.05}>
            <div className="mt-10 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
              <ul className="flex flex-col gap-3">
                {block.clients.map((x) => (
                  <li key={x} className="r-card border border-border px-4 py-4 text-center font-semibold text-ink">
                    {x}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center rounded-2xl bg-gold px-6 py-8 text-center text-xl font-extrabold text-[#14140f]">
                {block.hub}
              </div>
              <ul className="flex flex-col gap-3">
                {block.services.map((x) => (
                  <li key={x} className="r-card border border-border px-4 py-4 text-center font-semibold text-ink">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          {block.points ? <Points points={block.points} /> : null}
        </>
      );

    case "timeline":
      return (
        <>
          <Head eyebrow={block.eyebrow} heading={block.heading} body={block.body} />
          <Reveal delay={0.05}>
            <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {block.items.map((t) => (
                <li key={t.title} className="h-full r-card surface-1 p-5">
                  <Eyebrow size="sm">{t.when}</Eyebrow>
                  <h3 className="mt-3 text-base font-semibold text-ink">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{t.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </>
      );

    case "upcoming":
      return (
        <Reveal>
          <div className="r-card surface-1 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>{block.eyebrow}</Eyebrow>
              <span className="rounded-full border border-gold px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] text-gold">
                UPCOMING
              </span>
            </div>
            <h2 className="t-h3 mt-4 text-ink">{block.heading}</h2>
            <p className="mt-3 max-w-3xl text-lg text-muted leading-relaxed">{block.body}</p>
          </div>
        </Reveal>
      );
  }
}

/** Renders the blocks placed at one point in the page, each as its own section. */
export default function CaseStudyShowcase({
  blocks,
  at,
}: {
  blocks?: ShowcaseBlock[];
  at: ShowcaseBlock["at"];
}) {
  const here = (blocks ?? []).filter((b) => b.at === at);
  if (!here.length) return null;
  return (
    <>
      {here.map((block, i) => (
        <section key={`${block.kind}-${i}`} className="relative section">
          <div className="site-container">
            <Block block={block} />
          </div>
        </section>
      ))}
    </>
  );
}
