import { NextResponse, after } from "next/server";
import { clientIp, truncateIp } from "@/lib/clientIp";
import { saveToFile, sendAlert, type BackupRecord, type FailureReason } from "@/lib/leadBackup";
import { ALLOWED_SERVICES, ALLOWED_BUDGETS, ALLOWED_TIMELINES, ALLOWED_GOALS } from "@/data/leadAllowList";
import { HEALTH_CHECK_SERVICE, HEALTH_CHECK_SOURCE } from "@/data/leadOptions";
import { normaliseWebsite, WEBSITE_URL_MAX } from "@/lib/websiteUrl";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

/** Every answer from this route, success or refusal, carries `no-store`: a
 *  response about one person's enquiry must never be cached by a browser, a
 *  proxy or Cloudflare. */
function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

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
  /** The spam trap, under HONEYPOT_FIELD's key ("hp_x7q"). Any non-empty
   *  value marks a bot. Older keys ("botcheck", "company") are ignored. */
  [HONEYPOT_FIELD]?: unknown;
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
  /** The free health check (/free-website-health-check): the site to review,
   *  and the visitor's main goal from a fixed list. Performo's public intake
   *  has no field for either, so both are written into the message. */
  websiteUrl?: string;
  goal?: string;
  /** Cloudflare Turnstile response, verified server-side when a secret is set. */
  turnstileToken?: string;
};

/** The LeadPayload fields that must be strings when present. */
const STRING_FIELDS = [
  "name", "email", "phone", "message", "service", "meetingTime", "source", "pageUrl",
  "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "eventId", "fbp", "fbc",
  "serviceInterest", "budget", "timeline", "websiteUrl", "goal", "turnstileToken",
] as const satisfies readonly (keyof LeadPayload)[];

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
 * The website address from the free health check form, or why it was refused.
 *
 * The raw value is checked for length before anything is cleaned: `clean()`
 * truncates, and a truncated address is a different address. Then it is
 * cleaned like every other field (control characters out) and checked by
 * `normaliseWebsite`, the same rule the form runs before sending. Only the
 * normalised form (`URL.href`) is forwarded, never the text as typed.
 */
function websiteFrom(value: unknown): { url?: string; invalid: boolean } {
  if (typeof value === "string" && value.trim().length > WEBSITE_URL_MAX) return { invalid: true };
  const raw = clean(value, WEBSITE_URL_MAX);
  if (!raw) return { invalid: false };
  const url = normaliseWebsite(raw);
  return url ? { url, invalid: false } : { invalid: true };
}

/**
 * The message as it reaches the CRM.
 *
 * Performo's public intake (`/api/public/submissions`) stores a fixed list of
 * text fields and ignores everything else: there is no `source`, website or
 * custom field. So the health check's answers go where whoever reads the lead
 * will see them, at the top of the message, and the request is labelled by its
 * `service` ("Free website health check"). Checked against Performo's route on
 * 2026-10-26; Performo itself was not changed.
 */
function composeMessage(v: { service?: string; websiteUrl?: string; goal?: string; message?: string }) {
  if (!v.websiteUrl && !v.goal) return v.message;
  const lines = [
    v.service === HEALTH_CHECK_SERVICE ? "Free website health check request" : null,
    v.websiteUrl ? `Website: ${v.websiteUrl}` : null,
    v.goal ? `Main goal: ${v.goal}` : null,
  ].filter(Boolean);
  return v.message ? `${lines.join("\n")}\n\n${v.message}` : lines.join("\n");
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
    `[LEAD REJECTED] ${JSON.stringify({ reason, ip: truncateIp(ip), at: new Date().toISOString(), ...detail })}`
  );
}

/** Origins allowed to post a lead. A browser always sends `Origin` on a
 *  cross-site POST, so a page elsewhere cannot submit through a visitor's
 *  browser. No `Origin` at all is let through: server-side callers and the
 *  lead-probe script send none, and those are not a browser-borne attack. */
const ALLOWED_ORIGINS = new Set(["https://bilalshafqat.com", "https://www.bilalshafqat.com"]);
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

