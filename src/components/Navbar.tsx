"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/#services",
    megaMenu: true,
    items: [
      {
        title: "Web Development",
        desc: "Modern, scalable & responsive websites.",
        image: "/images/services/webdev.png",
      },
      {
        title: "Custom Software",
        desc: "Tailored software solutions for your needs.",
        image: "/images/services/software.png",
      },
      {
        title: "UI/UX Design",
        desc: "Beautiful designs that users love.",
        image: "/images/services/uiux.png",
      },
      {
        title: "Cloud Solutions",
        desc: "Secure, scalable & reliable cloud services.",
        image: "/images/services/cloud.png",
      },
      {
        title: "IT Consulting",
        desc: "Expert guidance for your IT strategy.",
        image: "/images/services/consulting.png",
      },
      {
        title: "Business Automation",
        desc: "Automate processes & boost efficiency.",
        image: "/images/services/automation.png",
      },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMegaEnter = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const hash = href.includes("#") ? "#" + href.split("#")[1] : href;
      if (pathname === "/") {
        e.preventDefault();
        setMobileOpen(false);
        setMegaOpen(false);
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setMobileOpen(false);
        setMegaOpen(false);
      }
    } else {
      setMobileOpen(false);
      setMegaOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-surface-darkest/90 backdrop-blur-md border-b border-white/10 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center shrink-0 transition-transform duration-300 hover:scale-[1.02] relative z-50"
            >
              <Image
                src="/hexalogic-logo.png"
                alt="HexaLogic Tech Logo"
                width={360}
                height={96}
                className="h-14 sm:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
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
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 rounded-lg ${
                        megaOpen ? "text-brand-primary bg-white/10" : "text-white hover:text-brand-primary hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                              {link.items?.map((item) => (
                                <Link
                                  key={item.title}
                                  href="/#services"
                                  onClick={(e) => handleNavClick(e, "/#services")}
                                  className="group block relative rounded-xl overflow-hidden bg-[#16161a] border border-white/5 hover:border-brand-primary/40 hover:bg-[#1c1c22] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                  <div className="relative w-full h-24 md:h-32 overflow-hidden bg-surface-darkest">
                                    <Image
                                      src={item.image}
                                      alt={item.title}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      sizes="(max-width: 768px) 150px, 300px"
                                      priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                  <div className="p-3 md:p-4 relative">
                                    <div className="mb-1.5">
                                      <h3 className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors duration-200">
                                        {item.title}
                                      </h3>
                                    </div>
                                    <p className="text-xs text-gray-300 group-hover:text-white leading-relaxed transition-colors duration-200 hidden md:block">
                                      {item.desc}
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
                              onClick={(e) => handleNavClick(e, "/contact")}
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
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg text-white hover:text-brand-primary hover:bg-white/5 min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/contact"
                onClick={(e) => handleNavClick(e, "/contact")}
                className="ml-4 px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-[#ff8947] transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/25 hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 rounded transition-all duration-300 bg-white ${mobileOpen ? "rotate-45 translate-y-2.5" : ""}`} />
                <span className={`block h-0.5 rounded transition-all duration-300 bg-white ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 rounded transition-all duration-300 bg-white ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-surface-darkest pt-24 px-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-2 pb-10">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block px-4 py-3.5 text-xl font-bold text-white hover:text-brand-primary hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                  {link.megaMenu && link.items && (
                    <div className="pl-4 mt-2 space-y-3">
                      {link.items.map((item) => (
                        <Link
                          key={item.title}
                          href="/#services"
                          onClick={(e) => handleNavClick(e, "/#services")}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/5 bg-surface-dark shadow-sm"
                        >
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={(e) => handleNavClick(e, "/contact")}
                className="mt-8 px-5 py-4 bg-brand-primary text-white text-lg font-bold rounded-xl text-center hover:bg-[#ff8947] transition-all duration-200 shadow-[0_0_30px_rgba(255,115,36,0.3)]"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
