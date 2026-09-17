"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BrainCircuit, Map, Calculator, Calendar, Heart, Shield, Search, Smartphone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EstateIqCaseStudy() {
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
            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest rounded-full">
              Mobile App / AI
            </span>
            <span className="text-gray-500 text-sm font-medium">2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            EstateIQ AI: The Future of Luxury Real Estate
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl leading-relaxed">
            A modern, AI-powered mobile real estate platform designed to make discovering, evaluating, and scheduling property visits faster and more intelligent.
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
              <h2 className="text-3xl font-bold text-white mb-6">The Vision</h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                EstateIQ AI aims to transform real estate discovery from a traditional listing-and-search experience into an intelligent, personalized, and immersive mobile platform where users can discover properties, understand their financial options, explore properties virtually, communicate with professionals, and arrange visits—all from one application.
              </p>
              <p className="text-gray-400 leading-relaxed font-medium mt-4">
                Designed primarily for <strong>Android mobile devices</strong>, the platform uses a smooth, gesture-driven interface focused on speed, simplicity, and an engaging property-discovery experience with a premium black-and-gold aesthetic.
              </p>
            </motion.section>

            {/* Custom UI Image 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 shadow-2xl"
            >
              <div className="relative w-full aspect-[9/16] max-w-[400px] mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                 {/* Placeholder for Screenshot 1 */}
                 <Image src="/images/case-studies/main-page.jpeg" alt="EstateIQ AI Home Screen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-5 mb-3 font-medium">Home Screen: &quot;Defining the future of luxury living&quot; with AI Concierge.</p>
            </motion.div>

            {/* Key Deliverables - Core Features */}
            <div className="feature-grid pt-8">
              <h2 className="text-3xl font-bold text-white mb-8">Core Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: BrainCircuit,
                    title: "AI Recommendations",
                    desc: "Analyzes user preferences, budget, and behavior to provide personalized recommendations and match scores (e.g., 98% Match)."
                  },
                  {
                    icon: Map,
                    title: "Interactive Map Search",
                    desc: "Discover properties directly on an interactive map. Search by location, view price markers, and apply smart filters."
                  },
                  {
                    icon: Calculator,
                    title: "Mortgage Calculator",
                    desc: "Calculate estimated monthly payments, total interest, and amortization schedules instantly."
                  },
                  {
                    icon: Calendar,
                    title: "Schedule Visits",
                    desc: "Select a property, date, and time to schedule physical or virtual visits without conflicting bookings."
                  },
                  {
                    icon: Heart,
                    title: "Saved Searches",
                    desc: "Save properties into collections and receive smart notifications when prices change."
                  },
                  {
                    icon: Search,
                    title: "Virtual Tours",
                    desc: "Explore 360° tours, high-quality videos, and floor plans to tour properties remotely."
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="feature-card bg-[#0f0f12] border border-white/[0.06] p-8 rounded-[2rem] hover:border-yellow-500/40 hover:bg-[#131316] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/10 group flex flex-col items-start">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom UI Image 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 shadow-2xl mt-16"
            >
              <div className="relative w-full aspect-[9/16] max-w-[400px] mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                 {/* Placeholder for Screenshot 2 */}
                 <Image src="/images/case-studies/estateiq-2.jpeg" alt="EstateIQ AI Property Listings" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-5 mb-3 font-medium">Property Listings: Browsing through curated luxury architectural masterpieces.</p>
            </motion.div>

            {/* The AI Assistant Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-invert prose-lg max-w-none mt-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6">The AI Chatbot Concierge</h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                The EstateIQ AI Assistant serves as a personal real estate concierge. Users can simply ask for recommendations—such as &quot;Give me the cheapest property in Allama Iqbal Town&quot;—and the conversational AI will instantly filter and respond with highly personalized, accurate property suggestions.
              </p>
            </motion.section>

            {/* Custom UI Image 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-3 shadow-2xl mt-8"
            >
              <div className="relative w-full aspect-[9/16] max-w-[400px] mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                 {/* Placeholder for Screenshot 3 */}
                 <Image src="/images/case-studies/estateiq-3.jpeg" alt="EstateIQ AI Chatbot" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-5 mb-3 font-medium">AI Concierge: Natural language search and personalized responses.</p>
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50" />
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-yellow-500" />
                  User Experience
                </h3>
                
                <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">
                  Built with a mobile-first design philosophy. We used interactive cards, animated bottom sheets, swipeable galleries, and gesture-driven navigation powered by React Native Reanimated.
                </p>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Core Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL + PostGIS", "OpenAI API", "Google Maps"].map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.05] rounded-full text-xs font-medium text-gray-300 cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Users section */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Multi-Role Support</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500"/> Buyers & Renters</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500"/> Property Owners</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500"/> Real Estate Agents</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500"/> Administrators</li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-white/[0.08]">
                  <Link href="/contact" className="group flex items-center justify-center gap-2 w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Start Your Mobile App
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
