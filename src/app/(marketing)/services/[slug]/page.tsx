import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES, getService } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — HexaLogic Tech Solutions`,
      description: service.tagline,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-surface-darkest min-h-screen text-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide min-h-[44px]">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All Services
          </Link>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <div>
            <p className="text-brand-primary text-sm font-bold uppercase tracking-[0.2em] mb-4">Service</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
              {service.title}
            </h1>
            <p className="text-xl text-gray-300 font-medium mb-6">{service.tagline}</p>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl">{service.description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 min-h-[48px] bg-brand-primary hover:bg-[#ff8947] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,115,36,0.25)]">
                Start Your Project
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/case-studies" className="inline-flex items-center justify-center px-8 min-h-[48px] border border-white/15 hover:border-white/40 text-white font-bold rounded-xl transition-all">
                See Related Work
              </Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] aspect-[4/3] shadow-2xl">
            <Image
              src={service.image}
              alt={`${service.title} illustration`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/70 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* Features & Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What we do</h2>
            <ul className="space-y-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What you get</h2>
            <ul className="space-y-4">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-primary/15 border border-brand-primary/30 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">How we work</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {service.process.map((step, index) => (
              <li key={step.title} className="bg-[#0f0f12] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
                <span className="text-5xl font-black text-white/5 absolute top-4 right-5 select-none" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">Step {index + 1}</p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Other services */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Other services</h2>
            <Link href="/services" className="text-sm font-semibold text-brand-primary hover:text-white transition-colors min-h-[44px] inline-flex items-center">View all &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherServices.map((other) => (
              <Link key={other.slug} href={`/services/${other.slug}`} className="group bg-[#121214] border border-white/5 hover:border-brand-primary/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1">
                <div className="relative h-36 bg-surface-darkest">
                  <Image src={other.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors">{other.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{other.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
