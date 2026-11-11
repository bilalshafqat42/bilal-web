import Eyebrow from "@/components/ui/Eyebrow";
import CtaButton from "@/components/ui/CtaButton";

/**
 * The homepage's Dubai section.
 *
 * Added 2026-11-11 for "freelance digital marketer in dubai" (480 searches a
 * month in the UAE, Ubersuggest). The site ranked about 21st for it, and Google
 * showed an article rather than this page. The page ranking first has 3 real
 * backlinks and a homepage that is entirely about being a digital marketing
 * freelancer in Dubai, using the whole group of job titles people search
 * (expert, specialist, strategist, consultant) and the other emirates. This
 * homepage covered marketing and development equally and said "Dubai" 19
 * times, so Google did not read it as the answer.
 *
 * Every claim here is one the site already makes elsewhere: Dubai hours, UK
 * and UAE clients, property launches, accounts in the client's name, pages
 * built as well as campaigns run. Nothing names a client.
 */

const points = [
  {
    title: "Who I help in Dubai",
    body: "Property developers launching off-plan projects, B2B companies selling to other businesses, and service businesses that need steady enquiries rather than likes. If you sell something people research before they buy, a digital marketing freelancer in Dubai who plans the campaign and builds the page it lands on will usually beat two suppliers handing work between them.",
  },
  {
    title: "Strategist and hands-on specialist",
    body: "Most businesses hire a digital marketing strategist who writes the plan, then a specialist who runs the ads. I am both. I set the goal and the budget split as your digital marketing consultant in Dubai, then run Google Ads, Meta, LinkedIn and SEO myself as the specialist, and report against one number you care about.",
  },
  {
    title: "Dubai, Abu Dhabi and Sharjah",
    body: "I am based in Dubai and work on Dubai hours, so you get answers during your working day, not overnight from another time zone. Businesses in Abu Dhabi and Sharjah get the same service through calls and screen shares, with a meeting in person when it helps. I also work with clients in the UK on the same terms.",
  },
  {
    title: "How to choose the best freelance digital marketer in Dubai",
    body: "The best digital marketing expert in Dubai for you is the one who can show results like the ones you need. Ask to see live work, not a slide. Ask who will own the ad accounts, the website and the analytics (it should be you). Ask what one number they will report on each month. And ask who builds the landing page, because most wasted ad spend in Dubai is a good ad sending people to a slow or vague page.",
  },
];

export default function DubaiFocus() {
  return (
    <section id="dubai" className="relative section-pad">
      <div className="site-container">
        <div className="max-w-3xl">
          <Eyebrow>
            <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
            Dubai and the UAE
          </Eyebrow>
          <h2 className="t-h2 mt-5 text-ink">
            A freelance digital marketer in Dubai, not an agency with an account manager
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            When you hire a freelance digital marketer in Dubai, you should get the person
            who does the work. That is how I work: one digital marketing expert in Dubai
            who plans the strategy, runs the campaigns, builds the pages and reports the
            results, with no layer in between. You brief me, and I do it.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
          {points.map((p) => (
            <li key={p.title} className="border-t border-border pt-6">
              <h3 className="t-h4 text-ink">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <CtaButton href="/appointment">Book a free 30-minute call</CtaButton>
          <p className="text-sm text-muted">
            Free, no obligation, and you leave with a plan and a price range.
          </p>
        </div>
      </div>
    </section>
  );
}
