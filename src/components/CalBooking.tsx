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
  /**
   * Fired once Cal confirms a booking.
   *
   * This is the only signal a booking happened. The page's own submit handler
   * was replaced by this embed, and with it went the `trackSchedule()` call —
   * so from the day `NEXT_PUBLIC_CALCOM_LINK` was set until this was added,
   * every primary CTA on the site led to a conversion nothing recorded.
   */
  onBooked?: () => void;
};

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & { ns?: Record<string, unknown>; loaded?: boolean };
  }
}

/** Cal offers exactly three: month_view, week_view, column_view. None of them
 *  is a multi-column grid of times — the slot list is a single column in all
 *  three, and it renders inside a cross-origin iframe on app.cal.com, so it
 *  cannot be restyled from this page at all.
 *
 *  This value is also close to decorative. Tested on 2026-09-15 with the
 *  property correctly placed in the `inline` config (it was in the `ui` call
 *  before, where it did nothing): all three layouts produced an identical
 *  1,251px frame rendering the month view. The event type's own **Appearance**
 *  setting in the Cal dashboard wins over anything sent from the embed, so the
 *  layout is changed there, not here. Kept so the next person does not repeat
 *  the experiment. */
const LAYOUT = "month_view" as const;

export default function CalBooking({ link, prefill, onBooked }: Props) {
  const mounted = useRef(false);
  // Held in a ref so the one-shot effect below always calls the current
  // handler. The effect deliberately runs once — re-registering Cal's callback
  // on every render would fire the conversion several times for one booking.
  const onBookedRef = useRef(onBooked);
  onBookedRef.current = onBooked;

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
        // `layout` belongs here, in the inline config. Setting it only on the
        // `ui` call below did nothing at all: month_view, week_view and
        // column_view all produced an identical 1,251px frame, which is what
        // gave the false impression that column_view was broken.
        layout: LAYOUT,
        ...prefill,
      },
    });
    // The conversion. `bookingSuccessful` is Cal's own confirmation that a slot
    // was actually taken, so this counts bookings rather than button presses —
    // the same rule the form handlers follow.
    //
    // Registered before `ui` rather than after because Cal replays its queue in
    // order, and a callback queued after the embed has already rendered can
    // miss an immediate booking.
    window.Cal?.("on", {
      action: "bookingSuccessful",
      callback: () => onBookedRef.current?.(),
    });

    window.Cal?.("ui", {
      theme: "dark",
      // The panel above the embed already carries the title, the description,
      // the duration and the timezone. Left on, Cal repeats all four inside the
      // frame, so a visitor read the same paragraph twice in a row and the
      // frame carried ~300px of duplicate header.
      hideEventTypeDetails: true,
      layout: LAYOUT,
    });
  }, [link, prefill]);

  return (
    <div
      id="cal-booking"
      // Fixed height with an internal scroll, not `min-h` with auto growth.
      //
      // Cal's month view stacks the whole day's slot list under the calendar —
      // sixteen rows for a 09:00-17:30 day — and sizes its iframe to that
      // content. Measured, the iframe came out at 1,532px in a 440px panel and
      // 1,767px at 692px wide, because widening the panel does not move the
      // slots beside the calendar at any width this layout can give it. That
      // dragged the page past 3,000px for what is a single booking form.
      //
      // Capping the frame and scrolling inside it is what Cal's own booking
      // page does with its slot column, so the interaction is the one people
      // already know.
      className="h-[620px] w-full overflow-y-auto overflow-x-hidden rounded-2xl border border-border bg-surface/40"
    />
  );
}
