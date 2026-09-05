import Anthropic from "@anthropic-ai/sdk";
import { buildSiteContent } from "@/lib/siteContent";

// Assembled once per server process, not per request — it only changes on deploy.
const SITE_CONTENT = buildSiteContent();

const SYSTEM = `You are the assistant on Bilal Shafqat's website. Bilal is a Dubai-based
freelance digital marketer, developer and designer.

Your job is to answer a visitor's question using ONLY the site content below, then help
them decide whether to get in touch.

Rules:
- Answer only from the site content. If it does not cover something, say so plainly and
  suggest they ask Bilal directly. Never invent services, prices, timelines, client names
  or results.
- There are no published prices. If asked what something costs, explain what drives the
  cost and that a real figure comes within a business day of describing the project.
- Be brief. Two or three short paragraphs at most. No bullet lists unless genuinely
  clearer. Plain sentences, no marketing language.
- When a relevant page exists, mention it by path (for example /services/paid-marketing)
  so the interface can link it.
- After answering, if the visitor seems to have a real project, ask ONE specific follow-up
  question that would help Bilal quote it — what they are trying to achieve, their
  timeline, or what they already have running. One question, never a list.
- Never claim to be Bilal. You are his assistant. He replies personally, usually within
  one business day.

Site content follows.

${SITE_CONTENT}`;

// Best-effort per-process throttle. Every question costs real money, so an
// unthrottled endpoint is a billing risk, not just an abuse one.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { question?: string; history?: Turn[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question) return Response.json({ error: "Ask a question first." }, { status: 400 });
  if (question.length > 500) {
    return Response.json({ error: "That question is a bit long — try shortening it." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "That's a lot of questions. Email bilal@bilalshafqat.com and Bilal will reply personally." },
      { status: 429 }
    );
  }

  // Checked after validation so a malformed or rate-limited request still gets
  // the response it deserves rather than being masked by a config error.
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json(
      { error: "The assistant isn't configured yet. Email bilal@bilalshafqat.com." },
      { status: 503 }
    );
  }

  // Only the last few turns are replayed: it keeps the request small and stops a
  // long session quietly growing the per-question cost.
  const history = (body.history ?? []).slice(-6).map((t) => ({
    role: t.role,
    content: String(t.content).slice(0, 2000),
  }));

  const client = new Anthropic({ apiKey: key });

  try {
    const stream = client.messages.stream({
      model: "claude-opus-5",
      max_tokens: 1200,
      // The site content is identical on every request, so caching it turns the
      // bulk of the input cost into a ~0.1x cache read.
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      thinking: { type: "adaptive" },
      // Low effort: this is retrieval and paraphrase over a small corpus, not a
      // reasoning problem. Higher effort would add latency and cost for no gain.
      output_config: { effort: "low" },
      messages: [...history, { role: "user", content: question }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") {
            controller.enqueue(
              encoder.encode("\n\nI can't help with that one — try asking Bilal directly.")
            );
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\nSomething went wrong. Email bilal@bilalshafqat.com.")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Busy right now — try again in a moment." }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("[ASSISTANT] bad API key");
      return Response.json({ error: "The assistant isn't available." }, { status: 503 });
    }
    console.error("[ASSISTANT] failed:", err);
    return Response.json({ error: "The assistant isn't available right now." }, { status: 502 });
  }
}
