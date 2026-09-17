"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles, Building2, TrendingUp, X, BarChart3, ShoppingBag, Users, Settings, Cpu, Plus, Brain, Cloud } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const HERO_VIDEOS = [
  { webm: "/hero-bg.mp4.webm", mp4: "/hero-bg.mp4" },
  { webm: "/hero-bg-2.mp4.webm", mp4: "/hero-bg-2.mp4" },
];

const HERO_PHRASES = [
  "Building Tomorrow's Digital Solutions Today.",
  "Engineering Intelligent AI Platforms For Tomorrow.",
  "Crafting Modern Web Experiences Today.",
  "Empowering 100+ Satisfied Clients Worldwide."
];

type CaseStudyItem = {
  name: string
  desc: string
  color: string
  icon: React.ElementType
  detail: string
  metrics: string[]
};

const SUCCESS_STORIES: CaseStudyItem[] = [
  { name: "Acme Corp", desc: "Automated logistics, +30% growth", color: "text-blue-400 bg-blue-500/10 border border-blue-500/20", icon: Cpu, detail: "Acme Corp implemented HexaLogic's automated AI middleware to route operations globally. Within 90 days, processing bottlenecks were reduced to zero.", metrics: ["30% efficiency increase", "No downtime", "Optimized workflows"] },
  { name: "GlobalTech", desc: "AI-driven analytics integration", color: "text-purple-400 bg-purple-500/10 border border-purple-500/20", icon: Brain, detail: "GlobalTech embedded our machine learning APIs to parse user events in real time, boosting conversions and scaling seamlessly.", metrics: ["12.5% conversion boost", "Real-time parsing", "Scalable event brokers"] },
  { name: "Nexus Ind.", desc: "Cloud infrastructure scaling", color: "text-orange-400 bg-orange-500/10 border border-brand-primary/20", icon: Cloud, detail: "Nexus Ind. used HexaLogic cloud architecture to autoscale servers under high consumer load without extra manual overhead.", metrics: ["$1.2M infrastructure saved", "Instant load response", "99.99% availability"] }
];

const STAT_TARGETS = [1250, 4.2, 89.4, 92913];

