/**
 * Receives Content-Security-Policy violation reports (see `csp` in
 * next.config.ts, which is report-only) and writes one compact log line per
 * violation, so the "week of clean reports" before enforcing can be read from
 * the server log rather than from one person's browser console.
 *
 * Two formats arrive:
 *   application/csp-report      `report-uri`, one report per request:
 *                               {"csp-report": {"violated-directive", "blocked-uri", "document-uri", ...}}
 *   application/reports+json    `report-to` (Chromium), an array of reports:
 *                               [{"type": "csp-violation", "url", "body": {"effectiveDirective", "blockedURL", "documentURL"}}]
 *
 * What is logged is deliberately small: the directive, the ORIGIN of the
 * blocked resource and the PATH of the page. Query strings and fragments are
 * dropped because they can carry personal data (an email in a search box, a
 * gclid, a token), and a report body can be sent by anyone, so nothing in it
 * is trusted, echoed in full or allowed to grow the log without bound.
 *
 * Always answers 204 for an accepted request: a browser does nothing with the
 * response, and a different answer for a malformed body only tells a prober
 * what was parsed.
 */
import { NextResponse } from "next/server";
import { clientIp } from "@/lib/clientIp";

const MAX_BODY_BYTES = 8 * 1024;

/** An empty answer that nothing may cache, matching /api/lead. */
function noStore(status: number) {
  return new NextResponse(null, { status, headers: { "Cache-Control": "no-store" } });
}
const MAX_LINES_PER_REQUEST = 10;

// Light, per-IP, in-process limit, keyed by the same `clientIp` as the lead
// route, so a direct hit on the origin cannot pick its own key once
// CF_ORIGIN_SECRET is set. The IP is never logged. One page with a missing origin can produce a
// burst of reports, so the cap is generous; it exists to stop one source from
// filling the log, not to count precisely.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 30;
const MAX_TRACKED_IPS = 2000;
const hits = new Map<string, { start: number; count: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start >= WINDOW_MS) {
    hits.delete(ip);
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > MAX_TRACKED_IPS) {
      const oldest = hits.keys().next().value;
      if (oldest !== undefined) hits.delete(oldest);
    }
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_WINDOW;
}

/** Short, printable, single-line. Report fields are attacker-controlled. */
function tidy(value: string, max = 100): string {
  return value.replace(/[^\x20-\x7E]/g, "?").slice(0, max);
}

/** Keywords such as `inline`, `eval` or `data` pass through; a URL becomes its
 *  origin only. */
function blockedOrigin(value: unknown): string {
  if (typeof value !== "string" || !value) return "-";
  try {
    const url = new URL(value);
    return url.origin === "null" ? `${url.protocol}` : url.origin;
  } catch {
    return /^[a-z-]{1,20}$/i.test(value) ? value : "?";
  }
}

/** The page path only, no host, query or fragment. */
function documentPath(value: unknown): string {
  if (typeof value !== "string" || !value) return "-";
  try {
    return new URL(value).pathname;
  } catch {
    return "?";
  }
}

type Violation = { directive: unknown; blocked: unknown; document: unknown };

function violations(contentType: string, data: unknown): Violation[] {
  if (contentType === "application/csp-report" || contentType === "application/json") {
    const r = (data as { "csp-report"?: Record<string, unknown> } | null)?.["csp-report"];
    if (!r || typeof r !== "object") return [];
    return [
      {
        directive: r["effective-directive"] ?? r["violated-directive"],
        blocked: r["blocked-uri"],
        document: r["document-uri"],
      },
    ];
  }
  // application/reports+json
  if (!Array.isArray(data)) return [];
  return data
    .filter((r) => r && typeof r === "object" && (r as { type?: unknown }).type === "csp-violation")
    .map((r) => {
      const body = ((r as { body?: unknown }).body ?? {}) as Record<string, unknown>;
      return {
        directive: body.effectiveDirective ?? body.violatedDirective,
        blocked: body.blockedURL,
        document: body.documentURL ?? (r as { url?: unknown }).url,
      };
    });
}

const ACCEPTED = new Set(["application/csp-report", "application/reports+json", "application/json"]);

export async function POST(request: Request) {
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ACCEPTED.has(contentType)) return noStore(415);

  if (limited(clientIp(request))) return noStore(429);

  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) {
    return noStore(413);
  }

  // Read at most MAX_BODY_BYTES, whatever Content-Length claimed.
  const reader = request.body?.getReader();
  if (!reader) return noStore(204);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return noStore(413);
      }
      chunks.push(value);
    }
  } catch {
    return noStore(400);
  }

  let data: unknown;
  try {
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return noStore(204);
  }

  for (const v of violations(contentType, data).slice(0, MAX_LINES_PER_REQUEST)) {
    const directive = typeof v.directive === "string" ? tidy(v.directive, 40) : "-";
    console.warn(
      `[CSP] directive=${directive} blocked=${tidy(blockedOrigin(v.blocked))} page=${tidy(documentPath(v.document))}`
    );
  }
  return noStore(204);
}