function originAllowed(origin: string | null): boolean {
  if (origin === null) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== "production" && LOCAL_ORIGIN.test(origin);
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
 *  Enforced only when the forms were BUILT with a site key AND the server has
 *  the secret at runtime.
 *
 *  The forms render the widget, and so send a token, only when
 *  NEXT_PUBLIC_TURNSTILE_SITE_KEY was in the environment at `next build`: it is
 *  inlined into the client bundle then. This check used to read that variable
 *  at runtime instead, so setting both keys on Hostinger and restarting
 *  without rebuilding left forms with no widget talking to a route demanding a
 *  token, and every lead was refused (reproduced 2026-10-14).
 *  `TURNSTILE_ENABLED_AT_BUILD` is set in next.config.ts from the same build
 *  environment the forms saw, so the two cannot disagree. */
async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || process.env.TURNSTILE_ENABLED_AT_BUILD !== "1") return true;
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
    return json(
      { success: false, error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // A cross-site page can POST text/plain or a form without a preflight;
  // only same-origin script (or a preflighted request, which CORS then
  // refuses) can send application/json. Requiring it, plus a known Origin,
  // closes that door. The site's only caller, useLeadSubmit, sends JSON.
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    logRejection("unsupported_content_type", ip, { contentType: contentType.slice(0, 60) });
    return json(
      { success: false, error: "Send the form as application/json." },
      { status: 415 }
    );
  }
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) {
    logRejection("foreign_origin", ip, { origin: (origin ?? "").slice(0, 100) });
    return json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    logRejection("payload_too_large_declared", ip, { declared });
    return json(
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
    return json({ success: false, error: "Invalid request body." }, { status: 400 });
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    logRejection("payload_too_large_actual", ip, { bytes: raw.length });
    return json(
      { success: false, error: "That submission is too large." },
      { status: 413 }
    );
  }

  let body: LeadPayload;
  try {
    body = JSON.parse(raw) as LeadPayload;
  } catch {
    logRejection("invalid_json", ip, { bytes: raw.length });
    return json({ success: false, error: "Invalid request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    logRejection("not_an_object", ip);
    return json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Answer exactly as a delivered
  // lead does, same status, body and headers, so a bot cannot tell it was
  // caught and retry with the field removed.
  //
  // This used to add `counted: false` so the client would skip the conversion
  // pixel. That made the trap detectable from the response. The client now
  // skips the pixel on its own: it knows whether it sent a trap value.
  //
  // Only HONEYPOT_FIELD counts. The trap was once a field named "company",
  // which browser autofill filled for real people, so their enquiries were
  // dropped as spam. Neither "company" nor the old "botcheck" key is a bot
  // signal here: a real company name must never block a lead.
  const trap = body[HONEYPOT_FIELD];
  if (trap !== undefined && trap !== null && trap !== "" && trap !== false) {
    recordHit(ip);
    logRejection("honeypot", ip, { source: clean(body.source, LIMITS.generic) });
    return json({ success: true });
  }


  // Every field the payload type declares as a string must be a string (or
  // absent/null). A number or object there is not a browser filling in a form,
  // so it is refused with a 400 rather than half-processed.
  const wrongType = STRING_FIELDS.find((k) => body[k] != null && typeof body[k] !== "string");
  const badAttribution =
    body.attribution != null && (typeof body.attribution !== "object" || Array.isArray(body.attribution));
  if (wrongType || badAttribution) {
    logRejection("invalid_field_type", ip, { field: wrongType ?? "attribution" });
    return json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Nothing in `body` is typed by the time it arrives: a field declared as a
  // string can be a number, an array or an object. Every string is read via
  // `clean()`, which returns undefined for anything that is not a string, and
  // `attribution` is used only if it is a plain object. `source` was the one
  // field used raw (`.includes()`), so `"source": 123` threw a 500.
  const source = clean(body.source, LIMITS.generic);
  const attribution: Attribution | undefined =
    body.attribution && typeof body.attribution === "object" && !Array.isArray(body.attribution)
      ? body.attribution
      : undefined;
  // Every free-text field is trimmed, length-capped and stripped of control
  // characters before it goes anywhere. Nothing below is used as received.
  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const message = clean(body.message, LIMITS.message, true);

  if (!name || !email) {
    logRejection("missing_required", ip, { hasName: !!name, hasEmail: !!email });
    return json(
      { success: false, error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL.test(email)) {
    logRejection("invalid_email", ip);
    return json(
      { success: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // The health check's website address. Refused rather than dropped, unlike
  // the selects below: it is the one thing that request is about, and the
  // form checks it by the same rules before sending, so only a hand-made
  // request reaches this with a bad value.
  const website = websiteFrom(body.websiteUrl);
  if (website.invalid) {
    logRejection("invalid_website", ip);
    return json(
      { success: false, error: "That website address doesn't look right. Try something like yourcompany.com." },
      { status: 400 }
    );
  }
  if (source === HEALTH_CHECK_SOURCE && !website.url) {
    logRejection("missing_website", ip);
    return json(
      { success: false, error: "Please add the address of the website you would like checked." },
      { status: 400 }
    );
  }
  const websiteUrl = website.url;

  // Whitelisted against the same lists the form renders from. A select
  // constrains an honest visitor and nobody else, so an unrecognised value is
  // never passed through to the CRM.
  //
  // It is DROPPED, not refused (audit batch 1, 2026-10-24). Refusing with a
  // 400 lost the whole enquiry over one optional field: a renamed option, a
  // stale cached form or a translated label was enough. Name and email are
  // valid by this point, so the lead goes through without the unknown answer.
  // Only the field's name is logged, never the value the visitor sent.
  //
  // The /contact dropdown lists the four pillar labels, not the fifteen
  // service titles. Until 2026-10-14 only the titles were allowed here, so
  // three of the four contact-page choices were rejected with a 400 and the
  // enquiry was lost without a fallback. Both lists are accepted now, from
  // `src/data/leadAllowList.ts`, which `npm run lead-options-check` tests
  // against every list the forms render.
  const dropped: string[] = [];
  const allowed = (field: string, value: string | undefined, list: ReadonlySet<string>) => {
    if (!value) return undefined;
    if (list.has(value)) return value;
    dropped.push(field);
    return undefined;
  };
  const service = allowed("service", clean(body.service, LIMITS.generic), ALLOWED_SERVICES);
  const serviceInterest = allowed(
    "serviceInterest",
    clean(body.serviceInterest, LIMITS.generic),
    ALLOWED_SERVICES
  );
  const budget = allowed("budget", clean(body.budget, LIMITS.generic), ALLOWED_BUDGETS);
  const timeline = allowed("timeline", clean(body.timeline, LIMITS.generic), ALLOWED_TIMELINES);
  const goal = allowed("goal", clean(body.goal, LIMITS.generic), ALLOWED_GOALS);
  if (dropped.length) {
    console.warn(`[LEAD FIELD DROPPED] ${JSON.stringify({ fields: dropped, at: new Date().toISOString() })}`);
  }

  // Turnstile runs after the cheap field checks, so a malformed request never
  // costs a call to Cloudflare. A failure is counted against the limit: it is
  // either a bot or a real visitor whose widget did not load, and the latter
  // is offered WhatsApp and email by `fallback: true` rather than a dead end.
  if (!(await turnstileOk(clean(body.turnstileToken, 4096), ip))) {
    recordHit(ip);
    logRejection("turnstile_failed", ip);
    return json(
      { success: false, fallback: true, error: "Could not verify that submission. Please try again." },
      { status: 403 }
    );
  }

  // Valid from here on, so it counts towards the limit whatever happens next.
  recordHit(ip);

  // Anything that throws after this point is our bug, not the visitor's, so
  // the lead is kept and the visitor offered WhatsApp and email exactly as on
  // a CRM failure, instead of an unhandled 500 that loses the enquiry.
  try {
    return await deliver({
      body, source, attribution, name, email, phone,
      message: composeMessage({ service, websiteUrl, goal, message }),
      service, serviceInterest, budget, timeline,
    });
  } catch (err) {
    const e = err as Error;
    console.error("[LEAD NOT DELIVERED — route error]", `${e?.name ?? "Error"}: ${safeDetail(String(e?.message ?? ""))}`);
    await backUp(
      {
        type: (source ?? "").includes("whatsapp") ? "chat" : "form",
        name, email, phone,
        message: composeMessage({ service, websiteUrl, goal, message }),
        service: serviceInterest || service, budget, timeline,
      },
      "route_error"
    );
    return json(
      { success: false, fallback: true, error: "Something went wrong saving your enquiry." },
      { status: 500 }
    );
  }
}

/** The validated fields `deliver` builds the CRM record from. */
type Validated = {
  body: LeadPayload;
  source?: string;
  attribution?: Attribution;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  service?: string;
  serviceInterest?: string;
  budget?: string;
  timeline?: string;
};

/** Builds the CRM record and sends it. Runs only after validation passed. */
async function deliver(v: Validated) {
  const { body, source, attribution, name, email, phone, message, service, serviceInterest, budget, timeline } = v;
  const { meetingTime, pageUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, eventId, fbp, fbc } = body;

  const isChat = (source ?? "").includes("whatsapp");

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
    return json(
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
    return json(
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
    return json(
      { success: false, fallback: true, error: "The lead system rejected this submission." },
      { status: 502 }
    );
  }

  // Nobody reads the CRM's success body; release the connection now rather
  // than leaving it for the garbage collector.
  await crmResponse.body?.cancel().catch(() => {});
  return json({ success: true });
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
