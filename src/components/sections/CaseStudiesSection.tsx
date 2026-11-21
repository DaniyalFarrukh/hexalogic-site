"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EditorialReveal } from "@/components/motion/EditorialReveal";

const caseStudies = [
  {
    id: "auxleds",
    title: "AUXLEDs",
    category: "Mobile App & IoT",
    externalUrl: "https://www.auxleds.com",
    description:
      "A dual-purpose mobile app featuring full Shopify e-commerce synchronization alongside BLE hardware controls for automotive interior lighting, CarPlay integration, and interactive garage vehicle profiles.",
    metric: "Shopify & Hardware Sync",
    image: "/images/case-studies/auxleds-card.png",
    tags: ["Mobile App", "IoT Hardware", "Shopify"],
    link: "/case-studies/auxleds",
  },
  {
    id: "decornish",
    title: "Decornish",
    category: "Retail & E-Commerce",
    externalUrl: "https://www.decornish.com",
    description:
      "A modern, elegant e-commerce platform designed for premium home decor. We integrated automated inventory management and an intuitive visual product catalog to replace their manual spreadsheets.",
    metric: "+60% Online Sales",
    image: "/images/case-studies/decornish-frontend.png",
    tags: ["Next.js", "TailwindCSS", "Automation"],
    link: "/case-studies/decornish",
  },
  {
    id: "mystique-tech",
    title: "Mystique Tech",
    category: "Gaming E-Commerce",
    description:
      "A high-performance digital storefront tailored for gamers. By building dynamic product filtering and a custom stock-alert system, we eliminated their daily inventory hurdles.",
    metric: "+45% Conversion Rate",
    image: "/images/case-studies/mystique-frontend.png",
    tags: ["React", "Node.js", "MongoDB"],
    link: "/case-studies/mystique-tech",
  },
  {
    id: "scorlyn",
    title: "Scorlyn",
    category: "Sports Tech",
    description:
      "A specialized paddle sports portal offering digital scoreboards and integrated management systems. We automated their client provisioning, removing manual data entry entirely.",
    metric: "3x Client Subscriptions",
    image: "/images/case-studies/scorlyn-shop.png",
    tags: ["React Native", "Hardware", "IoT"],
    link: "/case-studies/scorlyn",
  },
  {
    id: "estateiq-ai",
    title: "EstateIQ AI",
    category: "AI & Mobile App",
    description:
      "An AI-powered mobile real estate platform that makes discovering, evaluating and scheduling property visits faster and smarter, with a conversational assistant built in.",
    metric: "AI-Assisted Search",
    image: "/images/case-studies/main-page.jpeg",
    tags: ["Mobile", "AI", "Real Estate"],
    fit: "contain" as const,
    link: "/case-studies/estateiq-ai",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-16 sm:py-24 bg-paper text-ink relative overflow-x-clip">
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        <EditorialReveal className="max-w-3xl mb-14 sm:mb-18">
          <p className="ds-meta text-accent mb-4">Client Stories</p>
          <h1 className="text-[clamp(2.5rem,5.5vw,4.25rem)] ds-display text-ink mb-5 text-balance">
            Our <span className="text-accent">Case Studies</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
            Discover how we have transformed businesses with innovative technology, scalable architectures, and beautiful digital experiences.
          </p>
        </EditorialReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8">
          {caseStudies.map((study, index) => (
            <EditorialReveal
              key={study.id}
              delay={Math.min(index, 2) * 0.08}
              className="bg-card border border-line hover:border-line-strong rounded-[var(--ds-radius-bento)] overflow-hidden shadow-[var(--ds-shadow-card)] hover:shadow-[var(--ds-shadow-elevated)] transition-shadow duration-300 group flex flex-col"
            >
              <Link
                href={study.link}
                className="relative w-full aspect-[16/10] bg-paper-alt overflow-hidden block"
                aria-label={`Read the ${study.title} case study`}
              >
                <Image
                  src={study.image}
                  alt={`${study.title} project screenshot`}
                  fill
                  className={`${
                    "fit" in study && study.fit === "contain"
                      ? "object-contain p-4 bg-night"
                      : "object-cover object-top"
                  } group-hover:scale-[1.04] transition-transform duration-500 ease-out`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm border border-line font-mono text-[10px] font-medium uppercase tracking-wider text-ink">
                  {study.category}
                </span>
              </Link>

              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-paper text-ink-soft font-mono text-[10px] uppercase tracking-wider rounded-full border border-line"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-2 group-hover:text-accent transition-colors">
                  {study.title}
                </h2>
                <p className="font-mono text-xs font-medium text-accent mb-4">{study.metric}</p>

                <p className="text-ink-soft text-sm sm:text-base leading-relaxed mb-7 flex-1">
                  {study.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-line">
                  {"externalUrl" in study && study.externalUrl ? (
                    <a
                      href={study.externalUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:text-ink transition-colors text-sm font-semibold min-h-[44px]"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={study.link}
                    className="inline-flex items-center gap-2 text-ink hover:text-accent transition-colors text-sm font-semibold group/link min-h-[44px]"
                  >
                    Read Story
                    <ArrowRight
                      className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </EditorialReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
