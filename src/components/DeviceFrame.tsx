import Image from "next/image";
import { BatteryFull, SignalHigh, Wifi } from "lucide-react";
import type { Capture } from "@/data/caseStudies";

/**
 * A phone in a device frame, with drawn chrome.
 *
 * Extracted from `AppShowcase` so the project detail pages can use the same
 * frame for their mobile landing-page captures. Previously those used the
 * plainer `CaptureFrame`, which draws a generic bezel with no status bar.
 *
 * Proportions are 1:2.17, which is what a phone of this class actually is. An
 * earlier version used a fixed height against a fixed width and came out at
 * 1:1.67 — tablet proportions, and it read as an iPad.
 *
 * The status bar is drawn, not revealed, and that is deliberate. Captures carry
 * their own OS status bar, so uncovering it would show iPhone chrome inside an
 * Android frame. This paints over that strip and supplies each platform's own
 * furniture instead. The cover is a fixed 36px in both platforms — it has to
 * hide the *capture's* bar, which is the same height regardless of which frame
 * surrounds it, and sizing it to Android's shorter bar once left the Dynamic
 * Island peeking out below.
 *
 * The time is static. A live clock renders one value on the server and another
 * in the browser, which is a hydration mismatch, and a mockup gains nothing
 * from a real time.
 *
 * Server component: nothing here is interactive.
 */
export default function DeviceFrame({
  capture,
  platform = "ios",
  caption,
  eager = false,
}: {
  capture: Capture;
  platform?: "ios" | "android";
  /** Shown under the frame. Omit for no caption. */
  caption?: string;
  eager?: boolean;
}) {
  const isIos = platform === "ios";
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div
        className={`relative border-white/12 bg-[#0b0b0d] shadow-2xl shadow-black/50 ${
          isIos ? "rounded-[2.9rem] border-[4px] p-[7px]" : "rounded-[2.1rem] border-[3px] p-[5px]"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-black ${
            isIos ? "rounded-[2.45rem]" : "rounded-[1.75rem]"
          }`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[36px] bg-black">
            <span
              className={`absolute left-1/2 top-[7px] -translate-x-1/2 rounded-full bg-[#08080b] ${
                isIos ? "h-[19px] w-[68px]" : "h-[10px] w-[10px]"
              }`}
            />
            <div
              className={`absolute inset-x-0 top-0 flex items-center justify-between text-white/90 ${
                isIos
                  ? "h-[34px] px-[18px] text-[10px] font-semibold"
                  : "h-[28px] px-[11px] text-[9px] font-medium"
              }`}
            >
              <span className="tabular-nums">9:41</span>
              <span className="flex items-center gap-[3px]">
                <SignalHigh size={isIos ? 11 : 10} strokeWidth={2.5} />
                <Wifi size={isIos ? 10 : 9} strokeWidth={2.5} />
                <BatteryFull size={isIos ? 14 : 12} strokeWidth={2} />
              </span>
            </div>
          </div>

          <div
            className={`no-scrollbar overflow-y-auto ${
              isIos ? "aspect-[1206/2622]" : "aspect-[1440/3120]"
            }`}
          >
            <Image
              src={capture.src}
              alt={capture.alt}
              width={capture.width}
              height={capture.height}
              sizes="300px"
              loading={eager ? "eager" : "lazy"}
              className="w-full"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-6 items-end justify-center bg-gradient-to-t from-black to-transparent pb-1.5">
            <span className={`rounded-full bg-white/35 ${isIos ? "h-1 w-24" : "h-1 w-16"}`} />
          </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
