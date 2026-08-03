function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H7v3h2.5v8H13z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <rect x="3" y="9" width="3" height="10" />
      <circle cx="4.5" cy="5.5" r="1.8" />
      <path d="M10 9h3v1.6c.6-1 1.7-1.8 3.3-1.8 2.9 0 4.2 1.8 4.2 4.7V19h-3v-5c0-1.3-.5-2.2-1.8-2.2-1.2 0-1.9.8-1.9 2.2V19h-3V9z" />
    </svg>
  );
}

function BehanceMonogram() {
  return <span className="text-[11px] font-bold tracking-tight">Be</span>;
}

const socials = [
  { name: "LinkedIn", href: "#", icon: LinkedinIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "Behance", href: "#", icon: BehanceMonogram },
];

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#engagement" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.9fr] gap-10">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">Bilal Shafqat</h3>
            <p className="mt-1 text-sm font-medium text-gold">
              Paid Marketing, Design &amp; Development Studio
            </p>
            <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
              Paid marketing, web &amp; mobile development, and design — under one roof.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <s.icon />
                </a>
              ))}
            </div>
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
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
