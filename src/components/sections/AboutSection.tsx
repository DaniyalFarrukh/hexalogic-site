"use client";

import {
  CheckCircle2,
  Code2,
  Lightbulb,
  Users,
  Rocket,
  Trophy,
  Smile,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { EditorialReveal } from "@/components/motion/EditorialReveal";

const stats = [
  { icon: <Code2 className="w-5 h-5 text-accent" aria-hidden="true" />, label: "Projects Completed", value: "200+" },
  { icon: <Smile className="w-5 h-5 text-ink" aria-hidden="true" />, label: "Client Satisfaction", value: "98%" },
  { icon: <Users className="w-5 h-5 text-ink" aria-hidden="true" />, label: "Team Members", value: "50+" },
  { icon: <Trophy className="w-5 h-5 text-accent" aria-hidden="true" />, label: "Awards Won", value: "15" },
  { icon: <Globe className="w-5 h-5 text-ink" aria-hidden="true" />, label: "Global Clients", value: "100+" },
];

const values = [
  {
    icon: <Code2 className="w-5 h-5 text-accent" aria-hidden="true" />,
    title: "Technical Excellence",
    desc: "We pride ourselves on writing clean, efficient, and maintainable code that scales.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-ink" aria-hidden="true" />,
    title: "Innovation",
    desc: "We constantly explore new technologies and approaches to solve complex problems.",
  },
  {
    icon: <Users className="w-5 h-5 text-ink" aria-hidden="true" />,
    title: "Collaboration",
    desc: "We believe in the power of teamwork, transparency, and open communication.",
  },
  {
    icon: <Rocket className="w-5 h-5 text-accent" aria-hidden="true" />,
    title: "Delivery",
    desc: "We are committed to delivering high-quality solutions on time and within budget.",
  },
];

const reasons = [
  "Cutting-edge technology expertise",
  "Dedicated project management",
  "Transparent communication through your own client portal",
  "Scalable and future-proof solutions",
  "Post-launch support and maintenance",
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full bg-paper text-ink py-16 sm:py-24 overflow-x-clip"
    >
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Sticky Left Rail: Our Impact (Reference 4: Kestrine 4fr/8fr split) */}
          <EditorialReveal className="w-full lg:w-[36%] order-2 lg:order-1 lg:sticky lg:top-28">
            <div className="bg-card border border-line-strong rounded-[var(--ds-radius-bento)] p-6 sm:p-8 shadow-[var(--ds-shadow-card)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-8">Our Impact</h2>

              <dl className="divide-y divide-line">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <dt className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-medium text-ink-soft">{stat.label}</span>
                    </dt>
                    <dd className="text-2xl sm:text-3xl ds-heading text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </EditorialReveal>

          {/* Editorial Right Column */}
          <EditorialReveal
            delay={0.08}
            className="w-full lg:w-[64%] flex flex-col gap-12 sm:gap-16 order-1 lg:order-2"
          >
            <div>
              <h1 className="text-[clamp(2.75rem,6vw,4.75rem)] ds-display text-ink mb-7 text-balance">
                We Are <br className="hidden lg:block" />
                <span className="text-accent">HexaLogic</span>
              </h1>
              <div className="space-y-5 text-ink-soft leading-relaxed text-base sm:text-lg max-w-3xl">
                <p>
                  Founded with a vision for excellence, HexaLogic has grown from a small team of passionate developers into a full-service software house with a global client base. Our mission is to transform businesses through innovative, tailored technology solutions.
                </p>
                <p>
                  We specialize in web and mobile application development, cloud infrastructure, AI integration, and digital transformation. Our team of experts is dedicated to delivering exceptional results that consistently exceed client expectations.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-7">Our Core Values</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {values.map((val) => (
                  <div
                    key={val.title}
                    className="flex flex-col gap-3.5 bg-card border border-line hover:border-line-strong rounded-[var(--ds-radius-card)] p-6 shadow-[var(--ds-shadow-card)] transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-paper border border-line group-hover:border-accent/40 transition-colors">
                        {val.icon}
                      </div>
                      <h3 className="text-lg ds-heading text-ink group-hover:text-accent transition-colors">
                        {val.title}
                      </h3>
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-7">Why Choose Us?</h2>
              <ul className="grid sm:grid-cols-2 gap-3.5">
                {reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-center gap-3.5 bg-card p-4 rounded-xl border border-line hover:border-line-strong transition-colors"
                  >
                    <div className="bg-accent/10 p-1.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-ink">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="ds-pill px-8 min-h-[48px] bg-ink hover:bg-accent text-paper hover:text-white text-sm"
              >
                Start a Project
              </Link>
              <Link
                href="/case-studies"
                className="ds-pill px-8 min-h-[48px] border border-line-strong hover:border-ink text-ink text-sm bg-card"
              >
                See Our Work
              </Link>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
