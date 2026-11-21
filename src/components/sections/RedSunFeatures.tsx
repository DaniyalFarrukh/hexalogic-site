"use client";

import { useRef } from "react";
import { BrainCircuit, Rocket, Cloud, ChevronLeft, ChevronRight } from "lucide-react";
import { EditorialReveal } from "@/components/motion/EditorialReveal";
import GlassFolderProjects, { type FolderProject } from "@/components/sections/GlassFolderProjects";

const WEB_PROJECTS: FolderProject[] = [
  {
    slug: "decornish",
    title: "Decornish",
    tag: "Case Study",
    description:
      "A modern, elegant e-commerce platform designed for premium home decor. We integrated automated inventory management and an intuitive visual product catalog to replace their manual spreadsheets.",
    image: "/images/case-studies/decornish-frontend.png",
    alt: "Decornish decoration store homepage",
    accent: "brand",
    externalUrl: "https://www.decornish.com",
  },
  {
    slug: "mystique-tech",
    title: "Mystique Tech",
    tag: "Case Study",
    description:
      "A high-performance digital storefront tailored for gamers. By building dynamic product filtering and a custom stock-alert system, we eliminated their daily inventory hurdles.",
    image: "/images/case-studies/mystique-frontend.png",
    alt: "Mystique Tech gaming store homepage",
    accent: "brand",
  },
  {
    slug: "scorlyn",
    title: "Scorlyn",
    tag: "Case Study",
    description:
      "A specialized paddle sports portal offering digital scoreboards and integrated management systems. We integrated hardware and software for points calculation over wifi.",
    image: "/images/case-studies/scorlyn-shop.png",
    alt: "Scorlyn shop display",
    accent: "brand",
  },
];

const MOBILE_PROJECTS: FolderProject[] = [
  {
    slug: "auxleds",
    title: "AUXLEDs",
    tag: "Mobile App & IoT",
    description:
      "A custom mobile application combining full Shopify storefront shopping with Bluetooth vehicle hardware integration, allowing car owners to manage garage profiles and control ambient interior lights and trims in real-time.",
    image: "/images/case-studies/auxleds-card.png",
    alt: "AUXLEDs mobile app and smart automotive ambient lighting controls",
    accent: "brand",
  },
  {
    slug: "estateiq-ai",
    title: "EstateIQ AI",
    tag: "AI & Mobile App",
    description:
      "A modern, AI-powered mobile real estate platform designed to make discovering, evaluating, and scheduling property visits faster and more intelligent.",
    image: "/images/case-studies/main-page.jpeg",
    alt: "EstateIQ AI home screen",
    accent: "yellow",
    fit: "contain",
  },
];

const AI_PROJECTS: FolderProject[] = [MOBILE_PROJECTS[1]];

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

