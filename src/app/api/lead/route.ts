import { NextResponse } from "next/server";

// Mirrors the Attribution type in src/lib/attribution.ts — kept as an
// inline shape here rather than imported, since this is a server route and
// that module is "use client" (reads window/sessionStorage).
type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  referrer?: string;
  landingPage?: string;
  submittedFrom?: string;
};

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  service?: string;
  meetingTime?: string;
  source?: string;
  botcheck?: string | boolean;
  pageUrl?: string;
  // Preferred: src/lib/attribution.ts's getAttribution(), sent by both
  // ContactForm and WhatsAppButton. Flat utm* fields below are kept as a
  // fallback for any caller not yet using that lib.
  attribution?: Attribution;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

// Best-effort in-process rate limit. On serverless each instance keeps its own
// window, so this throttles obvious abuse rather than guaranteeing a global cap.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude bound; this is not a durable store
  return recent.length > MAX_PER_WINDOW;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Pretend success so bots don't retry.
  if (body.botcheck) {
    return NextResponse.json({ success: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  const {
    name,
    email,
    phone,
    message,
    service,
    meetingTime,
    source,
    pageUrl,
    attribution,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  } = body;
  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { success: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const isChat = (source || "").includes("whatsapp");

  // The attribution object (from getAttribution()) wins when present — it's
  // first-touch data persisted across the visit, more reliable than reading
  // the URL at the moment of submission alone. Flat fields are the fallback.
  const resolvedUtmSource = attribution?.utm_source || utmSource;
  const resolvedUtmMedium = attribution?.utm_medium || utmMedium;
  const resolvedUtmCampaign = attribution?.utm_campaign || utmCampaign;
  const resolvedUtmContent = attribution?.utm_content || utmContent;
  const resolvedUtmTerm = attribution?.utm_term || utmTerm;
  const resolvedPageUrl = attribution?.submittedFrom || attribution?.landingPage || pageUrl;

  // Performo's public intake API (the CRM this currently points at) expects
  // its own field names and an x-api-key header, not Authorization: Bearer —
  // this is the "adjust the mapping" step called out in .env.local.example.
  // Performo's Lead model has no fields for click IDs (gclid/fbclid/etc.) or
  // referrer today, so those are intentionally not sent — not lost, just not
  // yet modeled on the receiving end.
  const lead = {
    type: isChat ? "chat" : "form",
    name,
    email,
    phone: phone || undefined,
    message: message || (service ? `Interested in: ${service}` : undefined),
    service: service || undefined,
    campaign: meetingTime || undefined,
    pageUrl: resolvedPageUrl || undefined,
    utmSource: resolvedUtmSource || undefined,
    utmMedium: resolvedUtmMedium || undefined,
    utmCampaign: resolvedUtmCampaign || undefined,
    utmContent: resolvedUtmContent || undefined,
    utmTerm: resolvedUtmTerm || undefined,
  };

  const crmUrl = process.env.CRM_LEAD_API_URL;

  // `fallback: true` tells the client the lead was NOT captured, so it can offer
  // WhatsApp/email instead. Silently returning success here would lose real leads,
  // which is exactly the defect this route shipped with.
  if (!crmUrl) {
    console.error("[LEAD NOT DELIVERED — CRM_LEAD_API_URL unset]", JSON.stringify(lead));
    return NextResponse.json(
      { success: false, fallback: true, error: "Lead intake is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const crmResponse = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_LEAD_API_KEY
          ? { "x-api-key": process.env.CRM_LEAD_API_KEY }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });

    if (!crmResponse.ok) {
      const detail = await crmResponse.text().catch(() => "");
      console.error("[LEAD NOT DELIVERED — CRM rejected]", crmResponse.status, detail, JSON.stringify(lead));
      return NextResponse.json(
        { success: false, fallback: true, error: "The lead system rejected this submission." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LEAD NOT DELIVERED — CRM unreachable]", err, JSON.stringify(lead));
    return NextResponse.json(
      { success: false, fallback: true, error: "Could not reach the lead system right now." },
      { status: 502 }
    );
  }
}
