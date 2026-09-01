import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AppointmentBooking from "@/components/AppointmentBooking";

export const metadata: Metadata = {
  title: "Book a Call — Bilal Shafqat, Dubai",
  description:
    "Book a 30-minute call with Bilal Shafqat, a Dubai-based freelance digital marketer, developer and designer. Monday to Friday, 9am to 6pm GST. No pitch, no obligation.",
  alternates: { canonical: "/appointment" },
};

const reassurance = [
  "Thirty minutes, and you keep whatever comes out of it",
  "You speak to the person who does the work, not a salesperson",
  "An honest read on scope and budget before anything is quoted",
];

export default function AppointmentPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Full bleed. The portrait is pushed left so the booking panel on the
            right never lands on top of it. */}
        <section className="relative min-h-[100svh] overflow-hidden pb-16 pt-32 sm:pt-40">
          <Image
            src="/images/bilal-shafqat-coat.avif"
            alt="Bilal Shafqat"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "28% 12%" }}
          />
          {/* Two scrims rather than one: a horizontal wash keeps the right-hand
              panel readable, a vertical one lifts the copy off the floor of the
              image. */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-bg/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-bg/40" />

          <div className="site-container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-16">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-gold">
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

              <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
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
                <a href="/contact" className="text-gold underline underline-offset-4 hover:opacity-80">
                  Send me a message instead
                </a>
                .
              </p>
            </div>

            <AppointmentBooking />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
