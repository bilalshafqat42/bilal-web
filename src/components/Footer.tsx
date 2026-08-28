import Image from "next/image";
import SocialLinks from "./SocialLinks";
import FooterWordmark from "./FooterWordmark";

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border pt-14 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.9fr] gap-10">
          <div>
            <Image
              src="/logo/bilal-square-light.svg"
              alt="Bilal Shafqat"
              width={382}
              height={642}
              className="h-24 w-auto"
            />
            <p className="mt-3 text-sm font-medium text-gold">
              Paid Marketing, Development &amp; Design Partner
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
              One senior partner for paid marketing, website &amp; app
              development, design, and the CRM automation that connects them.
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Quick Links</p>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-muted hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Contact &amp; Trust</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <a href="mailto:bilalshafqat42@gmail.com" className="hover:text-gold transition-colors">
                  bilalshafqat42@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+971529766006" className="hover:text-gold transition-colors">
                  +971 52 976 6006
                </a>
              </li>
              <li>
                <a href="tel:+971566047396" className="hover:text-gold transition-colors">
                  +971 56 604 7396
                </a>
              </li>
              <li>Dubai, UAE</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} Bilal Shafqat. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gold transition-colors">Privacy</a>
            <span>Built with Next.js &amp; Tailwind CSS.</span>
          </p>
        </div>
        <FooterWordmark />
      </div>
    </footer>
  );
}
