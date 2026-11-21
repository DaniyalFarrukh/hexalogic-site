import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, SOCIAL_LINKS } from "@/lib/site";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Client Portal", href: "/portal/login" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-night-soft relative overflow-hidden border-t border-line-dark safe-bottom">
      {/* Architectural vertical hairlines (Reference 1: Leather Design Studio) */}
      <div className="absolute inset-0 ds-hairline-grid-dark pointer-events-none opacity-60" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] pt-20 sm:pt-28 pb-12 relative z-10">
        {/* Editorial Pre-Footer CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-16 sm:pb-20 mb-16 sm:mb-20 border-b border-line-dark">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.25rem,5vw,4.25rem)] ds-display text-night-ink mb-4 text-balance">
              Let&apos;s craft your next big idea.
            </h2>
            <p className="text-night-soft text-sm sm:text-base max-w-xl leading-relaxed">
              Tell us about your project and we&apos;ll get back to you within one business day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link
              href="/contact"
              className="ds-pill px-7 py-3.5 min-h-[48px] bg-accent text-white text-sm hover:bg-accent-hover text-center"
            >
              Start a Project
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="ds-pill px-7 py-3.5 min-h-[48px] border border-line-dark hover:border-white/30 bg-white/[0.03] text-night-ink text-sm text-center"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 md:pr-8">
            <h2 className="text-2xl sm:text-3xl ds-heading text-night-ink mb-5 flex items-center gap-1.5">
              <span>Hexa</span>
              <span className="text-accent">Logic</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm text-night-soft">
              Building smart digital solutions for modern businesses. We transform
              ideas into powerful, scalable technology that drives growth and innovation.
            </p>
            <div className="mt-6 space-y-1.5 text-sm text-night-soft font-mono">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center min-h-[44px] hover:text-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              <br />
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="inline-flex items-center min-h-[44px] hover:text-accent transition-colors"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex gap-2.5 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-night-card border border-line-dark text-night-soft hover:border-accent hover:text-accent ds-press"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <FooterColumn
            title="Services"
            links={SERVICES.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))}
          />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-line-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-night-soft text-center sm:text-left">
            © {new Date().getFullYear()} HexaLogic Tech Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link
              href="/privacy"
              className="text-xs font-mono text-night-soft hover:text-night-ink transition-colors flex items-center min-h-[44px]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-mono text-night-soft hover:text-night-ink transition-colors flex items-center min-h-[44px]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Leather-Studio architectural watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden text-center leading-[0.76] font-display font-semibold tracking-[-0.06em] text-[clamp(4.5rem,18vw,16rem)] text-white/[0.03] -mb-3 sm:-mb-6"
      >
        HEXALOGIC
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="ds-meta text-night-ink mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-0.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-night-soft hover:text-night-ink hover:translate-x-1 inline-flex items-center min-h-[44px] transition-all duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
