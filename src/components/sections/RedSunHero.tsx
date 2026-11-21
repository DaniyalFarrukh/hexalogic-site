"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_EDITORIAL } from "@/components/motion/EditorialReveal";
import RelayHeroBackdrop from "@/components/sections/RelayHeroBackdrop";
import TabletVideoShowcase from "@/components/sections/TabletVideoShowcase";

const HERO_PHRASES = [
  "Building Tomorrow's Digital Solutions Today.",
  "Engineering Intelligent AI Platforms For Tomorrow.",
  "Crafting Modern Web Experiences Today.",
  "Empowering 100+ Satisfied Clients Worldwide.",
];

const BUTTON_TILES = Array.from({ length: 16 }, (_, i) => i);

export default function RedSunHero() {
  const containerRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(HERO_PHRASES[0].length);

  // Subtle scroll-linked parallax on hero copy (desktop only)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(containerRef);
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(textSectionRef.current, {
          y: 56,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });
      });

      return () => {
        mm.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Typewriter headline (exact existing phrases preserved)
  useEffect(() => {
    if (reducedMotion) return;
    const currentText = HERO_PHRASES[phraseIndex];

    if (charCount < currentText.length) {
      const timer = setTimeout(() => setCharCount((prev) => prev + 1), 46);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
      setCharCount(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, [charCount, phraseIndex, reducedMotion]);

  const phrase = HERO_PHRASES[phraseIndex];
  const visibleCount = reducedMotion ? phrase.length : charCount;

  return (
    <section ref={containerRef} className="relative w-full overflow-x-clip bg-paper">
      {/* ── Relay SaaS Hero Section (#0c0c10 + 3D Glass Ribbon + Bottom-Anchored Editorial Copy) ── */}
      <div className="relative isolate w-full min-h-[100dvh] flex flex-col justify-end bg-[#0c0c10] text-white pt-32 pb-12 sm:pb-16 overflow-hidden">
        <RelayHeroBackdrop />

        <div
          ref={textSectionRef}
          className="max-w-7xl mx-auto w-full px-[var(--ds-gutter)] relative z-20 will-change-transform"
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            {/* Bottom-Left: Tight Display H1 + Team Tagline */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "105%", opacity: 0.001 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.95, delay: 0.08, ease: EASE_EDITORIAL }}
                  className="text-[clamp(2.65rem,5.4vw,4.75rem)] font-display font-medium tracking-[-0.045em] leading-[0.96] mb-5 text-white min-h-[136px] sm:min-h-[156px]"
                >
                  <span className="sr-only">{phrase}</span>
                  <span aria-hidden="true">
                    {phrase.split(" ").map((word, i, arr) => {
                      const isHighlight = i === arr.length - 1 || word === "AI";
                      const wordStart = arr.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);
                      if (visibleCount <= wordStart) return null;
                      const charsToShow = Math.min(visibleCount - wordStart, word.length);
                      return (
                        <span key={i} className={isHighlight ? "text-[#73d9ff]" : "text-white"}>
                          {word.slice(0, charsToShow)}{" "}
                        </span>
                      );
                    })}
                    {!reducedMotion && (
                      <span className="inline-block w-[3px] h-[0.88em] bg-[#2340ff] animate-pulse align-middle ml-1" />
                    )}
                  </span>
                </motion.h1>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL }}
                className="font-mono text-xs sm:text-sm uppercase tracking-[0.12em] text-white/85"
              >
                We are Team <span className="text-[#b9a6ff] font-semibold">Hexa Tech</span>
              </motion.div>
            </div>

            {/* Bottom-Right: Value Proposition + Relay Staggered-Tile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.16, ease: EASE_EDITORIAL }}
              className="lg:col-span-5 flex flex-col items-start gap-6"
            >
              <p className="text-base text-white/75 font-normal leading-relaxed max-w-[46ch]">
                Empowering businesses with custom software development, AI-powered solutions, mobile applications and intuitive digital experiences designed to scale with your growth.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {/* Relay Primary CTA with 8x2 Staggered White Tile Hover Reveal */}
                <Link
                  href="/contact"
                  className="group/pane relative isolate overflow-hidden inline-flex items-center justify-center h-12 px-7 bg-[#2340ff] text-white font-mono text-xs uppercase tracking-[0.1em] font-semibold active:scale-[0.97] transition-transform"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 grid grid-cols-8 grid-rows-2 pointer-events-none"
                  >
                    {BUTTON_TILES.map((t) => {
                      const col = t % 8;
                      const row = Math.floor(t / 8);
                      return (
                        <span
                          key={t}
                          className="bg-white scale-0 rotate-[24deg] group-hover/pane:scale-[1.06] group-hover/pane:rotate-0 transition-transform duration-300 ease-out"
                          style={{ transitionDelay: `${(col + row) * 20}ms` }}
                        />
                      );
                    })}
                  </span>
                  <span className="relative z-10 transition-colors duration-300 delay-75 group-hover/pane:text-[#2340ff]">
                    Start a Project
                  </span>
                </Link>

                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center h-12 px-6 border border-white/25 hover:border-white/70 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-[0.1em] font-semibold transition-colors"
                >
                  See Our Work
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Kodnod-Style 3D Scroll-Tilting Tablet Video Showcase ── */}
      <TabletVideoShowcase />
    </section>
  );
}
