import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AppointmentBooking from "@/components/AppointmentBooking";
import FaqSection from "@/components/FaqSection";
import { SITE_URL, breadcrumbNode, faqNode, graph, ref, ID } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Book a Free 30-Minute Call — Bilal Shafqat, Dubai",
  // Trimmed to 155 characters. The previous version ran to 166 and Google was
  // cutting it mid-sentence, which wastes the one line it gives you.
  description:
    "Book a free 30-minute call with Bilal Shafqat, a Dubai freelance marketer, developer and designer. Monday to Friday, 9am to 6pm GST. No pitch, no obligation.",
  alternates: { canonical: "/appointment" },
};

/**
 * Questions someone asks before giving up half an hour.
 *
 * Every answer here is supported by something the site already states: the
 * hours are the ones in the footer, the "no obligation" is the page's own
 * promise, the reschedule links are a fact of how Cal.com confirmations work,
 * and "just exploring" is literally one of the timeline options in the form
 * beside this list.
 *
 * Deliberately NOT here, because they need Bilal and guessing them would be
 * inventing a service promise or a contract term: what the thirty minutes
 * covers in order, what to have ready beforehand, what the client receives
 * afterwards, and whether he signs NDAs on request.
 */
const faqs = [
  {
    question: "Is the call actually free?",
    answer:
      "Yes. Thirty minutes, no charge, and no obligation afterwards. If it turns out I am not the right fit for what you need, I will say so on the call rather than send you a proposal.",
  },
  {
    question: "Who will I be speaking to?",
    answer:
      "Me. There is no account manager and no junior taking a brief to pass on. The person on the call is the person who would do the work.",
  },
  {
    question: "When are you available?",
    answer:
      "Monday to Friday, 9am to 6pm Dubai time (GST, UTC+4). The calendar here shows real availability read from my own diary, so anything you can select is genuinely free.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes, and without emailing me. The confirmation you receive carries its own reschedule and cancel links, so you can move it yourself at any point.",
  },
  {
    question: "What if I am not ready to start yet?",
    answer:
      "That is fine, and it is one of the options in the timeline dropdown. Plenty of these calls are with people six months out who want a straight read on scope and budget before they commit to anything.",
  },
  {
    question: "Do you work with clients outside the UAE?",
    answer:
      "Yes. I work with clients across the UAE and the UK. The call is on video, so the only thing that matters is finding an hour that works across both timezones.",
  },
];

/**
 * Structured data. This page had none, which was the largest single gap on the
 * site: every primary CTA on all 28 pages resolves here, and Google had no
 * description of what it is.
 *
 * `Service` rather than `Event` or `Reservation`. An `Event` is a specific
 * occurrence with a date, and there is no fixed date here; a `Reservation`
 * describes a booking that already exists. What this page offers is a free
 * consultation available on request, which is a Service with an Offer of zero.
 *
 * Nothing here claims a rating, a review count or a duration the page does not
 * state. The 30 minutes and the working hours are both visible on the page.
 */
const url = `${SITE_URL}/appointment`;

const schema = graph([
  {
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: "Book a call with Bilal Shafqat",
    description:
      "Book a free 30-minute consultation with Bilal Shafqat, a Dubai-based freelance digital marketer, developer and designer.",
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    about: ref(ID.business, "ProfessionalService"),
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/images/bilal-shirt.avif` },
  },
  {
    "@type": "Service",
    "@id": `${url}#consultation`,
    name: "Free 30-minute consultation",
    description:
      "A 30-minute call on your goals, your current setup and an honest read on scope and budget. You speak to the person who does the work, and there is no obligation afterwards.",
    serviceType: "Marketing, design and development consultation",
    provider: ref(ID.business, "ProfessionalService"),
    areaServed: [
      { "@type": "Country", name: "AE" },
      { "@type": "Country", name: "GB" },
    ],
    // Zero, because the call genuinely is free. A price of 0 is a fact the page
    // states; anything else here would be a claim it does not.
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      availableLanguage: { "@type": "Language", name: "English" },
      // Matches the hours stated in the footer and in this page's description.
      servicePhone: { "@type": "ContactPoint", contactType: "sales", telephone: "+971529766006" },
    },
  },
  breadcrumbNode(url, [
    { name: "Home", item: SITE_URL },
    { name: "Book a call", item: url },
  ]),
  // Built from the same array the page renders, so the markup cannot describe
  // an answer a visitor cannot read.
  faqNode(url, faqs),
]);

