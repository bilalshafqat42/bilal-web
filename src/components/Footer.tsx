const socials = [
  { label: "Fb", name: "Facebook", href: "#" },
  { label: "X", name: "X (Twitter)", href: "#" },
  { label: "in", name: "LinkedIn", href: "#" },
  { label: "IG", name: "Instagram", href: "#" },
  { label: "Tt", name: "TikTok", href: "#" },
  { label: "Yt", name: "YouTube", href: "#" },
  { label: "Pin", name: "Pinterest", href: "#" },
  { label: "Be", name: "Behance", href: "#" },
  { label: "Dr", name: "Dribbble", href: "#" },
];

const quickLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#case-studies" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#engagement" },
  { label: "Contact", href: "#contact" },
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted hover:text-gold hover:border-gold/40 transition-colors"
                >
                  {s.label}
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
