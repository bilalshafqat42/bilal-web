/**
 * One rule for "is this a website address", shared by the free health check
 * form (HealthCheckForm) and /api/lead, so the form can never accept an address
 * the route then refuses.
 *
 * No React and no browser APIs: `URL` exists in both places.
 */

/** A public host name: dotted labels ending in a letters-only or punycode TLD.
 *  `URL` has already lowercased it and converted any non-Latin name to
 *  punycode, so this only ever sees ASCII. */
const HOSTNAME = /^([a-z0-9-]+\.)+([a-z]{2,63}|xn--[a-z0-9-]{2,59})$/;

/** Longest address accepted, after trimming. */
export const WEBSITE_URL_MAX = 300;

/**
 * The normalised address, or `null` when the text is not a public http(s) site.
 *
 * A bare "example.com" is accepted and given `https://`, because that is how
 * most people type their own site. Refused: whitespace inside, a `javascript:`
 * or `data:` URL, a single word, an IP address, and an address carrying a
 * username or password, which nobody needs to send for a public site. What
 * comes back is `URL.href`, never the raw text.
 */
export function normaliseWebsite(text: string): string | null {
  const raw = text.trim();
  if (!raw || raw.length > WEBSITE_URL_MAX || /\s/.test(raw)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (parsed.username || parsed.password) return null;
  if (!HOSTNAME.test(parsed.hostname)) return null;
  return parsed.href.length > WEBSITE_URL_MAX ? null : parsed.href;
}
