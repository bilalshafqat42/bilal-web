import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 sm:px-16 sm:py-20 text-center">
            <div
              className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
              style={{ animationDelay: "-4s" }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                Book A Consultation
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                Have a project in mind? <span className="text-gradient">Let&apos;s start it.</span>
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-muted leading-relaxed">
                Whether it&apos;s a paid campaign, a website or app, or ongoing design and
                social support — tell me what you need and I&apos;ll get back to you with
                next steps.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:bilalshafqat42@gmail.com"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                >
                  Book a free consultation <ArrowUpRight size={16} />
                </a>
                <a
                  href="tel:+971529766006"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                >
                  Call / WhatsApp
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Mail size={15} className="text-gold" /> bilalshafqat42@gmail.com
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={15} className="text-gold" /> +971 52 976 6006
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-gold" /> Dubai, UAE
                </span>
              </div>

              <SocialLinks className="mt-8 justify-center" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
