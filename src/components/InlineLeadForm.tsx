"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { getAttribution, getFacebookCookies } from "@/lib/attribution";
import { trackLead, generateEventId } from "@/lib/analytics";

type Status = "idle" | "submitting" | "error";

/**
 * Short enquiry form placed directly on a service page.
 *
 * The page previously offered only links out to /contact and /appointment.
 * Every click between reading and enquiring loses people, and someone who has
 * just read a page about UI/UX design has already told you what they want, so
 * asking them to restate it on another page is friction for no gain.
 *
 * Three fields only. The service is carried in a hidden value from the page it
 * sits on, so the enquiry arrives already labelled.
 */
export default function InlineLeadForm({ service }: { service: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
          service,
          message: message || `Enquiry from the ${service} page.`,
          source: "service-page-form",
          attribution: getAttribution(),
          eventId,
          ...getFacebookCookies(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        trackLead("service-page-form", service, eventId);
        router.push("/thank-you?source=enquiry");
        return;
      }
      setError(data.error || "That didn't send. Try WhatsApp or email instead.");
      setStatus("error");
    } catch {
      setError("That didn't send. Try WhatsApp or email instead.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-gold/50"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Your email address"
        className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-gold/50"
      />
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`What do you need? (optional — I'll assume it's about ${service.toLowerCase()})`}
        aria-label="What do you need"
        className="w-full resize-none rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-gold/50 sm:col-span-2"
      />

      {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold disabled:opacity-60 sm:col-span-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Sending
          </>
        ) : (
          <>
            Send this enquiry <ArrowRight size={15} />
          </>
        )}
      </button>
      <p className="text-center text-xs text-muted sm:col-span-2">
        Goes straight to me. I reply personally, usually within one working day.
      </p>
    </form>
  );
}
