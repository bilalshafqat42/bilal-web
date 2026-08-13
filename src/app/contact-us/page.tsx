import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact Us - Bilal Shafqat",
  description:
    "Get in touch with Bilal Shafqat in Dubai, UAE for paid marketing, website and app development, design, or CRM and marketing automation work.",
  alternates: { canonical: "/contact-us/" },
};

export default function ContactUsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Contact
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Let&apos;s talk about your project
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              Whether it&apos;s a paid campaign, a website or app, ongoing design
              and social support, or getting your CRM and tracking in order,
              tell me what you need and I&apos;ll come back with next steps.
            </p>
          </div>
        </section>

        <section className="relative mt-14">
          <div className="mx-auto max-w-3xl px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="mailto:bilalshafqat42@gmail.com"
                className="card-hover rounded-2xl border border-border glass p-6 text-center"
              >
                <Mail size={20} className="mx-auto text-gold" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Email</p>
                <p className="mt-1 text-sm text-ink break-words">bilalshafqat42@gmail.com</p>
              </a>

              <a
                href="tel:+971529766006"
                className="card-hover rounded-2xl border border-border glass p-6 text-center"
              >
                <Phone size={20} className="mx-auto text-gold" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Phone</p>
                <p className="mt-1 text-sm text-ink">+971 52 976 6006</p>
                <p className="text-sm text-ink">+971 56 604 7396</p>
              </a>

              <div className="rounded-2xl border border-border glass p-6 text-center">
                <MapPin size={20} className="mx-auto text-gold" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/60">Location</p>
                <p className="mt-1 text-sm text-ink">Dubai, UAE</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-muted">Or find me here</p>
              <SocialLinks className="mt-4 justify-center" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
