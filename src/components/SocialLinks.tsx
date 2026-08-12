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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2h3.36l-7.32 8.36L22.8 22h-6.78l-5.31-6.78L4.6 22H1.24l7.83-8.94L1.2 2h6.78l4.8 6.36L18.24 2Zm-2.37 18h1.87L8.19 4H6.2l9.67 16Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2 1.7 3.6 3.9 3.9v2.6c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3-2.4 5.4-5.4 5.4S5.7 17.7 5.7 14.7s2.4-5.4 5.4-5.4c.4 0 .8 0 1.1.1v2.7a2.7 2.7 0 1 0 1.9 2.6V3h2.4Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M22 12s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.5c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7ZM10 15.3V8.7L15.5 12 10 15.3Z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.5 2 3 5.9 3 10.2c0 2.6 1.4 4.6 3.6 4.6.5 0 1-.3 1.1-.9.1-.4-.4-.9-.6-1.6-.6-1.3-.1-3.2 1.4-4.3 2.6-.9 5.7.5 5.7 4.6 0 1.8-1 3.9-3.2 3.9-.9 0-1.6-.5-1.9-1.2-.4-.9.4-2.2.6-3 .3-1.2.6-2.3-.4-3-1.5-1-3.9.6-3.9 3.3 0 .8.3 1.6.7 2.1-.1.3-.7 2.7-.8 3.1-.1.5.1.5.4.4 1.6-1.1 1.9-1.5 2.5-3.7.3.6 1.4 1.1 2.5 1.1 3.4 0 5.7-3.1 5.7-7.2C21 5.4 17.1 2 12 2Z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M4 10c4 1.2 12 1.2 16 0M6 18c2-4 5-9 6-14M18 18c-2-4-5-9-6-14" />
    </svg>
  );
}

export const socials = [
  { name: "Facebook", href: "https://www.facebook.com/imBilalshafqat", icon: FacebookIcon },
  { name: "X", href: "https://x.com/bilalshafqat42", icon: XIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bilalshafqat42", icon: LinkedinIcon },
  { name: "Instagram", href: "https://www.instagram.com/imbilalshafqat/", icon: InstagramIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@imbilalshafqat", icon: TikTokIcon },
  { name: "YouTube", href: "https://www.youtube.com/@bilalshafqat42", icon: YoutubeIcon },
  { name: "Pinterest", href: "https://www.pinterest.com/bilalshafqat42/", icon: PinterestIcon },
  { name: "Behance", href: "https://www.behance.net/bilalshafqat", icon: BehanceMonogram },
  { name: "Dribbble", href: "https://dribbble.com/bilalshafqat", icon: DribbbleIcon },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:text-gold hover:border-gold/40 transition-colors"
        >
          <s.icon />
        </a>
      ))}
    </div>
  );
}
