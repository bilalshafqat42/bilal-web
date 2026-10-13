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
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

if (typeof window !== "undefined") {
  throw new Error("leadBackup is server-only");
}

export type FailureReason = "crm_unset" | "crm_rejected" | "crm_unreachable";

export type BackupRecord = {
  savedAt: string;
  reason: FailureReason;
  status?: number;
  lead: Record<string, unknown>;
};

const DEFAULT_ALERT_EMAIL = "bilal@bilalshafqat.com";

/**
 * The backup directory, refusing anywhere inside the app.
 *
 * Inside the app means one of two bad outcomes: under `public/` or `.next/` it
 * could be served to anyone who guesses the path, and anywhere else in the app
 * folder it is wiped by the next deploy. A bad value falls back to the default
 * with a warning rather than failing, since losing the backup is worse.
 */
export function backupDir(): string {
  const fallback = path.join(os.homedir(), "lead-backup");
  const configured = process.env.LEAD_BACKUP_DIR?.trim();
  if (!configured) return fallback;
  const resolved = path.resolve(configured);
  const app = path.resolve(process.cwd());
  if (resolved === app || resolved.startsWith(app + path.sep)) {
    console.warn("[LEAD BACKUP] LEAD_BACKUP_DIR is inside the app folder; using the default instead.");
    return fallback;
  }
  return resolved;
}

/** Appends one lead as one line. Directory 0700 and file 0600, so only the
 *  account running Node can read it. */
export async function saveToFile(record: BackupRecord): Promise<boolean> {
  try {
    const dir = backupDir();
    await fs.mkdir(dir, { recursive: true, mode: 0o700 });
    const file = path.join(dir, "failed-leads.jsonl");
    await fs.appendFile(file, JSON.stringify(record) + "\n", { mode: 0o600, encoding: "utf8" });
    return true;
  } catch (err) {
    console.error("[LEAD BACKUP] could not write backup file:", (err as Error)?.message);
    return false;
  }
}

/** The lead in plain text. Values are already cleaned of control characters by
 *  the route, so nothing here can inject a header. */
function alertBody(record: BackupRecord): string {
  const lines = Object.entries(record.lead)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${String(v)}`);
  return [
    "A website lead did NOT reach Performo. Follow it up by hand, or run",
    "`npm run replay-leads` on the server once Performo is back.",
    "",
    `Reason: ${record.reason}${record.status ? ` (HTTP ${record.status})` : ""}`,
    `Time:   ${record.savedAt}`,
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
      subject: `Website lead not in Performo (${record.reason})`,
      text: alertBody(record),
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
    console.error("[LEAD BACKUP] alert email failed:", (err as Error)?.message);
    return false;
  }
}
