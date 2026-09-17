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
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-darkest text-gray-300 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-brand-primary/5 blur-[120px] pointer-events-none rounded-full" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 relative z-10">
        {/* Call to action */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-[#121214] border border-white/5 rounded-3xl p-8 md:p-12 mb-16 sm:mb-20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF7324]/20 to-transparent blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" aria-hidden="true" />

          <div className="max-w-xl relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Let&apos;s craft your next big idea.</h2>
            <p className="text-gray-400 text-sm md:text-base">Tell us about your project and we&apos;ll get back to you within one business day.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
            <Link
              href="/contact"
              className="px-8 py-3.5 min-h-[48px] bg-brand-primary text-white font-semibold rounded-xl text-sm shadow-[0_0_20px_rgba(255,115,36,0.25)] hover:bg-[#ff8947] transition-colors text-center flex items-center justify-center"
            >
              Start a Project
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="px-8 py-3.5 min-h-[48px] border border-white/10 hover:border-white/30 text-white font-semibold rounded-xl text-sm transition-colors text-center flex items-center justify-center"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 md:pr-8">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Hexa</span>
              <span className="text-brand-primary">Logic</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm text-gray-400 font-medium">
              Building smart digital solutions for modern businesses. We transform
              ideas into powerful, scalable technology that drives growth and innovation.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <a href={`mailto:${CONTACT_EMAIL}`} className="block hover:text-brand-primary transition-colors">{CONTACT_EMAIL}</a>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="block hover:text-brand-primary transition-colors">{CONTACT_PHONE_DISPLAY}</a>
            </div>
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#121214] border border-white/5 text-gray-400 hover:border-brand-primary/30 hover:bg-brand-primary/10 hover:text-brand-primary shadow-sm transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <FooterColumn title="Services" links={SERVICES.map(s => ({ label: s.title, href: `/services/${s.slug}` }))} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
            © {new Date().getFullYear()} HexaLogic Tech Solutions. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/privacy" className="text-sm font-medium text-gray-500 hover:text-white transition-colors duration-200 flex items-center min-h-[44px]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-white transition-colors duration-200 flex items-center min-h-[44px]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
        {title}
      </h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-brand-primary hover:translate-x-1 inline-flex items-center min-h-[44px] transition-all duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
