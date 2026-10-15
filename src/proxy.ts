// Renamed from `middleware.ts` on 2026-09-14. Next 16 deprecated the
// middleware file convention in favour of `proxy`, and warned on every dev
// start and every build. The file name, the exported function name and the
// runtime behaviour are the only things that change; the matcher and the bot
// reporting below are untouched.
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// Only run against real page requests — static assets, Next's own internals,
// and known file extensions never need bot detection and would just add
// noise (and cost) to every image/script/font request on the site.
//
// One exception: `/llms.txt` and `/llms-full.txt`. They exist for AI
// assistants, so an answer engine fetching them is exactly the visit this file
// is here to count, and the blanket `.txt` exclusion hid every one of them.
// The inner `(?!llms(?:-full)?\.txt$)` lets those two through while
// robots.txt, the IndexNow key and every other static file stay excluded.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images/|(?!llms(?:-full)?\\.txt$).*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|txt|xml|json|woff|woff2)$).*)",
  ],
};

// AI assistants and AI-training crawlers specifically — not the classic
// Googlebot/Bingbot, which are already tracked via Search Console and Bing
// Webmaster Tools. This is traffic neither of those reports at all: an AI
// chat product browsing on a user's behalf, or a crawler feeding a model's
// training data, citing bilalshafqat.com in an answer.
const AI_BOTS: { name: string; match: string }[] = [
  { name: "GPTBot", match: "gptbot" },
  { name: "OAI-SearchBot", match: "oai-searchbot" },
  { name: "ChatGPT-User", match: "chatgpt-user" },
  { name: "ClaudeBot", match: "claudebot" },
  { name: "Claude-User", match: "claude-user" },
  { name: "Claude-SearchBot", match: "claude-searchbot" },
  { name: "anthropic-ai", match: "anthropic-ai" },
  { name: "PerplexityBot", match: "perplexitybot" },
  { name: "Perplexity-User", match: "perplexity-user" },
  { name: "Google-Extended", match: "google-extended" },
  { name: "GoogleOther", match: "googleother" },
  { name: "Bytespider", match: "bytespider" },
  { name: "CCBot", match: "ccbot" },
  { name: "Amazonbot", match: "amazonbot" },
  { name: "Applebot-Extended", match: "applebot-extended" },
  { name: "cohere-ai", match: "cohere-ai" },
  { name: "Meta-ExternalAgent", match: "meta-externalagent" },
  { name: "Meta-ExternalFetcher", match: "meta-externalfetcher" },
  { name: "Diffbot", match: "diffbot" },
  { name: "YouBot", match: "youbot" },
];

function detectBot(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();
  for (const bot of AI_BOTS) {
    if (ua.includes(bot.match)) return bot.name;
  }
  return null;
}

/**
 * Reports an AI bot's visit to Performo, reusing the same public-API-key
 * intake mechanism as lead submissions (see src/app/api/lead/route.ts).
 * Fire-and-forget: `event.waitUntil` keeps the edge function alive long
 * enough for this to actually send, without making the real page request
 * wait on it — a slow or unreachable Performo should never slow the site
 * down for an AI crawler, let alone a real visitor.
 */
function reportBotHit(botName: string, userAgent: string, path: string, event: NextFetchEvent) {
  const apiUrl = process.env.CRM_LEAD_API_URL;
  const apiKey = process.env.CRM_LEAD_API_KEY;
  if (!apiUrl || !apiKey) return;

  let botHitUrl: string;
  try {
    botHitUrl = `${new URL(apiUrl).origin}/api/public/bot-hits`;
  } catch {
    return;
  }

  event.waitUntil(
    fetch(botHitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ botName, userAgent, path }),
    }).catch(() => {
      /* best-effort — a missed bot hit is not worth retrying or logging */
    })
  );
}

/**
 * URLs that are gone for good, answered with 410 rather than 404.
 *
 * From the Search Console "Not found (404)" export of 2026-10-15. A 404 says
 * "not here right now" and Google keeps re-checking; 410 says "removed on
 * purpose" and it drops out faster. Search Console's Removals tool is not the
 * fix for these: it hides a URL for about six months and takes one at a time.
 *
 * - Component and variable names (ThemeContext, AuthContext, Header, ...)
 *   that Google lifted from code samples in the React articles.
 * - The two WordPress course pages: no successor, and pointing them at a
 *   marketing page would be a soft 404 (see the note in next.config.ts).
 * - WordPress admin, REST API and search-template URLs, requested by bots.
 *
 * Anything with a real successor belongs in next.config.ts redirects instead.
 */
const GONE_PATHS = new Set([
  "/ThemeContext",
  "/AuthContext",
  "/Header",
  "/UserList",
  "/LargeImage",
  "/data",
  "/redux/store",
  "/graphic-designing-course",
  "/frontend-development-course",
]);
const GONE_PREFIXES = ["/wp-admin", "/wp-json", "/wp-login.php", "/xmlrpc.php", "/search/"];

function isGone(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (GONE_PATHS.has(path)) return true;
  return GONE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`) || pathname === `${p}/`);
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const userAgent = request.headers.get("user-agent") || "";
  const botName = detectBot(userAgent);

  if (botName) {
    reportBotHit(botName, userAgent, request.nextUrl.pathname, event);
  }

  // Case-sensitive on purpose. A next.config redirect cannot tell "/About"
  // from "/about" (it looped), and the capitalised form is in the 2026-10-15
  // Search Console 404 export.
  if (request.nextUrl.pathname === "/About" || request.nextUrl.pathname === "/About/") {
    return NextResponse.redirect(new URL("/about", request.url), 308);
  }

  if (isGone(request.nextUrl.pathname)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return NextResponse.next();
}