export default function RedSunHero() {
  const containerRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const statsValRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const [activeTab, setActiveTab] = useState<"analytics" | "solutions" | "partners" | "settings">("analytics");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudyItem | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [autoScale, setAutoScale] = useState(true);
  const [apiLogs, setApiLogs] = useState(false);

  // Scroll-linked motion for the headline and dashboard (desktop only)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(containerRef);
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(textSectionRef.current, {
          y: "60%",
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });

        gsap.fromTo(dashboardRef.current,
          { scale: 0.95, y: 100, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: dashboardRef.current,
              start: "top 90%",
            }
          }
        );
      });

      return () => {
        mm.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Count-up stats and growing bars each time the Analytics tab is shown
  useEffect(() => {
    if (activeTab !== "analytics") return;

    const ctx = gsap.context(() => {
      statsValRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: STAT_TARGETS[idx],
          duration: reducedMotion ? 0 : 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (idx === 0) ref.innerText = `${Math.floor(obj.val).toLocaleString()}+`;
            else if (idx === 1) ref.innerText = `$${obj.val.toFixed(1)}M`;
            else if (idx === 2) ref.innerText = `${obj.val.toFixed(1)}%`;
            else ref.innerText = Math.floor(obj.val).toLocaleString();
          }
        });
      });

      barsRefs.current.forEach((bar, idx) => {
        if (!bar) return;
        const targetHeight = bar.getAttribute("data-height") || "0%";
        gsap.fromTo(bar,
          { height: "0%" },
          { height: targetHeight, duration: reducedMotion ? 0 : 1.2, ease: "power2.out", delay: reducedMotion ? 0 : idx * 0.1 }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab, reducedMotion]);

  // Typewriter headline
  useEffect(() => {
    if (reducedMotion) return;
    const currentText = HERO_PHRASES[phraseIndex];

    if (charCount < currentText.length) {
      const timer = setTimeout(() => setCharCount(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setPhraseIndex(prev => (prev + 1) % HERO_PHRASES.length);
      setCharCount(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, [charCount, phraseIndex, reducedMotion]);

  const phrase = HERO_PHRASES[phraseIndex];
  const visibleCount = reducedMotion ? phrase.length : charCount;
  const video = HERO_VIDEOS[currentVideoIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-surface-darkest text-[#f4f4f5] font-sans selection:bg-brand-primary selection:text-white z-10 pt-32 overflow-hidden min-h-screen flex flex-col items-center"
    >
      {/* Background Video */}
      {!reducedMotion && (
        <video
          key={currentVideoIndex}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length)}
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-70 pointer-events-none"
          aria-hidden="true"
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/80 via-transparent to-[#0a0a0c] z-0 pointer-events-none" aria-hidden="true" />

      {/* Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] md:h-[600px] bg-white/5 blur-[120px] pointer-events-none rounded-full mix-blend-screen" aria-hidden="true" />
      <div className="absolute top-0 left-[10%] md:left-[20%] w-[200px] md:w-[300px] h-[500px] md:h-[700px] bg-white/5 blur-[100px] pointer-events-none transform -rotate-45" aria-hidden="true" />

      {/* Hero Content */}
      <div ref={textSectionRef} className="container mx-auto px-6 max-w-7xl relative z-20 flex flex-col items-start pt-8 sm:pt-14 md:pt-24 shrink-0">
        <h1 className="text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl text-white min-h-[180px] sm:min-h-[150px] md:min-h-[180px]">
          <span className="sr-only">{phrase}</span>
          <span aria-hidden="true">
            {phrase.split(" ").map((word, i, arr) => {
              const isHighlight = i === arr.length - 1 || word === "AI";
              const wordStart = arr.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);
              if (visibleCount <= wordStart) return null;
              const charsToShow = Math.min(visibleCount - wordStart, word.length);
              return (
                <span key={i} className={isHighlight ? "text-brand-primary" : "text-white"}>
                  {word.slice(0, charsToShow)}{" "}
                </span>
              );
            })}
            {!reducedMotion && <span className="inline-block w-[3px] h-[1em] bg-brand-primary animate-pulse align-middle ml-2" />}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium max-w-3xl mb-8">
          Empowering businesses with custom software development, AI-powered solutions, mobile applications and intuitive digital experiences designed to scale with your growth.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="text-2xl font-bold text-white">
            We are Team <span className="text-brand-primary">Hexa Tech</span>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="px-6 py-3 min-h-[48px] bg-brand-primary hover:bg-[#ff8947] text-white text-sm font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(255,115,36,0.25)] flex items-center">
              Start a Project
            </Link>
            <Link href="/case-studies" className="px-6 py-3 min-h-[48px] border border-white/15 hover:border-white/40 text-white text-sm font-bold rounded-xl transition-colors flex items-center">
              See Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="w-full relative flex justify-center items-end mt-8 md:mt-20 min-h-[40vh] md:min-h-[60vh] pointer-events-none perspective-[1000px] shrink-0">
        <div className="relative z-20 w-full max-w-[1200px] px-4 sm:px-6 pointer-events-auto">
          <div
            ref={dashboardRef}
            className="relative w-full rounded-t-3xl md:rounded-t-[40px] overflow-hidden border-t border-l border-r border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] bg-[#0e0e11] font-sans"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-white/5">
              <button type="button" className="flex items-center gap-1" onClick={() => { setActiveTab("analytics"); setActiveCaseStudy(null); }} aria-label="Show analytics">
                <span className="text-white font-bold text-lg sm:text-xl tracking-wider">HEXALOGIC</span>
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
              </button>

              <div className="hidden lg:flex items-center gap-8 text-xs font-medium text-gray-400" role="tablist" aria-label="Dashboard demo sections">
                {([
                  ["analytics", "Analytics", BarChart3],
                  ["solutions", "Solutions", ShoppingBag],
                  ["partners", "Partners", Users],
                  ["settings", "Settings", Settings],
                ] as const).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === key}
                    onClick={() => { setActiveTab(key); setActiveCaseStudy(null); }}
                    className={`flex items-center gap-2 transition-colors group min-h-[44px] ${activeTab === key ? "text-white font-semibold" : "hover:text-white"}`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === key ? "text-brand-primary" : "text-gray-500"}`} /> {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary text-xs font-bold" aria-hidden="true">
                  HL
                </div>
              </div>
            </div>

            {/* Main Dashboard Area */}
            <div className="p-4 sm:p-6 md:p-8 pb-14 md:pb-16 flex flex-col gap-6 md:gap-8 min-h-[420px] md:min-h-[500px]">
              {activeTab === "analytics" && (
                <div className="flex flex-col gap-8" role="tabpanel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">Impact Analytics</h2>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Illustrative performance measurements across our client ecosystems.</p>
                    </div>
                    <Link href="/contact" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-[#ff8947] transition-all shadow-[0_0_15px_rgba(255,115,36,0.2)] min-h-[44px]">
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Work With Us
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { title: "BUSINESSES SCALED", value: "0+", grow: "↑ 24.5%" },
                      { title: "REVENUE GENERATED", value: "$0.0M", grow: "↑ 12.5%" },
                      { title: "AVG. EFFICIENCY", value: "0.0%", grow: "↑ 19.3%" },
                      { title: "HOURS SAVED", value: "0", grow: "↑ 5.2%" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface-dark border border-brand-primary/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-brand-primary/40 transition-colors min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.title}</span>
                          <span className="text-[10px] font-bold text-green-500">{stat.grow}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span
                            ref={(el) => { statsValRefs.current[i] = el; }}
                            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                          >
                            {stat.value}
                          </span>
                          <svg className="w-16 h-6 text-brand-primary opacity-80" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            {i % 2 === 0 ? (
                              <path d="M0,20 C20,20 20,10 40,15 C60,20 60,5 80,10 C90,12 95,25 100,20" />
                            ) : (
                              <path d="M0,15 C15,25 30,5 45,15 C60,5 75,25 100,10" />
                            )}
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 flex flex-col">
                      <h3 className="text-white font-medium mb-1">Recent Success Stories</h3>
                      <p className="text-xs text-gray-500 mb-6">See how businesses transform with HexaLogic.</p>

                      <div className="flex flex-col gap-2">
                        {SUCCESS_STORIES.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              type="button"
                              key={item.name}
                              onClick={() => setActiveCaseStudy(item)}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-left group min-h-[56px]"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                                  <ItemIcon className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div>
                                  <div className="text-white text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-400">{item.desc}</div>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-gray-400 group-hover:text-brand-primary transition-colors shrink-0 ml-3">Read &rarr;</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 flex flex-col">
                      <h3 className="text-white font-medium mb-8">Client Growth (YoY)</h3>
                      <div className="relative flex items-end justify-between px-4 gap-2 mt-4 border-b border-white/10 pb-4 h-44 shrink-0">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4" aria-hidden="true">
                          {[100, 50, 0].map((val) => (
                            <div key={val} className="w-full border-t border-white/5 flex items-start">
                              <span className="text-[10px] text-gray-600 -mt-2 -ml-6">{val}</span>
                            </div>
                          ))}
                        </div>
                        {[
                          { a: 40, b: 25, label: "Jan" },
                          { a: 15, b: 25, label: "Feb" },
                          { a: 25, b: 30, label: "Mar" },
                          { a: 15, b: 10, label: "Apr" },
                          { a: 35, b: 20, label: "May" },
                          { a: 15, b: 25, label: "Jun" }
                        ].map((bar, i) => (
                          <div key={bar.label} className="flex gap-1 relative z-10 w-full justify-center group h-full items-end">
                            <div
                              ref={(el) => { barsRefs.current[i] = el; }}
                              data-height={`${bar.a}%`}
                              className="w-3 bg-brand-primary rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                              style={{ height: "0%" }}
                            />
                            <div
                              className="w-3 bg-brand-primary/30 rounded-t-sm transition-all duration-500 group-hover:bg-brand-primary/50"
                              style={{ height: `${bar.b}%` }}
                            />
                            <span className="absolute -bottom-6 text-[10px] text-gray-500 uppercase">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "solutions" && (
                <div className="flex flex-col gap-6 text-left" role="tabpanel">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-brand-primary w-6 h-6" aria-hidden="true" /> Tailored Business Solutions
                  </h2>
                  <p className="text-gray-400 text-sm max-w-2xl">
                    We deploy custom engineering models and AI infrastructure built around your business. Learn how we deliver progress.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {[
                      { title: "Machine Learning APIs", desc: "Embed real-time natural language processors, recommendation engines, and predictive analytics models directly into your platform.", icon: Brain, href: "/services/business-automation" },
                      { title: "Distributed Cloud Infrastructure", desc: "Scale globally. Our server architectures handle heavy operational surges with auto-throttling load balancers.", icon: Cloud, href: "/services/cloud-solutions" },
                      { title: "Operations Automation", desc: "Reclaim lost developer hours. We design system-wide triggers, CI/CD routines, and middle-layer automation for high-speed delivery.", icon: Cpu, href: "/services/business-automation" }
                    ].map((sol) => {
                      const SolIcon = sol.icon;
                      return (
                        <Link key={sol.title} href={sol.href} className="bg-surface-dark border border-white/5 rounded-2xl p-6 hover:border-brand-primary/30 hover:bg-[#18181c] transition-all group block">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <SolIcon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <h4 className="text-white font-semibold mb-2 group-hover:text-brand-primary transition-colors">{sol.title}</h4>
                          <p className="text-gray-400 text-xs leading-relaxed">{sol.desc}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "partners" && (
                <div className="flex flex-col gap-6 text-left" role="tabpanel">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Building2 className="text-brand-primary w-6 h-6" aria-hidden="true" /> Partner Network
                  </h2>
                  <p className="text-gray-400 text-sm max-w-2xl">
                    We work alongside ambitious teams and co-develop integrations, specifications and next-generation web platforms.
                  </p>
                  <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Scale your startup to new heights</h4>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
                        HexaLogic provides direct engineering power and mentorship to early-stage partners building in AI, automation and modern web platforms.
                      </p>
                      <Link href="/contact" className="inline-flex items-center px-6 py-2.5 min-h-[44px] bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold rounded-lg transition-colors">Apply for Partnership</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      {["Vercel", "Stripe", "Supabase", "AWS"].map((partner) => (
                        <div key={partner} className="bg-black/20 border border-white/5 px-6 py-4 rounded-xl text-center text-xs font-bold text-gray-400 tracking-wider">
                          {partner}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="flex flex-col gap-6 text-left max-w-xl" role="tabpanel">
                  <h2 className="text-2xl font-bold text-white">System Settings</h2>
                  <p className="text-gray-400 text-xs">A preview of the kind of controls we build into client dashboards.</p>
                  <div className="space-y-4 mt-4">
                    {[
                      { label: "Automatic Scaling", desc: "Allow the platform to handle database scaling dynamically.", value: autoScale, toggle: () => setAutoScale(v => !v) },
                      { label: "Developer API Logs", desc: "Enable verbose telemetry logging inside the dashboard.", value: apiLogs, toggle: () => setApiLogs(v => !v) },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 p-4 bg-surface-dark rounded-xl border border-white/5">
                        <div>
                          <div className="text-white text-sm font-semibold">{row.label}</div>
                          <div className="text-[10px] text-gray-500">{row.desc}</div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={row.value}
                          aria-label={row.label}
                          onClick={row.toggle}
                          className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors duration-200 shrink-0 ${row.value ? "bg-brand-primary justify-end" : "bg-white/10 justify-start"}`}
                        >
                          <span className="w-4 h-4 bg-white rounded-full block" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Case Study Detail Overlay */}
            {activeCaseStudy && (
              <div className="absolute inset-0 bg-[#0e0e11] z-50 p-5 sm:p-6 md:p-8 flex flex-col justify-between text-left overflow-y-auto" role="dialog" aria-label={`${activeCaseStudy.name} success story`}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary"><TrendingUp className="w-4 h-4" aria-hidden="true" /></div>
                      <span className="text-xs font-bold text-gray-500 tracking-wider">SUCCESS STORY</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveCaseStudy(null)}
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{activeCaseStudy.name}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{activeCaseStudy.detail}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Key metrics delivered</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeCaseStudy.metrics.map((metric) => (
                        <div key={metric} className="bg-surface-dark border border-brand-primary/20 rounded-xl p-4 flex items-center gap-3">
                          <Check className="text-green-500 w-5 h-5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-white text-xs font-medium">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudy(null)}
                    className="px-6 py-2.5 min-h-[44px] rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/case-studies"
                    className="px-6 py-2.5 min-h-[44px] rounded-lg bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold transition-colors shadow-[0_0_15px_rgba(255,115,36,0.2)] flex items-center"
                  >
                    View Real Case Studies
                  </Link>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0e11] to-transparent pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
