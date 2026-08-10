"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroWordmarkTest() {
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const statBadgesRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  // Scroll-driven width expand on the visual panel (same mechanism as the live Hero).
  useGSAP(
    () => {
      if (!frameRef.current) return;
      const tween = gsap.to(frameRef.current, {
        width: "100%",
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top 95%",
          end: "top 15%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: heroRef }
  );

  // One-time load-in entrance animation, gated on the hero photo being loaded.
  useGSAP(
    () => {
      const animatedEls = [wordmarkRef.current, photoRef.current, statBadgesRef.current].filter(
        Boolean
      ) as Element[];

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(animatedEls, { clearProps: "all" });
        return;
      }

      if (!imageLoaded) return;

      gsap.set(animatedEls, { willChange: "filter, transform, opacity" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => gsap.set(animatedEls, { willChange: "auto" }),
      });

      tl.set(wordmarkRef.current, { scale: 0.6, opacity: 0 })
        .set(photoRef.current, { filter: "blur(30px)", opacity: 0, scale: 0.94 })
        .set(statBadgesRef.current, { filter: "blur(20px)", opacity: 0, y: 12 })
        // Step 1 — wordmark reveal
        .to(wordmarkRef.current, { scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" })
        // Step 2 — photo focus-in
        .to(photoRef.current, {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: "power2.out",
        })
        // Step 3 — stat badges reveal, overlapping slightly with step 2
        .to(statBadgesRef.current, { filter: "blur(0px)", opacity: 1, y: 0, duration: 0.55 }, "<0.45");
    },
    { scope: heroRef, dependencies: [imageLoaded] }
  );

  return (
    <div ref={heroRef}>
      <section className="relative overflow-hidden bg-bg text-ink py-10">
        <div className="pointer-events-none absolute inset-0 grid-fade" />

        {/* Visual panel: giant wordmark behind the photo, starts at 90% width, expands to 100% on scroll */}
        <div
          ref={frameRef}
          className="relative mx-auto overflow-hidden"
          style={{ width: "90%", borderRadius: "1.75rem" }}
        >
          <div className="relative min-h-[440px] bg-bg-soft sm:min-h-[520px]">
            <div
              ref={wordmarkRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden select-none items-center justify-center overflow-hidden sm:flex"
            >
              <span
                className="font-black leading-none text-gold/90"
                style={{ fontSize: "clamp(6rem, 32vw, 30rem)" }}
              >
                BILAL
              </span>
            </div>

            <div
              ref={photoRef}
              className="absolute inset-y-0 left-1/2 z-10 w-full -translate-x-1/2 overflow-hidden sm:w-[46%]"
            >
              <Image
                src="/images/bilal-shirt.avif"
                alt="Bilal Shafqat"
                fill
                priority
                className="object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            <div
              ref={statBadgesRef}
              className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2"
            >
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                15+ Years
              </span>
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                Dubai, UAE
              </span>
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                6 Services, One Partner
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
