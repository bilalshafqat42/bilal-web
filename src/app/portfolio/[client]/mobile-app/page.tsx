import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import DeviceFrame from "@/components/DeviceFrame";
import CtaButton from "@/components/CtaButton";
import { FactStrip } from "@/components/CaseStudyParts";
import { clients, getClient } from "@/data/caseStudies";
import { SITE_URL as SITE } from "@/lib/schema";

/**
 * The mobile app, as its own case study.
 *
 * A static `mobile-app` segment inside the dynamic `[client]` folder. Next
 * resolves static siblings before dynamic ones, so this takes precedence over
 * `[project]` without shadowing any real project — verified no project uses the
 * slug `mobile-app`.
 *
 * Item 145 deliberately avoided creating this route, on the grounds that the
 * project pages are organised by *project* while an app is a *deliverable*, and
 * publishing both axes risks the same content under two URLs. That reasoning
 * does not apply here: the app screens appear on no landing-page route, so this
 * page is genuinely new content rather than a second view of existing content.
 *
 * Guarded on `c.mobileApp` rather than assuming every client has one, since the
 * route is generated for each client in the data.
 */
type Props = { params: Promise<{ client: string }> };

export function generateStaticParams() {
  return clients.filter((c) => c.mobileApp).map((c) => ({ client: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const c = getClient(client);
  if (!c?.mobileApp) return {};
  return {
    title: `${c.name} Mobile App — React Native Case Study | Bilal Shafqat`,
    description: `A cross-platform iOS and Android app for ${c.name}, built in React Native from a single codebase: sign-in with a guest route, the developments list, and the same enquiry paths as the website.`,
    alternates: { canonical: `/portfolio/${c.slug}/mobile-app` },
  };
}

export default async function MobileAppCaseStudy({ params }: Props) {
  const { client } = await params;
  const c = getClient(client);
  if (!c?.mobileApp) notFound();

  const app = c.mobileApp;
  const url = `${SITE}/portfolio/${c.slug}/mobile-app`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/portfolio/${c.slug}` },
      { "@type": "ListItem", position: 4, name: "Mobile app", item: url },
    ],
  };

  /* No SoftwareApplication node. That type wants an operating system, a
     category and ideally a store URL or price; none of those were supplied, and
     the standing rule on this project is that nothing goes into markup that is
     not visible on the page. */

  const facts = [
    { label: "Platforms", value: "iOS & Android" },
    { label: "Framework", value: "React Native" },
    { label: "Codebase", value: "Single, shared" },
    { label: "Screens shown", value: `${app.screens.length}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <Reveal>
              <div>
                <Link
                  href={`/portfolio/${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-gold"
                >
                  <ArrowLeft size={15} /> {c.name}
                </Link>
                <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
                  A cross-platform app, from one codebase
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{app.body}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12">
                <FactStrip facts={facts} />
              </div>
            </Reveal>

            {app.lead ? (
              <Reveal delay={0.15}>
                <Image
                  src={app.lead.src}
                  alt={app.lead.alt}
                  width={app.lead.width}
                  height={app.lead.height}
                  sizes="(min-width: 1024px) 1100px, 100vw"
                  className="mt-14 h-auto w-full"
                  priority
                />
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* The journey, one screen per row: frame on one side, reasoning on the
            other, alternating so the eye is not tracking a single column. */}
        <section className="relative mt-20 sm:mt-28">
          <div className="site-container">
            <Reveal>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                Screen by screen
              </h2>
            </Reveal>

            <ol className="mt-14 space-y-16 sm:space-y-20">
              {app.screens.map((s, i) => (
                <li key={s.key}>
                  <Reveal>
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
                      <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                        <DeviceFrame capture={s.capture} eager={i === 0} />
                      </div>
                      <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                        <span className="font-mono text-xs text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                          {s.label}
                        </h3>
                        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                          {s.journey}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* The enquiry screen, described rather than shown. It exists in the
                app and is visible inside the composite above, but there is no
                standalone capture of it — so the reasoning is published and the
                image is not invented. Swap this for a real screen entry the day
                a capture arrives. */}
            <Reveal>
              <div className="mt-16 rounded-2xl border border-dashed border-border bg-surface/30 p-7 sm:p-9">
                <span className="font-mono text-xs text-gold">
                  {String(app.screens.length + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Enquire</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  The form asks for four things — name, email, phone and a message — and nothing
                  else. Every extra field on a property enquiry costs completions, and the ones that
                  matter for a first conversation are how to reach someone and roughly what they
                  want. Qualification happens on the call, not in the form. It is reachable from
                  every development card, so a buyer never has to navigate back to a contact page
                  to act on what they are looking at.
                </p>
                <p className="mt-5 text-sm text-muted/70">
                  Visible in the composite above. A standalone capture of this screen is still to
                  come.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-28">
          <div className="site-container">
            <Reveal>
              <div className="flex flex-wrap items-center gap-5">
                <CtaButton href="/appointment">Book a free consultation</CtaButton>
                <Link
                  href={`/portfolio/${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                >
                  See the rest of the {c.name} work <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
