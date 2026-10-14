import { timingSafeEqual } from "node:crypto";

/**
 * The visitor's IP, for rate limiting and logs. Shared by the lead route and
 * the CSP report route, so both trust `cf-connecting-ip` on the same terms.
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
export function fromCloudflare(request: Request): boolean {
  const secret = process.env.CF_ORIGIN_SECRET;
  if (!secret) return true; // not configured yet: keep the previous behaviour
  const sent = request.headers.get("x-origin-auth") ?? "";
  const a = Buffer.from(sent);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function lastForwardedFor(request: Request): string {
  const chain = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return chain[chain.length - 1] || "unknown";
}

export function clientIp(request: Request): string {
  // With CF_ORIGIN_SECRET set and the header wrong, the request did not come
  // through Cloudflare, so the client wrote every header it sent, including
  // `x-real-ip` if the origin proxy passes a client value through. Only the
  // last X-Forwarded-For entry, appended by our own proxy, is used then.
  // Unset secret: unchanged, so nothing moves until the Transform Rule exists.
  if (process.env.CF_ORIGIN_SECRET && !fromCloudflare(request)) {
    return lastForwardedFor(request);
  }
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return lastForwardedFor(request);
}
