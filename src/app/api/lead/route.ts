import { timingSafeEqual } from "node:crypto";
import { NextResponse, after } from "next/server";
import { saveToFile, sendAlert, type BackupRecord, type FailureReason } from "@/lib/leadBackup";
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
const MAX_TRACKED_IPS = 5000;
// A Map iterates in insertion order. Re-inserting a key on every hit moves it
// to the end, so the first key is always the least recently seen: LRU for free.
const hits = new Map<string, number[]>();

function recentHits(ip: string, now: number): number[] {
  return (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** True when this IP has already used its window. Records nothing, so it can
 *  run first and turn away a known abuser before any parsing. */
function overLimit(ip: string): boolean {
  return recentHits(ip, Date.now()).length >= MAX_PER_WINDOW;
}

/**
 * Counts one submission against the IP. Called only once a request has passed
 * validation, or tripped the honeypot, so a visitor correcting a typo in their
 * email is not locked out by their own mistakes.
 *
 * The bound used to be `hits.clear()` at 5,000 entries, which meant a flood from
 * 5,000 spoofed addresses reset everyone's limit, including the abuser's.
 * Eviction is now per key: expired entries first, then the least recently seen.
 */
function recordHit(ip: string): void {
  const now = Date.now();
  const recent = recentHits(ip, now);
  recent.push(now);
  hits.delete(ip);
  hits.set(ip, recent);
  if (hits.size <= MAX_TRACKED_IPS) return;
  for (const [key, times] of hits) {
    if (hits.size <= MAX_TRACKED_IPS) return;
    if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  for (const key of hits.keys()) {
    if (hits.size <= MAX_TRACKED_IPS) return;
    hits.delete(key);
  }
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

/**
 * What a failed delivery is allowed to leave in the host's log.
 *
 * All three CRM-failure paths used to log `JSON.stringify(lead)` — name, email,
 * phone and the whole enquiry message in clear text on Hostinger's log volume
 * (roadmap 213.22). The intent was right: never silently lose a lead. But under
 * **UAE PDPL** that created a second, unmanaged store of personal data, with no
 * retention policy, in a place `/privacy` does not mention and nobody purges.
 *
 * This keeps what diagnoses a failure — when, from where, which campaign, how
 * big the message was — and drops what identifies the person. The email domain
 * is kept because "the CRM rejects gmail.com addresses" is a real failure mode
 * and the domain alone does not identify anyone.
 */
function redactedLead(lead: Record<string, unknown>) {
  const email = typeof lead.email === "string" ? lead.email : "";
  const message = typeof lead.message === "string" ? lead.message : "";
  return {
    type: lead.type,
    nameLength: typeof lead.name === "string" ? lead.name.length : 0,
    emailDomain: email.includes("@") ? email.slice(email.lastIndexOf("@")) : "none",
    hasPhone: Boolean(lead.phone),
    messageLength: message.length,
    service: lead.service,
    budget: lead.budget,
    timeline: lead.timeline,
    pageUrl: lead.pageUrl,
    utmSource: lead.utmSource,
    utmCampaign: lead.utmCampaign,
    eventId: lead.eventId,
  };
}

/** Rejections are logged in one shape so spam and genuine failures can be told
 *  apart in the host's log viewer without reading every line. `reason` is a
 *  stable token; the detail is whatever helps diagnose that reason. */
function logRejection(reason: string, ip: string, detail: Record<string, unknown> = {}) {
  console.warn(
    `[LEAD REJECTED] ${JSON.stringify({ reason, ip, at: new Date().toISOString(), ...detail })}`
  );
}

/**
 * The visitor's IP, for rate limiting and logs.
 *
 * The first X-Forwarded-For entry used to be trusted, but that value is
 * whatever the client sent: a bot could rotate it on every request and never
 * be rate limited. Each proxy appends to the header rather than replacing it,
 * so only the entries added by our own proxies mean anything.
 *
 *  1. `cf-connecting-ip`: the site is proxied by Cloudflare, which sets this
 *     itself and overwrites any value the client sent.
 *  2. `x-real-ip`: set by the origin proxy (LiteSpeed) when present.
 *  3. The LAST X-Forwarded-For entry: appended by the nearest proxy, so it is
 *     not client-controlled. Behind Cloudflare it is usually a Cloudflare edge
 *     address shared by many visitors, which is why it is only the fallback.
 *
 * Caveat: if the Hostinger origin is reachable directly, bypassing Cloudflare,
 * a client can send its own `cf-connecting-ip`. Hostinger's hosting gives no
 * firewall to restrict the origin to Cloudflare's IP ranges, so instead a
 * Cloudflare Transform Rule adds a secret `x-origin-auth` header to every
 * request it forwards. With `CF_ORIGIN_SECRET` set, `cf-connecting-ip` is
 * trusted only when that header matches; a direct hit falls through to the
 * proxy-set addresses below, which the client cannot forge.
 */
function fromCloudflare(request: Request): boolean {
  const secret = process.env.CF_ORIGIN_SECRET;
  if (!secret) return true; // not configured yet: keep the previous behaviour
  const sent = request.headers.get("x-origin-auth") ?? "";
  const a = Buffer.from(sent);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function clientIp(request: Request): string {
  const cf = fromCloudflare(request) ? request.headers.get("cf-connecting-ip")?.trim() : undefined;
  if (cf) return cf;
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const chain = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return chain[chain.length - 1] || "unknown";
}

/** CRM error bodies can echo the submitted lead back. At most 200 characters
 *  reach the log, with anything that looks like an email or phone masked. */
function safeDetail(text: string): string {
  return text
    .slice(0, 4000)
    .replace(/[^\s@"'<>,;:]+@[^\s@"'<>,;:]+/g, "[email]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "[phone]")
    .slice(0, 200);
}

/** Cloudflare Turnstile, only when fully configured. Invisible to real visitors.
 *
 *  Enforced only when BOTH keys are set. The forms render the widget, and so
 *  send a token, only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is in the build. With
 *  the secret alone every submission arrived without a token and was refused,
 *  so setting one variable on Hostinger would have silently blocked every lead. */
async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true;
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
  // first: limit, then declared size, then read, then parse.
  //
  // This check only reads the count. A hit is recorded further down, once the
  // request has passed validation (or tripped the honeypot), so a person whose
  // first attempts were rejected for a typo still gets through.
  if (overLimit(ip)) {
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
  //
  // `counted: false` is the part that matters, and it was missing. Every client
  // read only `success` and then fired `trackLead()`, so a blocked bot pushed
  // `generate_lead` to GA4 and `Lead` to Meta for a submission that was
  // discarded here. Meta optimises delivery toward whoever produced those
  // events, so the honeypot was quietly training the ad account on bot traffic.
  //
  // A bot sees `success: true` and learns nothing, which is the whole point of
  // the lie. The extra field only tells an honest client not to count it.
  if (body.botcheck) {
    recordHit(ip);
    logRejection("honeypot", ip, { source: clean(body.source, LIMITS.generic) });
    return NextResponse.json({ success: true, counted: false });
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

  // Turnstile runs after the cheap field checks, so a malformed request never
  // costs a call to Cloudflare. A failure is counted against the limit: it is
  // either a bot or a real visitor whose widget did not load, and the latter
  // is offered WhatsApp and email by `fallback: true` rather than a dead end.
  if (!(await turnstileOk(clean(body.turnstileToken, 4096), ip))) {
    recordHit(ip);
    logRejection("turnstile_failed", ip);
    return NextResponse.json(
      { success: false, fallback: true, error: "Could not verify that submission. Please try again." },
      { status: 403 }
    );
  }

  // Valid from here on, so it counts towards the limit whatever happens next.
  recordHit(ip);

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
  //
  // Every failure path below also hands the full lead to `backUp`, which keeps
  // it on disk for `npm run replay-leads` and emails it, so a visitor who closes
  // the tab instead of using WhatsApp is no longer lost.
  if (!crmUrl) {
    console.error("[LEAD NOT DELIVERED — CRM_LEAD_API_URL unset]", JSON.stringify(redactedLead(lead)));
    await backUp(lead, "crm_unset");
    return NextResponse.json(
      { success: false, fallback: true, error: "Lead intake is not configured yet." },
      { status: 503 }
    );
  }

  let crmResponse: Response;
  try {
    crmResponse = await fetch(crmUrl, {
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
  } catch (err) {
    // Only the error's name and message: a fetch error does not carry the body,
    // but the whole object can carry a `cause` with more than is needed here.
    const e = err as Error;
    console.error(
      "[LEAD NOT DELIVERED — CRM unreachable]",
      `${e?.name ?? "Error"}: ${safeDetail(String(e?.message ?? ""))}`,
      JSON.stringify(redactedLead(lead))
    );
    await backUp(lead, "crm_unreachable");
    return NextResponse.json(
      { success: false, fallback: true, error: "Could not reach the lead system right now." },
      { status: 502 }
    );
  }

  if (!crmResponse.ok) {
    // The CRM's error body can echo the lead back, so it is capped and masked.
    const detail = safeDetail(await crmResponse.text().catch(() => ""));
    console.error(
      "[LEAD NOT DELIVERED — CRM rejected]",
      crmResponse.status,
      detail,
      JSON.stringify(redactedLead(lead))
    );
    await backUp(lead, "crm_rejected", crmResponse.status);
    return NextResponse.json(
      { success: false, fallback: true, error: "The lead system rejected this submission." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * Keeps an undelivered lead. The file write is awaited because it takes
 * milliseconds and is the copy replay depends on. The email is sent after the
 * response has gone, via `after()`, so a slow SMTP server (up to 8s) never
 * delays the visitor's WhatsApp and email fallback.
 */
async function backUp(lead: Record<string, unknown>, reason: FailureReason, status?: number) {
  const record: BackupRecord = { savedAt: new Date().toISOString(), reason, status, lead };
  const saved = await saveToFile(record);
  console.error(`[LEAD BACKUP] ${saved ? "saved to file" : "NOT saved to file"} (${reason})`);
  try {
    after(() => sendAlert(record));
  } catch {
    // Outside a request scope `after` throws; send inline rather than not at all.
    void sendAlert(record);
  }
}
