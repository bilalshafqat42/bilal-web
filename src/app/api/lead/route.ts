import { NextResponse } from "next/server";
import { megaMenuGroups } from "@/data/pillars";
import {
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  SERVICE_EXTRA_OPTIONS,
} from "@/data/leadOptions";

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
  pageUrl?: string;
  internalReferrer?: string;
  pageOfInterest?: string;
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
  // Shared with the matching trackLead/trackSchedule pixel fire (see
  // src/lib/analytics.ts's generateEventId) so Performo's server-side Meta
  // Conversions API event dedupes against the browser pixel event instead
  // of double-counting the conversion. fbp/fbc are Meta's own cookies (see
  // src/lib/attribution.ts's getFacebookCookies) — passing them improves
  // match quality on top of/instead of the eventId.
  eventId?: string;
  fbp?: string;
  fbc?: string;
  /** Discrete qualification answers from /appointment. Checked against the same
   *  lists the form renders from, rather than trusted. */
  serviceInterest?: string;
  budget?: string;
  timeline?: string;
  /** Cloudflare Turnstile response, verified server-side when a secret is set. */
  turnstileToken?: string;
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

/** 16KB. A genuine enquiry is a few hundred bytes; the largest legitimate
 *  payload here is a long message plus attribution, well under 4KB. Anything
 *  above this is either a mistake or an attempt to make the server do work. */
const MAX_BODY_BYTES = 16 * 1024;

/** Per-field caps. Applied after trimming, before anything is forwarded. */
const LIMITS = { name: 120, email: 254, phone: 40, message: 4000, generic: 200 } as const;

/** Strips what does not belong in a value that will end up in an email body or
 *  a CRM record.
 *
 *  CR and LF are the important ones: a newline in a field that becomes an email
 *  header is how header injection works, and this route cannot know which of
 *  its fields the CRM puts where. Other C0 controls and the Unicode line and
 *  paragraph separators go too, since none of them are typed by a real person
 *  and several render invisibly.
 *
 *  `keepNewlines` is for the message body alone, where line breaks are real
 *  content — there they are normalised to \n rather than removed. */
function clean(value: unknown, max: number, keepNewlines = false): string | undefined {
  if (typeof value !== "string") return undefined;
  let out = value.normalize("NFC");
  out = keepNewlines
    ? out.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g, "")
    : out.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, " ");
  out = out.replace(/[ \t]{2,}/g, " ").trim();
  if (!out) return undefined;
  return out.length > max ? out.slice(0, max) : out;
}

/** Rejections are logged in one shape so spam and genuine failures can be told
 *  apart in the host's log viewer without reading every line. `reason` is a
 *  stable token; the detail is whatever helps diagnose that reason. */