function MarqueeItem({
  item,
}: {
  item: (typeof MARQUEE_ROW_1)[number] | (typeof MARQUEE_ROW_2)[number];
}) {
  if (item.type === "badge") {
    const styles =
      item.badgeType === "frontend"
        ? "bg-card border border-line-strong text-ink"
        : item.badgeType === "backend"
          ? "bg-accent/10 border border-accent/30 text-accent"
          : "bg-ink text-paper border border-ink";
    return (
      <span className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-medium uppercase tracking-wider ${styles}`}>
        {item.val}
      </span>
    );
  }
  return (
    <span className="text-ink/85 font-display font-medium text-lg sm:text-xl tracking-tight">
      {item.val}
    </span>
  );
}

export default function RedSunFeatures() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * 380, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-paper text-ink overflow-x-clip">
      {/* ── The Right Tech For Every Challenge (Warm Editorial Stone Band) ── */}
      <div className="py-20 sm:py-24 border-y border-line relative overflow-hidden bg-paper-alt/70">
        <div className="absolute inset-0 ds-hairline-grid opacity-70 pointer-events-none" aria-hidden="true" />

        <EditorialReveal className="max-w-7xl mx-auto px-[var(--ds-gutter)] mb-12 sm:mb-14 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] ds-display text-ink max-w-2xl text-balance">
            The Right Tech For Every Challenge
          </h2>
          <p className="text-ink-soft text-base md:text-lg max-w-xl leading-relaxed">
            From AI to UX, we cover all your tech needs, ensuring seamless development and efficient delivery.
          </p>
        </EditorialReveal>

        {[
          { items: MARQUEE_ROW_1, cls: "animate-marquee-reverse" },
          { items: MARQUEE_ROW_2, cls: "animate-marquee" },
        ].map((row, rowIdx) => (
          <div
            key={rowIdx}
            className={`relative w-full overflow-hidden whitespace-nowrap z-10 ${rowIdx === 0 ? "mb-6" : ""}`}
            aria-hidden="true"
          >
            <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-paper-alt to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-paper-alt to-transparent z-20 pointer-events-none" />
            <div className={`flex items-center w-max ${row.cls}`}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex gap-10 sm:gap-12 items-center px-6 shrink-0">
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

      {/* ── Core Capabilities (Reference 1: Tactile Dark Leather Contrast Band) ── */}
      <div id="capabilities" className="relative w-full bg-leather text-night-ink py-20 sm:py-28 border-b border-line-dark overflow-hidden">
        <div className="absolute inset-0 ds-hairline-grid-dark opacity-50 pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
          <div className="flex items-end justify-between mb-10 sm:mb-12 gap-4">
            <EditorialReveal>
              <h3 className="text-[clamp(2rem,3.6vw,3rem)] ds-display text-night-ink">
                Core Capabilities
              </h3>
              <p className="text-night-soft mt-2.5 text-base">
                The foundations behind everything we build.
              </p>
            </EditorialReveal>
            <div className="hidden md:flex lg:hidden items-center gap-2.5">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Scroll capabilities left"
                className="w-11 h-11 rounded-full border border-line-dark bg-night-card flex items-center justify-center text-night-ink hover:border-accent ds-press"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Scroll capabilities right"
                className="w-11 h-11 rounded-full border border-line-dark bg-night-card flex items-center justify-center text-night-ink hover:border-accent ds-press"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-5 lg:gap-6 relative z-10 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0 items-stretch"
          >
            {/* Card 1: AI Integrations */}
            <EditorialReveal
              delay={0}
              className="min-w-[84vw] md:min-w-[46vw] lg:min-w-0 snap-center bg-night-card border border-line-dark rounded-[var(--ds-radius-bento)] p-7 sm:p-8 flex flex-col justify-between hover:border-accent/50 transition-colors group"
            >
              <div className="w-full">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-7">
                  <BrainCircuit className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-2xl ds-heading mb-3 text-night-ink group-hover:text-accent transition-colors">
                  Next-Gen AI Integrations
                </h4>
                <p className="text-night-soft text-sm leading-relaxed">
                  Future-proof your business. We embed custom LLM integrations, automated workflows, and smart data modeling directly into your product.
                </p>
              </div>
              <div
                className="w-full h-32 mt-8 rounded-2xl bg-night border border-line-dark flex items-center justify-center relative overflow-hidden"
                aria-hidden="true"
              >
                <div className="flex gap-4 items-center relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-accent" />
                  <div className="w-14 h-[1.5px] bg-white/25" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/80" />
                  <div className="w-14 h-[1.5px] bg-white/25" />
                  <div className="w-3.5 h-3.5 rounded-full bg-accent/70" />
                </div>
              </div>
            </EditorialReveal>

            {/* Card 2: Elite Tech Stack */}
            <EditorialReveal
              delay={0.08}
              className="min-w-[84vw] md:min-w-[46vw] lg:min-w-0 snap-center bg-night-card border border-line-dark rounded-[var(--ds-radius-bento)] p-7 sm:p-8 flex flex-col justify-between hover:border-white/30 transition-colors group"
            >
              <div className="w-full">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-night-ink mb-7">
                  <Rocket className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-2xl ds-heading mb-3 text-night-ink group-hover:text-accent transition-colors">
                  Elite Tech Stack
                </h4>
                <p className="text-night-soft text-sm leading-relaxed">
                  Zero lag, infinite scale. We build with modern engines like Next.js, Go, Rust, and AWS for lightning-fast speeds and high security.
                </p>
              </div>
              <div
                className="w-full h-32 mt-8 grid grid-cols-3 gap-2.5 p-3.5 items-center bg-night border border-line-dark rounded-2xl"
                aria-hidden="true"
              >
                {["Next.js", "React", "Node.js", "Golang", "Rust", "AWS"].map((tech) => (
                  <div
                    key={tech}
                    className="px-2 py-2 rounded-lg bg-night-card border border-line-dark text-center font-mono text-[11px] text-night-ink/85"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </EditorialReveal>

            {/* Card 3: Scalable Cloud */}
            <EditorialReveal
              delay={0.16}
              className="min-w-[84vw] md:min-w-[46vw] lg:min-w-0 snap-center bg-night-card border border-line-dark rounded-[var(--ds-radius-bento)] p-7 sm:p-8 flex flex-col justify-between hover:border-white/30 transition-colors group"
            >
              <div className="w-full">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-night-ink mb-7">
                  <Cloud className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-2xl ds-heading mb-3 text-night-ink group-hover:text-accent transition-colors">
                  Scalable Cloud
                </h4>
                <p className="text-night-soft text-sm leading-relaxed">
                  Deploy to the edge globally with zero-downtime, automated load balancing, and high-performance serverless systems.
                </p>
              </div>
              <div
                className="w-full h-32 mt-8 flex items-end justify-between px-5 py-5 bg-night border border-line-dark rounded-2xl gap-2.5"
                aria-hidden="true"
              >
                {[40, 70, 50, 90, 60, 80, 95].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-night-card rounded-t h-full flex items-end border-x border-t border-line-dark"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-accent/30 to-accent rounded-t transition-transform duration-500 origin-bottom group-hover:scale-y-105"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
            </EditorialReveal>
          </div>
        </div>
      </div>

      {/* ── Successful Projects (Reference 2: Glass Folder Cards — Web, AI, Mobile) ── */}
      <GlassFolderProjects
        webProjects={WEB_PROJECTS}
        aiProjects={AI_PROJECTS}
        mobileProjects={MOBILE_PROJECTS}
      />
    </section>
  );
}
