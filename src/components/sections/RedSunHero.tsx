"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles, Building2, TrendingUp, X, BarChart3, ShoppingBag, Users, Settings, Cpu, Plus, Brain, Cloud } from "lucide-react";
import Image from "next/image";

const HERO_VIDEOS = [
  {
    desktop: "/hero-bg.mp4.webm",
    mobileWebm: "/hero-bg.mp4.webm",
    mobileMp4: "", // Fallback omitted since user provided single webm
  },
  {
    desktop: "/hero-bg-2.mp4.webm",
    mobileWebm: "/hero-bg-2.mp4.webm",
    mobileMp4: "", 
  },
];

const HERO_PHRASES = [
  "Building Tomorrow Digital Solutions Today.",
  "Engineering Intelligent AI Platforms For Tomorrow.",
  "Crafting Modern Web Experiences Today.",
  "Empowering 100+ Satisfied Clients Worldwide."
];

export default function RedSunHero({}: Record<string, never>) {
  const containerRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"analytics" | "solutions" | "partners" | "settings">("analytics");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState<{name: string, desc: string, detail: string, metrics: string[], icon: React.ElementType} | null>(null);
  
  // Word by word title state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  // Settings tab states
  const [autoScale, setAutoScale] = useState(true);
  const [apiLogs, setApiLogs] = useState(false);

  // Performance/Accessibility states
  const [reducedMotion, setReducedMotion] = useState(false);

  // Refs for dashboard animations
  const dashboardRef = useRef<HTMLDivElement>(null);
  const statsValRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Setup ScrollTrigger for animating the ring down when scrolling
      const mm = gsap.matchMedia(containerRef);
      mm.add("(min-width: 768px)", () => {

        // Animate the wordings
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

        // Scale up and fade in the dashboard when it enters the viewport
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

      // Animate Stats & Bars when Analytics tab is shown
      if (activeTab === "analytics") {
        // Count up stats
        const targets = [1250, 4.2, 89.4, 92913];
        statsValRefs.current.forEach((ref, idx) => {
          if (!ref) return;
          const targetVal = targets[idx];
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetVal,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              if (idx === 0) ref.innerText = `${Math.floor(obj.val).toLocaleString()}+`;
              else if (idx === 1) ref.innerText = `$${obj.val.toFixed(1)}M`;
              else if (idx === 2) ref.innerText = `${obj.val.toFixed(1)}%`;
              else ref.innerText = Math.floor(obj.val).toLocaleString();
            }
          });
        });

        // Growth animation for bars
        barsRefs.current.forEach((bar, idx) => {
          if (!bar) return;
          const targetHeight = bar.getAttribute("data-height") || "0%";
          gsap.fromTo(bar, 
            { height: "0%" },
            { height: targetHeight, duration: 1.2, ease: "power2.out", delay: idx * 0.1 }
          );
        });
      }

      return () => {
        mm.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (!reducedMotion) {
        video.load();
        video.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        video.pause();
      }
    }
  }, [currentVideoIndex, reducedMotion]);

  // Title Character-by-character effect
  useEffect(() => {
    const currentText = HERO_PHRASES[phraseIndex];
    
    if (charCount < currentText.length) {
      const timer = setTimeout(() => {
        setCharCount(prev => prev + 1);
      }, 50); // Speed of characters appearing
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % HERO_PHRASES.length);
        setCharCount(0);
      }, 3000); // Wait 3 seconds before next phrase
      return () => clearTimeout(timer);
    }
  }, [charCount, phraseIndex]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-surface-darkest text-[#f4f4f5] font-sans selection:bg-brand-primary selection:text-white z-10 pt-32 overflow-hidden min-h-screen flex flex-col items-center"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        poster="/hexalogic-logo.png"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-70 pointer-events-none"
      >
        <source src={HERO_VIDEOS[currentVideoIndex].mobileWebm} type="video/webm" media="(max-width: 768px)" />
        <source src={HERO_VIDEOS[currentVideoIndex].desktop} type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/80 via-transparent to-[#0a0a0c] z-0 pointer-events-none" />

      {/* Background Lighting (RedSun style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] md:h-[600px] bg-white/5 blur-[120px] pointer-events-none rounded-full mix-blend-screen" />
      <div className="absolute top-0 left-[10%] md:left-[20%] w-[200px] md:w-[300px] h-[500px] md:h-[700px] bg-white/5 blur-[100px] pointer-events-none transform -rotate-45" />

      {/* RedSun Hero Content */}
      <div ref={textSectionRef} className="container mx-auto px-6 max-w-7xl relative z-20 flex flex-col items-start pt-24 md:pt-40 shrink-0">
        {/* Title */}
        <h1 className="text-[clamp(2.5rem,5vw+1rem,4.5rem)] font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl text-white min-h-[180px] sm:min-h-[150px] md:min-h-[180px]">
          {(() => {
            return HERO_PHRASES[phraseIndex].split(" ").map((word, i, arr) => {
              const isHighlight = i === arr.length - 1 || word === "AI";
              const wordStart = arr.slice(0, i).join(" ").length + (i > 0 ? 1 : 0);

              if (charCount <= wordStart) return null;

              const charsToShow = Math.min(charCount - wordStart, word.length);
              const displayWord = word.slice(0, charsToShow);

              return (
                <span key={i} className={isHighlight ? "text-brand-primary" : "text-white"}>
                  {displayWord}{" "}
                </span>
              );
            });
          })()}
          {/* Blinking cursor */}
          <span className="inline-block w-[3px] h-[1em] bg-brand-primary animate-pulse align-middle ml-2" />
        </h1>

        {/* Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium max-w-3xl mb-8">
          Empowering businesses with custom software development AI-powered solutions mobile applications and intuitive digital experiences designed to scale with your growth.
        </p>

        {/* Slogan */}
        <div className="text-2xl font-bold mb-10 text-white">
          We are Team <span className="text-brand-primary">Hexa Tech</span>
        </div>



      </div>

      {/* Glowing Ring & Dashboard Section */}
      <div className="w-full relative flex justify-center items-end mt-16 md:mt-32 min-h-[50vh] md:min-h-[70vh] pointer-events-none perspective-[1000px] shrink-0">
        
        {/* The "Horizon" (Dashboard UI) */}
        <div className="relative z-20 w-full max-w-[1200px] px-6 pointer-events-auto">
          <div 
            ref={dashboardRef}
            className="relative w-full rounded-t-3xl md:rounded-t-[40px] overflow-hidden border-t border-l border-r border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] bg-[#0e0e11] font-sans"
          >
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-white/5">
              {/* Logo */}
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab("analytics")}>
                <span className="text-white font-bold text-lg sm:text-xl tracking-wider">HEXALOGIC</span>
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
              </div>
              
              {/* Nav */}
              <div className="hidden lg:flex items-center gap-8 text-xs font-medium text-gray-400">
                <button 
                  onClick={() => { setActiveTab("analytics"); setActiveCaseStudy(null); }}
                  className={`flex items-center gap-2 transition-colors group min-h-[44px] ${activeTab === "analytics" ? "text-white font-semibold" : "hover:text-white"}`}
                >
                  <BarChart3 className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === "analytics" ? "text-brand-primary" : "text-gray-500"}`} /> Analytics
                </button>
                <button 
                  onClick={() => { setActiveTab("solutions"); setActiveCaseStudy(null); }}
                  className={`flex items-center gap-2 transition-colors group min-h-[44px] ${activeTab === "solutions" ? "text-white font-semibold" : "hover:text-white"}`}
                >
                  <ShoppingBag className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === "solutions" ? "text-brand-primary" : "text-gray-500"}`} /> Solutions
                </button>
                <button 
                  onClick={() => { setActiveTab("partners"); setActiveCaseStudy(null); }}
                  className={`flex items-center gap-2 transition-colors group min-h-[44px] ${activeTab === "partners" ? "text-white font-semibold" : "hover:text-white"}`}
                >
                  <Users className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === "partners" ? "text-brand-primary" : "text-gray-500"}`} /> Partners
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2 transition-colors group min-h-[44px] ${activeTab === "settings" ? "text-white font-semibold" : "hover:text-white"}`}
                >
                  <Settings className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === "settings" ? "text-brand-primary" : "text-gray-500"}`} /> Settings
                </button>
              </div>
              
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/10">
                  <Image src="https://i.pravatar.cc/100?img=3" alt="User Avatar" width={32} height={32} />
                </div>
              </div>
            </div>

            {/* Main Dashboard Area */}
            <div className="p-6 md:p-8 pb-16 flex flex-col gap-8 min-h-[500px]">
              
              {/* TABS CONTAINER */}
              {activeTab === "analytics" && (
                <div className="tab-panel flex flex-col gap-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">Impact Analytics</h2>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Real-time performance measurements of our client ecosystems.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-[#ff8947] transition-all shadow-[0_0_15px_rgba(255,115,36,0.2)] min-h-[44px]">
                      <Plus className="w-3.5 h-3.5" /> Connect Platform
                    </button>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "BUSINESSES SCALED", value: "0+", grow: "↑ 24.5%" },
                      { title: "REVENUE GENERATED", value: "$0.0M", grow: "↑ 12.5%" },
                      { title: "AVG. EFFICIENCY", value: "0.0%", grow: "↑ 19.3%" },
                      { title: "HOURS SAVED", value: "0", grow: "↓ 5.2%" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface-dark border border-brand-primary/20 rounded-2xl p-5 flex flex-col justify-between hover:border-brand-primary/40 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.title}</span>
                          <span className={`text-[10px] font-bold ${stat.grow.includes('↑') ? 'text-green-500' : 'text-red-500'}`}>{stat.grow}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span 
                            ref={(el) => { statsValRefs.current[i] = el; }}
                            className="text-2xl font-bold text-white tracking-tight"
                          >
                            {stat.value}
                          </span>
                          {/* Sparkline */}
                          <svg className="w-16 h-6 text-brand-primary opacity-80" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
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

                  {/* Bottom Panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left List */}
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 flex flex-col">
                      <h3 className="text-white font-medium mb-1">Recent Success Stories</h3>
                      <p className="text-xs text-gray-500 mb-6">See how businesses transform with HexaLogic.</p>
                      
                      <div className="flex flex-col gap-2">
                        {[
                          { name: "Acme Corp", desc: "Automated logistics, +30% growth", color: "text-blue-400 bg-blue-500/10 border border-blue-500/20", icon: Cpu, detail: "Acme Corp implemented HexaLogic's automated AI middleware to route operations globally. Within 90 days, processing bottlenecks were reduced to zero.", metrics: ["30% efficiency increase", "No downtime", "Optimized workflows"] },
                          { name: "GlobalTech", desc: "AI-driven analytics integration", color: "text-purple-400 bg-purple-500/10 border border-purple-500/20", icon: Brain, detail: "GlobalTech embedded our machine learning APIs to parse user events in real-time, boosting their custom conversions and scaling seamlessly.", metrics: ["12.5% Conversion boost", "Real-time parsing", "Scalable event brokers"] },
                          { name: "Nexus Ind.", desc: "Cloud infrastructure scaling", color: "text-orange-400 bg-orange-500/10 border border-brand-primary/20", icon: Cloud, detail: "Nexus Ind. utilized HexaLogic cloud architecture to autoscale servers in reaction to high-traffic consumer loads without extra manual admin overhead.", metrics: ["$1.2M infrastructure saved", "Instant load response", "99.99% system availability"] }
                        ].map((item, i) => {
                          const ItemIcon = item.icon;
                          return (
                            <div 
                              key={i} 
                              onClick={() => setActiveCaseStudy(item)}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                                  <ItemIcon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-white text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-400">{item.desc}</div>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-gray-400 group-hover:text-brand-primary transition-colors">Read Case Study &rarr;</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Chart */}
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 flex flex-col">
                      <h3 className="text-white font-medium mb-8">Client Growth (YoY)</h3>
                      
                      <div className="flex-1 relative flex items-end justify-between px-4 gap-2 mt-4 border-b border-white/10 pb-4 h-40">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                          {[100, 50, 0].map((val, idx) => (
                            <div key={idx} className="w-full border-t border-white/5 flex items-start">
                                <span className="text-[10px] text-gray-600 -mt-2 -ml-6">{val}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bars */}
                        {[
                          { a: 40, b: 25, label: "Jan" },
                          { a: 15, b: 25, label: "Feb" },
                          { a: 25, b: 30, label: "Mar" },
                          { a: 15, b: 10, label: "Apr" },
                          { a: 35, b: 20, label: "May" },
                          { a: 15, b: 25, label: "Jun" }
                        ].map((bar, i) => (
                          <div key={i} className="flex gap-1 relative z-10 w-full justify-center group cursor-pointer h-full items-end">
                            <div 
                              ref={(el) => { barsRefs.current[i] = el; }}
                              data-height={`${bar.a}%`}
                              className="w-2 md:w-3 bg-brand-primary rounded-t-sm transition-all duration-500 group-hover:brightness-125" 
                              style={{ height: "0%" }} 
                            />
                            <div 
                              className="w-2 md:w-3 bg-brand-primary/30 rounded-t-sm transition-all duration-500 group-hover:bg-brand-primary/50" 
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
                <div className="tab-panel flex flex-col gap-6 text-left">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-brand-primary w-6 h-6 animate-pulse" /> Tailored Business Solutions
                  </h2>
                  <p className="text-gray-400 text-sm max-w-2xl">
                    We deploy custom engineering models and AI infrastructure built around your business. Learn how we deliver progress.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {[
                      { title: "Machine Learning APIs", desc: "Embed real-time natural language processors, recommendation engines, and predictive analytics models directly into your platform.", icon: Brain },
                      { title: "Distributed Cloud Infrastructure", desc: "Scale globally to infinite nodes. Our server architectures handle heavy operational surges with auto-throttling load balancers.", icon: Cloud },
                      { title: "Operations Automation", desc: "Reclaim lost developer hours. We design system-wide triggers, CI/CD routines, and middle-layer automation for high-speed delivery.", icon: Cpu }
                    ].map((sol, i) => {
                      const SolIcon = sol.icon;
                      return (
                        <div key={i} className="bg-surface-dark border border-white/5 rounded-2xl p-6 hover:border-brand-primary/30 hover:bg-[#18181c] transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all duration-350">
                            <SolIcon className="w-5 h-5" />
                          </div>
                          <h4 className="text-white font-semibold mb-2 group-hover:text-brand-primary transition-colors">{sol.title}</h4>
                          <p className="text-gray-400 text-xs leading-relaxed">{sol.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "partners" && (
                <div className="tab-panel flex flex-col gap-6 text-left">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Building2 className="text-brand-primary w-6 h-6" /> Partner Network
                  </h2>
                  <p className="text-gray-400 text-sm max-w-2xl">
                    Join forces with elite organizations. We co-develop open-source specifications, system integrations, and next-generation Web platforms.
                  </p>
                  <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Scale your startup to new heights</h4>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
                        HexaLogic provides capital, mentorship, and direct engineering power to seed-stage partners aiming to innovate in AI, decentralized networks, or automated operations.
                      </p>
                      <button className="px-6 py-2.5 bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold rounded-lg transition-colors">Apply for Partnership</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                      {[
                        { name: "Vercel", icon: "▲" },
                        { name: "Stripe", icon: "💳" },
                        { name: "Supabase", icon: "⚡" },
                        { name: "AWS", icon: "☁️" }
                      ].map((partner, idx) => (
                        <div key={idx} className="bg-black/20 border border-white/5 hover:border-brand-primary/30 px-6 py-4 rounded-xl text-center text-xs font-bold text-gray-400 hover:text-white tracking-wider flex items-center gap-2 cursor-pointer transition-colors duration-200">
                          <span className="text-brand-primary">{partner.icon}</span>
                          <span>{partner.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="tab-panel flex flex-col gap-6 text-left max-w-xl">
                  <h2 className="text-2xl font-bold text-white">System Settings</h2>
                  <p className="text-gray-400 text-xs">Configure your platform integration defaults and credentials.</p>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-white/5">
                      <div>
                        <div className="text-white text-sm font-semibold">Automatic Scaling</div>
                        <div className="text-[10px] text-gray-500">Allow platform to handle database scaling dynamically.</div>
                      </div>
                      <div 
                        onClick={() => setAutoScale(!autoScale)}
                        className={`w-10 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-200 ${autoScale ? "bg-brand-primary justify-end" : "bg-white/10 justify-start"}`}
                      >
                        <motion.div layout className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-white/5">
                      <div>
                        <div className="text-white text-sm font-semibold">Developer API Logs</div>
                        <div className="text-[10px] text-gray-500">Enable verbose telemetry logging inside dashboard.</div>
                      </div>
                      <div 
                        onClick={() => setApiLogs(!apiLogs)}
                        className={`w-10 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-200 ${apiLogs ? "bg-brand-primary justify-end" : "bg-white/10 justify-start"}`}
                      >
                        <motion.div layout className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
            
            {/* Case Study Detail Overlay Panel */}
            {activeCaseStudy && (
              <div className="absolute inset-0 bg-[#0e0e11] z-50 p-6 md:p-8 flex flex-col justify-between text-left transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary"><TrendingUp className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-gray-500 tracking-wider">SUCCESS STORY</span>
                    </div>
                    <button 
                      onClick={() => setActiveCaseStudy(null)}
                      className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{activeCaseStudy.name}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{activeCaseStudy.detail}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase">KEY METRICS DELIVERED</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeCaseStudy.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-surface-dark border border-brand-primary/20 rounded-xl p-4 flex items-center gap-3">
                          <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                          <span className="text-white text-xs font-medium">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button 
                    onClick={() => setActiveCaseStudy(null)}
                    className="px-6 py-2.5 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => { setActiveCaseStudy(null); setActiveTab("solutions"); }}
                    className="px-6 py-2.5 rounded-lg bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold transition-colors shadow-[0_0_15px_rgba(255,115,36,0.2)]"
                  >
                    View Our Solutions
                  </button>
                </div>
              </div>
            )}

            {/* Fading bottom edge to make it look embedded */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0e0e11] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
