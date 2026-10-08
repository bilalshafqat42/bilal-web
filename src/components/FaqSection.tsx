import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Eyebrow from "@/components/Eyebrow";

export type Faq = { question: string; answer: string };

type Props = {
  /** Gold mono label above the heading. */
  eyebrow?: string;
  /** Section heading. Sized as a section heading, never a card heading. */
  title: string;
  faqs: Faq[];
  /** Anchor target, for pages that link to their own questions. */
  id?: string;
  /** A short gold rule before the eyebrow, for a section that opens a run. */
  rule?: boolean;
  /** A paragraph under the heading, in the sticky left column. */
  intro?: ReactNode;
  /** A card under the intro: the homepage's "Still not sure what you need?"
   *  escape hatch. Sticks with the label on a tall screen. */
  aside?: ReactNode;
  /** Vertical rhythm. Pages differ on whether this section opens or closes a
   *  run of sections, so the spacing is passed in rather than guessed. */
  className?: string;
};

/**
 * The one FAQ layout used everywhere on the site.
 *
 * Added 2026-09-16. Before this there were **six** different FAQ designs: a
 * two-column sticky one on case studies, bordered cards on service pages,
 * `<details>` accordions on /pricing and /faq, a bare definition list on the
 * discipline pages, another card grid on /process, and a narrow list wedged
 * into the left column of /appointment. Same content type, six presentations,
 * which is the single clearest way a site tells a visitor it was assembled in
 * pieces.
 *
 * The case study version won because it is the one that reads best at length:
 * the label stays put on the left while the answers scroll past it, so you
 * always know what you are reading, and the answers get the full width of the
 * container instead of being squeezed into a card.
 *
 * Renders nothing when there are no questions, so a page can pass a possibly
 * empty array without guarding at the call site.
 *
 * **2026-10-08: `HomeFaq` folded in here.** A seventh design had grown back on
 * the homepage — `py-24 sm:py-32` against this one's `py-20 sm:py-24`, a 416px
 * label column against 320px, `gap-20` against `gap-16`, `<h3>` questions at
 * `t-h4` against `<dt>` at `text-lg sm:text-xl`, and no top border. Same
 * content type, two presentations, on the two pages a visitor is most likely to
 * see in one session.
 *
 * It brought two things worth keeping, which are now props rather than a second
 * component: `intro`, the paragraph under the heading, and `aside`, the "Still
 * not sure what you need?" card that sticks beside the answers.
 */
export default function FaqSection({
  eyebrow,
  title,
  faqs,
  id,
  rule = false,
  intro,
  aside,
  className,
}: Props) {
  if (!faqs.length) return null;

  return (
    <section id={id} className={`site-container ${className ?? "py-20 sm:py-24"}`}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          {/* Sticky, so the label holds its place beside a long run of answers.
              Below lg it simply sits above them. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {eyebrow ? <Eyebrow rule={rule}>{eyebrow}</Eyebrow> : null}
            <h2 className={`t-h2 text-ink ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
            {intro ? (
              <div className="mt-5 text-lg leading-relaxed text-muted">{intro}</div>
            ) : null}
            {aside ? <div className="mt-10">{aside}</div> : null}
          </div>
        </Reveal>

        <Reveal>
          {/* **`<h3>`, not `<dt>`.** This was a `<dl>` until 2026-10-08, on the
              reasoning that a definition list is what a Q&A is. Two things
              overruled it.

              A screen reader user navigates a long page by heading. `/faq`
              carries fifteen questions and, as a `<dl>`, offered not one heading
              to jump between — the audit on 2026-10-07 flagged exactly that.
              And the HTML spec forbids heading content inside `<dt>`, so there
              is no version that keeps both.

              It is also measurable: folding the homepage's own FAQ into this
              component turned its `<h3>` questions into `<dt>`s and dropped the
              homepage from 100 to 92, because the question carrying "freelance
              digital marketer in Dubai" stopped counting as a subheading.

              Hairlines rather than cards, unchanged: six bordered boxes in a
              column read as six separate things, and these are one thing. */}
          <div className="divide-y divide-border border-t border-border">
            {faqs.map((f) => (
              <div key={f.question} className="py-7 first:pt-8">
                <h3 className="text-lg font-semibold text-ink sm:text-xl">{f.question}</h3>
                {/* Capped in `ch`, not by a container width: the problem is the
                    ratio of font size to column, not the page. */}
                <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
