"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLeadSubmit, TURNSTILE_ENABLED } from "@/lib/useLeadSubmit";

const NOT_SENT = "That didn't send. Try WhatsApp or email instead.";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // No success state here: the button stays disabled while the push to
  // /thank-you lands, and a failed send (fallback or not) shows one message.
  const { status, error, submit, turnstileRef } = useLeadSubmit({
    source: "service-page-form",
    thankYouPath: "/thank-you?source=enquiry",
    honeypotField: "company",
    defaultError: NOT_SENT,
    networkError: NOT_SENT,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    submit(e, () => ({
      fields: {
        name,
        email,
        service,
        message: message || `Enquiry from the ${service} page.`,
      },
      service,
    }));

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Your email address"
        className="w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
      />
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`What do you need? (optional; I'll assume it's about ${service.toLowerCase()})`}
        aria-label="What do you need"
        className="w-full resize-none rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20 sm:col-span-2"
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

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="sm:col-span-2" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-red-400 sm:col-span-2">
          {error}
        </p>
      ) : null}

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
