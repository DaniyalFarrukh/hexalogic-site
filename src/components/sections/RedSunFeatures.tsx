"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Rocket, Cloud, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  slug: string
  title: string
  tag: string
  description: string
  image: string
  alt: string
  accent: "brand" | "yellow"
  fit?: "cover" | "contain"
};

const WEB_PROJECTS: Project[] = [
  {
    slug: "decornish",
    title: "Decornish",
    tag: "Case Study",
    description: "A modern, elegant e-commerce platform designed for premium home decor. We integrated automated inventory management and an intuitive visual product catalog to replace their manual spreadsheets.",
    image: "/images/case-studies/decornish-frontend.png",
    alt: "Decornish decoration store homepage",
    accent: "brand",
  },
  {
    slug: "mystique-tech",
    title: "Mystique Tech",
    tag: "Case Study",
    description: "A high-performance digital storefront tailored for gamers. By building dynamic product filtering and a custom stock-alert system, we eliminated their daily inventory hurdles.",
    image: "/images/case-studies/mystique-frontend.png",
    alt: "Mystique Tech gaming store homepage",
    accent: "brand",
  },
  {
    slug: "scorlyn",
    title: "Scorlyn",
    tag: "Case Study",
    description: "A specialized paddle sports portal offering digital scoreboards and integrated management systems. We integrated hardware and software for points calculation over wifi.",
    image: "/images/case-studies/scorlyn-shop.png",
    alt: "Scorlyn shop display",
    accent: "brand",
  },
];

const MOBILE_PROJECTS: Project[] = [
  {
    slug: "estateiq-ai",
    title: "EstateIQ AI",
    tag: "AI & Mobile App",
    description: "A modern, AI-powered mobile real estate platform designed to make discovering, evaluating, and scheduling property visits faster and more intelligent.",
    image: "/images/case-studies/main-page.jpeg",
    alt: "EstateIQ AI home screen",
    accent: "yellow",
    fit: "contain",
  },
];

const MARQUEE_ROW_1 = [
  { type: "text", val: "Swift" },
  { type: "badge", badgeType: "frontend", val: "Frontend Technologies" },
  { type: "text", val: "HTML5" },
  { type: "text", val: "CSS3 / SCSS / Sass" },
  { type: "text", val: "JavaScript" },
  { type: "text", val: "TypeScript" },
  { type: "badge", badgeType: "mobile", val: "Mobile Technologies" },
  { type: "text", val: "Kotlin / Java" },
  { type: "text", val: "React" },
  { type: "text", val: "Next.js" },
] as const;

const MARQUEE_ROW_2 = [
  { type: "badge", badgeType: "backend", val: "Backend Technologies" },
  { type: "text", val: "Node.js" },
  { type: "text", val: "Express.js" },
  { type: "text", val: "Spring Boot" },
  { type: "text", val: "Ruby on Rails" },
  { type: "text", val: "Python" },
  { type: "badge", badgeType: "mobile", val: "Mobile Technologies" },
  { type: "text", val: "Flutter" },
  { type: "text", val: "PostgreSQL" },
  { type: "text", val: "Supabase" },
] as const;

function MarqueeItem({ item }: { item: (typeof MARQUEE_ROW_1)[number] | (typeof MARQUEE_ROW_2)[number] }) {
  if (item.type === "badge") {
    const styles =
      item.badgeType === "frontend"
        ? "bg-blue-400/20 border border-blue-300/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        : item.badgeType === "backend"
          ? "bg-orange-400/20 border border-orange-300/40 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
          : "bg-green-400/20 border border-green-300/40 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
    return <span className={`px-4 py-2 rounded-full text-xs font-semibold ${styles}`}>{item.val}</span>;
  }
  return <span className="text-blue-100/90 font-medium text-xl tracking-wide">{item.val}</span>;
}

