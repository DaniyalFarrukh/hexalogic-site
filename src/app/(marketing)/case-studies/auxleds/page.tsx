"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  ShoppingBag,
  Car,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  MobileAppReveal,
  TitaniumPhoneFrame,
} from "@/components/case-studies/MobileAppDetailLayout";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Full Shopify Storefront",
    desc: "Synchronized in real-time with auxleds.com via Shopify Storefront APIs, providing smooth catalog browsing, product filters, and secure mobile checkout.",
  },
  {
    icon: Cpu,
    title: "BLE Hardware Integration",
    desc: "Low-latency Bluetooth connection communicating with in-car ambient LED controllers, dashboard strips, and footwell lighting kits without requiring an internet connection.",
  },
  {
    icon: Car,
    title: "Personalized Virtual Garage",
    desc: "Users can add and manage their personal cars in a virtual garage, selecting specific makes, models, and interior configurations.",
  },
  {
    icon: Sliders,
    title: "Trim-by-Trim Lighting Control",
    desc: "Drivers can tap specific interior trims (dashboard, center console, door panels, footwells) to independently adjust colors, brightness, and lighting patterns.",
  },
  {
    icon: Sparkles,
    title: "CarPlay & Dynamic Modes",
    desc: "Optimized for vehicle usability with support for CarPlay setups, custom dynamic lighting scenes, and music-synchronized rhythm modes.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Offline Architecture",
    desc: "Hardware controls operate locally and instantly over Bluetooth, ensuring immediate responsiveness even in underground garages or remote roads.",
  },
];

const CORE_TECH = [
  "React Native",
  "Bluetooth LE (BLE)",
  "Shopify Storefront API",
  "IoT & Embedded Hardware",
  "CarPlay Compatibility",
  "iOS & Android",
];

