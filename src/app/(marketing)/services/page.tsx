import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { EditorialReveal } from "@/components/motion/EditorialReveal";
import KodnodServicesScroller from "@/components/sections/KodnodServicesScroller";

export const metadata: Metadata = {
  title: "Our Services | Web Development, Cloud Solutions & Business Automation",
  description:
    "Explore HexaLogic's comprehensive IT services including custom web development, business automation, UI/UX design, and scalable cloud solutions for modern businesses.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-paper min-h-[100dvh] text-ink relative overflow-x-clip">
      <div className="absolute inset-0 ds-hairline-grid opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)] relative z-10">
        <EditorialReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div className="max-w-3xl">
            <p className="ds-meta text-accent mb-4">What we do</p>
            <h1 className="text-[clamp(2.5rem,5.2vw,4rem)] ds-display text-ink mb-4 text-balance">
              Services built around <span className="text-accent">your goals</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
              From the first wireframe to production infrastructure, we cover the full lifecycle of modern digital products.
            </p>
          </div>
          <Link
            href="/contact"
            className="text-sm font-semibold text-accent hover:text-ink transition-colors shrink-0 min-h-[44px] inline-flex items-center"
          >
            Book a free consultation &rarr;
          </Link>
        </EditorialReveal>

        {/* Kodnod-style Interactive 3D Services Scroller */}
        <KodnodServicesScroller services={SERVICES} />

        {/* Bottom Consultation CTA */}
        <EditorialReveal className="mt-16 sm:mt-20 bg-card border border-line-strong rounded-[var(--ds-radius-bento)] p-8 md:p-12 text-center shadow-[var(--ds-shadow-card)]">
          <h2 className="text-2xl sm:text-3xl ds-heading text-ink mb-3">
            Not sure where to start?
          </h2>
          <p className="text-ink-soft mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Tell us about the problem you are trying to solve and we will recommend the right approach, with no obligation.
          </p>
          <Link
            href="/contact"
            className="ds-pill px-8 min-h-[48px] bg-ink hover:bg-accent text-paper hover:text-white text-sm"
          >
            Book a free consultation
          </Link>
        </EditorialReveal>
      </div>
    </div>
  );
}
