"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Smartphone,
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
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AuxledsCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-24 pb-32 bg-surface-darkest min-h-screen text-[#f4f4f5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest rounded-full">
              Mobile App &amp; Automotive IoT
            </span>
            <span className="text-gray-500 text-sm font-medium">2024 - 2026</span>
            <a
              href="https://www.auxleds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-300 hover:text-white transition-colors"
            >
              <span>auxleds.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            AUXLEDs: Smart Automotive Ambient Lighting &amp; Storefront
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl leading-relaxed">
            A unified mobile application bringing automotive lighting controls and e-commerce together—featuring a full Shopify storefront, low-latency Bluetooth vehicle integration, and a personalized virtual garage.
          </p>
        </motion.div>

        {/* Feature Grid & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* The Vision & Challenge */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-white mb-6">The Vision</h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                <a
                  href="https://www.auxleds.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary underline underline-offset-4 hover:text-[#ff8947]"
                >
                  AUXLEDs
                </a>{" "}
                is a premier provider of automotive LED and ambient lighting systems for modern vehicles. They needed a dedicated mobile app that serves two essential purposes in one seamless experience:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-gray-300 font-medium my-6">
                <li>
                  <strong className="text-white">Shopify Mobile Storefront:</strong> An in-app shopping experience that replicates their full online catalog with real-time product collections, inventory, and instant checkout.
                </li>
                <li>
                  <strong className="text-white">Hardware &amp; IoT Car Integration:</strong> Direct wireless control for automotive ambient interior lighting, dashboard trims, underglow, and CarPlay-compatible systems.
                </li>
              </ol>
              <p className="text-gray-400 leading-relaxed font-medium">
                HexaLogic built and delivered a cross-platform mobile application that connects seamlessly to the user&apos;s vehicle hardware via Bluetooth Low Energy (BLE) while providing a top-tier retail experience.
              </p>
            </motion.section>

            {/* Custom UI Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 sm:p-4 shadow-2xl"
            >
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#07080a] flex items-center justify-center">
                <Image
                  src="/images/case-studies/auxleds-card.png"
                  alt="AUXLEDs Mobile App and Hardware Controls"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
              <p className="text-center text-sm text-gray-400 mt-4 mb-2 font-medium">
                AUXLEDs Mobile App: Integrated Shopify Storefront &amp; Smart Vehicle Lighting Control.
              </p>
            </motion.div>

            {/* Key Deliverables - Core Features */}
            <div className="feature-grid pt-4">
              <h2 className="text-3xl font-bold text-white mb-8">What We Built</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
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
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="feature-card p-6 rounded-2xl bg-[#121214] border border-white/5 hover:border-brand-primary/30 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Depth Feature Spotlight: Virtual Garage */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#121214] border border-white/5 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Interactive Garage Experience</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-medium mb-4">
                One of the standout features developed for AUXLEDs is the <strong className="text-white">Virtual Garage</strong>. Rather than using generic sliders, users configure their exact vehicle in their digital garage.
              </p>
              <p className="text-gray-400 leading-relaxed font-medium">
                The app presents an intuitive interior schematic where tapping an area—such as the passenger door trim, central dashboard contour, or footwells—instantly isolates that zone. Drivers can apply cohesive lighting themes across all zones or mix accents to match their car&apos;s custom interior aesthetic.
              </p>
            </motion.section>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 space-y-8">
              <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none" />

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  Key Outcomes
                </h3>

                <div className="space-y-4 mb-8">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">Real-Time</div>
                      <div className="text-sm text-gray-400 font-medium">BLE Hardware Sync</div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">100% Sync</div>
                      <div className="text-sm text-gray-400 font-medium">Shopify Web Storefront</div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">Multi-Car</div>
                      <div className="text-sm text-gray-400 font-medium">Virtual Garage Profiles</div>
                    </div>
                  </div>
                </div>

                {/* Client Link */}
                <div className="mb-8 p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                  <span className="text-xs uppercase font-bold text-brand-primary tracking-wider block mb-1">
                    Client Website
                  </span>
                  <a
                    href="https://www.auxleds.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-brand-primary font-bold text-base transition-colors"
                  >
                    <span>auxleds.com</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Leading provider of automotive ambient lighting and vehicle LED kits.
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Core Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React Native",
                      "Bluetooth LE (BLE)",
                      "Shopify Storefront API",
                      "IoT & Embedded Hardware",
                      "CarPlay Compatibility",
                      "iOS & Android",
                    ].map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.05] rounded-full text-xs font-medium text-gray-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-white/[0.08]">
                  <Link
                    href="/contact"
                    className="group flex items-center justify-center gap-2 w-full py-4 bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,115,36,0.25)]"
                  >
                    Start Your Project
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
