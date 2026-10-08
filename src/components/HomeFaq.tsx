import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import Surface from "@/components/Surface";
import { homeFaqs as faqs } from "@/data/home";

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

export default function HomeFaq() {
  return (
    <FaqSection
      id="faq"
      className="scroll-mt-28 section-pad"
      rule
      eyebrow="Common questions"
      title="The questions I get before the first call"
      intro={
        <>
          Answered here so you do not have to book a call to find out. If yours is not
          covered,{" "}
          <Link href="/faq" className="text-gold underline underline-offset-2">
            there are more on the FAQ page
          </Link>
          , or ask it directly.
        </>
      }
      aside={
        <Surface pad="lg" radius="card">
          <p className="font-semibold text-ink">Still not sure what you need?</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tell me the business and the number you want to move. You will get a
            recommended approach and a price range, whether or not you hire me.
          </p>
          <CtaButton href="/appointment" className="mt-6">
            Book a free consultation
          </CtaButton>
        </Surface>
      }
      faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
    />
  );
}
