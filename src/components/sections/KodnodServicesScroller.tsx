"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/hooks";

const STICKY_TOP_PX = 84; // 5.25rem — matches sticky top-[5.25rem]

export default function KodnodServicesScroller({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [scrollPos, setScrollPos] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelLockRef = useRef(0);

  const count = services.length;

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    const updateFromScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const stickyHeight = window.innerHeight - STICKY_TOP_PX;
      const scrollable = el.offsetHeight - stickyHeight;
      if (scrollable <= 0) return;

      // Starts rotating the instant the sticky wrapper pins at STICKY_TOP_PX
      const raw = Math.max(0, Math.min(1, (STICKY_TOP_PX - rect.top) / scrollable));
      const pos = raw * (count - 1);
      setScrollPos(pos);
      setActiveIndex(Math.round(pos));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, reducedMotion]);

  const scrollToService = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(count - 1, index));
      if (reducedMotion || !trackRef.current) {
        setScrollPos(clamped);
        setActiveIndex(clamped);
        return;
      }
      const el = trackRef.current;
      const stickyHeight = window.innerHeight - STICKY_TOP_PX;
      const scrollable = el.offsetHeight - stickyHeight;
      const trackTop = el.getBoundingClientRect().top + window.scrollY;
      const targetY =
        trackTop - STICKY_TOP_PX + (clamped / Math.max(1, count - 1)) * scrollable;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    [count, reducedMotion]
  );

  // When cursor is over the Services card, mouse wheel steps through services
  // without scrolling the whole page until the user reaches the first or last service.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;
      if (Math.abs(e.deltaY) < 4) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = activeIndex + dir;

      if (next >= 0 && next < count) {
        e.preventDefault();
        e.stopPropagation();
        const now = performance.now();
        if (now - wheelLockRef.current < 260) return;
        wheelLockRef.current = now;
        scrollToService(next);
      }
    };

    card.addEventListener("wheel", onWheel, { passive: false });
    return () => card.removeEventListener("wheel", onWheel);
  }, [activeIndex, count, reducedMotion, scrollToService]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollToService(activeIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToService(activeIndex - 1);
    }
  };

  const activeService = services[activeIndex] ?? services[0];

  return (
    <>
      {/* ── Desktop Sticky 3D Wheel Scroller (Kodnod-style, >= 1024px) ── */}
      <div
        ref={trackRef}
        className="relative hidden lg:block"
        style={{ height: reducedMotion ? "auto" : "260vh" }}
      >
        <div
          className={
            reducedMotion
              ? "py-2"
              : "sticky top-[5.25rem] h-[calc(100dvh-5.75rem)] flex flex-col justify-start"
          }
        >
          <section
            ref={cardRef}
            aria-label="Services"
            className="relative w-full h-[min(660px,calc(100dvh-6.5rem))] rounded-[24px] bg-paper-alt border border-line-strong overflow-hidden select-none shadow-[var(--ds-shadow-card)]"
          >
            {/* Left Column: Active Service Copy + View Link + Deliverables */}
            <div className="absolute top-1/2 left-[5.5%] w-[min(24rem,32%)] -translate-y-1/2 z-20">
              <div className="ds-meta text-accent mb-2.5">
                {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[28px] xl:text-[32px] ds-heading text-ink">
                  {activeService.title}
                </h2>
                <Link
                  href={`/services/${activeService.slug}`}
                  className="shrink-0 text-sm font-semibold text-accent hover:text-ink transition-colors min-h-[44px] inline-flex items-center"
                >
                  View &rarr;
                </Link>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {activeService.description}
              </p>
              <p className="mt-3.5 text-sm leading-relaxed text-ink font-medium">
                {activeService.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {activeService.deliverables.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-full bg-card border border-line font-mono text-[10px] text-ink-soft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Center Stage: 3D Vertical Cylinder Image Wheel (wraps circularly so 3 cards are always visible) */}
            <div
              tabIndex={0}
              role="listbox"
              aria-label="Services"
              aria-activedescendant={`service-wheel-${activeIndex}`}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 touch-pan-y outline-none cursor-default"
              style={{ perspective: "620px" }}
            >
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateX(86px) translateZ(-480px)",
                }}
              >
                {services.map((service, i) => {
                  let delta = i - scrollPos;
                  if (delta > count / 2) delta -= count;
                  if (delta < -count / 2) delta += count;

                  if (Math.abs(delta) > 1.35) return null;

                  const angle = delta * 38;
                  const shiftX = -Math.abs(delta) * 84;
                  const opacity = Math.max(0, 1 - Math.abs(delta) * 0.2);
                  const zIndex = Math.round(100 - Math.abs(delta) * 10);

                  return (
                    <Link
                      key={service.slug}
                      id={`service-wheel-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      href={`/services/${service.slug}`}
                      className="group absolute block"
                      style={{
                        width: "340px",
                        height: "230px",
                        marginLeft: "-170px",
                        marginTop: "-115px",
                        backfaceVisibility: "hidden",
                        transform: `translateX(${shiftX}px) rotateX(${angle}deg) translateZ(480px)`,
                        opacity,
                        zIndex,
                      }}
                    >
                      <span className="block w-full h-full rounded-xl border border-line-strong bg-card overflow-hidden shadow-[0_18px_40px_-18px_rgba(20,20,20,0.22)]">
                        <span className="relative block w-full h-full">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="340px"
                          />
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Vertical Service Index List */}
            <ul
              className="absolute top-[8%] right-[3.5%] z-20 text-right leading-[1.9]"
              style={{ fontSize: "13px" }}
            >
              {services.map((service, i) => {
                const isCurrent = i === activeIndex;
                return (
                  <li key={service.slug}>
                    <button
                      type="button"
                      onClick={() => scrollToService(i)}
                      className={`transition-colors py-0.5 cursor-pointer ${
                        isCurrent
                          ? "font-semibold text-ink"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {service.title}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Bottom Scroll Cue */}
            <div className="absolute bottom-5 right-[3.5%] z-20 ds-meta text-ink-muted pointer-events-none">
              Scroll to explore
            </div>
          </section>
        </div>
      </div>

      {/* ── Mobile & Tablet Stacked Cards (< 1024px) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group bg-card border border-line hover:border-line-strong rounded-[24px] overflow-hidden shadow-[var(--ds-shadow-card)] flex flex-col ds-press"
          >
            <div className="relative aspect-[16/10] w-full bg-paper-alt overflow-hidden">
              <Image
                src={service.image}
                alt=""
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl ds-heading text-ink mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h2>
              <p className="text-sm font-medium text-ink mb-2">{service.tagline}</p>
              <p className="text-sm text-ink-soft leading-relaxed flex-1">
                {service.shortDescription}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-accent transition-colors min-h-[44px]">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
