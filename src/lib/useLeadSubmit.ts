"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getAttribution, getFacebookCookies } from "@/lib/attribution";
import { trackLead, generateEventId } from "@/lib/analytics";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * The submit logic shared by ContactForm, InlineLeadForm and LeadFormPopup.
 *
 * All three used to carry their own copy of the same sequence: read the
 * honeypot, mint an event id, attach attribution and Meta cookies, POST to
 * /api/lead, fire `generate_lead` only on a counted success, then go to
 * /thank-you. Three copies meant three places for a fix to be missed. Each form
 * keeps its own markup; only the sequence lives here, with the small
 * differences between forms passed in as options.
 */

export type LeadStatus = "idle" | "submitting" | "success" | "fallback" | "error";

type Options = {
  /** `source` sent to /api/lead and the `lead_source` of `generate_lead`. */
  source: string;
  /** Where a delivered lead goes next, e.g. "/thank-you?source=enquiry". */
  thankYouPath: string;
  /** Set status to "success" on delivery. Off keeps the button disabled while
   *  the navigation to the thank-you page is in flight. */
  markSuccess?: boolean;
  /** Clear the DOM form on delivery (uncontrolled forms). */
  resetOnSuccess?: boolean;
  /** Show the dedicated "fallback" state when the route says the lead was not
   *  captured. Off maps it to "error". */
  fallbackState?: boolean;
  /** Message when the server sends none. */
  defaultError: string;
  /** Message when the request never got an answer. */
  networkError: string;
};

type Submission = {
  /** Form fields for /api/lead, without source, attribution or tokens. */
  fields: Record<string, unknown>;
  /** `lead_service` for analytics. */
  service?: string;
};

// ---------------------------------------------------------------- Turnstile

/** Public by design: the site key is meant to be in the page. The route only
 *  enforces Turnstile when this AND the server-side secret are both set. */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const TURNSTILE_ENABLED = TURNSTILE_SITE_KEY !== "";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScript: Promise<TurnstileApi> | null = null;

/** Loads Cloudflare's script once, and only when a form with Turnstile mounts.
 *  With no site key this is never called, so nothing extra loads. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScript) return turnstileScript;
  turnstileScript = new Promise<TurnstileApi>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      turnstileScript = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return turnstileScript;
}

// ---------------------------------------------------------------- the hook

export function useLeadSubmit(opts: Options) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [error, setError] = useState("");

  const tokenRef = useRef("");
  const widgetRef = useRef<string | null>(null);
  /** True once Cloudflare's script has failed to load (blocked or offline).
   *  No token can ever arrive then, so a submit should not wait for one. */
  const turnstileFailedRef = useRef(false);

  /** Attach to an empty <div> inside the form when TURNSTILE_ENABLED. Renders
   *  the managed widget, which stays invisible unless Cloudflare needs the
   *  visitor to click. Cleans up when the form unmounts (the popup closing). */
  const { source } = opts;
  const turnstileRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || !TURNSTILE_ENABLED) return;
      let cancelled = false;
      turnstileFailedRef.current = false;
      loadTurnstile()
        .then((ts) => {
          if (cancelled) return;
          widgetRef.current = ts.render(el, {
            sitekey: TURNSTILE_SITE_KEY,
            action: source,
            appearance: "interaction-only",
            size: "flexible",
            callback: (t: string) => (tokenRef.current = t),
            "expired-callback": () => (tokenRef.current = ""),
            "error-callback": () => (tokenRef.current = ""),
          });
        })
        .catch(() => {
          // Blocked or offline. The route answers 403 with `fallback: true`,
          // so the visitor is still offered WhatsApp and email.
          if (!cancelled) turnstileFailedRef.current = true;
        });
      return () => {
        cancelled = true;
        try {
          if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
        } catch {
          // Already gone.
        }
        widgetRef.current = null;
        tokenRef.current = "";
      };
    },
    [source]
  );

  /** The token, waiting up to 5s for a challenge still in progress. When the
   *  script never loaded there is no challenge to wait for: the submit goes
   *  straight out without a token, and the route's 403 `fallback: true` puts
   *  the form in its WhatsApp/email state at once instead of after 5s of a
   *  spinner. If the route is not enforcing Turnstile, the lead is delivered. */
  async function turnstileToken(): Promise<string | undefined> {
    if (!TURNSTILE_ENABLED) return undefined;
    for (let waited = 0; !tokenRef.current && !turnstileFailedRef.current && waited < 5000; waited += 250) {
      await new Promise((r) => setTimeout(r, 250));
    }
    return tokenRef.current || undefined;
  }

  /** Tokens are single-use, so every attempt gets a fresh one. */
  function resetTurnstile() {
    tokenRef.current = "";
    try {
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
    } catch {
      // Widget removed mid-submit (the form unmounted); nothing to reset.
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>, build: (fd: FormData) => Submission) {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setStatus("submitting");

    const fd = new FormData(form);
    // The spam trap (see components/forms/Honeypot.tsx). Read from the form
    // and sent under its own meaningless key, never "company".
    const trap = fd.get(HONEYPOT_FIELD);
    const trapValue = typeof trap === "string" ? trap : "";
    const { fields, service } = build(fd);
    // One id for this submission attempt, shared between the /api/lead POST
    // and the trackLead pixel fire below, so Meta dedupes the browser pixel
    // event against the server-side Conversions API event Performo sends.
    const eventId = generateEventId();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          [HONEYPOT_FIELD]: trapValue,
          source: opts.source,
          attribution: getAttribution(),
          eventId,
          ...getFacebookCookies(),
          turnstileToken: await turnstileToken(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Fired only on confirmed delivery, so the conversion count matches
        // what actually reached the CRM. A filled trap gets a success from the
        // route that looks exactly like a real one (so a bot learns nothing),
        // so the client skips the conversion on its own knowledge instead.
        // Otherwise a blocked bot would train the ad account on bot traffic.
        if (!trapValue) trackLead(opts.source, service, eventId);
        if (opts.markSuccess) setStatus("success");
        if (opts.resetOnSuccess) form.reset();
        router.push(opts.thankYouPath);
        return;
      }
      setError(data.error || opts.defaultError);
      setStatus(data.fallback && opts.fallbackState ? "fallback" : "error");
    } catch {
      setError(opts.networkError);
      setStatus(opts.fallbackState ? "fallback" : "error");
    } finally {
      resetTurnstile();
    }
  }

  return { status, setStatus, error, submit, turnstileRef };
}
