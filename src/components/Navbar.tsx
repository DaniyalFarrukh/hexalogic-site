"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SERVICES } from "@/lib/services";

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services", megaMenu: true },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pathname = usePathname();

  const isDarkSurface =
    !mobileOpen &&
    ((pathname === "/" && !scrolled) ||
      pathname === "/case-studies/auxleds" ||
      pathname === "/case-studies/estateiq-ai");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on Escape or when clicking outside the mega menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const handleMegaEnter = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const closeAll = () => {
    setMobileOpen(false);
    setMegaOpen(false);
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const navBackground = mobileOpen
    ? "bg-surface-darkest"
    : isDarkSurface
      ? scrolled
        ? "bg-night/90 backdrop-blur-md border-b border-white/10 shadow-sm"
        : "bg-transparent"
      : scrolled
        ? "bg-paper/95 backdrop-blur-md border-b border-line shadow-sm"
        : "bg-paper/85 backdrop-blur-sm border-b border-line/60";

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] h-20 lg:h-22 gap-4">
            {/* Brand Logo */}
            <Link
              href="/"
              onClick={closeAll}
              className="inline-flex items-center shrink-0 justify-self-start transition-opacity duration-200 hover:opacity-85 relative z-50"
              aria-label="HexaLogic Tech Solutions home"
            >
              <Image
                src="/images/hexalogic-navbar-logo.png"
                alt="HexaLogic Tech Solutions"
                width={96}
                height={96}
                unoptimized
                priority
                className={`h-16 sm:h-20 w-auto object-contain ${
                  isDarkSurface
                    ? "brightness-[2.2] contrast-125 drop-shadow-[0_2px_12px_rgba(115,217,255,0.25)]"
                    : ""
                }`}
              />
            </Link>

            {/* Desktop Nav — Centered Relay-style clean spacing */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              {navLinks.map((link) =>
                link.megaMenu ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                    ref={megaRef}
                  >
                    <Link
                      href={link.href}
                      onClick={closeAll}
                      onFocus={handleMegaEnter}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      className={`px-3.5 py-2 font-nike text-base uppercase tracking-[0.04em] font-extrabold transition-colors duration-200 flex items-center gap-1.5 rounded-lg min-h-[44px] ${
                        megaOpen || isActive(link.href)
                          ? isDarkSurface
                            ? "text-white bg-white/12"
                            : "text-accent bg-paper-alt"
                          : isDarkSurface
                            ? "text-white/80 hover:text-white hover:bg-white/10"
                            : "text-ink/80 hover:text-accent hover:bg-paper-alt"
                      }`}
                    >
                      {link.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100vw-2rem)] max-w-[850px] bg-[#0c0c0e] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
                        >
                          <div className="p-4 md:p-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                              {SERVICES.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  onClick={closeAll}
                                  className="group block relative rounded-xl overflow-hidden bg-[#16161a] border border-white/5 hover:border-brand-primary/40 hover:bg-[#1c1c22] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                  <div className="relative w-full h-24 md:h-32 overflow-hidden bg-surface-darkest">
                                    <Image
                                      src={service.image}
                                      alt=""
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      sizes="(max-width: 768px) 40vw, 260px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                  <div className="p-3 md:p-4 relative">
                                    <h3 className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors duration-200 mb-1.5">
                                      {service.title}
                                    </h3>
                                    <p className="text-xs text-gray-300 group-hover:text-white leading-relaxed transition-colors duration-200 hidden md:block">
                                      {service.shortDescription}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="bg-[#111114] px-4 md:px-8 py-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2">
                            <p className="text-xs text-gray-300 text-center md:text-left">Looking for something else? We build custom solutions.</p>
                            <Link
                              href="/contact"
                              onClick={closeAll}
                              className="text-sm font-semibold text-brand-primary hover:text-white transition-colors duration-200 flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center"
                            >
                              Get in touch <span aria-hidden="true">&rarr;</span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeAll}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`px-3.5 py-2 font-nike text-base uppercase tracking-[0.04em] font-extrabold transition-colors duration-200 rounded-lg min-h-[44px] flex items-center ${
                      isActive(link.href)
                        ? isDarkSurface
                          ? "text-white bg-white/12"
                          : "text-accent bg-paper-alt"
                        : isDarkSurface
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-ink/80 hover:text-accent hover:bg-paper-alt"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right CTA */}
            <div className="hidden lg:flex items-center justify-self-end">
              <Link
                href="/contact"
                onClick={closeAll}
                className={`px-5 py-2.5 font-nike text-base uppercase tracking-[0.05em] font-extrabold transition-colors duration-200 min-h-[44px] flex items-center justify-center ${
                  isDarkSurface
                    ? "bg-[#2340ff] hover:bg-white text-white hover:text-[#2340ff]"
                    : "bg-ink hover:bg-accent text-paper hover:text-white rounded-full"
                }`}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Burger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center relative z-50 ${
                isDarkSurface || mobileOpen ? "hover:bg-white/10" : "hover:bg-paper-alt"
              }`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between" aria-hidden="true">
                <span className={`block h-0.5 rounded transition-all duration-300 ${isDarkSurface || mobileOpen ? "bg-white" : "bg-ink"} ${mobileOpen ? "rotate-45 translate-y-2.5" : ""}`} />
                <span className={`block h-0.5 rounded transition-all duration-300 ${isDarkSurface || mobileOpen ? "bg-white" : "bg-ink"} ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 rounded transition-all duration-300 ${isDarkSurface || mobileOpen ? "bg-white" : "bg-ink"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-surface-darkest pt-24 px-6 overflow-y-auto lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2 pb-10">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={closeAll}
                    className="block px-4 py-3.5 text-xl font-bold text-white hover:text-brand-primary hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                  {link.megaMenu && (
                    <div className="pl-4 mt-2 space-y-3">
                      {SERVICES.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          onClick={closeAll}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/5 bg-surface-dark shadow-sm"
                        >
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0">
                            <Image src={service.image} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{service.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{service.shortDescription}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={closeAll}
                className="mt-8 px-5 py-4 bg-brand-primary text-white text-lg font-bold rounded-xl text-center hover:bg-[#ff8947] transition-all duration-200 shadow-[0_0_30px_rgba(255,115,36,0.3)]"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
