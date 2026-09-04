"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";
import { processSteps as steps } from "@/data/process";

gsap.registerPlugin(ScrollTrigger, useGSAP);


export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // The trigger callback fires far more often than the index changes, so the
  // last value is kept in a ref to avoid setting state on every scroll tick.
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Pinning is desktop only. On a phone there is no room to hold a step in
      // place, and pinned sections there fight the browser's own scroll.
      // Reduced motion opts out entirely and gets the plain stacked list.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const trigger = ScrollTrigger.create({
            trigger: pinRef.current,
            start: "top top",
            // One viewport of scroll per transition, so each step gets an equal
            // share of the gesture rather than being sized by its own content.
            end: () => `+=${(steps.length - 1) * window.innerHeight}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (steps.length - 1),
              duration: { min: 0.2, max: 0.5 },
              ease: "power2.inOut",
              delay: 0.06,
            },
            onUpdate: (self) => {
              const i = Math.round(self.progress * (steps.length - 1));
              if (i !== activeRef.current) {
                activeRef.current = i;
                setActive(i);
              }
            },
          });
          return () => trigger.kill();
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // Runs on every step change: the copy lifts in, and the images crossfade.
  // Keyed on `active` rather than driven by scroll, so a snap and a jump both
  // animate identically.
  useGSAP(
    () => {
      if (copyRef.current) {
        gsap.fromTo(
          copyRef.current.children,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06, overwrite: true }
        );
      }
      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: i === active ? 1 : 0,
          scale: i === active ? 1 : 1.04,
          duration: 0.7,
          ease: "power2.out",
          overwrite: true,
        });
      });
    },
    { dependencies: [active], scope: sectionRef }
  );

  const current = steps[active];

  return (
    <section ref={sectionRef} id="process" className="relative bg-bg-soft/40 py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          // This is now the only heading on /process, so it has to be the h1.
          // SectionHeading defaults to h2, and without this the page shipped
          // with no h1 at all — the exact defect its own comment warns about
          // and the one Bing's site scan previously reported.
          as="h1"
          eyebrow="How I Work"
          title="A Structured Path From"
          highlight="Brief To Shipped Work"
          description="Whether it's a paid campaign, a website, or a custom application, every project follows the same clear process — from brief to launch to optimization."
        />
      </div>

      {/* Desktop: one step held in place at a time. */}
      <div ref={pinRef} className="process-pinned hidden lg:flex lg:h-screen lg:items-center">
        <div className="site-container w-full">
          <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-10 xl:gap-x-14">
            {/* Pagination rail. One segment per step, so position in the
                sequence is readable at a glance rather than inferred from a
                continuous bar. */}
            <div className="flex flex-col gap-2.5" aria-hidden="true">
              {steps.map((s, i) => (
                <span
                  key={s.step}
                  className={`w-0.5 rounded-full transition-all duration-500 ${
                    i === active ? "h-14 bg-gold" : "h-8 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <div ref={copyRef}>
              <p className="font-display text-sm tabular-nums text-gold">
                {current.step} <span className="text-muted">/ {steps[steps.length - 1].step}</span>
              </p>
              <h3 className="mt-4 text-4xl font-semibold leading-tight text-ink xl:text-5xl">
                {current.title}
              </h3>
              <p className="mt-3 text-lg text-muted">{current.subtitle}</p>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
                {current.description}
              </p>
              <ul className="mt-6 space-y-2.5">
                {current.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-base text-muted">
                    <span className="text-gold">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Images are stacked and crossfaded rather than swapped, so there
                is never a frame with no image while the next one decodes. */}
            <div className="relative aspect-[4/3] max-h-[58vh] w-full overflow-hidden rounded-2xl border border-border bg-bg">
              {steps.map((s, i) => (
                <div
                  key={s.step}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="42vw"
                    priority={i === 0}
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and reduced motion: the same content as a plain stacked list,
          no pinning, nothing to get stuck behind. */}
      <div className="process-stacked site-container mt-14 lg:hidden">
        {steps.map((s, i) => (
          <div key={s.step} className={i === steps.length - 1 ? "" : "mb-16"}>
            <p className="font-display text-sm tabular-nums text-gold">
              {s.step} <span className="text-muted">/ {steps[steps.length - 1].step}</span>
            </p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight text-ink">{s.title}</h3>
            <p className="mt-2 text-lg text-muted">{s.subtitle}</p>
            <div className="relative mt-6 aspect-[16/11] overflow-hidden rounded-2xl border border-border">
              <Image src={s.image} alt={s.alt} fill sizes="92vw" className="object-cover object-top" />
            </div>
            <p className="mt-6 text-base leading-relaxed text-muted">{s.description}</p>
            <ul className="mt-5 space-y-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-base text-muted">
                  <span className="text-gold">—</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
