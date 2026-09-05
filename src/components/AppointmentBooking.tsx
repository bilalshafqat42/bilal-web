"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronRight, Loader2 } from "lucide-react";
import { getAttribution, getFacebookCookies } from "@/lib/attribution";
import { useRouter } from "next/navigation";
import { trackSchedule, generateEventId } from "@/lib/analytics";
import { megaMenuGroups } from "@/data/pillars";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/data/leadOptions";
import CalBooking from "@/components/CalBooking";

type Status = "idle" | "submitting" | "success" | "error";

/** Monday to Friday only, matching the UAE working week. Starts from today if
 *  today is a working day, otherwise from the next one. */
function workingDays(count: number) {
  const out: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (out.length < count) {
    const dow = cursor.getDay();
    if (dow >= 1 && dow <= 5) out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

// 09:00 to 17:30 Gulf Standard Time, which is the window stated in the footer.
const SLOTS = Array.from({ length: 18 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

/** Budget bands, not prices. They exist so a first call starts from a shared
 *  ballpark instead of discovering in minute twenty that the scope and the
 *  budget were never in the same range.
 *
 *  The boundaries follow the pricing model rather than being picked at random:
 *  an advisory session starts at 3,500, a retainer at 16,000 a month, a
 *  project at 31,500, and a website build at 47,500. "Not sure yet" is first
 *  on purpose — forcing a guess from someone who genuinely does not know only
 *  produces a wrong answer that then anchors the conversation. */


/** The eight service categories, read from the same data the nav, /services
 *  and llms.txt use. Hard-coding a parallel list here is how it would quietly
 *  drift out of step the next time a category is renamed. */
const SERVICES = megaMenuGroups.map((g) => g.title);

/** Set this to a Cal.com event-type path, e.g. "bilalshafqat/30min", and the
 *  page switches from collecting a time preference to taking a real booking.
 *  Left unset, nothing about the current flow changes. */
const CAL_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

export default function AppointmentBooking() {
  const router = useRouter();
  const days = useMemo(() => workingDays(10), []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const chosen = days[day];
  const chosenLabel = chosen
    ? chosen.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : "";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot) {
      setError("Pick a time first.");
      return;
    }
    setError("");
    setStatus("submitting");
    const botcheck = (new FormData(e.currentTarget).get("company") as string) || "";
    const eventId = generateEventId();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          botcheck,
          service: "Appointment request",
          // Discrete, so the route can check each against the list it came
          // from. The message below keeps them human-readable for the inbox.
          serviceInterest: topic,
          budget,
          timeline,
          message: `Requested a 30-minute call on ${chosenLabel} at ${slot} (GST, UTC+4).\nService: ${topic}${budget ? `\nBudget: ${budget}` : ""}\nTimeline: ${timeline}`,
          attribution: getAttribution(),
          eventId,
          ...getFacebookCookies(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Fired on confirmed delivery, so the count matches what reached the
        // CRM rather than counting button presses.
        trackSchedule("appointment-page", topic, eventId);
        setStatus("success");
        // The chosen slot travels with the redirect so the confirmation page can
        // still tell them what they asked for.
        router.push(
          `/thank-you?source=appointment&slot=${encodeURIComponent(`${chosenLabel} at ${slot}`)}`
        );
        return;
      }
      setError(data.error || "That did not go through. Try again, or email me directly.");
      setStatus("error");
    } catch {
      setError("That did not go through. Try again, or email me directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-strong rounded-2xl border border-border p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check size={22} />
        </span>
        <h2 className="mt-5 text-2xl font-semibold text-ink">Request sent</h2>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted">
          You asked for {chosenLabel} at {slot}. I confirm every call by email
          personally, usually the same working day, so treat this as requested
          rather than booked until you hear from me.
        </p>
        <Link
          href="/portfolio"
          className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
        >
          See my work while you wait <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // The three qualification answers, shared by both modes: they sit beside the
  // time picker in the request flow, and ahead of the calendar when Cal is
  // configured so they can be carried into the booking notes.
  const qualification = (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div>
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

  // Cal.com replaces the request flow the moment a link is configured. Until
  // then the existing flow stays: removing it first would leave thirteen
  // primary CTAs pointing at a page with no way to book anything.
  //
  // The disclaimer about "requested rather than booked" lives in the request
  // flow's success state, so it disappears with it rather than needing to be
  // deleted separately — it stops being true and stops being rendered at the
  // same moment.
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
        <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
          Book your 30-minute clarity call
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Thirty minutes on your goals, your current setup and what the honest path forward looks
          like. No deck, no pitch, and no obligation afterwards.
        </p>

        {qualification}

        {/* Keyed on the answers so the embed picks them up when they change.
            They are selects, not text inputs, so this remounts a handful of
            times at most rather than on every keystroke. */}
        <div className="mt-7">
          <CalBooking key={notes} link={CAL_LINK} prefill={{ notes }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-strong rounded-2xl border border-border p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src="/images/bilal-shirt.avif"
            alt="Bilal Shafqat"
            fill
            sizes="44px"
            className="object-cover"
            style={{ objectPosition: "center 18%" }}
          />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Bilal Shafqat</p>
          <p className="text-xs text-muted">Dubai · GST, UTC+4</p>
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
        Book your 30-minute clarity call
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted">
        Thirty minutes on your goals, your current setup and what the honest path
        forward looks like. No deck, no pitch, and no obligation afterwards.
      </p>

      {/* Day strip. Horizontal scroll rather than a wrapped grid, so the row
          keeps its rhythm however many days are shown. */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">{chosenLabel}</p>
          <ChevronRight size={16} className="text-muted" />
        </div>
        <div className="no-scrollbar mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1">
          {days.map((d, i) => {
            const on = i === day;
            const today = i === 0 && d.toDateString() === new Date().toDateString();
            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => {
                  setDay(i);
                  setSlot(null);
                }}
                aria-pressed={on}
                className={`flex min-w-[64px] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 text-xs transition-colors ${
                  on
                    ? "border-gold/50 bg-gold/15 text-ink"
                    : "border-border bg-surface/50 text-muted hover:border-gold/30 hover:text-ink"
                }`}
              >
                <span>{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                <span className="mt-0.5 font-semibold tabular-nums">
                  {today ? "Today" : d.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Times */}
      <div className="mt-6">
        <p className="text-sm font-medium text-ink">Pick a time</p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SLOTS.map((t) => {
            const on = t === slot;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSlot(t)}
                aria-pressed={on}
                className={`rounded-lg border py-2 text-sm tabular-nums transition-colors ${
                  on
                    ? "border-gold/50 bg-gold/15 text-ink"
                    : "border-border bg-surface/50 text-muted hover:border-gold/30 hover:text-ink"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qualification moved here from the retired floating widget. This is the
          page every primary CTA points at, so the questions belong on it rather
          than in a chat bubble a visitor may never open — and WhatsApp goes
          back to being a plain channel rather than a form in disguise. */}
      {qualification}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Your email address"
          className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
        />
      </div>

      {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending
          </>
        ) : (
          <>
            Request this 30-minute call <ArrowRight size={15} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        This sends a request, not a confirmed booking. I reply personally to
        confirm, usually the same working day.
      </p>
    </form>
  );
}
