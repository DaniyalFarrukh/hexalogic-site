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

export default function AboutSection() {
  const stats = [
    { icon: <Code2 className="w-5 h-5 text-blue-400" />, label: "Projects Completed", value: "200+" },
    { icon: <Smile className="w-5 h-5 text-emerald-400" />, label: "Client Satisfaction", value: "98%" },
    { icon: <Users className="w-5 h-5 text-purple-400" />, label: "Team Members", value: "50+" },
    { icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: "Awards Won", value: "15" },
    { icon: <Globe className="w-5 h-5 text-brand-primary" />, label: "Global Clients", value: "120+" },
  ];

  const values = [
    {
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      title: "Technical Excellence",
      desc: "We pride ourselves on writing clean, efficient, and maintainable code that scales."
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      title: "Innovation",
      desc: "We constantly explore new technologies and approaches to solve complex problems."
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      title: "Collaboration",
      desc: "We believe in the power of teamwork, transparency, and open communication."
    },
    {
      icon: <Rocket className="w-5 h-5 text-brand-primary" />,
      title: "Delivery",
      desc: "We are committed to delivering high-quality solutions on time and within budget."
    }
  ];

  const reasons = [
    "Cutting-edge technology expertise",
    "Dedicated project management",
    "Transparent communication",
    "Scalable and future-proof solutions",
    "Post-launch support and maintenance"
  ];

  return (
    <section id="about" className="relative w-full bg-surface-darkest text-[#f4f4f5] py-24 sm:py-32 font-sans overflow-hidden">
      {/* Background Orbs for HexaLogic theme */}
      <div className="absolute top-[5%] right-[-5%] w-[50rem] h-[50rem] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45rem] h-[45rem] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Cybernetic Tech Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Impact in Numbers */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[35%] xl:w-1/3"
          >
            <div className="bg-[#121215]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:sticky lg:top-32 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7324] to-[#ff9b66]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/15 transition-colors duration-700 pointer-events-none" />
              
              <h3 className="text-3xl font-black text-white mb-10 tracking-tight">Our Impact</h3>
              
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/5 py-4 first:pt-0 last:border-0 last:pb-0 hover:px-2 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-darkest flex items-center justify-center border border-white/10 shadow-inner group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-colors">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-300 tracking-wide">{stat.label}</span>
                    </div>
                    <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[65%] xl:w-2/3 flex flex-col gap-14 lg:pt-4"
          >
            {/* Header Text */}
            <div>
              <h2 className="text-[clamp(3rem,6vw+1rem,4.5rem)] font-black text-white mb-8 tracking-tighter leading-[1.1]">
                We Are <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] via-[#ff9b66] to-[#FF7324] bg-[length:200%_auto] animate-gradient">HexaLogic</span>
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-medium max-w-3xl">
                <p>
                  Founded with a vision for excellence, HexaLogic has grown from a small team of passionate developers into a full-service software house with a global client base. Our mission is to transform businesses through innovative, tailored technology solutions.
                </p>
                <p>
                  We specialize in web and mobile application development, cloud infrastructure, AI integration, and digital transformation. Our team of experts is dedicated to delivering exceptional results that consistently exceed client expectations.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Our Core Values</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((val, idx) => (
                  <div key={idx} className="flex flex-col gap-4 group bg-[#121215]/50 hover:bg-[#121215] border border-white/5 hover:border-white/10 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-surface-darkest border border-white/10 shadow-inner group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-colors">
                        {val.icon}
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{val.title}</h4>
                    </div>
                    <p className="text-base text-gray-400 leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Why Choose Us?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-[#121215]/40 p-4 lg:p-5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 group">
                    <div className="bg-brand-primary/10 p-1.5 rounded-full group-hover:bg-brand-primary/20 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
                    </div>
                    <span className="text-base text-gray-300 font-semibold">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 px-8 min-h-[44px] bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,115,36,0.25)] hover:shadow-[0_0_30px_rgba(255,115,36,0.4)] hover:-translate-y-1"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
