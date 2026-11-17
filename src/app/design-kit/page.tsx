import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageOpener from "@/components/layout/PageOpener";
import Eyebrow from "@/components/ui/Eyebrow";
import CtaButton from "@/components/ui/CtaButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Tag from "@/components/ui/Tag";
import Surface from "@/components/ui/Surface";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqSection from "@/components/ui/FaqSection";
import BookingPanel from "@/components/portfolio/BookingPanel";
import { WorkCardView } from "@/components/portfolio/WorkShowcase";
import { cardsFor } from "@/data/workCards";
import Spec from "./Spec";

/**
 * The design kit: every shared component and style on one page, drawn by the
 * real components, so Bilal can check at a glance that sizes, colours and
 * spacing agree across the site (asked for on 2026-11-17).
 *
 * Nothing here is a copy. Each block imports the component the site uses, and
 * `Spec` prints the size the browser actually draws, so a change to a
 * component or to `globals.css` shows up here the moment it ships.
 *
 * Not for search: noindex, not in the sitemap, not linked from the menu.
 */
export const metadata: Metadata = {
  title: "Design Kit | Bilal Shafqat",
  description: "The shared colours, type, buttons, cards and panels used across bilalshafqat.com, drawn by the real components.",
  robots: { index: false, follow: false },
  // Own `alternates` so the layout's canonical of "/" is not inherited, as on
  // /thank-you: a noindex page must not name the homepage as its main copy.
  alternates: { types: { "application/rss+xml": [{ url: "/rss.xml", title: "Bilal Shafqat: Writing" }] } },
};

const COLOURS: { name: string; token: string; hex: string; use: string }[] = [
  { name: "Background", token: "--color-bg", hex: "#08080B", use: "Page background" },
  { name: "Background soft", token: "--color-bg-soft", hex: "#0E0E13", use: "Alternate sections" },
  { name: "Surface", token: "--color-surface", hex: "#121218", use: "Cards and panels" },
  { name: "Ink", token: "--color-ink", hex: "#F5F5F7", use: "Headings and main text" },
  { name: "Muted", token: "--color-muted", hex: "#9A9AA6", use: "Body text" },
  { name: "Faint", token: "--color-faint", hex: "#82828C", use: "Captions and counts" },
  { name: "Gold", token: "--color-gold", hex: "#F2C94C", use: "Buttons, labels, highlights" },
  { name: "Gold 2", token: "--color-gold-2", hex: "#F7A53B", use: "Gradient end" },
  { name: "Violet", token: "--color-violet", hex: "#7C6BF5", use: "Accent" },
  { name: "Cyan", token: "--color-cyan", hex: "#4FD7E0", use: "Accent" },
];

const TYPE: { cls: string; name: string; use: string }[] = [
  { cls: "t-display", name: "Display", use: "Homepage hero" },
  { cls: "t-h1", name: "H1", use: "Page title, one per page" },
  { cls: "t-h2", name: "H2", use: "Section heading" },
  { cls: "t-h3", name: "H3", use: "Card and panel heading" },
  { cls: "t-h4", name: "H4", use: "Small heading" },
  { cls: "t-h5", name: "H5", use: "Sub-heading" },
  { cls: "t-h6", name: "H6", use: "Smallest heading" },
];

/** One numbered block of the kit. */
function Block({ n, title, note, children }: { n: string; title: string; note: string; children: ReactNode }) {
  return (
    <section className="site-container border-t border-border py-14 sm:py-20">
      <div className="mb-10 max-w-3xl">
        <Eyebrow>{`${n} · ${title}`}</Eyebrow>
        <p className="mt-4 text-base leading-relaxed text-muted">{note}</p>
      </div>
      {children}
    </section>
  );
}

