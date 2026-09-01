"use client";

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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

  // dataLayer push: what GTM reads. Harmless with no container, since the queue
  // is just an array, and it keeps the GTM route open without a code change.
  window.dataLayer = window.dataLayer || [];
  const payload: DataLayerEvent = { event, ...params };
  window.dataLayer.push(payload);

  // gtag event: what a directly loaded GA4 reads. GA4 does not interpret raw
  // dataLayer pushes, so without this the conversions would only ever reach
  // Meta and a hypothetical GTM container, never GA4 itself.
  window.gtag?.("event", event, params);
}

/**
 * One ID per real submission attempt, shared between the browser pixel fire
 * and the server-side Conversions API event sent from Performo. Call this
 * once at the top of a submit handler, pass it into both the `/api/lead`
 * body (as `eventId`) and the matching `trackLead`/`trackSchedule` call, so
 * Meta dedupes the two signals instead of counting the conversion twice.
 */
export function generateEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
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
 * Each event carries an `eventID`. Pass the same id used in the matching
 * `/api/lead` submission (see `generateEventId`) so the conversion sent later
 * from the server via the Conversions API is matched rather than counted
 * twice. If no id is supplied, one is generated here — fine for events that
 * don't also reach Performo's server-side event (e.g. ViewContent).
 */
function meta(
  event: string,
  params: Record<string, string | undefined> = {},
  eventId?: string,
) {
  if (typeof window === "undefined") return;

  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) if (v) clean[k] = v;
  const id = eventId || generateEventId();

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

/**
 * A lead actually reached the CRM. This is the conversion worth bidding on.
 * Pass the same `eventId` sent to `/api/lead` for this submission so Meta
 * can dedupe against the server-side Conversions API event.
 */
export function trackLead(source: string, service?: string, eventId?: string) {
  track("generate_lead", {
    lead_source: source,
    lead_service: service || "unspecified",
  });
  meta("Lead", { content_name: source, content_category: service }, eventId);
}

/**
 * A call was requested. Deliberately `Schedule` rather than `Lead`: it lets a
 * future campaign optimise for booked calls specifically, which are worth more
 * than a general enquiry.
 */
export function trackSchedule(source: string, topic?: string, eventId?: string) {
  track("schedule_call", { lead_source: source, call_topic: topic || "unspecified" });
  meta("Schedule", { content_name: source, content_category: topic }, eventId);
}

/** Outbound WhatsApp click — a real intent signal that leaves the site. */
export function trackWhatsApp(context: string, eventId?: string) {
  track("whatsapp_click", { whatsapp_context: context });
  meta("Contact", { content_name: `whatsapp:${context}` }, eventId);
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
