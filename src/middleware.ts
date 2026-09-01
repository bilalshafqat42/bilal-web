import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// Only run against real page requests — static assets, Next's own internals,
// and known file extensions never need bot detection and would just add
// noise (and cost) to every image/script/font request on the site.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|txt|xml|json|woff|woff2)$).*)",
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

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const userAgent = request.headers.get("user-agent") || "";
  const botName = detectBot(userAgent);

  if (botName) {
    reportBotHit(botName, userAgent, request.nextUrl.pathname, event);
  }

  return NextResponse.next();
}
