/**
 * Social quote cards for the daily post series (roadmap 394).
 *
 * One card design, rendered at every size the platforms want, from one piece of
 * text. The alternative is redrawing the same sentence four times per post and
 * seven posts a week, which is where consistency goes to die.
 *
 * Writes HTML to `.post-cards/` and leaves rendering to Chrome, so there is no
 * image library to install and the output is exactly what a browser paints.
 *
 *     node scripts/post-cards.mjs
 *     npm run cards            # same, plus the PNG render
 *
 * **On the reference.** Bilal supplied a Musemind card as the look he wants:
 * cream ground, dark green type, phrases in coloured highlight blocks. The
 * structure is borrowed and the palette is not. Their cream-and-green is their
 * brand; copying it would make his feed read as theirs, and someone who clicks
 * through from a cream card to a black site has been handed two companies.
 * These use `--color-bg` and `--color-gold` straight from `globals.css`.
 *
 * Two things from the reference are deliberately dropped:
 *
 *   - **The verified badge.** He is not verified. Drawing a platform's
 *     verification mark on your own graphic is a lie about the platform.
 *   - **The connector line between the two highlights.** It is the most
 *     recognisable thing on their card. Reusing it is how an account ends up
 *     looking like a copy of the account it learned from.
 */

import fs from "node:fs";
import path from "node:path";

/** Every size a platform actually wants, and what each one is for. */
export const SIZES = [
  { key: "link", w: 1200, h: 630, for: "Blog lead image, LinkedIn and Facebook link cards" },
  { key: "feed", w: 1080, h: 1350, for: "Instagram and Facebook feed (4:5, the tallest the feed allows)" },
  { key: "pin", w: 1000, h: 1500, for: "Pinterest (2:3, what the platform recommends)" },
  { key: "story", w: 1080, h: 1920, for: "Instagram and Facebook stories" },
];

/**
 * Post 1. To make the next card, copy this block and change the four fields.
 *
 * `lines` is the quote, split where it should break. A `*` wraps the phrase
 * that gets the gold block — one per line at most, because two highlights in
 * one line highlights nothing.
 */
export const CARDS = {
  "cost-per-lead": {
    slug: "cost-per-lead-is-fine-sales-team-unhappy",
    lines: ["Your *cost per lead* is fine.", "Your sales team is *still unhappy*."],
    kicker: "Paid marketing",
  },
};

const BRAND = {
  bg: "#08080b",
  ink: "#f5f5f7",
  muted: "#9a9aa6",
  gold: "#f2c94c",
  goldInk: "#14140f",
  border: "rgba(255,255,255,0.08)",
};

/** Scaled off the card's short edge, so one set of rules holds at 630px tall
 *  and at 1920px tall without a per-size stylesheet. */
const scale = (w, h) => Math.min(w, h) / 1000;

function markup({ lines, kicker, slug }, { w, h }) {
  const s = scale(w, h);
  const quote = lines
    .map(
      (line) =>
        `<span class="line">${line.replace(
          /\*([^*]+)\*/g,
          '<mark>$1</mark>',
        )}</span>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${kicker} card</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px}
  body{
    background:${BRAND.bg};
    color:${BRAND.ink};
    font-family:"Segoe UI",system-ui,-apple-system,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:${Math.round(86 * s)}px ${Math.round(80 * s)}px;
    overflow:hidden;position:relative;
  }
  /* A single soft gold wash, bottom right. One light source, far from the
     type, so nothing competes with the sentence. */
  body::after{
    content:"";position:absolute;right:${-18 * s}%;bottom:${-24 * s}%;
    width:${72 * s}%;aspect-ratio:1;border-radius:50%;
    background:radial-gradient(circle,rgba(242,201,76,.13),transparent 68%);
  }
  .top,.bottom,.quote{position:relative;z-index:1}
  .kicker{
    font-size:${Math.round(26 * s)}px;letter-spacing:.18em;text-transform:uppercase;
    color:${BRAND.gold};font-weight:600;
  }
  .quote{
    display:flex;flex-direction:column;gap:${Math.round(22 * s)}px;
    font-size:${Math.round(86 * s)}px;line-height:1.16;font-weight:700;
    letter-spacing:-0.02em;text-wrap:balance;
    /* Centres the quote in whatever space the kicker and footer leave, instead
       of letting space-between park it high with a hole underneath. */
    margin-block:auto;
  }
  .line{display:block}
  /* The highlight is a block behind the words, not a text colour: at feed size
     a coloured word disappears and a coloured block does not. */
  mark{
    background:${BRAND.gold};color:${BRAND.goldInk};
    padding:0 ${Math.round(14 * s)}px ${Math.round(6 * s)}px;
    border-radius:${Math.round(10 * s)}px;
    box-decoration-break:clone;-webkit-box-decoration-break:clone;
    /* The highlighted phrase never breaks across lines. Without this the block
       split the phrase in two and the card read as a rendering fault
       rather than as emphasis. The line wraps before the phrase instead. */
    white-space:nowrap;
  }
  .bottom{
    display:flex;align-items:center;justify-content:space-between;gap:${Math.round(30 * s)}px;
    border-top:1px solid ${BRAND.border};padding-top:${Math.round(34 * s)}px;
    font-size:${Math.round(27 * s)}px;color:${BRAND.muted};
  }
  .who{font-weight:600;color:${BRAND.ink}}
  .read{color:${BRAND.gold};font-weight:600;white-space:nowrap}
</style></head>
<body>
  <div class="top"><div class="kicker">${kicker}</div></div>
  <div class="quote">${quote}</div>
  <div class="bottom">
    <div><span class="who">Bilal Shafqat</span> &nbsp;·&nbsp; Dubai, UAE</div>
    <div class="read">bilalshafqat.com</div>
  </div>
</body></html>`;
}

const outDir = path.join(process.cwd(), ".post-cards");
fs.mkdirSync(outDir, { recursive: true });

let n = 0;
for (const [name, card] of Object.entries(CARDS)) {
  for (const size of SIZES) {
    const file = path.join(outDir, `${name}-${size.key}.html`);
    fs.writeFileSync(file, markup(card, size));
    n++;
  }
}
console.log(`wrote ${n} card(s) to .post-cards/`);
for (const s of SIZES) console.log(`  ${s.key.padEnd(6)} ${s.w}x${s.h}  ${s.for}`);