const reassurance = [
  "Thirty minutes, and you keep whatever comes out of it",
  "You speak to the person who does the work, not a salesperson",
  "An honest read on scope and budget before anything is quoted",
];

export default function AppointmentPage() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="flex-1">
        {/* Full bleed. The portrait is pushed left so the booking panel on the
            right never lands on top of it. */}
        {/* `overflow-clip`, not `overflow-hidden`. Both clip the full-bleed
            portrait to the section, but `hidden` creates a scroll container and
            that silently kills `position: sticky` on every descendant — the
            booking panel scrolled away with the page until this changed.
            `clip` does the same clipping without becoming a scroll container. */}
        <section className="relative min-h-[100svh] overflow-clip pb-16 pt-32 sm:pt-40">
          {/* The blue suit, on request. Note the filenames are misleading and
              have been since they were added: `bilal-shirt.avif` is the blue
              three-piece, and `bilal-shafqat-coat.avif` — which this page used
              to show — is the grey coat. Renaming them would touch a dozen
              references, so the correction lives here instead. */}
          <Image
            src="/images/bilal-shirt.avif"
            alt="Bilal Shafqat"
            fill
            priority
            sizes="100vw"
            className="portrait-edge object-cover brightness-[1.04] contrast-[1.12] grayscale"
            // Retuned for this image, not carried over. The blue suit is a
            // full-torso frame at 3368x5056, so `object-cover` on a full-height
            // section shows only about 47% of it, and the inherited 12% landed
            // on the face alone with no suit visible.
            //
            // The value is height-sensitive, because the section is
            // `min-h-[100svh]`: a taller viewport crops more and the window
            // moves. 60% read well at 1280x800 and cut the face off at the eyes
            // on a 14-inch 1512x982. 38% holds the whole face plus the suit at
            // 982 and stays acceptable at 800.
            style={{ objectPosition: "26% 38%" }}
          />
          {/* Two scrims rather than one: a horizontal wash keeps the right-hand
              panel readable, a vertical one lifts the copy off the floor of the
              image. */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-bg/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-bg/40" />

          {/* `items-start`, not `items-center`. A centred grid item cannot stick:
              sticky needs the item anchored to the top of a track taller than
              itself, and centring gives it nowhere to travel. */}
          <div className="site-container relative grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14">
            <div className="min-w-0">
              {/* The last rounded pill on the site became the flat gold label
                  every other section uses (item 189), but keeps its pulsing
                  dot. The pill shape was the inconsistency; the dot is the part
                  that carries meaning, because this says something live rather
                  than labelling a section. */}
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Taking work now
              </span>

              <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
                One conversation, one person, and a straight answer about whether
                I am the right fit for what you are trying to do.
              </p>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
                Let&apos;s talk about
                <br />
                <span className="text-gradient">what you need</span>
              </h1>

              <ul className="mt-9 space-y-3">
                {reassurance.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-base text-muted">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-9 text-sm text-muted">
                Prefer to write first?{" "}
                <Link href="/contact" className="text-gold underline underline-offset-4 hover:opacity-80">
                  Send me a message instead
                </Link>
                .
              </p>
            </div>

            {/* Sticky on desktop so the booking panel stays in view while the
                rest of the page scrolls past it.

                The old note here explained a 620px cap needed because the
                Cal.com embed rendered at 1,251px, taller than most viewports,
                which made a sticky panel stick with its bottom cut off. That
                does not apply any more: the embed loads on request, so the
                panel is short until someone asks for the calendar.

                Not sticky below `lg`, where the panel is full width and there
                is nothing beside it to scroll. */}
            <div className="lg:sticky lg:top-28">
              <AppointmentBooking />
            </div>
          </div>
        </section>

        {/* Was wedged into the hero's left column, where it had to be a narrow
            list and could not use the site's FAQ layout. Now its own section,
            below the fold, the same shape as every other FAQ on the site.

            The left column previously existed partly to give the sticky booking
            panel something taller to travel against. That is no longer needed:
            the Cal.com embed loads on request, so the panel is short. */}
        <FaqSection
          eyebrow="Before you book"
          title="Common questions"
          faqs={faqs}
          className="pb-20 sm:pb-24"
        />
      </main>
      <Footer />
    </>
  );
}
