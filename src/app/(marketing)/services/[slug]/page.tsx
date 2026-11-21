import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES, getService } from "@/lib/services";
import { EditorialReveal } from "@/components/motion/EditorialReveal";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-paper min-h-[100dvh] text-ink relative overflow-x-clip">
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors ds-meta min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All Services
          </Link>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <EditorialReveal>
            <p className="ds-meta text-accent mb-4">Service</p>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] ds-display text-ink mb-4 text-balance">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl text-ink font-medium mb-5">{service.tagline}</p>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed mb-8 max-w-2xl">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="ds-pill px-8 min-h-[48px] bg-ink hover:bg-accent text-paper hover:text-white text-sm"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/case-studies"
                className="ds-pill px-8 min-h-[48px] border border-line-strong hover:border-ink text-ink text-sm bg-card"
              >
                See Related Work
              </Link>
            </div>
          </EditorialReveal>

          <EditorialReveal
            delay={0.08}
            className="relative rounded-[var(--ds-radius-bento)] overflow-hidden border border-line-strong bg-card aspect-[4/3] shadow-[var(--ds-shadow-elevated)]"
          >
            <Image
              src={service.image}
              alt={`${service.title} illustration`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </EditorialReveal>
        </div>

        {/* Features & Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <EditorialReveal className="bg-card border border-line rounded-[var(--ds-radius-bento)] p-7 sm:p-9 shadow-[var(--ds-shadow-card)]">
            <h2 className="text-2xl ds-heading text-ink mb-6">What we do</h2>
            <ul className="space-y-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-ink-soft text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </EditorialReveal>

          <EditorialReveal
            delay={0.08}
            className="bg-card border border-line rounded-[var(--ds-radius-bento)] p-7 sm:p-9 shadow-[var(--ds-shadow-card)]"
          >
            <h2 className="text-2xl ds-heading text-ink mb-6">What you get</h2>
            <ul className="space-y-4">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full bg-accent/15 border border-accent/40 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-ink-soft text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </EditorialReveal>
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-8">How we work</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {service.process.map((step, index) => (
              <li
                key={step.title}
                className="bg-card border border-line rounded-[var(--ds-radius-card)] p-6 relative overflow-hidden shadow-[var(--ds-shadow-card)]"
              >
                <span
                  className="text-5xl font-display font-semibold text-ink/[0.05] absolute top-4 right-5 select-none"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="ds-meta text-accent mb-3">Step {index + 1}</p>
                <h3 className="text-lg ds-heading text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Other services */}
        <div className="border-t border-line-strong pt-12">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="text-2xl ds-heading text-ink">Other services</h2>
            <Link
              href="/services"
              className="text-sm font-semibold text-accent hover:text-ink transition-colors min-h-[44px] inline-flex items-center"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                href={`/services/${other.slug}`}
                className="group bg-card border border-line hover:border-line-strong rounded-[var(--ds-radius-card)] overflow-hidden shadow-[var(--ds-shadow-card)] transition-shadow hover:shadow-[var(--ds-shadow-elevated)] ds-press"
              >
                <div className="relative h-36 bg-paper-alt overflow-hidden">
                  <Image
                    src={other.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="ds-heading text-lg text-ink group-hover:text-accent transition-colors">
                    {other.title}
                  </h3>
                  <p className="text-sm text-ink-soft mt-1">{other.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
