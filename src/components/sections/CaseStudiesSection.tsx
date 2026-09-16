"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const caseStudies = [
  {
    id: 1,
    title: "Decornish",
    category: "Retail & E-Commerce",
    description:
      "A modern, elegant e-commerce platform designed for premium home decor. We integrated automated inventory management and an intuitive visual product catalog to replace their manual spreadsheets.",
    metric: "+60% Online Sales",
    image: "/images/case-studies/decornish-frontend.png",
    tags: ["Next.js", "TailwindCSS", "Automation"],
    link: "/case-studies/decornish",
  },
  {
    id: 2,
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
    id: 3,
    title: "Scorlyn",
    category: "Sports Tech",
    description:
      "A specialized paddle sports portal offering digital scoreboards and integrated management systems. We automated their client provisioning, removing manual data entry entirely.",
    metric: "3x Client Subscriptions",
    image: "/images/case-studies/scorlyn-shop.png",
    tags: ["React Native", "Hardware", "IoT"],
    link: "/case-studies/scorlyn",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-24 sm:py-32 bg-surface-darkest text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Client Stories</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] to-orange-400">Case Studies</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7324] to-orange-400 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover how we have transformed businesses with innovative technology, scalable architectures, and beautiful digital experiences.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 hover:bg-[#16161a] transition-all duration-300 group flex flex-col"
            >
              <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100"
                />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-brand-primary transition-colors">
                  {study.title}
                </h3>
                
                <p className="text-gray-400 text-base leading-relaxed mb-8 flex-1">
                  {study.description}
                </p>
                
                <div className="flex items-center justify-end pt-6 border-t border-white/10">
                  <a href={study.link || "#"} className="inline-flex items-center gap-2 text-white hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wide group/link">
                    Read Story 
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
