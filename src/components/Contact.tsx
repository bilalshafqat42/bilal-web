import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 sm:px-16 sm:py-20 text-center">
            <div className="blob pointer-events-none absolute -top-20 left-10 h-64 w-64 rounded-full bg-gold/30" />
            <div className="blob pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-violet/30" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                Let&apos;s Talk
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-ink">
                Have a growth challenge? <span className="text-gradient">Let&apos;s solve it.</span>
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-muted leading-relaxed">
                Whether it&apos;s a freelance project, a fractional growth role, or a
                full-time position — I&apos;m happy to talk through what you need and how I
                can help.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:bilalshafqat42@gmail.com"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                >
                  Email Me <ArrowUpRight size={16} />
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
