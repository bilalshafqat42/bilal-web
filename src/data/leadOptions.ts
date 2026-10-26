/**
 * The option lists the appointment form renders, in a module both the form and
 * the API route can read.
 *
 * They lived inside the form component, which is `"use client"` — so the server
 * had no way to check a submitted value against the list it came from, and
 * `service`, `budget` and `timeline` were taken on trust. Anything can POST to
 * a public endpoint; a select element constrains the honest visitor and nobody
 * else.
 *
 * No React, no icons, no client APIs, so this is safe to import from a route
 * handler.
 */
export const BUDGET_OPTIONS: readonly string[] = [
  "Not sure yet",
  "Under AED 15,000",
  "AED 15,000 - 35,000",
  "AED 35,000 - 100,000",
  "Over AED 100,000",
];

export const TIMELINE_OPTIONS: readonly string[] = [
  "As soon as possible",
  "Within the next month",
  "One to three months",
  "Just exploring for now",
];

/** The last option in the /contact dropdown, after the pillar labels. Shared
 *  so the form renders exactly the value the route accepts: until 2026-10-14
 *  it was typed into ContactForm and missing here, so choosing it lost the
 *  enquiry to a 400. */
export const CONTACT_OTHER_OPTION = "Something else";

/** Free-text values the route accepts for `service` beyond the category titles
 *  and pillar labels: the labels other forms on the site legitimately send.
 *  Anything not in this set or in those lists is rejected rather than
 *  forwarded. See `src/data/leadAllowList.ts`. */
/** The `service` label the free health check form sends, so Performo files
 *  every request under one recognisable service (its public intake has no
 *  `source` field; see /api/lead). */
export const HEALTH_CHECK_SERVICE = "Free website health check";

/** The `source` the health check form sends to /api/lead and as `lead_source`
 *  on `generate_lead`. Also the thank-you page's `?source=` key. */
export const HEALTH_CHECK_SOURCE = "health-check";

/** "Main goal" on /free-website-health-check. The route drops any other value
 *  rather than forwarding it, like every other select on the site. */
export const HEALTH_CHECK_GOALS: readonly string[] = [
  "More enquiries",
  "Better tracking",
  "A faster site",
  "Not sure yet",
];

export const SERVICE_EXTRA_OPTIONS: readonly string[] = [
  "Appointment request",
  "General enquiry",
  CONTACT_OTHER_OPTION,
  HEALTH_CHECK_SERVICE,
];
