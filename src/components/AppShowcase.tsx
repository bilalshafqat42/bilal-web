"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { Capture } from "@/data/caseStudies";

/**
 * Cross-platform app showcase: two device frames, a screen selector, and the
 * user journey told one screen at a time.
 *
 * Layout follows the brief exactly. At desktop both platforms are shown at
 * once, iOS left and Android right, because the whole claim being made is "one
 * codebase, both platforms" and showing them together is the evidence. Below
 * `lg` there is not room for two phones side by side, so a toggle replaces
 * them and iOS is the default.
 *
 * On the captures, stated plainly because it shapes the component: there is one
 * set and it was taken on iOS. That is not a gap being hidden — a React Native
 * app renders the same component tree on both platforms, so the screens really
 * are the same. What differs is the OS chrome, so each frame draws its own
 * (Dynamic Island for iOS, punch-hole for Android) *over* the capture's own
 * status bar. Without that overlay an iPhone status bar would show through
 * inside the Android frame, which would be a visible lie about where the
 * screenshot came from.
 */
export type AppScreen = {
  key: string;
  label: string;
  journey: string;
  capture: Capture;
};

type Platform = "ios" | "android";

/** One phone. The screen area is a fixed height with the capture scrolling
 *  inside it, so a 2622px screen and a 5807px scroll both sit in a frame of the
 *  same size — otherwise the two-up desktop layout would go ragged. */
function DeviceFrame({
  platform,
  screen,
  active,
}: {
  platform: Platform;
  screen: AppScreen;
  /** Drives `loading`: only the visible frame's image should be eager. */
  active: boolean;
}) {
  const isIos = platform === "ios";
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div
        className={`relative border-[3px] border-white/12 bg-[#0b0b0d] p-2 shadow-2xl shadow-black/50 ${
          isIos ? "rounded-[2.75rem]" : "rounded-[1.75rem]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-black ${
            isIos ? "rounded-[2.25rem]" : "rounded-[1.25rem]"
          }`}
        >
          {/* Sits over the capture's own status bar — see the note above. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-center bg-black">
            {isIos ? (
              <span className="h-[18px] w-[74px] rounded-full bg-[#0b0b0d]" />
            ) : (
              <span className="h-[11px] w-[11px] rounded-full bg-[#0b0b0d]" />
            )}
          </div>

          <div className="no-scrollbar h-[440px] overflow-y-auto sm:h-[500px]">
            <Image
              src={screen.capture.src}
              alt={screen.capture.alt}
              width={screen.capture.width}
              height={screen.capture.height}
              sizes="300px"
              loading={active ? "eager" : "lazy"}
              className="w-full"
            />
          </div>

          {/* Gesture affordance, different shape per platform. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-6 items-end justify-center bg-gradient-to-t from-black to-transparent pb-1.5">
            <span
              className={`rounded-full bg-white/35 ${isIos ? "h-1 w-24" : "h-1 w-16"}`}
            />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        {isIos ? "iOS" : "Android"}
      </figcaption>
    </figure>
  );
}

export default function AppShowcase({ screens }: { screens: AppScreen[] }) {
  const [active, setActive] = useState(0);
  const [platform, setPlatform] = useState<Platform>("ios");
  const panelId = useId();
  const screen = screens[active];

  return (
    <div className="mt-12">
      {/* Screen selector. Buttons with `aria-pressed` rather than a tablist:
          these switch what one region shows, and a real tablist would promise
          arrow-key navigation between panels that do not exist. */}
      <div className="flex flex-wrap justify-center gap-2.5" role="group" aria-label="Choose a screen">
        {screens.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={on}
              aria-controls={panelId}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                on
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/30 hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Platform toggle: only below lg, where there is no room for two phones.
          Hidden rather than disabled at desktop, because both frames are
          already visible there and a control that changes nothing is noise. */}
      <div className="mt-7 flex justify-center lg:hidden">
        <div className="inline-flex rounded-full border border-border bg-surface/60 p-1" role="group" aria-label="Choose a platform">
          {(["ios", "android"] as const).map((pf) => {
            const on = platform === pf;
            return (
              <button
                key={pf}
                type="button"
                onClick={() => setPlatform(pf)}
                aria-pressed={on}
                className={`rounded-full px-5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${
                  on ? "bg-gold text-[#14140f]" : "text-muted"
                }`}
              >
                {pf === "ios" ? "iOS" : "Android"}
              </button>
            );
          })}
        </div>
      </div>

      <div id={panelId} className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-10">
        {/* Mobile shows whichever the toggle selects; desktop shows both. */}
        <div className={platform === "ios" ? "" : "hidden lg:block"}>
          <DeviceFrame platform="ios" screen={screen} active={platform === "ios"} />
        </div>
        <div className={platform === "android" ? "" : "hidden lg:block"}>
          <DeviceFrame platform="android" screen={screen} active={platform === "android"} />
        </div>
      </div>

      {/* The journey, one screen at a time. `aria-live` because the text swaps
          under the same heading when a different screen is chosen, and a
          screen-reader user who pressed a button should hear the result. */}
      <div className="mx-auto mt-12 max-w-2xl text-center" aria-live="polite">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
          {screen.label}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{screen.journey}</p>
      </div>
    </div>
  );
}