export default function AuxledsCaseStudy() {
  return (
    <div className="pt-28 sm:pt-32 pb-28 bg-mm-bg min-h-[100dvh] text-mm-ink overflow-x-clip">
      <div className="max-w-[1170px] mx-auto px-[var(--ds-gutter)]">
        {/* Back Button */}
        <div className="mb-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-mm-soft hover:text-white transition-colors ds-meta min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Case Studies
          </Link>
        </div>

        {/* Centered Dark App-Landing Hero (Reference 3) */}
        <MobileAppReveal className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-7">
            <span className="px-3.5 py-1.5 rounded-full bg-mm-card mm-card-border text-mm-accent ds-meta">
              Mobile App &amp; Automotive IoT
            </span>
            <span className="text-mm-muted font-mono text-xs">2024 - 2026</span>
            <a
              href="https://www.auxleds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-mm-card hover:bg-mm-card-2 mm-card-border rounded-full text-xs text-mm-ink hover:text-white transition-colors min-h-[36px]"
            >
              <span>auxleds.com</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] ds-display text-white mb-6 text-balance">
            AUXLEDs: Smart Automotive Ambient Lighting &amp; Storefront
          </h1>
          <p className="text-base sm:text-lg text-mm-soft max-w-2xl mx-auto leading-relaxed">
            A unified mobile application bringing automotive lighting controls and e-commerce together—featuring a full Shopify storefront, low-latency Bluetooth vehicle integration, and a personalized virtual garage.
          </p>
        </MobileAppReveal>

        {/* Hero Device Showcase with subtle iridescent halo */}
        <MobileAppReveal delay={0.1} className="relative mb-20 sm:mb-28">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[540px] h-[240px] sm:h-[320px] rounded-full opacity-20 blur-[90px] pointer-events-none mm-iridescent-ring"
          />
          <div className="relative z-10">
            <TitaniumPhoneFrame
              src="/images/case-studies/auxleds-card.png"
              alt="AUXLEDs Mobile App and Hardware Controls"
              caption="AUXLEDs Mobile App: Integrated Shopify Storefront & Smart Vehicle Lighting Control."
              aspect="landscape"
              priority
            />
          </div>
        </MobileAppReveal>

        {/* Bento Overview: Vision + Key Outcomes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 sm:mb-24">
          <MobileAppReveal className="lg:col-span-7 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10">
            <h2 className="text-2xl sm:text-3xl ds-heading text-white mb-5">The Vision</h2>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base">
              <a
                href="https://www.auxleds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mm-accent underline underline-offset-4 hover:text-white transition-colors"
              >
                AUXLEDs
              </a>{" "}
              is a premier provider of automotive LED and ambient lighting systems for modern vehicles. They needed a dedicated mobile app that serves two essential purposes in one seamless experience:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-mm-ink text-sm sm:text-base my-6">
              <li>
                <strong className="text-white">Shopify Mobile Storefront:</strong> An in-app shopping experience that replicates their full online catalog with real-time product collections, inventory, and instant checkout.
              </li>
              <li>
                <strong className="text-white">Hardware &amp; IoT Car Integration:</strong> Direct wireless control for automotive ambient interior lighting, dashboard trims, underglow, and CarPlay-compatible systems.
              </li>
            </ol>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base">
              HexaLogic built and delivered a cross-platform mobile application that connects seamlessly to the user&apos;s vehicle hardware via Bluetooth Low Energy (BLE) while providing a top-tier retail experience.
            </p>
          </MobileAppReveal>

          <MobileAppReveal
            delay={0.08}
            className="lg:col-span-5 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10 flex flex-col justify-between gap-6"
          >
            <div>
              <h3 className="text-xl ds-heading text-white mb-6 flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-mm-accent" aria-hidden="true" />
                Key Outcomes
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Zap, val: "Real-Time", label: "BLE Hardware Sync" },
                  { icon: ShoppingBag, val: "100% Sync", label: "Shopify Web Storefront" },
                  { icon: Car, val: "Multi-Car", label: "Virtual Garage Profiles" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-4 rounded-2xl bg-mm-card-2 mm-card-border flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 text-mm-accent">
                      <m.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{m.val}</div>
                      <div className="text-xs text-mm-soft">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] mm-card-border">
              <span className="ds-meta text-mm-accent block mb-1">Client Website</span>
              <a
                href="https://www.auxleds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white hover:text-mm-accent font-semibold text-base transition-colors min-h-[44px]"
              >
                <span>auxleds.com</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="text-xs text-mm-soft mt-1">
                Leading provider of automotive ambient lighting and vehicle LED kits.
              </p>
            </div>
          </MobileAppReveal>
        </div>

        {/* Feature Blocks (Reference 3 Dark Bento Grid) */}
        <div className="mb-20 sm:mb-24">
          <MobileAppReveal className="mb-10">
            <h2 className="text-3xl sm:text-4xl ds-display text-white">What We Built</h2>
          </MobileAppReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <MobileAppReveal
                key={feature.title}
                delay={i * 0.05}
                className="bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 flex flex-col justify-between hover:bg-mm-card-2 transition-colors group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] mm-card-border flex items-center justify-center text-mm-accent mb-6">
                    <feature.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl ds-heading text-white mb-2.5">{feature.title}</h3>
                  <p className="text-mm-soft text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </MobileAppReveal>
            ))}
          </div>
        </div>

        {/* Spotlight + Core Technologies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 sm:mb-24">
          <MobileAppReveal className="lg:col-span-7 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-mm-accent">
                <Car className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl ds-heading text-white">The Interactive Garage Experience</h3>
            </div>
            <p className="text-mm-ink leading-relaxed text-sm sm:text-base mb-4">
              One of the standout features developed for AUXLEDs is the{" "}
              <strong className="text-white">Virtual Garage</strong>. Rather than using generic sliders, users configure their exact vehicle in their digital garage.
            </p>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base">
              The app presents an intuitive interior schematic where tapping an area—such as the passenger door trim, central dashboard contour, or footwells—instantly isolates that zone. Drivers can apply cohesive lighting themes across all zones or mix accents to match their car&apos;s custom interior aesthetic.
            </p>
          </MobileAppReveal>

          <MobileAppReveal
            delay={0.08}
            className="lg:col-span-5 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <h4 className="ds-meta text-mm-muted mb-5">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {CORE_TECH.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 bg-mm-card-2 mm-card-border rounded-full font-mono text-xs text-mm-ink"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Final Pill CTA (Reference 3 style) */}
            <div className="pt-8 mt-8 border-t border-mm-divider">
              <Link
                href="/contact"
                className="ds-pill w-full py-3.5 px-6 bg-white text-mm-bg hover:bg-mm-accent hover:text-mm-bg text-sm font-semibold"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </MobileAppReveal>
        </div>
      </div>
    </div>
  );
}
