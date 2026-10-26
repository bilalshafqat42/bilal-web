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
 *
 * Every accepted probe uses an `@example.invalid` address. With the CRM
 * unreachable, the route now writes each one to the lead backup file (and
 * emails it if SMTP is set); `npm run replay-leads` discards `.invalid`
 * addresses, so none of them can reach Performo later.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const API = `${BASE}/api/lead`;

const post = (body, ip = "203.0.113.1", headers = {}) =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": ip, ...headers },
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
  ["oversized body", 413, { name: "A", email: "a@example.invalid", message: "x".repeat(40000) }],
  // An unknown dropdown value is dropped, not refused: the lead still goes on
  // to delivery (502 here, because the CRM is blackholed). Until audit batch 1
  // (2026-10-24) each of these was a 400 and the whole enquiry was lost.
  ["unknown service", 502, { name: "A", email: "a@example.invalid", service: "Bitcoin Mining" }],
  ["unknown interest", 502, { name: "A", email: "a@example.invalid", serviceInterest: "Bitcoin Mining" }],
  ["unknown budget", 502, { name: "A", email: "a@example.invalid", budget: "AED 9,999,999" }],
  ["unknown timeline", 502, { name: "A", email: "a@example.invalid", timeline: "yesterday" }],
  ["missing name/email", 400, { message: "hi" }],
  ["bad email format", 400, { name: "A", email: "not-an-email" }],
  ["array body", 400, "[1,2,3]"],
  ["malformed JSON", 400, "{oops"],
  ["honeypot filled", 200, { name: "A", email: "a@example.invalid", hp_x7q: "x" }],
  ["old company key", 502, { name: "A", email: "a@example.invalid", company: "Acme Ltd" }],
  ["old botcheck key", 502, { name: "A", email: "a@example.invalid", botcheck: "Acme Ltd" }],
  // A non-string where a string belongs used to reach `.includes()` and 500.
  ["source as a number", 400, { name: "A", email: "a@example.invalid", source: 123 }],
  ["attribution as text", 400, { name: "A", email: "a@example.invalid", attribution: "x" }],
  ["text/plain body", 415, { name: "A", email: "a@example.invalid" }, { "Content-Type": "text/plain" }],
  ["foreign Origin", 403, { name: "A", email: "a@example.invalid" }, { Origin: "https://evil.example" }],
  ["site Origin", 502, { name: "A", email: "a@example.invalid" }, { Origin: "https://bilalshafqat.com" }],
  // Every /contact dropdown value must be accepted (502 = valid, CRM
  // blackholed), not refused. Three of these were 400s until 2026-10-14.
  ...[
    "Paid Marketing & Lead Generation",
    "Website & App Development",
    "Design, Content & Conversion",
    "CRM & Marketing Automation",
    "Something else",
  ].map((service) => [`contact: ${service.slice(0, 12)}`, 502, { name: "A", email: "a@example.invalid", service }]),
  // The free health check (2026-10-26): `websiteUrl` is required for that
  // source and must be a public http(s) address; `goal` is a select, so an
  // unknown one is dropped like the others rather than refused.
  ...(() => {
    const hc = {
      name: "A",
      email: "a@example.invalid",
      source: "health-check",
      service: "Free website health check",
      goal: "More enquiries",
    };
    return [
      ["health check: valid", 502, { ...hc, websiteUrl: "example.com" }],
      ["health check: no site", 400, { ...hc }],
      ["health check: js url", 400, { ...hc, websiteUrl: "javascript:alert(1)" }],
      ["health check: login url", 400, { ...hc, websiteUrl: "https://user:pass@example.com" }],
      ["health check: one word", 400, { ...hc, websiteUrl: "localhost" }],
      ["health check: ip address", 400, { ...hc, websiteUrl: "http://127.0.0.1:9099" }],
      ["health check: too long", 400, { ...hc, websiteUrl: `https://example.com/${"a".repeat(400)}` }],
      ["health check: bad goal", 502, { ...hc, websiteUrl: "https://example.com", goal: "Get rich" }],
      ["health check: url as number", 400, { ...hc, websiteUrl: 42 }],
    ];
  })(),
  [
    "CRLF injection",
    502,
    {
      name: `Real${CR}${LF}Bcc: attacker@evil.test`,
      email: "a@example.invalid",
      message: `line1${CR}${LF}line2${NUL}  spaced`,
    },
  ],
];

