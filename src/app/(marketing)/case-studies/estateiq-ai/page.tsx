"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  Map,
  Calculator,
  Calendar,
  Heart,
  Shield,
  Search,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import {
  MobileAppReveal,
  TitaniumPhoneFrame,
} from "@/components/case-studies/MobileAppDetailLayout";

const CORE_FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Recommendations",
    desc: "Analyzes user preferences, budget, and behavior to provide personalized recommendations and match scores (e.g., 98% Match).",
  },
  {
    icon: Map,
    title: "Interactive Map Search",
    desc: "Discover properties directly on an interactive map. Search by location, view price markers, and apply smart filters.",
  },
  {
    icon: Calculator,
    title: "Mortgage Calculator",
    desc: "Calculate estimated monthly payments, total interest, and amortization schedules instantly.",
  },
  {
    icon: Calendar,
    title: "Schedule Visits",
    desc: "Select a property, date, and time to schedule physical or virtual visits without conflicting bookings.",
  },
  {
    icon: Heart,
    title: "Saved Searches",
    desc: "Save properties into collections and receive smart notifications when prices change.",
  },
  {
    icon: Search,
    title: "Virtual Tours",
    desc: "Explore 360° tours, high-quality videos, and floor plans to tour properties remotely.",
  },
];

const CORE_TECH = [
  "React Native",
  "Expo",
  "TypeScript",
  "Supabase",
  "PostgreSQL + PostGIS",
  "OpenAI API",
  "Google Maps",
];

const ROLES = [
  "Buyers & Renters",
  "Property Owners",
  "Real Estate Agents",
  "Administrators",
];

export default function EstateIqCaseStudy() {
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
          <div className="flex items-center justify-center gap-3 mb-7">
            <span className="px-3.5 py-1.5 rounded-full bg-mm-card mm-card-border text-mm-accent ds-meta">
              Mobile App / AI
            </span>
            <span className="text-mm-muted font-mono text-xs">2026</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] ds-display text-white mb-6 text-balance">
            EstateIQ AI: The Future of Luxury Real Estate
          </h1>
          <p className="text-base sm:text-lg text-mm-soft max-w-2xl mx-auto leading-relaxed">
            A modern, AI-powered mobile real estate platform designed to make discovering, evaluating, and scheduling property visits faster and more intelligent.
          </p>
        </MobileAppReveal>

        {/* Hero Titanium Phone Mockup */}
        <MobileAppReveal delay={0.1} className="relative mb-20 sm:mb-28">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] h-[360px] rounded-full opacity-20 blur-[90px] pointer-events-none mm-iridescent-ring"
          />
          <div className="relative z-10">
            <TitaniumPhoneFrame
              src="/images/case-studies/main-page.jpeg"
              alt="EstateIQ AI Home Screen"
              caption='Home Screen: "Defining the future of luxury living" with AI Concierge.'
              aspect="portrait"
              priority
            />
          </div>
        </MobileAppReveal>

        {/* Bento Vision + User Experience / Tech Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 sm:mb-24">
          <MobileAppReveal className="lg:col-span-7 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10">
            <h2 className="text-2xl sm:text-3xl ds-heading text-white mb-5">The Vision</h2>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base">
              EstateIQ AI aims to transform real estate discovery from a traditional listing-and-search experience into an intelligent, personalized, and immersive mobile platform where users can discover properties, understand their financial options, explore properties virtually, communicate with professionals, and arrange visits—all from one application.
            </p>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base mt-4">
              Designed primarily for <strong className="text-white">Android mobile devices</strong>, the platform uses a smooth, gesture-driven interface focused on speed, simplicity, and an engaging property-discovery experience with a premium black-and-gold aesthetic.
            </p>
          </MobileAppReveal>

          <MobileAppReveal
            delay={0.08}
            className="lg:col-span-5 bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-7 sm:p-10 flex flex-col justify-between gap-6"
          >
            <div>
              <h3 className="text-xl ds-heading text-white mb-4 flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-mm-accent" aria-hidden="true" />
                User Experience
              </h3>
              <p className="text-sm text-mm-soft leading-relaxed mb-6">
                Built with a mobile-first design philosophy. We used interactive cards, animated bottom sheets, swipeable galleries, and gesture-driven navigation powered by React Native Reanimated.
              </p>

              <h4 className="ds-meta text-mm-muted mb-3">Core Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {CORE_TECH.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-mm-card-2 mm-card-border rounded-full font-mono text-xs text-mm-ink"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </MobileAppReveal>
        </div>

        {/* Sticky Feature Blocks + Phone Showcase (Reference 3 .mm-feat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20 sm:mb-24">
          <div className="lg:col-span-7">
            <MobileAppReveal className="mb-8">
              <h2 className="text-3xl sm:text-4xl ds-display text-white">Core Features</h2>
            </MobileAppReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CORE_FEATURES.map((feature, idx) => (
                <MobileAppReveal
                  key={feature.title}
                  delay={idx * 0.05}
                  className="bg-mm-card mm-card-border rounded-[var(--ds-radius-bento)] p-6 sm:p-7 hover:bg-mm-card-2 transition-colors flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] mm-card-border flex items-center justify-center mb-5 text-mm-accent">
                    <feature.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg ds-heading text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-mm-soft leading-relaxed">{feature.desc}</p>
                </MobileAppReveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <MobileAppReveal>
              <TitaniumPhoneFrame
                src="/images/case-studies/estateiq-2.jpeg"
                alt="EstateIQ AI Property Listings"
                caption="Property Listings: Browsing through curated luxury architectural masterpieces."
                aspect="portrait"
              />
            </MobileAppReveal>
          </div>
        </div>

        {/* AI Concierge + Multi-Role Support + Final CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-mm-card mm-card-border rounded-[28px] p-7 sm:p-10 lg:p-12">
          <MobileAppReveal className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl ds-display text-white">
              The AI Chatbot Concierge
            </h2>
            <p className="text-mm-soft leading-relaxed text-sm sm:text-base">
              The EstateIQ AI Assistant serves as a personal real estate concierge. Users can simply ask for recommendations—such as &quot;Give me the cheapest property in Allama Iqbal Town&quot;—and the conversational AI will instantly filter and respond with highly personalized, accurate property suggestions.
            </p>

            <div className="pt-4 border-t border-mm-divider">
              <h4 className="ds-meta text-mm-muted mb-4">Multi-Role Support</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-mm-ink">
                {ROLES.map((role) => (
                  <li key={role} className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-mm-accent shrink-0" aria-hidden="true" />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className="ds-pill px-7 py-3.5 bg-white text-mm-bg hover:bg-mm-accent hover:text-mm-bg text-sm font-semibold"
              >
                Start Your Mobile App
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </MobileAppReveal>

          <MobileAppReveal delay={0.1} className="lg:col-span-5">
            <TitaniumPhoneFrame
              src="/images/case-studies/estateiq-3.jpeg"
              alt="EstateIQ AI Chatbot"
              caption="AI Concierge: Natural language search and personalized responses."
              aspect="portrait"
            />
          </MobileAppReveal>
        </div>
      </div>
    </div>
  );
}
