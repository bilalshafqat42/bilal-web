import Link from "next/link";
import CtaButton from "@/components/CtaButton";

/**
 * The questions people ask before booking, answered on the page.
 *
 * Replaces the "Not sure what you need?" search box on 2026-09-29. That section
 * asked the visitor to do the work — type a question, read three results, click
 * one. This answers the five questions they were going to type.
 *
 * ---------------------------------------------------------------------------
 * **No `FAQPage` schema here, deliberately.**
 *
 * `/faq` already carries it, with 15 questions, and one of them — "Can you work
 * with clients outside the UAE?" — is also on this list. Publishing `FAQPage`
 * on two URLs that share questions is the cross-page version of the duplicate
 * that broke two service pages in roadmap item 254, and Google's guidance
 * treats duplicated FAQ markup as grounds for dropping it. `/faq` keeps the
 * markup; this section is a marketing block that happens to be made of
 * questions, and links there for the rest.
 * ---------------------------------------------------------------------------
 *
 * **Every answer below is the site's own.** The design this was built from
 * carried two placeholders — a landing page price as `AED [amount]`, and a
 * "[45] minute" consultation — and both are resolved rather than shipped:
 *
 *   - The price is not invented, because the site's own position on
 *     /services/website-app-development is that quoting before scope "is
 *     guesswork". Saying so is a better answer than a number.
 *   - The consultation is **30 minutes**, not 45: the booking is a Cal.com
 *     event whose path is `bilalshafqat/30min`.
 */

const faqs = [
  {
    // Added 2026-10-05. Measured: the homepage carried 1,468 words and the
    // phrase "digital marketing" appeared zero times, while three of the nine
    // terms this page competes for contain it exactly: "digital marketing
    // freelancer in dubai" (720), "digital marketing expert in dubai" (320)
    // and "digital marketing freelance" (210). "Digital marketer" is a
    // different string and does not cover them.
    //
    // A question first and a keyword second: this is the one people genuinely
    // ask, because "freelancer" and "agency" are the two options they are
    // weighing, and it belongs at the top for that reason rather than this one.
    q: "What does a freelance digital marketer actually cover?",
    a: "Paid ads on Google, Meta, TikTok, Snapchat and LinkedIn, search and content, email and WhatsApp, and the tracking underneath all of it. The difference from most digital marketing freelancers in Dubai is that I also build the landing pages and apps the campaigns point at, so the site and the spend are designed together instead of handed between two suppliers.",
  },
  {
    q: "Do you build mobile apps?",
    // From the website-app-development FAQ, kept whole. The second half is the
    // part worth keeping: telling someone they do not need an app is the
    // answer that earns trust.
    a: "Yes, with React Native so one codebase serves iOS and Android. I will also tell you when you do not need an app — for a lot of businesses a fast mobile website does the same job without app store approval and two platforms to maintain.",
  },
  {
    q: "How much does a landing page cost?",
    a: "It depends on scope, and any number quoted before understanding that is guesswork. What is published: project work starts at AED 31,500, a monthly retainer at AED 16,000, and an advisory session at AED 3,500. Describe what you have in mind and you get a real figure within a business day.",
  },
  {
    q: "Can you work with clients outside the UAE?",
    a: "Yes, and much of the work suits remote delivery well: audits, tracking implementation, landing page builds and design work do not require being in the same room. Campaign management that needs daily contact is easier within a few hours of Gulf Standard Time.",
  },
  {
    q: "What have you done for property developers?",
    // Named work is LEOS's, because that is the client with published case
    // studies. Tomorrow World and Refine are named as clients rather than
    // attached to projects, which is what the logo row already claims and no
    // more.
    a: "Campaigns, websites and apps for LEOS Developments, plus work for Tomorrow World Real Estate and Refine. The published case studies cover Hadley Heights, Weybridge Gardens and Cavendish Square: off-plan lead generation, launch and sales-gallery sites, and the CRM behind the enquiries.",
  },
  {
    q: "What actually happens in the free consultation?",
    a: "Thirty minutes. You describe the business and the number you want to move, I ask questions, and you leave with a recommended approach and a price range. No deck, no follow-up sequence, and no obligation.",
  },
];

export default function HomeFaq() {
  return (
    <section id="faq" className="relative py-24 scroll-mt-28 sm:py-32">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          {/* Left: the framing and the escape hatch. `lg:sticky` so the CTA
              stays beside the answers on a tall screen rather than scrolling
              away at the top. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
              Common questions
            </span>
            <h2 className="t-h2 mt-5 text-ink">The questions I get before the first call</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Answered here so you do not have to book a call to find out. If yours is not
              covered,{" "}
              <Link href="/faq" className="text-gold underline underline-offset-2">
                there are more on the FAQ page
              </Link>
              , or ask it directly.
            </p>

            <div className="mt-10 rounded-2xl border border-border panel p-7">
              <p className="font-semibold text-ink">Still not sure what you need?</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tell me the business and the number you want to move. You will get a
                recommended approach and a price range, whether or not you hire me.
              </p>
              <CtaButton href="/appointment" className="mt-6">
                Book a free consultation
              </CtaButton>
            </div>
          </div>

          {/* Right: the answers, open. No accordion — the same reasoning as the
              pricing table in item 262. Someone scanning five questions should
              not have to click five times to find the one that applies, and
              text behind a toggle is text a skimming reader never sees. */}
          <dl className="divide-y divide-border">
            {faqs.map((f, i) => (
              <div key={f.q} className={i === 0 ? "pb-8" : "py-8"}>
                <dt className="t-h4 text-ink">{f.q}</dt>
                <dd className="mt-4 text-base leading-relaxed text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
