/**
 * Safe way to exercise /api/lead without risking a real CRM record.
 *
 * This exists because of a specific mistake: testing the hardened endpoint, I
 * started the server with `env -u CRM_LEAD_API_URL` believing that made
 * delivery impossible. It does not — Next loads `.env.local` at runtime and a
 * shell unset does not override it. One valid probe was forwarded and accepted,
 * creating a real lead in Performo named "A".
 *
 * The lesson was not "be careful". It was that the safety property has to be
 * *proved* before anything acceptable is sent, not assumed from how the command
 * was written. So this script proves it first and refuses to continue if it
 * cannot.
 *
 * Usage:  npm run lead-probe
 *
 * That script sets the blackhole URL for the server and for this check from a
 * single value, so the two cannot disagree — which is the failure that created
 * the unwanted records in the first place.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const API = `${BASE}/api/lead`;

const post = (body, ip = "203.0.113.1") =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

/**
 * Establishes that delivery is impossible WITHOUT sending anything to the route.
 *
 * The first version of this proved it by posting a valid lead and requiring a
 * 502. That is circular: against a live CRM the proof itself is delivered, and
 * it created a second unwanted record before refusing to continue. A safety
 * check that has to cause the harm to detect it is not a safety check.
 *
 * So the operator passes the same blackhole URL the server was started with,
 * and this asserts it is genuinely unreachable from here before any request is
 * made. Use the `lead-probe` npm script, which sets both from one value so they
 * cannot drift apart.
 */
async function proveUndeliverable() {
  const url = process.env.CRM_LEAD_API_URL;
  if (!url) {
    console.error("\n  REFUSING TO RUN. CRM_LEAD_API_URL is not set for this script.");
    console.error("  It must be the same blackhole URL the server was started with, so");
    console.error("  this can verify it is unreachable. Use: npm run lead-probe\n");
    return false;
  }
  try {
    await fetch(url, {
      method: "POST",
      body: "{}",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    console.log(`  safety proof: ${url} is unreachable from here. Continuing.\n`);
    return true;
  }
  console.error(`\n  REFUSING TO RUN. ${url} answered, so it is a live endpoint.`);
  console.error("  Point CRM_LEAD_API_URL at a closed port, e.g.");
  console.error("  http://127.0.0.1:9/blackhole, for BOTH the server and this script.");
  console.error("  Note: `env -u` does NOT work — Next reads .env.local at runtime.\n");
  return false;
}

if (!(await proveUndeliverable())) process.exit(1);

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const NUL = String.fromCharCode(0);

const cases = [
  ["oversized body", 413, { name: "A", email: "a@b.co", message: "x".repeat(40000) }],
  ["unknown service", 400, { name: "A", email: "a@b.co", service: "Bitcoin Mining" }],
  ["unknown budget", 400, { name: "A", email: "a@b.co", budget: "AED 9,999,999" }],
  ["unknown timeline", 400, { name: "A", email: "a@b.co", timeline: "yesterday" }],
  ["missing name/email", 400, { message: "hi" }],
  ["bad email format", 400, { name: "A", email: "not-an-email" }],
  ["array body", 400, "[1,2,3]"],
  ["malformed JSON", 400, "{oops"],
  ["honeypot filled", 200, { name: "A", email: "a@b.co", botcheck: "x" }],
  [
    "CRLF injection",
    502,
    {
      name: `Real${CR}${LF}Bcc: attacker@evil.test`,
      email: "a@b.co",
      message: `line1${CR}${LF}line2${NUL}  spaced`,
    },
  ],
];

let failed = 0;
for (const [label, want, body] of cases) {
  // A fresh IP per case, so the rate limiter does not mask the check.
  const ip = `198.51.100.${Math.floor(Math.random() * 250) + 1}`;
  const res = await post(body, ip);
  const ok = res.status === want;
  if (!ok) failed++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${label.padEnd(20)} want ${want}, got ${res.status}`);
}

// The rate limiter, from one IP so the window actually fills.
const statuses = [];
for (let i = 0; i < 7; i++) {
  statuses.push((await post({ name: "RL", email: "rl@example.invalid" }, "203.0.113.99")).status);
}
const limited = statuses.filter((s) => s === 429).length;
const rlOk = limited === 2 && statuses.slice(0, 5).every((s) => s !== 429);
if (!rlOk) failed++;
console.log(`  ${rlOk ? "pass" : "FAIL"}  rate limit           5 allowed then 429: ${statuses.join(",")}`);

if (failed) {
  console.error(`\n${failed} guard(s) failed.\n`);
  process.exit(1);
}
console.log(`\nAll ${cases.length + 1} guards on /api/lead behave as expected.`);
