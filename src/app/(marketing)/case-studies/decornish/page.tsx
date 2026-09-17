"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Mail, Tag, Package, Server, PenTool, TrendingUp, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DecornishCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Staggered GSAP reveal for the feature cards
      gsap.fromTo('.feature-card', 
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.feature-grid',
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
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
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full">
              E-Commerce / Retail
            </span>
            <span className="text-gray-500 text-sm font-medium">2024</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Decornish: Elevating Home Decor E-Commerce
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl leading-relaxed">
            A comprehensive, bespoke e-commerce platform designed exclusively for premium home decor. We transformed Decornish&apos;s digital presence and backend operations to handle rapid scale effortlessly.
          </p>
        </motion.div>

        {/* Feature Grid & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* The Challenge & Solution */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h2 className="text-3xl font-bold text-white mb-6">The Goal</h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                Decornish required a high-performance, visually stunning platform that reflected the elegance of their home decor products. Off-the-shelf solutions were too restrictive, and manual order processing was causing severe bottlenecks. They needed a fully custom-built ecosystem that automated their daily hurdles while providing a luxurious shopping experience for their customers.
              </p>
            </motion.section>

            {/* Custom Admin Dashboard Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 shadow-2xl"
            >
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                 <Image src="/images/case-studies/decornish-admin.png" alt="Decornish Admin Dashboard" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-5 mb-3 font-medium">Custom Admin Dashboard: Making daily sales and inventory management incredibly easy.</p>
            </motion.div>

            {/* Key Deliverables - Refined & Human-designed */}
            <div className="feature-grid pt-8">
              <h2 className="text-3xl font-bold text-white mb-8">What We Built</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Settings,
                    title: "Custom Admin Dashboard",
                    desc: "A fully tailored management suite making daily sales monitoring and product updates completely frictionless."
                  },
                  {
                    icon: Mail,
                    title: "Email Automation",
                    desc: "Integrated smart email triggers for instant order confirmations, shipping updates, and abandoned cart recovery."
                  },
                  {
                    icon: Tag,
                    title: "Dynamic Coupon System",
                    desc: "Built a robust discount engine allowing Decornish to run complex seasonal sales and targeted promotions seamlessly."
                  },
                  {
                    icon: Package,
                    title: "Inventory Management",
                    desc: "Real-time stock tracking with automated low-stock alerts and multi-variant product handling."
                  },
                  {
                    icon: Server,
                    title: "Secure Backend Pipelines",
                    desc: "Engineered scalable, proper backend handling with automated deployment pipelines ensuring zero downtime."
                  },
                  {
                    icon: PenTool,
                    title: "Bespoke Design",
                    desc: "Every single UI component was meticulously crafted according to the client&apos;s specific aesthetic demands."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="feature-card bg-[#0f0f12] border border-white/[0.06] p-8 rounded-[2rem] hover:border-amber-500/40 hover:bg-[#131316] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 group flex flex-col items-start">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Front-end Website Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 shadow-2xl mt-16"
            >
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                 <Image src="/images/case-studies/decornish-frontend.png" alt="Decornish Website Storefront" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-5 mb-3 font-medium">Bespoke Storefront: Designed entirely around the client&apos;s aesthetic demands.</p>
            </motion.div>

          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[2rem]">
              {/* Premium Card Container */}
              <div className="bg-[#0f0f12] border border-white/[0.08] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                {/* Subtle top gradient glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Key Outcomes
                </h3>
                
                <div className="space-y-4 mb-8">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">+60%</div>
                      <div className="text-sm text-gray-400 font-medium">Online Sales</div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-sm text-gray-400 font-medium">Order Routing</div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] flex items-center gap-4 transition-colors hover:bg-white/[0.05]">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">Zero</div>
                      <div className="text-sm text-gray-400 font-medium">Inventory Errors</div>
                    </div>
                  </div>
                </div>

                {/* Client Quote */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 relative group">
                  <div className="text-amber-500/20 absolute top-2 right-4 font-serif text-6xl group-hover:scale-110 transition-transform">&ldquo;</div>
                  <p className="text-sm text-gray-300 italic mb-5 relative z-10 leading-relaxed font-medium">
                    &ldquo;Hexalogic completely transformed our operations. The custom dashboard feels incredibly intuitive and tailored exactly to our needs.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
                      D
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Decornish Team</div>
                      <div className="text-xs text-gray-500">Founders</div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Core Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "React", "Node.js", "TailwindCSS", "AWS", "PostgreSQL"].map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.05] rounded-full text-xs font-medium text-gray-300 cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-white/[0.08]">
                  <Link href="/contact" className="group flex items-center justify-center gap-2 w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
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
