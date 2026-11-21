"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const PANE_COUNT = 16;

const EDGE_COLORS = [
  "rgba(123, 92, 255, 0.72)",
  "rgba(255, 128, 242, 0.65)",
  "rgba(115, 217, 255, 0.72)",
  "rgba(185, 166, 255, 0.65)",
];

const ASCII_RING = [
  "      . : * # % @ % # * : .      ",
  "   . : * # @ % * + * % @ # * : . ",
  " . : # @ % + - : . : - + % @ # : ",
  ": * @ % + : .         . : + % @ *",
  "* # @ + :                 : + @ #",
  "# % * - .                 . - * %",
  "* # @ + :                 : + @ #",
  ": * @ % + : .         . : + % @ *",
  " . : # @ % + - : . : - + % @ # : ",
  "   . : * # @ % * + * % @ # * : . ",
  "      . : * # % @ % # * : .      ",
];

/**
 * Full-bleed Relay-inspired 3D cascading glass-pane ribbon with continuous
 * 60fps 3D wave/rotation animation + pointer parallax on a #0c0c10 night canvas.
 */
export default function RelayHeroBackdrop() {
  const reducedMotion = usePrefersReducedMotion();
  const paneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const setStaticPositions = (phase = 0) => {
      paneRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = i / (PANE_COUNT - 1);
        const wave = Math.sin(phase * 1.4 - i * 0.42);
        const wave2 = Math.cos(phase * 0.9 - i * 0.35);

        const x = -34 + t * 68 + wave2 * 1.6;
        const y = -26 + Math.sin(t * Math.PI * 1.15) * 14 + t * 42 + wave * 3.2;
        const z = -220 + Math.sin(t * Math.PI) * 240 + wave * 42;
        const rotX = 52 - t * 24 + wave * 12;
        const rotY = -28 + t * 46 + wave2 * 14;
        const rotZ = -18 + t * 32 + Math.sin(phase * 0.7 + i * 0.28) * 10;

        el.style.transform = `translate3d(${x}vw, ${y}vh, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
      });
    };

    if (reducedMotion) {
      setStaticPositions(0);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setStaticPositions(elapsed);

      // Smoothly interpolate pointer tilt on the 3D stage
      const p = pointerRef.current;
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateX(${p.y * -6}deg) rotateY(${p.x * 7}deg)`;
      }

      // Gently orbit the ASCII art cluster
      if (orbRef.current) {
        const ox = Math.sin(elapsed * 0.35) * 18;
        const oy = Math.cos(elapsed * 0.45) * 14;
        orbRef.current.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0c0c10] z-0"
    >
      {/* Ambient Violet / Cobalt / Cyan Glow */}
      <div
        className="absolute -top-24 left-1/4 w-[620px] h-[420px] rounded-full blur-[140px] opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(35,64,255,0.7) 0%, rgba(123,92,255,0.4) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute bottom-10 right-[12%] w-[520px] h-[380px] rounded-full blur-[130px] opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(115,217,255,0.55) 0%, rgba(255,128,242,0.32) 50%, transparent 75%)",
        }}
      />

      {/* Drifting ASCII-Art Orb */}
      <div
        ref={orbRef}
        className="absolute top-[18%] right-[10%] font-mono text-[11px] sm:text-xs leading-[1.35] tracking-[0.25em] text-[#b9a6ff]/25 whitespace-pre select-none will-change-transform"
      >
        {ASCII_RING.join("\n")}
      </div>

      {/* 3D Cascading Glass Pane Ribbon */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1050px" }}
      >
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {Array.from({ length: PANE_COUNT }, (_, i) => {
            const edge = EDGE_COLORS[i % EDGE_COLORS.length];
            return (
              <div
                key={i}
                ref={(el) => {
                  paneRefs.current[i] = el;
                }}
                className="absolute w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] md:w-[250px] md:h-[250px] rounded-2xl will-change-transform"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(123,92,255,0.04) 50%, rgba(115,217,255,0.06) 100%)",
                  border: `1px solid ${edge}`,
                  boxShadow: `inset 0 0 28px rgba(255,255,255,0.05), 0 0 36px -10px ${edge}`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Top & Bottom Readability Scrims */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0c0c10] via-[#0c0c10]/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/70 to-transparent" />
    </div>
  );
}
