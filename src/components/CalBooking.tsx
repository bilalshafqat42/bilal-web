"use client";

import { useEffect, useRef } from "react";

/**
 * Cal.com embed for the booking page.
 *
 * Chosen over Google Calendar appointment schedules for one reason that
 * decides it: prefill. The qualification answers collected on this page can be
 * passed into the booking so they arrive in the notes before the call. Google's
 * appointment schedule is an iframe with no way to carry custom values in.
 *
 * Cal's free tier covers what this page promises — availability read from a
 * connected calendar, confirmation to both sides, a calendar invite, and a
 * reminder — so nothing here depends on a paid plan.
 *
 * Loaded only when `NEXT_PUBLIC_CALCOM_LINK` is set. Until then the page keeps
 * its existing request flow, because removing that first would leave thirteen
 * primary CTAs pointing at a page with no way to book anything at all.
 *
 * The script is injected rather than imported so that a site with no Cal link
 * configured ships none of it.
 */
type Props = {
  /** e.g. "bilalshafqat/30min" — the Cal.com event-type path. */
  link: string;
  /** Carried into the booking notes so the answers arrive before the call. */
  prefill: { name?: string; email?: string; notes?: string };
};

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { ns?: Record<string, unknown>; loaded?: boolean };
  }
}

export default function CalBooking({ link, prefill }: Props) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Cal's official loader snippet, inlined. It defines the queue before the
    // remote script arrives so calls made now are replayed once it loads.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (C: any, A: string, L: string) {
      const p = (a: any, ar: unknown) => a.q.push(ar);
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: unknown[]) {
          const cal = C.Cal;
          const ar = args;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement("script");
            s.src = A;
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function (...a: unknown[]) {
              p(api, a);
            };
            api.q = api.q || [];
            // Cal ships this as a ternary used for its side effects. Written
            // out, because a ternary evaluated as a statement is the kind of
            // line that reads as a mistake every time anyone opens the file.
            const namespace = ar[1];
            if (typeof namespace === "string") {
              cal.ns[namespace] = api;
              p(api, ar);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    /* eslint-enable @typescript-eslint/no-explicit-any */

    window.Cal?.("init", { origin: "https://cal.com" });
    window.Cal?.("inline", {
      elementOrSelector: "#cal-booking",
      calLink: link,
      config: {
        // The site is dark, so an embed in the default light theme would look
        // like a third-party panel dropped onto the page.
        theme: "dark",
        ...prefill,
      },
    });
    window.Cal?.("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, [link, prefill]);

  return (
    <div
      id="cal-booking"
      // Reserves height before the embed loads, so the page does not jump when
      // the calendar arrives.
      className="min-h-[560px] w-full overflow-hidden rounded-2xl border border-border bg-surface/40"
    />
  );
}
