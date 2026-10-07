import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const btn = p.locator('nav button[aria-expanded]').first();
await btn.click();
await p.waitForTimeout(600);
await p.screenshot({ path: "/tmp/claude-502/-Users-bilalshafqat-Desktop-bilal/da08536e-665d-436b-8ce6-e433389690b5/scratchpad/menu.png" });
await b.close();
