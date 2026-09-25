"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { trackSchedule } from "@/lib/analytics";
import { megaMenuGroups } from "@/data/pillars";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/data/leadOptions";
import CalBooking from "@/components/CalBooking";
/** The service categories, read from the same data the nav, /services and
 *  llms.txt use. Hard-coding a parallel list here is how it would quietly drift
 *  out of step the next time a category is renamed — which is exactly what
 *  happened to the "eight services" copy this comment used to repeat.
 *
 *  Budget bands come from `leadOptions.ts` and are bands, not prices: they exist
 *  so a first call starts from a shared ballpark instead of discovering in
 *  minute twenty that the scope and the budget were never in the same range. */
const SERVICES = megaMenuGroups.map((g) => g.title);

/** The Cal.com event-type path, e.g. "bilalshafqat/30min". Set in `.env.local`
 *  and on Hostinger (item 174), so the calendar is the live path. Unset, the
 *  panel degrades to a route into `/contact` rather than to the generated slot
 *  picker it used to carry — see the note at the bottom of this file. */
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

export default function AppointmentBooking() {
  const [topic, setTopic] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  // The Cal.com embed pulls roughly 4.9MB of third-party JavaScript. That is
  // about six times the weight of the page's own code, and it used to arrive
  // for everyone who opened the page, including the majority who came to read
  // the FAQs beside it and never book. It now loads when someone asks for it.
  const [showCal, setShowCal] = useState(false);

  // The three qualification answers. They sit ahead of the calendar so they can
  // be carried into the booking notes and arrive before the call.
  const qualification = (
    // Two columns, with the service select spanning both.
    //
    // Three equal columns inside a 520px panel gave each select 141px, and the
    // option text does not fit: the longest service is "Digital Marketing &
    // Outreach" at 28 characters and the longest timeline "Just exploring for
    // now" at 22, so every dropdown rendered truncated. A native select cannot
    // wrap or ellipsis its way out of that — the only fix is width.
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="topic" className="text-sm font-medium text-ink">
          What is it about?
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold/50 [color-scheme:dark]"
        >
          {SERVICES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="budget" className="text-sm font-medium text-ink">
          Rough budget
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          disabled={BUDGET_OPTIONS.length === 0}
          aria-describedby={BUDGET_OPTIONS.length === 0 ? "budget-note" : undefined}
          className="mt-2 w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold/50 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]"
        >
          {BUDGET_OPTIONS.length === 0 ? (
            <option value="">Not collected yet</option>
          ) : (
            BUDGET_OPTIONS.map((t) => <option key={t}>{t}</option>)
          )}
        </select>
        {BUDGET_OPTIONS.length === 0 ? (
          <p id="budget-note" className="mt-1.5 text-xs text-muted/70">
            We&apos;ll cover this on the call.
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="timeline" className="text-sm font-medium text-ink">
          Timeline
        </label>
        <select
          id="timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold/50 [color-scheme:dark]"
        >
          {TIMELINE_OPTIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );

  if (CAL_LINK) {
    const notes = [
      `Service: ${topic}`,
      budget ? `Budget: ${budget}` : null,
      `Timeline: ${timeline}`,
    ]
      .filter(Boolean)
      .join("\n");

    return (
      <div className="glass-strong rounded-2xl border border-border p-6 sm:p-8">
        <h2 className="t-h3 text-ink">
          Book your 30-minute clarity call
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Thirty minutes on your goals, your current setup and what the honest path forward looks
          like. No deck, no pitch, and no obligation afterwards.
        </p>

        {qualification}

        {/* Keyed on the answers so the embed picks them up when they change.
            They are selects, not text inputs, so this remounts a handful of
            times at most rather than on every keystroke.

            Mounted on request rather than on page load. Cal.com is ~4.9MB of
            third-party JavaScript and most visitors to this page read the
            questions beside it without ever opening the calendar. Answering
            the three selects first also means the embed mounts once, already
            carrying the answers, instead of remounting as they change. */}
        <div className="mt-7">
          {showCal ? (
            <CalBooking
              key={notes}
              link={CAL_LINK}
              prefill={{ notes }}
              // The booking conversion. `trackSchedule` used to live in the
              // submit handler of the request flow this embed replaced, so
              // while Cal has been live `schedule_call` and Meta's `Schedule`
              // recorded nothing at all — on the page every primary CTA points
              // at (roadmap 213.1).
              //
              // `topic` is read at fire time rather than captured, which is why
              // CalBooking holds the handler in a ref.
              onBooked={() => trackSchedule("appointment-page", topic)}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowCal(true)}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Show available times
                <ArrowRight size={16} />
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Opens my live calendar. Monday to Friday, 9am to 6pm Dubai time.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // No Cal link configured. This used to fall back to ~200 lines that
  // generated 09:00-17:30 slots and collected a *preference* rather than a
  // booking — the flow Cal.com replaced in item 174. It has been unreachable
  // since `NEXT_PUBLIC_CALCOM_LINK` was set, and the comment that justified
  // keeping it claimed its hours matched the footer, which said 9am to 6pm.
  // Deleted 2026-09-24 (roadmap 213.13).
  //
  // What stays is a real route to a conversation, so an unset variable
  // degrades to something honest rather than to a page that cannot book.
  return (
    <div className="glass-strong rounded-2xl border border-border p-6 sm:p-8">
      <h2 className="t-h3 text-ink">
        Book your 30-minute clarity call
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted">
        Thirty minutes on your goals, your current setup and what the honest path forward looks
        like. No deck, no pitch, and no obligation afterwards.
      </p>

      {qualification}

      <p className="mt-7 text-sm leading-relaxed text-muted">
        The live calendar is not available right now. Send the details instead and I will come
        back with times that work, usually the same working day.
      </p>
      <Link
        href="/contact#enquiry"
        className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
      >
        Send me the details <ArrowRight size={16} />
      </Link>
    </div>
  );
}