function ProjectCard({ project }: { project: Project }) {
  const hover = project.accent === "yellow" ? "group-hover:text-yellow-500" : "group-hover:text-brand-primary";
  const tagColor = project.accent === "yellow" ? "text-yellow-500" : "text-brand-primary";
  return (
    <article className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group reveal">
      <Link href={`/case-studies/${project.slug}`} className="block relative w-full aspect-[16/10] bg-[#0b0b0e] overflow-hidden">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          className={`${project.fit === "contain" ? "object-contain p-4" : "object-cover object-top"} group-hover:scale-105 transition-transform duration-500 opacity-90`}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </Link>
      <div className="p-6 sm:p-8">
        <span className={`${tagColor} text-xs font-bold tracking-wider uppercase`}>{project.tag}</span>
        <h3 className={`text-2xl font-bold text-white mt-2 mb-3 ${hover} transition-colors`}>{project.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{project.description}</p>
        <div className="flex items-center justify-end pt-6 border-t border-white/5">
          <Link href={`/case-studies/${project.slug}`} className={`inline-flex items-center gap-1.5 text-white ${hover.replace("group-", "")} transition-colors text-sm font-bold min-h-[44px]`}>
            View details <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function RedSunFeatures() {
  const containerRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeMainTab, setActiveMainTab] = useState<"web" | "mobile" | "ai">("web");

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * 400, behavior: "smooth" });
  };

  // Reveal-on-scroll runs once, desktop only. Content is always visible on
  // touch devices and for users who prefer reduced motion.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(containerRef);
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }
          );
        });

        gsap.to(".ai-node", { y: "random(-8, 8)", x: "random(-8, 8)", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.15 });
        gsap.to(".ai-line", { opacity: 0.4, scaleX: 1.05, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.2 });
        gsap.to(".tech-badge", { y: -6, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.1, from: "random" } });
        gsap.to(".server-bar-fill", { height: () => `${Math.random() * 50 + 40}%`, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.1 });
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, [activeMainTab]);

  const tabs: { key: typeof activeMainTab; label: string }[] = [
    { key: "web", label: "Web" },
    { key: "mobile", label: "Mobile" },
    { key: "ai", label: "AI" },
  ];

  return (
    <section ref={containerRef} className="w-full bg-surface-darkest text-[#f4f4f5] font-sans overflow-hidden">

      {/* The Right Tech For Every Challenge */}
      <div className="py-20 sm:py-24 border-b border-white/5 relative overflow-hidden bg-gradient-to-br from-[#092540] via-[#164475] to-[#092540]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-6 max-w-7xl text-center mb-12 sm:mb-16 relative z-10">
          <h2 className="text-[clamp(2rem,4vw+1rem,3rem)] font-bold tracking-tight mb-4 leading-tight text-white drop-shadow-md text-balance">
            The Right Tech For Every Challenge
          </h2>
          <p className="text-blue-100/90 text-base md:text-lg max-w-2xl mx-auto drop-shadow-sm font-medium">
            From AI to UX, we cover all your tech needs, ensuring seamless development and efficient delivery.
          </p>
        </div>

        {[{ items: MARQUEE_ROW_1, cls: "animate-marquee-reverse" }, { items: MARQUEE_ROW_2, cls: "animate-marquee" }].map((row, rowIdx) => (
          <div key={rowIdx} className={`relative w-full overflow-hidden whitespace-nowrap z-10 ${rowIdx === 0 ? "mb-8" : ""}`} aria-hidden="true">
            <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#092540] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#092540] to-transparent z-20 pointer-events-none" />
            {/* Two identical copies make the -50% translate loop seamless */}
            <div className={`flex items-center w-max ${row.cls}`}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex gap-12 items-center px-6 shrink-0">
                  {row.items.map((item, idx) => (
                    <div key={`${copy}-${idx}`} className="flex-shrink-0 flex items-center">
                      <MarqueeItem item={item} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Core Capabilities */}
      <div id="capabilities" className="relative container mx-auto px-6 max-w-7xl py-20 sm:py-28">
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] md:w-[1200px] h-[700px] sm:h-[900px] md:h-[1200px] z-0 pointer-events-none opacity-70" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border-[10px] border-brand-primary/30 blur-[2px]" />
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(255,115,36,0.16)_0%,rgba(255,115,36,0.05)_45%,transparent_70%)] blur-2xl" />
        </div>

        <div className="flex items-end justify-between mb-8 relative z-10 gap-4">
          <div>
            <h3 className="text-[clamp(1.875rem,3vw+1rem,2.25rem)] font-black text-white tracking-tight">Core Capabilities</h3>
            <p className="text-gray-400 mt-2">The foundations behind everything we build.</p>
          </div>
          <div className="hidden md:flex lg:hidden items-center gap-3">
            <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Scroll capabilities left" className="w-11 h-11 rounded-full border border-white/10 bg-surface-darkest flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollCarousel(1)} aria-label="Scroll capabilities right" className="w-11 h-11 rounded-full border border-white/10 bg-surface-darkest flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all">
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-5 lg:gap-6 relative z-10 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0"
        >
          {/* AI Integrations */}
          <div className="min-w-[82vw] md:min-w-[45vw] lg:min-w-0 snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-brand-primary/50 hover:bg-[#16161a]/80 transition-all duration-300 group reveal">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-8 shadow-[0_0_15px_rgba(255,115,36,0.15)] group-hover:shadow-[0_0_25px_rgba(255,115,36,0.4)] transition-all">
                <BrainCircuit className="w-7 h-7" aria-hidden="true" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-primary transition-colors">Next-Gen AI Integrations</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Future-proof your business. We embed custom LLM integrations, automated workflows, and smart data modeling directly into your product.</p>
            </div>
            <div className="w-full h-36 mt-8 rounded-2xl bg-surface-darkest/80 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-brand-primary/30 transition-all duration-300" aria-hidden="true">
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

          {/* Tech Stack */}
          <div className="min-w-[82vw] md:min-w-[45vw] lg:min-w-0 snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-[#3b82f6]/50 hover:bg-[#16161a]/80 transition-all duration-300 group reveal">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all">
                <Rocket className="w-7 h-7" aria-hidden="true" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-[#3b82f6] transition-colors">Elite Tech Stack</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Zero lag, infinite scale. We build with modern engines like Next.js, Go, Rust, and AWS for lightning-fast speeds and high security.</p>
            </div>
            <div className="w-full h-36 mt-8 grid grid-cols-3 gap-3 p-4 items-center bg-surface-darkest/80 border border-white/5 rounded-2xl relative overflow-hidden group-hover:border-[#3b82f6]/30 transition-all duration-300" aria-hidden="true">
              {["Next.js", "React", "Node.js", "Golang", "Rust", "AWS"].map((tech) => (
                <div key={tech} className="tech-badge px-2 py-2 rounded-xl bg-[#16161a] border border-white/10 text-center text-xs font-bold text-gray-300">
                  {tech}
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent opacity-40 pointer-events-none" />
            </div>
          </div>

          {/* Cloud */}
          <div className="min-w-[82vw] md:min-w-[45vw] lg:min-w-0 snap-center bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-start justify-between min-h-[380px] hover:border-[#22c55e]/50 hover:bg-[#16161a]/80 transition-all duration-300 group reveal">
            <div className="w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e] mb-8 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all">
                <Cloud className="w-7 h-7" aria-hidden="true" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-[#22c55e] transition-colors">Scalable Cloud</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Deploy to the edge globally with zero-downtime, automated load balancing, and high-performance serverless systems.</p>
            </div>
            <div className="w-full h-36 mt-8 flex items-end justify-between px-6 py-6 bg-surface-darkest/80 border border-white/5 rounded-2xl gap-3 relative overflow-hidden group-hover:border-[#22c55e]/30 transition-all duration-300" aria-hidden="true">
              <div className="absolute inset-0 opacity-10 flex flex-col justify-between py-6 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-white/50" />
                ))}
              </div>
              {[40, 70, 50, 90, 60, 80, 95].map((val, idx) => (
                <div key={idx} className="w-full bg-[#16161a] rounded-t-md h-full flex items-end relative z-10 border-x border-t border-white/5">
                  <div className="server-bar-fill w-full bg-gradient-to-t from-[#22c55e]/20 to-[#22c55e]/80 group-hover:to-[#22c55e] rounded-t-md transition-colors duration-500" style={{ height: `${val}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Successful Projects */}
      <div id="projects" className="container mx-auto px-6 max-w-7xl py-20 sm:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl reveal">
            <h2 className="text-[clamp(2.5rem,5vw,3rem)] font-extrabold text-white mb-6 tracking-tight text-balance">
              Successful Projects
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Take a look at the custom-engineered digital systems and solutions we have deployed globally for our clients.
            </p>
          </div>

          <div className="flex bg-[#121214] border border-white/5 p-1.5 rounded-xl shrink-0 overflow-x-auto hide-scrollbar" role="tablist" aria-label="Project categories">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeMainTab === tab.key}
                onClick={() => setActiveMainTab(tab.key)}
                className={`px-6 py-2.5 min-h-[44px] rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center justify-center ${
                  activeMainTab === tab.key
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeMainTab === "web" && (
          <div role="tabpanel">
            <h3 className="text-2xl font-bold text-brand-primary mb-8">E-Commerce &amp; Web Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {WEB_PROJECTS.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          </div>
        )}

        {activeMainTab === "mobile" && (
          <div role="tabpanel">
            <h3 className="text-2xl font-bold text-brand-primary mb-8">Mobile Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {MOBILE_PROJECTS.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          </div>
        )}

        {activeMainTab === "ai" && (
          <div role="tabpanel">
            <h3 className="text-2xl font-bold text-brand-primary mb-8">AI-Powered Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {MOBILE_PROJECTS.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
            <p className="text-gray-500 text-sm mt-8">More AI case studies are on the way. <Link href="/contact" className="text-brand-primary hover:underline">Talk to us</Link> about your AI project.</p>
          </div>
        )}
      </div>
    </section>
  );
}
