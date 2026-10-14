/**
 * Where a lead goes when Performo cannot take it. Server-only: it imports
 * node:fs and reads SMTP credentials, and must never be imported by a client
 * component.
 *
 * Before this, a failed CRM call left the lead in one redacted log line and
 * nowhere else. The visitor was offered WhatsApp, but anyone who closed the tab
 * instead was simply lost. Now two independent copies are attempted:
 *
 *  1. A JSON line appended to `${LEAD_BACKUP_DIR}/failed-leads.jsonl`, which
 *     `npm run replay-leads` re-posts to Performo once it is back.
 *  2. An email to LEAD_ALERT_EMAIL, so a lead is seen the same day even if
 *     nobody looks at the server.
 *
 * Either can fail without affecting the other, and neither ever throws into
 * the route.
 *
 * **UAE PDPL.** Both copies hold personal data in full, unlike the log. The
 * file lives outside the web root with owner-only permissions, and should be
 * deleted once replayed. See .env.local.example.
 */
// Fails the build if a client component ever imports this file. Resolved by
// Next to its bundled copy (next/dist/compiled/server-only), so no separate
// package is installed.
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { backupDir, PENDING_FILE } from "./leadBackupDir.mjs";

export type FailureReason = "crm_unset" | "crm_rejected" | "crm_unreachable";

export type BackupRecord = {
  savedAt: string;
  reason: FailureReason;
  status?: number;
  lead: Record<string, unknown>;
};

const DEFAULT_ALERT_EMAIL = "bilal@bilalshafqat.com";

/** Above this the file is still written (losing a lead is worse than a big
 *  file), but every write warns: it means Performo has been failing for a
 *  long time, or nobody has run `npm run replay-leads`. */
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Appends one lead as one line. Directory 0700 and file 0600, so only the
 *  account running Node can read it. The `mode` options apply only when the
 *  directory or file is created, so both are chmod-ed after every write too:
 *  a directory made by hand, or a file restored from a copy, is tightened. */
export async function saveToFile(record: BackupRecord): Promise<boolean> {
  try {
    const dir = backupDir();
    await fs.mkdir(dir, { recursive: true, mode: 0o700 });
    const file = path.join(dir, PENDING_FILE);
    await fs.appendFile(file, JSON.stringify(record) + "\n", { mode: 0o600, encoding: "utf8" });
    await fs.chmod(dir, 0o700).catch(() => {});
    await fs.chmod(file, 0o600).catch(() => {});
    const { size } = await fs.stat(file);
    if (size > MAX_FILE_BYTES) {
      console.warn(
        `[LEAD BACKUP] ${PENDING_FILE} is ${(size / 1024 / 1024).toFixed(1)} MB (over 5 MB). ` +
          "Performo has been failing for a while: check it, then run `npm run replay-leads`."
      );
    }
    return true;
  } catch (err) {
    console.error("[LEAD BACKUP] could not write backup file:", (err as Error)?.message);
    return false;
  }
}

/** One alert per ALERT_WINDOW_MS at most. When Performo goes down, every lead
 *  fails at once; one email per lead would bury the inbox and could trip the
 *  mailbox's sending limit, which then blocks the alert that matters. Leads
 *  skipped here are still in the backup file, and the next alert says how many
 *  there were. Per process, which on this single Node server is the whole site. */
const ALERT_WINDOW_MS = 10 * 60 * 1000;
let lastAlertAt = 0;
let failedSinceLastAlert = 0;

/** The lead in plain text. Values are already cleaned of control characters by
 *  the route, so nothing here can inject a header. */
function alertBody(record: BackupRecord, othersSinceLast: number): string {
  const lines = Object.entries(record.lead)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${String(v)}`);
  return [
    "A website lead did NOT reach Performo. Follow it up by hand, or run",
    "`npm run replay-leads` on the server once Performo is back.",
    "",
    `Reason: ${record.reason}${record.status ? ` (HTTP ${record.status})` : ""}`,
    `Time:   ${record.savedAt}`,
    ...(othersSinceLast > 0
      ? [
          "",
          `${othersSinceLast} other lead(s) also failed since the last alert. Alerts are`,
          "limited to one per 10 minutes; those leads are in the backup file only.",
        ]
      : []),
    "",
    ...lines,
    "",
    "This email contains personal data (UAE PDPL). Delete it once the lead is in Performo.",
  ].join("\n");
}

/** Emails the lead. Skipped, with a log line, when SMTP is not configured. */
export async function sendAlert(record: BackupRecord): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("[LEAD BACKUP] SMTP not configured; no alert email sent.");
    return false;
  }
  const now = Date.now();
  if (now - lastAlertAt < ALERT_WINDOW_MS) {
    failedSinceLastAlert++;
    console.warn(
      `[LEAD BACKUP] alert skipped (one per 10 min); ${failedSinceLastAlert} lead(s) waiting for the next alert.`
    );
    return false;
  }
  // Claimed before the send, so failures arriving during a slow SMTP call do
  // not each start their own email. Restored if the send fails.
  const previousAlertAt = lastAlertAt;
  const othersSinceLast = failedSinceLastAlert;
  lastAlertAt = now;
  failedSinceLastAlert = 0;
  try {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 8_000,
    });
    const send = transport.sendMail({
      from: process.env.LEAD_ALERT_FROM || SMTP_USER,
      to: process.env.LEAD_ALERT_EMAIL || DEFAULT_ALERT_EMAIL,
      subject:
        othersSinceLast > 0
          ? `Website leads not in Performo (${record.reason}, +${othersSinceLast} more)`
          : `Website lead not in Performo (${record.reason})`,
      text: alertBody(record, othersSinceLast),
    });
    // The transport timeouts cover each socket step; this caps the whole send.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("SMTP send timed out after 8s")), 8_000);
    });
    try {
      await Promise.race([send, timeout]);
    } finally {
      clearTimeout(timer);
      transport.close();
    }
    return true;
  } catch (err) {
    lastAlertAt = previousAlertAt;
    failedSinceLastAlert += othersSinceLast;
    console.error("[LEAD BACKUP] alert email failed:", (err as Error)?.message);
    return false;
  }
}