export default function DesignKitPage() {
  const card = cardsFor(["texdale"])[0];

  return (
    <main id="main" tabIndex={-1} className="flex-1">
      <PageOpener
        crumbs={[{ label: "Home", href: "/" }, { label: "Design kit" }]}
        eyebrow="Design kit"
        title={<>Every component, <span className="text-gradient">one set of rules</span></>}
        standfirst={
          <>
            The colours, type sizes, buttons, cards and panels the whole site is built from. Each one below is
            the real component, and the small grey line under it is the size your browser is drawing right
            now. If two things that should match show different numbers, something has drifted.
          </>
        }
      />

      <Block n="01" title="Colours" note="Ten colours. Gold is the only bright one, so it always means: this is what to press or read first.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLOURS.map((c) => (
            <div key={c.token} className="r-card surface-1 overflow-hidden">
              <div className="h-24 border-b border-border" style={{ background: `var(${c.token})` }} />
              <div className="p-4">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <p className="mt-1 font-mono text-xs text-faint">{c.hex}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block n="02" title="Headings" note="Seven sizes. They shrink smoothly on smaller screens, so resize the window and the numbers change, but every page uses the same step for the same job.">
        <div className="space-y-10">
          {TYPE.map((t) => (
            <div key={t.cls} className="grid gap-3 lg:grid-cols-[180px_1fr] lg:gap-10">
              <div>
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="mt-1 font-mono text-xs text-faint">.{t.cls}</p>
                <p className="mt-1 text-xs text-muted">{t.use}</p>
              </div>
              <Spec>
                <p className={`${t.cls} text-ink`}>Freelance digital marketer in Dubai</p>
              </Spec>
            </div>
          ))}
        </div>
      </Block>

      <Block n="03" title="Body text and labels" note="Text below the headings. Long reading text is muted grey, never white, so headings stand out.">
        <div className="grid gap-10 lg:grid-cols-2">
          <Spec>
            <p className="text-lg leading-relaxed text-muted">Large body (lead paragraph). Used for the first paragraph under a section heading.</p>
          </Spec>
          <Spec>
            <p className="text-base leading-relaxed text-muted">Body. The normal reading size for paragraphs across the site.</p>
          </Spec>
          <Spec>
            <p className="text-sm leading-relaxed text-muted">Small. Card text and notes beside a heading.</p>
          </Spec>
          <Spec>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">Caption · mono · faint</p>
          </Spec>
          <Spec>
            <Eyebrow>Eyebrow · default · gold</Eyebrow>
          </Spec>
          <Spec>
            <Eyebrow size="sm" tone="muted">Eyebrow · small · muted</Eyebrow>
          </Spec>
          <Spec>
            <p className="t-h3 text-ink">
              Gradient text: <span className="text-gradient">for one phrase in a title</span>
            </p>
          </Spec>
        </div>
      </Block>

      <Block n="04" title="Buttons" note="Two buttons, two sizes each. Gold for the main action, outline for the second one. Large beside heroes and section endings, small inside cards.">
        <div className="grid gap-10 sm:grid-cols-2">
          <Spec show="box">
            <CtaButton href="/appointment">Book a free consultation</CtaButton>
          </Spec>
          <Spec show="box">
            <CtaButton href="/appointment" size="sm">Book a free consultation</CtaButton>
          </Spec>
          <Spec show="box">
            <SecondaryButton href="/portfolio">See the work</SecondaryButton>
          </Spec>
          <Spec show="box">
            <SecondaryButton href="/portfolio" size="sm">See the work</SecondaryButton>
          </Spec>
        </div>
      </Block>

      <Block n="05" title="Tags and filter chips" note="Tags label things and cannot be pressed. Filter chips can.">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            <Tag>Web Development</Tag>
            <Tag>SEO</Tag>
            <Tag>Meta Ads</Tag>
          </div>
          <div className="work-filter flex flex-wrap items-center gap-2">
            <span className="work-chip" data-on="">
              All work <span className="work-chip-count">11</span>
            </span>
            <span className="work-chip">
              UI / UX Design <span className="work-chip-count">13</span>
            </span>
            <span className="work-chip">
              Web Development <span className="work-chip-count">10</span>
            </span>
          </div>
        </div>
      </Block>

      <Block n="06" title="Surfaces and corners" note="Three backgrounds for boxes: on the page, nested inside another box, and floating over content. Three corner sizes: large panels, everyday cards, small chips.">
        <div className="grid gap-6 md:grid-cols-3">
          {([1, 2, 3] as const).map((level) => (
            <Surface key={level} level={level} radius="card" pad="md">
              <p className="t-h5 text-ink">Surface {level}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {level === 1 ? "A card on the page." : level === 2 ? "A box inside another box." : "Floating: menus and pop-ups."}
              </p>
              <p className="mt-3 font-mono text-xs text-faint">.surface-{level}</p>
            </Surface>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {(["panel", "card", "chip"] as const).map((r) => (
            <div key={r} className={`r-${r} surface-1 p-6`}>
              <p className="t-h5 text-ink">{r[0].toUpperCase() + r.slice(1)} corner</p>
              <p className="mt-2 font-mono text-xs text-faint">.r-{r}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block n="07" title="Section heading" note="The block that opens most sections: a gold label, the heading, and a short line under it.">
        <SectionHeading
          eyebrow="Selected work"
          title="Real briefs, real launches"
          description="Each one opens into the brief, the decisions behind it and what shipped."
        />
      </Block>

      <Block n="08" title="Portfolio card" note="The card used on the homepage and /portfolio: a 16:10 image that is never cut off at the sides, the name, and one quiet link.">
        <div className="grid max-w-[1200px] gap-12 lg:grid-cols-2">
          {card ? <WorkCardView card={card} kind="pair" /> : null}
          <div className="r-card surface-1 p-6">
            <p className="t-h5 text-ink">Rules</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>Image frame 16:10, filled edge to edge.</li>
              <li>Two cards per row on desktop, one on a phone.</li>
              <li>A last card on its own goes full width.</li>
              <li>Square corners: the work is the one thing on the site that looks like a printed page.</li>
            </ul>
          </div>
        </div>
      </Block>

      <Block n="09" title="Booking panel" note="Used after case study slides and on service pages. The button always names the service it books.">
        <div className="-mx-6 lg:mx-0">
          <BookingPanel
            heading="Got a catalogue nobody can read?"
            body="I design and build websites for manufacturers and B2B companies, where the product list is the hard part."
            service="custom-web-development"
          />
        </div>
      </Block>

      <Block n="10" title="Questions (FAQ)" note="The same FAQ design on every page. Google and AI assistants read these answers directly.">
        <FaqSection
          eyebrow="Common questions"
          title="About this design kit"
          faqs={[
            { question: "Is this page visible on Google?", answer: "No. It is hidden from search and not linked from the menu. It is a checking tool, not a page for visitors." },
            { question: "What if two things that should match show different sizes?", answer: "Then one of them has drifted from the shared component. Send a screenshot and it can be brought back in line." },
          ]}
        />
      </Block>
    </main>
  );
}
