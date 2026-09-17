"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Code2,
  Lightbulb,
  Users,
  Rocket,
  Trophy,
  Smile,
  Globe
} from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: <Code2 className="w-5 h-5 text-blue-400" aria-hidden="true" />, label: "Projects Completed", value: "200+" },
  { icon: <Smile className="w-5 h-5 text-emerald-400" aria-hidden="true" />, label: "Client Satisfaction", value: "98%" },
  { icon: <Users className="w-5 h-5 text-purple-400" aria-hidden="true" />, label: "Team Members", value: "50+" },
  { icon: <Trophy className="w-5 h-5 text-yellow-400" aria-hidden="true" />, label: "Awards Won", value: "15" },
  { icon: <Globe className="w-5 h-5 text-brand-primary" aria-hidden="true" />, label: "Global Clients", value: "100+" },
];

const values = [
  {
    icon: <Code2 className="w-5 h-5 text-blue-400" aria-hidden="true" />,
    title: "Technical Excellence",
    desc: "We pride ourselves on writing clean, efficient, and maintainable code that scales."
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
    title: "Innovation",
    desc: "We constantly explore new technologies and approaches to solve complex problems."
  },
  {
    icon: <Users className="w-5 h-5 text-purple-400" aria-hidden="true" />,
    title: "Collaboration",
    desc: "We believe in the power of teamwork, transparency, and open communication."
  },
  {
    icon: <Rocket className="w-5 h-5 text-brand-primary" aria-hidden="true" />,
    title: "Delivery",
    desc: "We are committed to delivering high-quality solutions on time and within budget."
  }
];

const reasons = [
  "Cutting-edge technology expertise",
  "Dedicated project management",
  "Transparent communication through your own client portal",
  "Scalable and future-proof solutions",
  "Post-launch support and maintenance"
];

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-surface-darkest text-[#f4f4f5] py-20 sm:py-32 font-sans overflow-hidden">
      <div className="absolute top-[5%] right-[-5%] w-[50rem] h-[50rem] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45rem] h-[45rem] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Impact in Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[35%] xl:w-1/3 order-2 lg:order-1"
          >
            <div className="bg-[#121215]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:sticky lg:top-32 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7324] to-[#ff9b66]" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/15 transition-colors duration-700 pointer-events-none" aria-hidden="true" />

              <h2 className="text-3xl font-black text-white mb-8 sm:mb-10 tracking-tight">Our Impact</h2>

              <dl className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4 border-b border-white/5 py-4 first:pt-0 last:border-0 last:pb-0">
                    <dt className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-darkest flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-300 tracking-wide">{stat.label}</span>
                    </dt>
                    <dd className="text-2xl sm:text-3xl font-black text-white tracking-tighter drop-shadow-md">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full lg:w-[65%] xl:w-2/3 flex flex-col gap-12 sm:gap-14 lg:pt-4 order-1 lg:order-2"
          >
            <div>
              <h1 className="text-[clamp(3rem,6vw+1rem,4.5rem)] font-black text-white mb-8 tracking-tighter leading-[1.1] text-balance">
                We Are <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] via-[#ff9b66] to-[#FF7324]">HexaLogic</span>
              </h1>
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-medium max-w-3xl">
                <p>
                  Founded with a vision for excellence, HexaLogic has grown from a small team of passionate developers into a full-service software house with a global client base. Our mission is to transform businesses through innovative, tailored technology solutions.
                </p>
                <p>
                  We specialize in web and mobile application development, cloud infrastructure, AI integration, and digital transformation. Our team of experts is dedicated to delivering exceptional results that consistently exceed client expectations.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Our Core Values</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((val) => (
                  <div key={val.title} className="flex flex-col gap-4 group bg-[#121215]/50 hover:bg-[#121215] border border-white/5 hover:border-white/10 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-surface-darkest border border-white/10 shadow-inner group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-colors">
                        {val.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{val.title}</h3>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Why Choose Us?</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-4 bg-[#121215]/40 p-4 lg:p-5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 group">
                    <div className="bg-brand-primary/10 p-1.5 rounded-full group-hover:bg-brand-primary/20 transition-colors shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                    </div>
                    <span className="text-base text-gray-300 font-semibold">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 min-h-[48px] bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,115,36,0.25)] hover:shadow-[0_0_30px_rgba(255,115,36,0.4)] hover:-translate-y-1"
              >
                Start a Project
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center gap-2 px-8 min-h-[48px] border border-white/15 hover:border-white/40 text-white font-bold rounded-xl transition-all"
              >
                See Our Work
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