let failed = 0;
for (const [i, [label, want, body, headers]] of cases.entries()) {
  // A fresh IP per case, so the rate limiter does not mask the check.
  const ip = `198.51.100.${i + 1}`;
  const res = await post(body, ip, headers);
  const ok = res.status === want;
  if (!ok) failed++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${label.padEnd(20)} want ${want}, got ${res.status}`);
}

// Rejected submissions must not use up the window: a person fixing a typo in
// their email should not be locked out by their own mistakes.
{
  const ip = "203.0.113.77";
  for (let i = 0; i < 6; i++) await post({ name: "T", email: "not-an-email" }, ip);
  const after = (await post({ name: "T", email: "t@example.invalid" }, ip)).status;
  const ok = after !== 429;
  if (!ok) failed++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${"typos not counted".padEnd(20)} valid after 6 rejected: ${after}`);
}

// Unknown service value -> still delivered. The CRM is blackholed, so
// "delivered" here means the lead reached the delivery step: the visitor is
// offered the fallback, and the lead is in the backup file (the script sets
// LEAD_BACKUP_DIR to a fresh temp folder) with the unknown value removed.
{
  const marker = `unknown-service-${Date.now()}@example.invalid`;
  const res = await post(
    { name: "U", email: marker, service: "Bitcoin Mining", budget: "AED 9,999,999", message: "probe" },
    "203.0.113.55"
  );
  const data = await res.json().catch(() => ({}));
  let record;
  const dir = process.env.LEAD_BACKUP_DIR;
  if (dir) {
    const { readFile } = await import("node:fs/promises");
    const lines = (await readFile(`${dir}/failed-leads.jsonl`, "utf8").catch(() => "")).split("\n");
    record = lines.filter(Boolean).map((l) => JSON.parse(l)).find((r) => r.lead?.email === marker);
  }
  const ok =
    res.status === 502 &&
    data.fallback === true &&
    (!dir ||
      (record && record.lead.service === undefined && record.lead.budget === undefined && record.lead.message === "probe"));
  if (!ok) failed++;
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${"unknown service → still delivered".padEnd(20)} ${res.status}, fallback ${data.fallback}, ` +
      (dir ? (record ? `backed up without the unknown values: ${record.lead.service === undefined && record.lead.budget === undefined}` : "NOT in backup file") : "backup not checked (LEAD_BACKUP_DIR unset)")
  );
}

// A health check request reaches delivery with the website and goal written
// into the message, since Performo's public intake has no field for either,
// and labelled by `service`. Control characters in the address are stripped
// and the address is normalised; the visitor's own note comes after.
{
  const marker = `health-check-${Date.now()}@example.invalid`;
  const res = await post(
    {
      name: "H",
      email: marker,
      source: "health-check",
      service: "Free website health check",
      websiteUrl: `  Example.com/contact${CR}${LF}`,
      goal: "Better tracking",
      message: "probe note",
    },
    "203.0.113.66"
  );
  let record;
  const dir = process.env.LEAD_BACKUP_DIR;
  if (dir) {
    const { readFile } = await import("node:fs/promises");
    const lines = (await readFile(`${dir}/failed-leads.jsonl`, "utf8").catch(() => "")).split("\n");
    record = lines.filter(Boolean).map((l) => JSON.parse(l)).find((r) => r.lead?.email === marker);
  }
  const want =
    "Free website health check request\nWebsite: https://example.com/contact\nMain goal: Better tracking\n\nprobe note";
  const ok =
    res.status === 502 &&
    (!dir || (record && record.lead.message === want && record.lead.service === "Free website health check"));
  if (!ok) failed++;
  console.log(
    `  ${ok ? "pass" : "FAIL"}  ${"health check → message carries site and goal".padEnd(20)} ${res.status}, ` +
      (dir ? (record ? `message ${JSON.stringify(record.lead.message)}` : "NOT in backup file") : "backup not checked (LEAD_BACKUP_DIR unset)")
  );
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
console.log(`\nAll ${cases.length + 4} guards on /api/lead behave as expected.`);
