import type { Metadata } from "next";
import { ArrowRight, Check, Clock, Mail } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thank you — Bilal Shafqat",
  description: "Your message has been received. I reply personally, usually within one working day.",
  // A conversion page has no business in search results: it would rank for
  // nothing useful and would let people arrive here without converting, which
  // pollutes the very measurement it exists to provide.
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ source?: string; slot?: string }>;
};

/** Tailors one line per entry point. Anything unrecognised falls back to the
 *  generic wording rather than showing an empty space. */
const COPY: Record<string, { heading: string; body: string }> = {
  appointment: {
    heading: "Call requested",
    body: "I confirm every call by email personally, so treat this as requested rather than booked until you hear from me.",
  },
  contact: {
    heading: "Message received",
    body: "It has landed with me directly, not with an assistant or a shared inbox.",
  },
  enquiry: {
    heading: "Enquiry received",
    body: "It has landed with me directly, not with an assistant or a shared inbox.",
  },
};

const next = [
  { icon: Clock, text: "I reply personally, usually within one working day, Monday to Friday." },
  { icon: Mail, text: "Check your spam folder if nothing arrives, then email me directly." },
];

export default async function ThankYouPage({ searchParams }: PageProps) {
  const { source, slot } = await searchParams;
  const copy = (source && COPY[source]) || {
    heading: "Thank you",
    body: "Your message has reached me directly, not an assistant or a shared inbox.",
  };

  return (
    <>
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Check size={26} />
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {copy.heading}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted">{copy.body}</p>

            {slot ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm text-ink">
                <Clock size={15} className="text-gold" />
                You asked for {slot}
              </p>
            ) : null}

            <ul className="mx-auto mt-10 max-w-md space-y-3 text-left">
              {next.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-base leading-relaxed text-muted">
                  <Icon size={17} className="mt-1 shrink-0 text-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/portfolio"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                See my work while you wait <ArrowRight size={15} />
              </a>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
              >
                Read the FAQ
              </a>
            </div>

            <p className="mt-9 text-sm text-muted">
              Something urgent?{" "}
              <a
                href="https://wa.me/971529766006"
                className="text-gold underline underline-offset-4 hover:opacity-80"
              >
                WhatsApp me
              </a>{" "}
              or call{" "}
              <a href="tel:+971529766006" className="text-gold underline underline-offset-4 hover:opacity-80">
                +971 52 976 6006
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
