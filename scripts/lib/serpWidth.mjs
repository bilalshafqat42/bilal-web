/**
 * How wide a string renders in a Google result, in pixels.
 *
 * Moved out of `serp-preview.mjs` on 2026-10-19 so `site-audit.mjs` can flag
 * descriptions by width with the same numbers. Character limits are a proxy
 * for this: on 2026-10-19 the crawl found 64 descriptions between 120 and 160
 * characters, so the audit passed them, that were still wider than 920px and
 * cut off with an ellipsis.
 *
 * Google renders desktop titles at roughly Arial 20px and truncates near 600px;
 * descriptions at roughly 14px, truncating near 920px across two lines. Those
 * numbers move, so treat a result near the limit as "probably fine" rather than
 * as a guarantee.
 */

// Arial advance widths at 1px em, for the characters that actually appear in
// these titles. Everything unlisted falls back to an average.
export const W = {
  " ": 0.278, "!": 0.278, '"': 0.355, "&": 0.667, "'": 0.191, "(": 0.333, ")": 0.333,
  ",": 0.278, "-": 0.333, ".": 0.278, "/": 0.278, ":": 0.278, ";": 0.278, "?": 0.556,
  "—": 1.0, "–": 0.556, "·": 0.278,
  a: 0.556, b: 0.556, c: 0.5, d: 0.556, e: 0.556, f: 0.278, g: 0.556, h: 0.556,
  i: 0.222, j: 0.222, k: 0.5, l: 0.222, m: 0.833, n: 0.556, o: 0.556, p: 0.556,
  q: 0.556, r: 0.333, s: 0.5, t: 0.278, u: 0.556, v: 0.5, w: 0.722, x: 0.5,
  y: 0.5, z: 0.5,
  A: 0.667, B: 0.667, C: 0.722, D: 0.722, E: 0.667, F: 0.611, G: 0.778, H: 0.722,
  I: 0.278, J: 0.5, K: 0.667, L: 0.556, M: 0.833, N: 0.722, O: 0.778, P: 0.667,
  Q: 0.778, R: 0.722, S: 0.667, T: 0.611, U: 0.722, V: 0.667, W: 0.944, X: 0.667,
  Y: 0.667, Z: 0.611,
  0: 0.556, 1: 0.556, 2: 0.556, 3: 0.556, 4: 0.556, 5: 0.556, 6: 0.556, 7: 0.556,
  8: 0.556, 9: 0.556,
};

/** Rendered width of `s` at font size `size`, in pixels. */
export const px = (s, size) => [...s].reduce((n, c) => n + (W[c] ?? 0.55) * size, 0);

export const TITLE_SIZE = 20;
export const DESC_SIZE = 14;
export const TITLE_LIMIT = 600; // desktop, approximate
export const DESC_LIMIT = 920;  // two lines, approximate
