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

/** A lead actually reached the CRM. This is the conversion worth bidding on. */
export function trackLead(source: string, service?: string) {
  track("generate_lead", {
    lead_source: source,
    lead_service: service || "unspecified",
  });
}

/** Outbound WhatsApp click — a real intent signal that leaves the site. */
export function trackWhatsApp(context: string) {
  track("whatsapp_click", { whatsapp_context: context });
}
