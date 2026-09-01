"use client";

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Pushes an event to the GTM dataLayer.
 *
 * Safe to call with no container installed — the queue is just an array, so the
 * push is a no-op until GTM loads (and if it never does, nothing breaks).
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const payload: DataLayerEvent = { event, ...params };
  window.dataLayer.push(payload);
}

/**
 * Sends the same conversion to the Meta Pixel.
 *
 * A no-op unless the pixel has loaded, which only happens after the visitor
 * accepts on the consent banner. So callers never need to check consent.
 *
 * Standard Meta event names only (Lead, Schedule, Contact, ViewContent), because
 * Meta's optimisation and reporting do not understand custom ones.
 *
 * Each event carries an `eventID`. Nothing consumes it yet, but it is what lets
 * the same conversion sent later from the server via the Conversions API be
 * matched rather than counted twice. Adding it now is free; adding it after a
 * campaign is live means a stretch of double-counted conversions.
 */
function meta(event: string, params: Record<string, string | undefined> = {}) {
  if (typeof window === "undefined") return;

  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) if (v) clean[k] = v;
  let id: string;
  try {
    id = crypto.randomUUID();
  } catch {
    id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  const fire = () => window.fbq?.("track", event, clean, { eventID: id });

  if (typeof window.fbq === "function") {
    fire();
    return;
  }

  // The pixel loads asynchronously and only after consent, so a page-view event
  // fired from a mount effect can arrive before `fbq` exists. Dropping it there
  // silently is how ViewContent went missing while Lead and Schedule, which
  // happen seconds later, worked fine. Wait a short while for the loader, then
  // give up: if consent was declined it is never coming, and that is correct.
  let waited = 0;
  const timer = window.setInterval(() => {
    waited += 200;
    if (typeof window.fbq === "function") {
      window.clearInterval(timer);
      fire();
    } else if (waited >= 6000) {
      window.clearInterval(timer);
    }
  }, 200);
}

/** A lead actually reached the CRM. This is the conversion worth bidding on. */
export function trackLead(source: string, service?: string) {
  track("generate_lead", {
    lead_source: source,
    lead_service: service || "unspecified",
  });
  meta("Lead", { content_name: source, content_category: service });
}

/**
 * A call was requested. Deliberately `Schedule` rather than `Lead`: it lets a
 * future campaign optimise for booked calls specifically, which are worth more
 * than a general enquiry.
 */
export function trackSchedule(source: string, topic?: string) {
  track("schedule_call", { lead_source: source, call_topic: topic || "unspecified" });
  meta("Schedule", { content_name: source, content_category: topic });
}

/** Outbound WhatsApp click — a real intent signal that leaves the site. */
export function trackWhatsApp(context: string) {
  track("whatsapp_click", { whatsapp_context: context });
  meta("Contact", { content_name: `whatsapp:${context}` });
}

/**
 * A service or case study page was read. Builds interest-segmented audiences, so
 * a future campaign can retarget by discipline rather than site-wide, which is
 * the difference between a useful retargeting list and one big undifferentiated
 * pool of visitors.
 */
export function trackViewContent(name: string, category: string) {
  track("view_content", { content_name: name, content_category: category });
  meta("ViewContent", { content_name: name, content_category: category });
}
