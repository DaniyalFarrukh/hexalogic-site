"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  LayoutGrid,
  Cpu,
  Wifi,
  Smartphone,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { EditorialReveal } from "@/components/motion/EditorialReveal";

const DELIVERABLES = [
  {
    icon: Cpu,
    title: "Hardware Integration",
    desc: "Custom physical scoreboards designed for durability and visibility on paddle and tennis courts.",
  },
  {
    icon: Wifi,
    title: "WiFi & Networking",
    desc: "Robust local networking ensuring real-time synchronization between scoreboards and controllers without delay.",
  },
  {
    icon: Smartphone,
    title: "Mobile Controller App",
    desc: "A sleek software application running on phones, giving users full control to manage points and game states.",
  },
  {
    icon: LayoutGrid,
    title: "Points Calculation System",
    desc: "Intelligent logic tailored for paddle and tennis rules to automatically handle scoring progression.",
  },
];

export default function ScorlynCaseStudy() {
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
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3.5 py-1 bg-card border border-line-strong text-accent ds-meta rounded-full">
              Sports Tech &amp; IoT
            </span>
            <span className="font-mono text-xs text-ink-soft">2024</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] ds-display text-ink mb-6 text-balance">
            Scorlyn: Brought his idea to life
          </h1>
          <p className="text-base sm:text-lg text-ink-soft max-w-3xl leading-relaxed">
            Our client wanted hardware as well as software for making a scoreboard for paddle and tennis fields for points calculation. We delivered a complete solution so that he can sell his idea and items.
          </p>
        </EditorialReveal>

        {/* Feature Grid & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-14 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-14">
            <EditorialReveal>
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-5">The Goal</h2>
              <p className="text-ink-soft leading-relaxed text-base sm:text-lg">
                The objective was to create an integrated ecosystem of hardware and software capable of tracking and calculating points for paddle and tennis matches. The client needed custom scoreboards paired with reliable networking and an intuitive mobile app to bring his innovative vision to the market.
              </p>
            </EditorialReveal>

            <EditorialReveal className="rounded-[var(--ds-radius-bento)] overflow-hidden border border-line-strong bg-card p-3 shadow-[var(--ds-shadow-card)]">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-paper-alt">
                <Image
                  src="/images/case-studies/scorlyn-shop.png"
                  alt="Scorlyn Shop Display"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-ink-soft mt-4 mb-2">
                Scorlyn Shop Display: Bringing the integrated scoreboard hardware to the field.
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
                  src="/images/case-studies/scorlyn-frontend.png"
                  alt="Scorlyn Mobile App"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-ink-soft mt-4 mb-2">
                The Phone Application: Controlling the scoreboard hardware wirelessly via WiFi.
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
                  { icon: Zap, val: "Seamless", label: "Hardware Sync" },
                  { icon: Wifi, val: "Wireless", label: "Local Networking" },
                  { icon: CheckCircle2, val: "100%", label: "Market Ready" },
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
                  &quot;They brought my idea to life by perfectly blending the hardware and software components. The mobile app connects instantly to the scoreboards, making it incredibly easy to sell this product.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold text-sm">
                    S
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">Scorlyn</div>
                    <div className="text-xs text-ink-soft">Founder</div>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="ds-meta text-ink-muted mb-3">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {["React Native", "IoT", "Networking", "Hardware Integration"].map((tech) => (
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
