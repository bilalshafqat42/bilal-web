/**
 * Every size a platform actually wants for the social quote cards, and what
 * each one is for. Shared by `post-cards.mjs` (writes the HTML) and
 * `render-cards.mjs` (paints it). Lives here because `render-cards.mjs` used to
 * import it from `post-cards.mjs`, and importing that file runs it: every
 * render rewrote every card's HTML first (audit batch 3).
 */
export const SIZES = [
  { key: "link", w: 1200, h: 630, for: "Blog lead image, LinkedIn and Facebook link cards" },
  { key: "feed", w: 1080, h: 1350, for: "Instagram and Facebook feed (4:5, the tallest the feed allows)" },
  { key: "pin", w: 1000, h: 1500, for: "Pinterest (2:3, what the platform recommends)" },
  { key: "story", w: 1080, h: 1920, for: "Instagram and Facebook stories" },
];