function logRejection(reason: string, ip: string, detail: Record<string, unknown> = {}) {
  console.warn(
    `[LEAD REJECTED] ${JSON.stringify({ reason, ip, at: new Date().toISOString(), ...detail })}`
  );
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Cloudflare Turnstile, only when configured. Invisible to real visitors and
 *  skipped entirely when no secret is set, so the endpoint keeps working before
 *  the key exists rather than rejecting every submission. */
async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A Turnstile outage should not swallow real leads.
    return true;
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  // Order matters here, and it was wrong before: the body was parsed first and
  // the rate limit checked afterwards, so a flood of oversized payloads was
  // fully deserialised before anything said no. The cheapest checks now run
  // first — count, then declared size, then read, then parse.
  if (rateLimited(ip)) {
    logRejection("rate_limited", ip);
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    logRejection("payload_too_large_declared", ip, { declared });
    return NextResponse.json(
      { success: false, error: "That submission is too large." },
      { status: 413 }
    );
  }

  // Content-Length is a claim, not a fact, so the actual bytes are measured
  // too. A chunked request can omit the header entirely.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    logRejection("body_unreadable", ip);
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    logRejection("payload_too_large_actual", ip, { bytes: raw.length });
    return NextResponse.json(
      { success: false, error: "That submission is too large." },
      { status: 413 }
    );
  }

  let body: LeadPayload;
  try {
    body = JSON.parse(raw) as LeadPayload;
  } catch {
    logRejection("invalid_json", ip, { bytes: raw.length });
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    logRejection("not_an_object", ip);
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Answer success so bots do not
  // learn they were caught and retry with the field removed.
  if (body.botcheck) {
    logRejection("honeypot", ip, { source: clean(body.source, LIMITS.generic) });
    return NextResponse.json({ success: true });
  }

  if (!(await turnstileOk(body.turnstileToken, ip))) {
    logRejection("turnstile_failed", ip);
    return NextResponse.json(
      { success: false, error: "Could not verify that submission. Please try again." },
      { status: 403 }
    );
  }

  const {
    meetingTime,
    source,
    pageUrl,
    attribution,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    eventId,
    fbp,
    fbc,
  } = body;
  // Every free-text field is trimmed, length-capped and stripped of control
  // characters before it goes anywhere. Nothing below is used as received.
  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const message = clean(body.message, LIMITS.message, true);

  if (!name || !email) {
    logRejection("missing_required", ip, { hasName: !!name, hasEmail: !!email });
    return NextResponse.json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL.test(email)) {
    logRejection("invalid_email", ip);
    return NextResponse.json(
      { success: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // Whitelisted against the same lists the form renders from. A select
  // constrains an honest visitor and nobody else, so an unrecognised value is
  // rejected rather than passed through to the CRM.
  const allowedServices = new Set<string>([
    ...megaMenuGroups.map((g) => g.title),
    ...SERVICE_EXTRA_OPTIONS,
  ]);
  const service = clean(body.service, LIMITS.generic);
  if (service && !allowedServices.has(service)) {
    logRejection("unknown_service", ip, { service });
    return NextResponse.json(
      { success: false, error: "Unrecognised service." },
      { status: 400 }
    );
  }

  const serviceInterest = clean(body.serviceInterest, LIMITS.generic);
  if (serviceInterest && !allowedServices.has(serviceInterest)) {
    logRejection("unknown_service_interest", ip, { serviceInterest });
    return NextResponse.json(
      { success: false, error: "Unrecognised service." },
      { status: 400 }
    );
  }

  const budget = clean(body.budget, LIMITS.generic);
  if (budget && !BUDGET_OPTIONS.includes(budget)) {
    logRejection("unknown_budget", ip, { budget });
    return NextResponse.json({ success: false, error: "Unrecognised budget." }, { status: 400 });
  }

  const timeline = clean(body.timeline, LIMITS.generic);
  if (timeline && !TIMELINE_OPTIONS.includes(timeline)) {
    logRejection("unknown_timeline", ip, { timeline });
    return NextResponse.json({ success: false, error: "Unrecognised timeline." }, { status: 400 });
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
  // Full URL first, then the in-site page they came from (more useful than
  // "/contact" when the form lives on a dedicated contact page), then fallbacks.
  const resolvedPageUrl =
    attribution?.pageOfInterest ||
    attribution?.pageUrl ||
    attribution?.internalReferrer ||
    attribution?.submittedFrom ||
    attribution?.landingPage ||
    pageUrl;

  // Ad click IDs, taken from the persisted first-touch attribution. Unlike the
  // UTMs there is no flat fallback, because no caller sends one. These are what
  // offline conversion import
  // is keyed on: without gclid, Google Ads can learn which clicks produced a
  // form fill but never which produced a customer.
  //
  // Probed against Performo directly on 2026-09-02: it stores gclid, fbclid,
  // ttclid and msclkid. An earlier note in the roadmap claimed it had no fields
  // for them, which is why they were being dropped here. `referrer` genuinely
  // is not stored, so it is still not sent.
  const resolvedGclid = attribution?.gclid;
  const resolvedFbclid = attribution?.fbclid;
  const resolvedTtclid = attribution?.ttclid;
  const resolvedMsclkid = attribution?.msclkid;

  // Performo's public intake API (the CRM this currently points at) expects
  // its own field names and an x-api-key header, not Authorization: Bearer —
  // this is the "adjust the mapping" step called out in .env.local.example.
  const lead = {
    type: isChat ? "chat" : "form",
    name,
    email,
    phone: phone || undefined,
    message: message || (service ? `Interested in: ${service}` : undefined),
    // `serviceInterest` is the visitor's own answer on /appointment; `service`
    // is the form's label for itself. The answer is the more useful of the two
    // when both are present.
    service: serviceInterest || service || undefined,
    budget: budget || undefined,
    timeline: timeline || undefined,
    campaign: clean(meetingTime, LIMITS.generic) || undefined,
    pageUrl: clean(resolvedPageUrl, LIMITS.generic) || undefined,
    utmSource: clean(resolvedUtmSource, LIMITS.generic) || undefined,
    utmMedium: clean(resolvedUtmMedium, LIMITS.generic) || undefined,
    utmCampaign: clean(resolvedUtmCampaign, LIMITS.generic) || undefined,
    utmContent: clean(resolvedUtmContent, LIMITS.generic) || undefined,
    utmTerm: clean(resolvedUtmTerm, LIMITS.generic) || undefined,
    eventId: clean(eventId, LIMITS.generic) || undefined,
    fbp: clean(fbp, LIMITS.generic) || undefined,
    fbc: clean(fbc, LIMITS.generic) || undefined,
    gclid: clean(resolvedGclid, LIMITS.generic) || undefined,
    fbclid: clean(resolvedFbclid, LIMITS.generic) || undefined,
    ttclid: clean(resolvedTtclid, LIMITS.generic) || undefined,
    msclkid: clean(resolvedMsclkid, LIMITS.generic) || undefined,
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
