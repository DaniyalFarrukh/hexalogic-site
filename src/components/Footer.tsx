"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "Web Development", href: "/services" },
    { label: "Custom Software", href: "/services" },
    { label: "Business Automation", href: "/services" },
    { label: "Cloud Solutions", href: "/services" },
    { label: "IT Consulting", href: "/services" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/case-studies" },
    { label: "Careers", href: "/contact" },
    { label: "Blog", href: "/#readmore" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  {
    label: "Twitter / X",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "#",
  },
  {
    label: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    href: "https://www.linkedin.com/company/hexaloigc-and-tech/about/?viewAsMember=true",
  },
  {
    label: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    href: "https://github.com/DaniyalFarrukh",
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-darkest text-gray-300 relative overflow-hidden border-t border-white/5">
      {/* Optional subtle glow behind the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-brand-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        
        {/* Call to action top section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#121214] border border-white/5 rounded-3xl p-8 md:p-12 mb-20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF7324]/20 to-transparent blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
           
           <div className="mb-8 md:mb-0 max-w-xl relative z-10 text-center md:text-left w-full">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Let&apos;s craft your next big idea.</h2>
             <p className="text-gray-400 text-sm md:text-base">Join our newsletter for tech insights, or reach out to start a project.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 relative z-10">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="bg-surface-darkest border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary/50 flex-1 md:w-72 transition-colors" 
             />
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="px-8 py-3.5 bg-brand-primary text-white font-semibold rounded-xl text-sm shadow-[0_0_20px_rgba(255,115,36,0.25)] hover:bg-[#ff8947] transition-colors"
             >
               Subscribe
             </motion.button>
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
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#121214] border border-white/5 text-gray-400 hover:border-brand-primary/30 hover:bg-brand-primary/10 hover:text-brand-primary shadow-sm transition-colors duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                {category}
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
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
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
            <Link href="/privacy" className="text-sm font-medium text-gray-500 hover:text-white transition-colors duration-200 flex items-center min-h-[44px]">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
