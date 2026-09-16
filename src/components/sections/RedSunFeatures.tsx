"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BrainCircuit, Rocket, Cloud, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RedSunFeatures() {
  const containerRef = useRef<HTMLElement>(null);
  const backgroundRingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeMainTab, setActiveMainTab] = useState("web");

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Elements sliding in from the left
      const leftElements = gsap.utils.toArray<HTMLElement>('.slide-left');
      leftElements.forEach((el) => {
        gsap.fromTo(el, 
          { x: -100, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%", // Trigger when top of element hits 85% down the viewport
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // Elements sliding in from the right
      const rightElements = gsap.utils.toArray<HTMLElement>('.slide-right');
      rightElements.forEach((el) => {
        gsap.fromTo(el, 
          { x: 100, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // Elements sliding in from the bottom (optional for center elements)
      const upElements = gsap.utils.toArray<HTMLElement>('.slide-up');
      upElements.forEach((el) => {
        gsap.fromTo(el, 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // Feature 1: AI Nodes animation
      gsap.to('.ai-node', {
        y: "random(-8, 8)",
        x: "random(-8, 8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.15
      });
      
      gsap.to('.ai-line', {
        opacity: 0.4,
        scaleX: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2
      });

      // Feature 2: Tech Badges Floating
      gsap.to('.tech-badge', {
        y: -6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.1,
          from: "random"
        }
      });

      // Feature 3: Server Bars dynamic
      gsap.to('.server-bar-fill', {
        height: () => `${Math.random() * 50 + 40}%`,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1
      });

      // Floating Background Ring Animation
      if (backgroundRingRef.current) {
        gsap.to(backgroundRingRef.current, {
          y: 40,
          rotation: 2,
          scale: 1.05,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-surface-darkest text-[#f4f4f5] font-sans overflow-hidden">
      
      {/* The Right Tech For Every Challenge Section */}
      <div className="py-24 border-b border-white/5 slide-up relative overflow-hidden bg-gradient-to-br from-[#092540] via-[#164475] to-[#092540]">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Futuristic Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
            The Right Tech For Every Challenge
          </h2>
          <p className="text-blue-100/90 text-base md:text-lg max-w-2xl mx-auto drop-shadow-sm font-medium">
            From AI to UX, we cover all your tech needs, ensuring seamless development and efficient delivery.
          </p>
        </div>

        {/* Row 1 (Left to Right / Reverse Marquee) */}
        <div className="relative w-full overflow-hidden whitespace-nowrap mb-8 z-10">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#092540] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#092540] to-transparent z-20 pointer-events-none" />
          
          <div className="flex gap-12 items-center px-8 animate-marquee-reverse w-max">
            {/* Repeat items to ensure seamless loop */}
            {Array(3).fill([
              { type: "text", val: "Swift" },
              { type: "badge", badgeType: "frontend", val: "Frontend Technologies" },
              { type: "text", val: "Html5" },
              { type: "text", val: "Css3 / Scss / Sass" },
              { type: "text", val: "Javascript" },
              { type: "text", val: "Typescript" },
              { type: "badge", badgeType: "mobile", val: "Mobile Technologies" },
              { type: "text", val: "Kotlin / Java" },
            ]).flat().map((item, idx) => (
              <div key={idx} className="flex-shrink-0 flex items-center">
                {item.type === "badge" ? (
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    item.badgeType === "frontend" 
                      ? "bg-blue-400/20 border border-blue-300/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                      : "bg-green-400/20 border border-green-300/40 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                  }`}>
                    <span>💻</span> {item.val}
                  </span>
                ) : (
                  <span className="text-blue-100/90 font-medium text-xl tracking-wide hover:text-white transition-colors duration-200">
                    {item.val}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Right to Left / Standard Marquee) */}
        <div className="relative w-full overflow-hidden whitespace-nowrap z-10">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#092540] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#092540] to-transparent z-20 pointer-events-none" />
          
          <div className="flex gap-12 items-center px-8 animate-marquee w-max">
            {/* Repeat items to ensure seamless loop */}
            {Array(3).fill([
              { type: "badge", badgeType: "backend", val: "Backend Technologies" },
              { type: "text", val: "Node.js" },
              { type: "text", val: "Express.js" },
              { type: "text", val: "Spring Boot" },
              { type: "text", val: "Ruby On Rails" },
              { type: "text", val: "Python" },
              { type: "badge", badgeType: "mobile", val: "Mobile Technologies" },
              { type: "text", val: "Kotlin / Java" },
              { type: "text", val: "Flutter" },
            ]).flat().map((item, idx) => (
              <div key={idx} className="flex-shrink-0 flex items-center">
                {item.type === "badge" ? (
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    item.badgeType === "backend" 
                      ? "bg-orange-400/20 border border-orange-300/40 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
                      : "bg-green-400/20 border border-green-300/40 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                  }`}>
                    <span>⚡</span> {item.val}
                  </span>
                ) : (
                  <span className="text-blue-100/90 font-medium text-xl tracking-wide hover:text-white transition-colors duration-200">
                    {item.val}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div id="readmore" className="relative container mx-auto px-6 max-w-7xl py-32">
        {/* Glowing Ring Background */}
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center z-0 pointer-events-none opacity-80 mix-blend-screen">
          <div ref={backgroundRingRef} className="relative w-[700px] sm:w-[900px] md:w-[1200px] h-[700px] sm:h-[900px] md:h-[1200px] flex items-center justify-center transform-style-3d">
            <img 
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c8790c213543ea74788a0_Red%20Circle%20No%20Glow.png" 
              alt="Glowing Ring"
              className="absolute w-full h-full object-contain mix-blend-screen"
            />
            <img 
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c87ad03ca3526725241f9_Red%20Glow.png" 
              alt=""
              className="absolute w-[110%] h-[110%] object-contain mix-blend-screen opacity-60 blur-md"
            />
            <img 
              src="https://cdn.prod.website-files.com/673c8623b53e085c22dcde7d/673c878ff9abee9c378d3e76_Glow.png" 
              alt=""
              className="absolute w-[90%] h-[90%] object-contain mix-blend-screen opacity-80"
            />
          </div>
        </div>

        {/* Carousel Header & Controls */}
        <div className="flex items-end justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Core Capabilities</h3>
            <p className="text-gray-400 mt-2">Swipe or scroll to explore our specialized tech foundations.</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={scrollLeft} className="w-10 h-10 rounded-full border border-white/10 bg-surface-darkest flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollRight} className="w-10 h-10 rounded-full border border-white/10 bg-surface-darkest flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 relative z-10 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}"
        >
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          
          {/* Box 1: Next-Gen AI Integrations */}
          <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[400px] snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-brand-primary/50 hover:bg-[#16161a]/80 transition-all duration-300 group shadow-[inset_0_0_20px_rgba(255,115,36,0.02)] hover:shadow-[0_20px_40px_rgba(255,115,36,0.1),inset_0_0_20px_rgba(255,115,36,0.05)] slide-left">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-8 shadow-[0_0_15px_rgba(255,115,36,0.15)] group-hover:shadow-[0_0_25px_rgba(255,115,36,0.4)] transition-all">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h6 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-primary transition-colors">Next-Gen AI Integrations</h6>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Future-proof your business. We embed custom LLM integrations, automated workflows, and smart data modeling directly into your product.</p>
            </div>
            {/* Visual Node Web Illustration */}
            <div className="w-full h-36 mt-8 rounded-2xl bg-surface-darkest/80 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-brand-primary/30 transition-all duration-300">
               {/* Decorative background grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
               <div className="flex gap-4 items-center relative z-10">
                 <div className="w-4 h-4 rounded-full bg-brand-primary shadow-[0_0_20px_#FF7324] ai-node" />
                 <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF7324] to-blue-500 origin-left ai-line" />
                 <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6] ai-node" />
                 <div className="w-16 h-[2px] bg-gradient-to-r from-blue-500 to-green-500 origin-left ai-line" />
                 <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_20px_#22c55e] ai-node" />
               </div>
            </div>
          </div>

          {/* Box 2: Elite Tech Stack */}
          <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[400px] snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-[#3b82f6]/50 hover:bg-[#16161a]/80 transition-all duration-300 group shadow-[inset_0_0_20px_rgba(59,130,246,0.02)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.1),inset_0_0_20px_rgba(59,130,246,0.05)] slide-up">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all">
                <Rocket className="w-7 h-7" />
              </div>
              <h6 className="text-2xl font-bold mb-4 text-white group-hover:text-[#3b82f6] transition-colors">Elite Tech Stack</h6>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Zero lag, infinite scale. We build with modern engines like Next.js, Go, Rust, and AWS for lightning-fast speeds and high security.</p>
            </div>
            {/* Visual floating tech badges */}
            <div className="w-full h-36 mt-8 grid grid-cols-3 gap-3 p-4 items-center bg-surface-darkest/80 border border-white/5 rounded-2xl relative overflow-hidden group-hover:border-[#3b82f6]/30 transition-all duration-300">
               {["Next.js", "React", "Node.js", "Golang", "Rust", "AWS"].map((tech, idx) => (
                 <div key={idx} className="tech-badge px-2 py-2 rounded-xl bg-[#16161a] border border-white/10 text-center text-xs font-bold text-gray-300 hover:text-white hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/20 transition-colors shadow-sm cursor-default">
                   {tech}
                 </div>
               ))}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent opacity-40 pointer-events-none" />
            </div>
          </div>

          {/* Box 3: Scalable Cloud */}
          <div className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[400px] snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-[#22c55e]/50 hover:bg-[#16161a]/80 transition-all duration-300 group shadow-[inset_0_0_20px_rgba(34,197,94,0.02)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.1),inset_0_0_20px_rgba(34,197,94,0.05)] slide-right">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e] mb-8 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all">
                <Cloud className="w-7 h-7" />
              </div>
              <h6 className="text-2xl font-bold mb-4 text-white group-hover:text-[#22c55e] transition-colors">Scalable Cloud</h6>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Deploy to the edge globally with zero-downtime, automated load balancing, and high-performance serverless systems.</p>
            </div>
            {/* Visual server bar chart / pulse */}
            <div className="w-full h-36 mt-8 flex items-end justify-between px-6 py-6 bg-surface-darkest/80 border border-white/5 rounded-2xl gap-3 relative overflow-hidden group-hover:border-[#22c55e]/30 transition-all duration-300">
               {/* Grid lines background */}
               <div className="absolute inset-0 opacity-10 flex flex-col justify-between py-6 pointer-events-none">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="w-full h-[1px] bg-white/50" />
                 ))}
               </div>
               {[40, 70, 50, 90, 60, 80, 95].map((val, idx) => (
                 <div key={idx} className="w-full bg-[#16161a] rounded-t-md h-full flex items-end relative z-10 border-x border-t border-white/5">
                   <div className="server-bar-fill w-full bg-gradient-to-t from-[#22c55e]/20 to-[#22c55e]/80 group-hover:to-[#22c55e] rounded-t-md transition-colors duration-500 shadow-[0_-5px_15px_rgba(34,197,94,0.1)] group-hover:shadow-[0_-5px_20px_rgba(34,197,94,0.4)]" style={{ height: `${val}%` }} />
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      {/* Successful Projects delivered to Clients */}
      <div className="container mx-auto px-6 max-w-7xl py-24 pb-48">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl slide-up">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Successful Projects
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Take a look at the custom-engineered digital systems and solutions we have deployed globally for our clients.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex bg-[#121214] border border-white/5 p-1.5 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveMainTab("web")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeMainTab === "web"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Web
            </button>
            <button
              onClick={() => setActiveMainTab("mobile")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeMainTab === "mobile"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setActiveMainTab("ai")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeMainTab === "ai"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              AI
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeMainTab === "web" && (
          <div className="space-y-20">
            {/* Web Subcategory 1: E-Commerce */}
            <div>
              <h3 className="text-2xl font-bold text-brand-primary mb-8">E-Commerce Websites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 1: Decornish */}
              <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group slide-left">
                <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                  <img 
                    src="/images/case-studies/decornish-frontend.png" 
                    alt="Decornish Decoration Store"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                </div>
                <div className="p-8">
                  <span className="text-brand-primary text-xs font-bold tracking-wider uppercase">Case Study</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-brand-primary transition-colors">Decornish</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A modern, elegant e-commerce platform designed for premium home decor. We integrated automated inventory management and an intuitive visual product catalog to replace their manual spreadsheets.
                  </p>
                  <div className="flex items-center justify-end pt-6 border-t border-white/5">
                    <a href="/case-studies/decornish" className="inline-flex items-center gap-1.5 text-white hover:text-brand-primary transition-colors text-sm font-bold">
                      View details <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 2: Mystique Tech */}
              <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group slide-right">
                <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                  <img 
                    src="/images/case-studies/mystique-frontend.png" 
                    alt="Mystique Tech Gaming Store"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                </div>
                <div className="p-8">
                  <span className="text-brand-primary text-xs font-bold tracking-wider uppercase">Case Study</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-brand-primary transition-colors">Mystique Tech</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A high-performance digital storefront tailored for gamers. By building dynamic product filtering and a custom stock-alert system, we eliminated their daily inventory hurdles.
                  </p>
                  <div className="flex items-center justify-end pt-6 border-t border-white/5">
                    <a href="/case-studies/mystique-tech" className="inline-flex items-center gap-1.5 text-white hover:text-brand-primary transition-colors text-sm font-bold">
                      View details <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Project 3: Scorlyn */}
              <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group slide-left md:col-span-2 lg:col-span-1">
                <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                  <img 
                    src="/images/case-studies/scorlyn-shop.png" 
                    alt="Scorlyn Shop Display"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                </div>
                <div className="p-8">
                  <span className="text-brand-primary text-xs font-bold tracking-wider uppercase">Case Study</span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-brand-primary transition-colors">Scorlyn</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    A specialized paddle sports portal offering digital scoreboards and integrated management systems. We integrated hardware and software for points calculation over wifi.
                  </p>
                  <div className="flex items-center justify-end pt-6 border-t border-white/5">
                    <a href="/case-studies/scorlyn" className="inline-flex items-center gap-1.5 text-white hover:text-brand-primary transition-colors text-sm font-bold">
                      View details <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {activeMainTab === "mobile" && (
          <div className="space-y-20">
            {/* Mobile Subcategory 1: AI Platforms */}
            <div>
              <h3 className="text-2xl font-bold text-brand-primary mb-8">AI Real Estate Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project: EstateIQ AI */}
                <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group slide-left">
                  <div className="relative w-full h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img 
                      src="/images/case-studies/main-page.jpeg" 
                      alt="EstateIQ AI Home Screen"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-yellow-500 text-xs font-bold tracking-wider uppercase">AI & Mobile App</span>
                    <h3 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-yellow-500 transition-colors">EstateIQ AI</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      A modern, AI-powered mobile real estate platform designed to make discovering, evaluating, and scheduling property visits faster and more intelligent.
                    </p>
                    <div className="flex items-center justify-end pt-6 border-t border-white/5">
                      <a href="/case-studies/estateiq-ai" className="inline-flex items-center gap-1.5 text-white hover:text-yellow-500 transition-colors text-sm font-bold">
                        View details <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMainTab === "ai" && (
          <div className="space-y-20 flex justify-center py-12">
            <p className="text-gray-500 font-medium">New AI case studies will be published here shortly.</p>
          </div>
        )}
      </div>

    </section>
  );
}
