/**
 * Renders the HTML written by `post-cards.mjs` to PNG, via headless Chrome.
 *
 * Chrome rather than an image library, for one reason: the card is already
 * described in CSS, and a browser is the only thing that paints CSS exactly
 * right. A canvas reimplementation would be a second renderer to keep in sync
 * with the first, and the two would disagree about text wrapping within a week.
 *
 * Chrome's path is read from `CHROME` when set, so this works on a machine
 * where it is installed somewhere else.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { SIZES } from "./post-cards.mjs";

const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME=/path/to/chrome and rerun.`);
  process.exit(1);
}

const dir = path.join(process.cwd(), ".post-cards");
const html = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
if (!html.length) {
  console.error("No HTML in .post-cards/. Run `node scripts/post-cards.mjs` first.");
  process.exit(1);
}

const sizeOf = (file) => SIZES.find((s) => file.endsWith(`-${s.key}.html`));

let n = 0;
for (const file of html) {
  const size = sizeOf(file);
  if (!size) continue;
  const png = path.join(dir, file.replace(/\.html$/, ".png"));
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${size.w},${size.h}`,
      `--screenshot=${png}`,
      "--virtual-time-budget=3000",
      `file://${path.join(dir, file)}`,
    ],
    { stdio: "ignore" },
  );
  n++;
}

console.log(`rendered ${n} PNG(s) to .post-cards/`);
console.log("Convert the one you want for the blog:");
console.log("  sips -s format jpeg -s formatOptions 82 .post-cards/<name>-link.png \\");
console.log("    --out public/blog/<name>/card.jpg");
