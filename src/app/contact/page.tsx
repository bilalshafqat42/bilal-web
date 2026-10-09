import type { Metadata } from "next";
import PageOpener from "@/components/PageOpener";
import Surface from "@/components/Surface";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import WhatsAppLink from "@/components/WhatsAppLink";
import SocialLinks from "@/components/SocialLinks";
import CtaButton from "@/components/CtaButton";
import { SITE_URL, breadcrumbNode, graph, ref, ID, jsonLdSafe } from "@/lib/schema";
import Eyebrow from "@/components/Eyebrow";
import SecondaryButton from "@/components/SecondaryButton";

export const metadata: Metadata = {
  title: "Contact Bilal Shafqat — Digital Marketer & Developer, Dubai",
  description:
    // 186 characters before this. Google cuts around 160, so the last clause
    // was being truncated in the result.
    "Get in touch with Bilal Shafqat, a Dubai freelance digital marketer, developer and designer. Email, phone or WhatsApp, reply within one business day.",
  alternates: {
    canonical: "/contact",
  },
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "bilal@bilalshafqat.com",
    // Deliberately no href. The card displayed an address and linked to
    // /appointment, so anyone clicking what looked like an email landed on the
    // booking page instead — the same label-versus-destination mismatch already
    // fixed in the footer, and the fix is the same: show the address as text
    // people can copy. A `mailto:` is not the alternative; there are zero on
    // this site by decision.
    href: undefined as string | undefined,
    note: "Best for detailed briefs and attachments. Copy the address above.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+971 52 976 6006",
    // Rendered by WhatsAppLink rather than as a plain href, so this card
    // reports `whatsapp_click` like every other WhatsApp route on the site.
    // It did not, and it is the most prominent one on the contact page.
    whatsapp: "contact-page-card" as const,
    href: undefined as string | undefined,
    note: "Fastest route to a first reply.",
  },
  {
    icon: Phone,
    label: "Call",
    value: "+971 52 976 6006",
    href: "tel:+971529766006",
    note: "Alternate line: +971 56 604 7396.",
  },
];

/**
 * Built with the shared helpers rather than by hand, like every other page.
 *
 * Doing it by hand is why this was the only commercial page on the site with no
 * `BreadcrumbList` — `/faq` and `/pricing` both have one.
 */
const pageUrl = `${SITE_URL}/contact`;

