import Reveal from "./Reveal";

export type Faq = { question: string; answer: string };

type Props = {
  /** Gold mono label above the heading. */
  eyebrow?: string;
  /** Section heading. Sized as a section heading, never a card heading. */
  title: string;
  faqs: Faq[];
  /** Anchor target, for pages that link to their own questions. */
  id?: string;
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
 */
export default function FaqSection({ eyebrow, title, faqs, id, className }: Props) {
  if (!faqs.length) return null;

  return (
    <section id={id} className={`site-container ${className ?? "py-20 sm:py-24"}`}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          {/* Sticky, so the label holds its place beside a long run of answers.
              Below lg it simply sits above them. */}
          <div className="lg:sticky lg:top-32">
            {eyebrow ? (
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {title}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          {/* A definition list, because that is what this is. Hairlines rather
              than cards: six bordered boxes in a column read as six separate
              things, and these are one thing. */}
          <dl className="divide-y divide-border border-t border-border">
            {faqs.map((f) => (
              <div key={f.question} className="py-7 first:pt-8">
                <dt className="text-lg font-semibold text-ink sm:text-xl">{f.question}</dt>
                {/* Capped in `ch`, not by a container width: the problem is the
                    ratio of font size to column, not the page. */}
                <dd className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted">
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
