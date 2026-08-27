import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";

const SITE_URL = "https://bilalshafqat.com";

export const metadata: Metadata = {
  title: "Contact — Freelance Digital Marketer & Developer in Dubai | Bilal Shafqat",
  description:
    "Get in touch with Bilal Shafqat, a Dubai-based freelance digital marketer, web and app developer, and designer. Email, phone, or WhatsApp, with a reply typically within one business day.",
  alternates: {
    canonical: "/contact",
  },
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "bilalshafqat42@gmail.com",
    href: "mailto:bilalshafqat42@gmail.com",
    note: "Best for detailed briefs and attachments.",
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

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Person",
    name: "Bilal Shafqat",
    url: SITE_URL,
    jobTitle: "Digital Marketing, Design & Development Specialist",
    email: "bilalshafqat42@gmail.com",
    telephone: "+971529766006",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: ["United Arab Emirates", "Worldwide"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "bilalshafqat42@gmail.com",
        telephone: "+971529766006",
        availableLanguage: ["English"],
        areaServed: ["AE", "Worldwide"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+971566047396",
        availableLanguage: ["English"],
        areaServed: ["AE", "Worldwide"],
      },
    ],
  },
};

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
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Contact
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Talk to the person who&apos;ll actually do the work
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              No sales team, no account manager, no discovery call with someone
              who then briefs somebody else. Whatever you send here reaches me
              directly, and I&apos;ll come back with honest next steps rather than
              a templated proposal.
            </p>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {channels.map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <Reveal key={channel.label} delay={i * 0.08}>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="card-hover group flex h-full flex-col rounded-2xl border border-border glass p-7"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-gold-2/10">
                        <Icon size={20} className="text-gold" />
                      </span>
                      <h2 className="mt-5 text-sm font-semibold tracking-wide text-gold uppercase">
                        {channel.label}
                      </h2>
                      <p className="mt-2 text-lg font-semibold text-ink break-words">
                        {channel.value}
                      </p>
                      <p className="mt-3 text-sm text-muted leading-relaxed">{channel.note}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                        Open{" "}
                        <ArrowUpRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="enquiry" className="relative mt-16 scroll-mt-28 sm:mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <Reveal>
                <ContactForm />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border border-border glass p-7">
                  <h2 className="text-xl font-semibold text-ink">Where I am and when</h2>
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
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Not sure what you need yet?{" "}
                    <span className="text-gradient">Start there.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    A first conversation costs nothing and often ends with me
                    telling you a smaller piece of work would do the job. That&apos;s
                    a better outcome than selling you a bigger one.
                  </p>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <a
                      href="https://wa.me/971529766006"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                    >
                      Book a free consultation <ArrowUpRight size={16} />
                    </a>
                    <a
                      href="/services"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                    >
                      Browse services
                    </a>
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