const contactSchema = graph([
  {
    "@type": "ContactPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "Contact Bilal Shafqat",
    inLanguage: "en",
    // A pointer, not a second copy. The Person is defined once on the homepage
    // at #person; restating name, job title and address here is what produced
    // twenty-odd unlinked duplicates of the same entity.
    mainEntity: ref(ID.person, "Person"),
    about: ref(ID.business, "ProfessionalService"),
    isPartOf: ref(ID.website, "WebSite"),
    // Contact routes belong to this page rather than to the Person node: they
    // are the page's subject, and they are all visible on it.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "bilal@bilalshafqat.com",
        telephone: "+971529766006",
        availableLanguage: ["English"],
        areaServed: ["AE", "GB"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+971566047396",
        availableLanguage: ["English"],
        areaServed: ["AE", "GB"],
      },
    ],
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Contact", item: pageUrl },
  ]),
]);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSafe(contactSchema) }}
      />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          eyebrow="Contact"
          title={<>Talk to the person who&apos;ll actually do the work</>}
          standfirst={
            <>
              No sales team, no account manager, no discovery call with someone
              who then briefs somebody else. Whatever you send here reaches me
              directly, and I&apos;ll come back with honest next steps rather than
              a templated proposal.
            </>
          }
          actions={
            /* Two things a contact page owes a visitor: what to write, and what
               happens after they press send. Both are answers Bilal gave on
               2026-09-15, and the first also exists as the message field's
               placeholder — this surfaces it before someone starts typing.

               Deliberately NOT here: a section on work he turns down. Asked
               directly, he said he takes everything, so there is nothing true to
               write. */
            <dl className="grid max-w-2xl gap-6 text-left sm:grid-cols-2">
              <Surface as="div" radius="card">
                <dt>
                  <Eyebrow>What to send</Eyebrow>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  What you are trying to achieve, any deadline you are working
                  to, and whether you already have a site, a CRM or an ad account
                  running. Three lines is plenty &mdash; the detail comes later.
                </dd>
              </Surface>
              <Surface as="div" radius="card">
                <dt>
                  <Eyebrow>What happens next</Eyebrow>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  I read it myself and reply within one business day, same day if
                  you message on WhatsApp. If it is a fit, the next step is a
                  30-minute call. If it is not, I will say so.
                </dd>
              </Surface>
            </dl>
          }
        />

        <section className="relative section-tight">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {channels.map((channel, i) => {
                const Icon = channel.icon;
                const external = channel.href?.startsWith("http") ?? false;
                const body = (
                  <>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-gold-2/10">
                      <Icon size={20} className="text-gold" />
                    </span>
                    {/* A label, not a section heading. These were `h2`, so the
                        page outline read as three sections called "Email",
                        "WhatsApp" and "Call". */}
                    <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-gold">
                      {channel.label}
                    </p>
                    <p className="mt-2 break-words text-lg font-semibold text-ink">
                      {channel.value}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{channel.note}</p>
                  </>
                );

                const cardClass =
                  "card-hover group flex h-full flex-col r-card surface-1 p-7";
                const openAffordance = (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    Open{" "}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                );

                return (
                  <Reveal key={channel.label} delay={i * 0.08}>
                    {"whatsapp" in channel && channel.whatsapp ? (
                      <WhatsAppLink context={channel.whatsapp} className={cardClass}>
                        {body}
                        {openAffordance}
                      </WhatsAppLink>
                    ) : channel.href ? (
                      <a
                        href={channel.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={cardClass}
                      >
                        {body}
                        {openAffordance}
                      </a>
                    ) : (
                      // No "Open" affordance either: a card that cannot be
                      // opened should not offer to open.
                      <div className="flex h-full flex-col r-card surface-1 p-7">
                        {body}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="enquiry" className="relative section-tight scroll-mt-28">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <Reveal>
                <ContactForm />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full r-card surface-1 p-7">
                  <Eyebrow>Where to find me</Eyebrow>
                  <h2 className="t-h3 mt-3 text-ink">Where I am and when</h2>
                  <ul className="mt-5 space-y-4 text-sm text-muted">
                    <li className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                      <span>
                        <span className="block font-medium text-ink">Dubai, United Arab Emirates</span>
                        Working with clients across the UAE and internationally.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                      <span>
                        <span className="block font-medium text-ink">
                          Gulf Standard Time (GST, UTC+4)
                        </span>
                        Monday to Friday. A reply typically lands within one
                        business day, and same day if you reach me on WhatsApp.
                      </span>
                    </li>
                  </ul>
                  <SocialLinks className="mt-7" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative section-tight">
          <div className="site-container">
            <div className="max-w-3xl">
              <Reveal>
                <h2 className="t-h2 text-ink">What happens after you send it</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  It reaches me. Not a shared inbox, not a sales team, and not an
                  assistant who logs it and books a discovery call with somebody who
                  then briefs me. I read it, and the reply comes from the person who
                  would do the work.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Usually within one business day, Monday to Friday on Dubai hours,
                  and the same day if you message on WhatsApp. If what you send is
                  clear enough to price, the reply has a range in it rather than a
                  request for a call to discuss your requirements.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">What it costs to ask</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Nothing, and that is not a figure of speech. The first conversation
                  is thirty minutes, free, and it is not a pitch. You describe the
                  business and the number you want to move, and you leave with a
                  recommended approach and a price range whether or not you hire me.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Sometimes the recommendation is to do less than you came in asking
                  for, or to fix the tracking before touching the site, or that you do
                  not need an app at all. Those answers are worth having and they cost
                  nothing.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">If you would rather not write much</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Three lines is plenty. What you are trying to achieve, any deadline,
                  and whether something already exists: a site, a CRM, an ad account
                  running. The detail comes later and I will ask for the rest.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  There is no form behind the form. Nothing you send is added to a
                  mailing list and nothing is shared with anyone.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative section-tight">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden r-panel surface-3 px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>Start anywhere</Eyebrow>
                  <h2 className="t-h2 mt-3 text-ink">
                    Not sure what you need yet?{" "}
                    <span className="text-gradient">Start there.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    A first conversation costs nothing and often ends with me
                    telling you a smaller piece of work would do the job. That&apos;s
                    a better outcome than selling you a bigger one.
                  </p>
                  {/* `/appointment`, not WhatsApp. This was the only "Book a
                      free consultation" on the site pointing somewhere else:
                      the label promised a booking and opened a chat window,
                      bypassing the calendar entirely. `CtaButton` rather than a
                      hand-rolled `btn-primary`, so it cannot drift from the
                      other nine pages that use it. */}
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <CtaButton href="/appointment">Book a free consultation</CtaButton>
                    <SecondaryButton href="/services">Browse services</SecondaryButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
