import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, custom software, UI/UX design, cloud solutions, IT consulting and business automation from HexaLogic Tech Solutions.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-surface-darkest min-h-screen text-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">What we do</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 text-balance">
            Services built around <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7324] to-orange-400">your goals</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            From the first wireframe to production infrastructure, we cover the full lifecycle of modern digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-[#121214] border border-white/5 hover:border-brand-primary/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 bg-surface-darkest overflow-hidden">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" aria-hidden="true" />
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{service.title}</h2>
                <p className="text-sm font-medium text-gray-300 mb-3">{service.tagline}</p>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{service.shortDescription}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-brand-primary transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 bg-[#121214] border border-white/5 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Not sure where to start?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Tell us about the problem you are trying to solve and we will recommend the right approach, with no obligation.</p>
          <Link href="/contact" className="inline-flex items-center justify-center px-8 min-h-[48px] bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-xl transition-all">
            Book a free consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
