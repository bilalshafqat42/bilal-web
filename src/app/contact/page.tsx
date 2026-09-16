import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import CtaButton from "@/components/CtaButton";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";

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
    value: "bilalshafqat42@gmail.com",
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
    href: "https://wa.me/971529766006",
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
        email: "bilalshafqat42@gmail.com",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          {/* Left-aligned at the container edge, not a centred 4xl column.
              Measured before this: the h1 started 296px from the left here and
              40px on every other page, so moving between them shifted the whole
              layout. Centring is kept for the closing CTA below, where it is a
              deliberate full-width moment rather than the page's default. */}
          <div className="site-container relative">
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              Contact
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
              Talk to the person who&apos;ll actually do the work
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              No sales team, no account manager, no discovery call with someone
              who then briefs somebody else. Whatever you send here reaches me
              directly, and I&apos;ll come back with honest next steps rather than
              a templated proposal.
            </p>

            {/* Two things a contact page owes a visitor: what to write, and what
                happens after they press send.
                
                Both are answers Bilal gave on 2026-09-15, and the first one also
                already exists as the placeholder inside the message field — this
                surfaces it before someone starts typing rather than after.
                
                Deliberately NOT here: a section on work he turns down. Asked
                directly, he said he takes everything, so there is nothing true
                to write. Inventing a filter to look selective is the kind of
                thing a reader can test on the first call. */}
            <dl className="mt-10 grid max-w-2xl gap-6 text-left sm:grid-cols-2">
              <div className="rounded-2xl border border-border panel p-6">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  What to send
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  What you are trying to achieve, any deadline you are working
                  to, and whether you already have a site, a CRM or an ad account
                  running. Three lines is plenty &mdash; the detail comes later.
                </dd>
              </div>
              <div className="rounded-2xl border border-border panel p-6">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  What happens next
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">
                  I read it myself and reply within one business day, same day if
                  you message on WhatsApp. If it is a fit, the next step is a
                  30-minute call. If it is not, I will say so.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
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

                return (
                  <Reveal key={channel.label} delay={i * 0.08}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="card-hover group flex h-full flex-col rounded-2xl border border-border panel p-7"
                      >
                        {body}
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                          Open{" "}
                          <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </a>
                    ) : (
                      // No "Open" affordance either: a card that cannot be
                      // opened should not offer to open.
                      <div className="flex h-full flex-col rounded-2xl border border-border panel p-7">
                        {body}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="enquiry" className="relative mt-16 scroll-mt-28 sm:mt-20">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <Reveal>
                <ContactForm />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border border-border panel p-7">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Where to find me</span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Where I am and when</h2>
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

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Start anywhere</span>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
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
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                    >
                      Browse services
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
