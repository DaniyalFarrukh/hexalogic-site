"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Settings,
  Mail,
  Tag,
  Package,
  Server,
  PenTool,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { EditorialReveal } from "@/components/motion/EditorialReveal";

const DELIVERABLES = [
  {
    icon: Settings,
    title: "Custom Admin Dashboard",
    desc: "A fully tailored management suite making daily sales monitoring and product updates completely frictionless.",
  },
  {
    icon: Mail,
    title: "Email Automation",
    desc: "Integrated smart email triggers for instant order confirmations, shipping updates, and abandoned cart recovery.",
  },
  {
    icon: Tag,
    title: "Dynamic Coupon System",
    desc: "Built a robust discount engine allowing Decornish to run complex seasonal sales and targeted promotions seamlessly.",
  },
  {
    icon: Package,
    title: "Inventory Management",
    desc: "Real-time stock tracking with automated low-stock alerts and multi-variant product handling.",
  },
  {
    icon: Server,
    title: "Secure Backend Pipelines",
    desc: "Engineered scalable, proper backend handling with automated deployment pipelines ensuring zero downtime.",
  },
  {
    icon: PenTool,
    title: "Bespoke Design",
    desc: "Every single UI component was meticulously crafted according to the client's specific aesthetic demands.",
  },
];

export default function DecornishCaseStudy() {
  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-paper min-h-[100dvh] text-ink relative overflow-x-clip">
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        {/* Back Button */}
        <div className="mb-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors ds-meta min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Case Studies
          </Link>
        </div>

        {/* Hero Section */}
        <EditorialReveal className="mb-16 sm:mb-20">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1 bg-card border border-line-strong text-accent ds-meta rounded-full">
              E-Commerce / Retail
            </span>
            <span className="font-mono text-xs text-ink-soft">2024</span>
            <a
              href="https://www.decornish.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-card hover:bg-paper-alt border border-line-strong rounded-full font-mono text-xs text-ink hover:text-accent transition-colors min-h-[36px]"
            >
              <span>decornish.com</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
          <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] ds-display text-ink mb-6 text-balance">
            Decornish: Elevating Home Decor E-Commerce
          </h1>
          <p className="text-base sm:text-lg text-ink-soft max-w-3xl leading-relaxed">
            A comprehensive, bespoke e-commerce platform designed exclusively for premium home decor. We transformed Decornish&apos;s digital presence and backend operations to handle rapid scale effortlessly.
          </p>
        </EditorialReveal>

        {/* Feature Grid & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-14 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-14">
            <EditorialReveal>
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-5">The Goal</h2>
              <p className="text-ink-soft leading-relaxed text-base sm:text-lg">
                <a
                  href="https://www.decornish.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold underline underline-offset-4 hover:text-ink"
                >
                  Decornish (decornish.com)
                </a>{" "}
                required a high-performance, visually stunning platform that reflected the elegance of their home decor products. Off-the-shelf solutions were too restrictive, and manual order processing was causing severe bottlenecks. They needed a fully custom-built ecosystem that automated their daily hurdles while providing a luxurious shopping experience for their customers.
              </p>
              <div className="mt-5">
                <a
                  href="https://www.decornish.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-pill px-5 py-2.5 min-h-[44px] bg-card border border-line-strong hover:border-accent text-ink hover:text-accent text-sm"
                >
                  <span>Visit Live Store at decornish.com</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </EditorialReveal>

            <EditorialReveal className="rounded-[var(--ds-radius-bento)] overflow-hidden border border-line-strong bg-card p-3 shadow-[var(--ds-shadow-card)]">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-paper-alt">
                <Image
                  src="/images/case-studies/decornish-admin.png"
                  alt="Decornish Admin Dashboard"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-ink-soft mt-4 mb-2">
                Custom Admin Dashboard: Making daily sales and inventory management incredibly easy.
              </p>
            </EditorialReveal>

            <div>
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-7">What We Built</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {DELIVERABLES.map((feature, idx) => (
                  <EditorialReveal
                    key={feature.title}
                    delay={idx * 0.05}
                    className="bg-card border border-line hover:border-line-strong p-6 sm:p-7 rounded-[var(--ds-radius-card)] shadow-[var(--ds-shadow-card)] transition-colors flex flex-col items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-paper border border-line flex items-center justify-center mb-5 text-accent">
                      <feature.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg ds-heading text-ink mb-2">{feature.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{feature.desc}</p>
                  </EditorialReveal>
                ))}
              </div>
            </div>

            <EditorialReveal className="rounded-[var(--ds-radius-bento)] overflow-hidden border border-line-strong bg-card p-3 shadow-[var(--ds-shadow-card)]">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-paper-alt">
                <Image
                  src="/images/case-studies/decornish-frontend.png"
                  alt="Decornish Website Storefront"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-ink-soft mt-4 mb-2">
                Bespoke Storefront: Designed entirely around the client&apos;s aesthetic demands.
              </p>
            </EditorialReveal>
          </div>

          {/* Sticky Sidebar */}
          <EditorialReveal delay={0.1} className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-card border border-line-strong rounded-[var(--ds-radius-bento)] p-6 sm:p-7 shadow-[var(--ds-shadow-card)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" aria-hidden="true" />

              <h3 className="text-xl ds-heading text-ink mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" aria-hidden="true" />
                Key Outcomes
              </h3>

              <div className="space-y-3 mb-5">
                {[
                  { icon: TrendingUp, val: "+60%", label: "Online Sales" },
                  { icon: Zap, val: "100%", label: "Order Routing" },
                  { icon: CheckCircle2, val: "Zero", label: "Inventory Errors" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-3.5 rounded-2xl bg-paper border border-line flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center shrink-0 text-accent">
                      <m.icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-lg ds-heading text-ink">{m.val}</div>
                      <div className="text-xs text-ink-soft">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Quote */}
              <div className="mb-5 p-5 rounded-2xl bg-paper border border-line relative">
                <p className="text-xs sm:text-sm text-ink italic mb-3 leading-relaxed">
                  &ldquo;Hexalogic completely transformed our operations. The custom dashboard feels incredibly intuitive and tailored exactly to our needs.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-sm">
                    D
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">Decornish Team</div>
                    <div className="text-xs text-ink-soft">Founders</div>
                  </div>
                </div>
              </div>

              {/* Client Website */}
              <div className="mb-5 p-4 rounded-2xl bg-paper border border-line">
                <span className="ds-meta text-accent block mb-1">Client Website</span>
                <a
                  href="https://www.decornish.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink hover:text-accent font-semibold text-base transition-colors min-h-[44px]"
                >
                  <span>decornish.com</span>
                  <ExternalLink className="w-4 h-4 text-accent" aria-hidden="true" />
                </a>
                <p className="text-xs text-ink-soft mt-1">
                  Explore Decornish&apos;s live online home decor store.
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="ds-meta text-ink-muted mb-3">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "React", "Node.js", "TailwindCSS", "AWS", "PostgreSQL"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-paper border border-line rounded-full font-mono text-xs text-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-line">
                <Link
                  href="/contact"
                  className="ds-pill w-full py-3.5 bg-ink hover:bg-accent text-paper hover:text-white text-sm"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </div>
  );
}
