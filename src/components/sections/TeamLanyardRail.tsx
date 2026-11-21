"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Code2,
  Smartphone,
  Workflow,
  Cloud,
  PenTool,
  Server,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type RoleBadge = {
  id: string;
  code: string;
  role: string;
  division: string;
  summary: string;
  tags: string[];
  accent: string;
  strapDrop: number;
  restRot: number;
  restTiltY: number;
  icon: React.ElementType;
};

const TEAM_ROLES: RoleBadge[] = [
  {
    id: "ai-engineer",
    code: "HL-01-AI",
    role: "AI Engineer",
    division: "LLM & ML Systems",
    summary:
      "Architects custom LLM integrations, RAG pipelines, and predictive intelligence embedded directly into production apps.",
    tags: ["OpenAI", "Python", "RAG", "Agents"],
    accent: "#e8463c",
    strapDrop: 58,
    restRot: -1.6,
    restTiltY: -6,
    icon: BrainCircuit,
  },
  {
    id: "react-developer",
    code: "HL-02-FE",
    role: "React Developer",
    division: "Web Platforms",
    summary:
      "Builds high-speed, accessible Next.js & React interfaces with fluid motion, SSR performance, and design-system precision.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    accent: "#141414",
    strapDrop: 72,
    restRot: 1.2,
    restTiltY: 7,
    icon: Code2,
  },
  {
    id: "flutter-developer",
    code: "HL-03-MB",
    role: "Flutter Developer",
    division: "iOS & Android",
    summary:
      "Ships 60fps cross-platform mobile applications with native device bridges, offline sync, and polished gesture UX.",
    tags: ["Flutter", "Dart", "React Native", "BLE"],
    accent: "#4a0b10",
    strapDrop: 64,
    restRot: -0.9,
    restTiltY: -4,
    icon: Smartphone,
  },
  {
    id: "automation-expert",
    code: "HL-04-AU",
    role: "Automation Expert",
    division: "Ops & Workflows",
    summary:
      "Eliminates manual bottlenecks by connecting APIs, CRMs, inventory pipelines, and event-driven background workers.",
    tags: ["n8n", "Webhooks", "APIs", "CI/CD"],
    accent: "#d1382e",
    strapDrop: 78,
    restRot: 1.8,
    restTiltY: 8,
    icon: Workflow,
  },
  {
    id: "cloud-architect",
    code: "HL-05-CL",
    role: "Cloud Architect",
    division: "Edge & Infra",
    summary:
      "Designs zero-downtime serverless and container infrastructure with automated scaling, telemetry, and edge caching.",
    tags: ["AWS", "Vercel", "Docker", "Postgres"],
    accent: "#2c2c30",
    strapDrop: 60,
    restRot: -1.4,
    restTiltY: -7,
    icon: Cloud,
  },
  {
    id: "ui-ux-designer",
    code: "HL-06-UX",
    role: "UI/UX Designer",
    division: "Product Design",
    summary:
      "Crafts editorial interfaces, interactive prototypes, and cohesive token systems tailored to how real users work.",
    tags: ["Figma", "Design Systems", "Motion", "UX"],
    accent: "#e8463c",
    strapDrop: 74,
    restRot: 1.1,
    restTiltY: 5,
    icon: PenTool,
  },
  {
    id: "backend-engineer",
    code: "HL-07-BE",
    role: "Backend Engineer",
    division: "Core APIs",
    summary:
      "Engineers resilient Node.js, Go, and Rust services with strict auth, encrypted credentials, and high-throughput data models.",
    tags: ["Node.js", "Golang", "Rust", "Supabase"],
    accent: "#141414",
    strapDrop: 66,
    restRot: -1.8,
    restTiltY: -8,
    icon: Server,
  },
  {
    id: "iot-specialist",
    code: "HL-08-IO",
    role: "IoT Specialist",
    division: "Hardware Sync",
    summary:
      "Bridges physical hardware—BLE vehicle lighting, court scoreboards, and WiFi controllers—directly to mobile & web apps.",
    tags: ["BLE", "WiFi", "Embedded", "CarPlay"],
    accent: "#4a0b10",
    strapDrop: 70,
    restRot: 1.5,
    restTiltY: 6,
    icon: Cpu,
  },
];

const BARCODE_WIDTHS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2];

const BARCODE_BARS = BARCODE_WIDTHS.reduce<{ x: number; w: number }[]>((acc, w, i) => {
  const prev = acc[acc.length - 1];
  const x = prev ? prev.x + prev.w + ((i - 1) % 2 === 0 ? 1.5 : 2.1) : 0;
  acc.push({ x, w });
  return acc;
}, []);

function BarcodeGraphic() {
  return (
    <svg viewBox="0 0 95 18" className="h-[1.35em] w-full text-ink/80" aria-hidden="true">
      {BARCODE_BARS.map((bar, i) => (
        <rect key={i} x={bar.x} y={0} width={bar.w} height={18} fill="currentColor" />
      ))}
    </svg>
  );
}

function QrPattern({ seed }: { seed: number }) {
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const inCorner =
        (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
      if (inCorner || ((r * 7 + c * 13 + seed * 5) % 3 === 0)) {
        cells.push({ r, c });
      }
    }
  }
  return (
    <svg viewBox="0 0 9 9" className="w-[3.2em] h-[3.2em] text-ink/85" aria-hidden="true">
      {cells.map((cell, idx) => (
        <rect
          key={idx}
          x={cell.c}
          y={cell.r}
          width={0.88}
          height={0.88}
          rx={0.12}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function TeamLanyardRail() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [stageWidth, setStageWidth] = useState(1200);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Drag & spring-pull state
  const [dragState, setDragState] = useState<{
    index: number;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);
  const pointerStartRef = useRef<{
    index: number;
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const suppressClickRef = useRef(false);

  // Pointer tilt inside hovered card
  const [hoverTiltY, setHoverTiltY] = useState<number>(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageWidth(el.clientWidth || 1200);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isCarousel = stageWidth < 1620;

  // Zoomed-in card geometry for high legibility and prominent badge presence
  const cardW = useMemo(() => {
    if (stageWidth < 460) return 164;
    if (stageWidth < 768) return 174;
    return 184;
  }, [stageWidth]);

  const cardH = Math.round(cardW * 1.5484);
  const pitch = isCarousel
    ? cardW + 32
    : Math.min(212, (stageWidth - 64) / TEAM_ROLES.length);
  const stageHeight = cardH + 144;

  const getSlotX = useCallback(
    (index: number) => {
      const n = TEAM_ROLES.length;
      if (!isCarousel) {
        const totalW = (n - 1) * pitch + cardW;
        const startX = (stageWidth - totalW) / 2;
        return startX + index * pitch;
      }
      // Circular wrap-around offset centered on activeIndex
      let diff = index - activeIndex;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      const center = stageWidth / 2 - cardW / 2;
      return center + diff * pitch;
    },
    [isCarousel, pitch, cardW, stageWidth, activeIndex]
  );

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.button !== 0) return;
    pointerStartRef.current = {
      index,
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
    };
    suppressClickRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start) return;
    const rawDx = e.clientX - start.x;
    const rawDy = e.clientY - start.y;
    const dist = Math.hypot(rawDx, rawDy);
    const moved = dist > 6;
    if (moved) suppressClickRef.current = true;

    const dx = Math.max(-72, Math.min(72, rawDx * 0.75));
    const dy = Math.max(-10, Math.min(68, rawDy * 0.78));
    setDragState({ index: start.index, dx, dy, moved });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerStartRef.current) {
      try {
        e.currentTarget.releasePointerCapture(pointerStartRef.current.pointerId);
      } catch {
        // Ignore if capture already released
      }
    }
    pointerStartRef.current = null;
    setDragState(null);
  };

  const handleCardClick = (role: RoleBadge, index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (isCarousel && activeIndex !== index) {
      setActiveIndex(index);
      setFlippedId(null);
      return;
    }
    setActiveIndex(index);
    setFlippedId((prev) => (prev === role.id ? null : role.id));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setFlippedId(null);
      setActiveIndex((prev) => (prev + 1) % TEAM_ROLES.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setFlippedId(null);
      setActiveIndex((prev) => (prev - 1 + TEAM_ROLES.length) % TEAM_ROLES.length);
    } else if (e.key === "Escape") {
      setFlippedId(null);
    }
  };

  const activeRole = TEAM_ROLES[activeIndex];
  const activeIsFlipped = flippedId === activeRole.id;

  return (
    <div className="relative isolate w-full overflow-hidden bg-paper text-ink border-t border-line pt-12 sm:pt-16 pb-6">
      {/* Subtle Dotted Grid & Radial Vignette (Reference: Team Lanyard Rail) */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side at 50% 46%, rgba(20, 20, 20, 0.05), transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(rgba(20, 20, 20, 0.11) 1px, transparent 1.3px) 0 0 / 18px 18px",
            maskImage: "radial-gradient(closest-side, black 55%, transparent)",
            WebkitMaskImage: "radial-gradient(closest-side, black 55%, transparent)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center mb-4">
        <p className="ds-meta text-ink-soft">Engineering Team · Eight Disciplines</p>
        <h3 className="text-2xl sm:text-3xl ds-heading text-ink">
          Specialists Behind Every Build
        </h3>
      </div>

      {/* Lanyard Rail Stage */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="lanyard rail"
        aria-label="Engineering team roles"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative mt-2 w-full touch-pan-y select-none focus:outline-none"
        style={{ height: `${stageHeight}px`, overflowX: "clip" }}
      >
        {/* Brushed Metallic Rail */}
        <div
          data-rail="true"
          className="pointer-events-none absolute inset-x-0 z-0"
          style={{ top: "14px", height: "8px" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-0 h-3 rounded-full bg-ink/10 blur-[5px]"
            style={{ top: "10px" }}
          />
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              background:
                "linear-gradient(to bottom, #c9c5c2 0%, #ffffff 22%, #a8a3a0 45%, #7c7774 70%, #524f4d 100%)",
              boxShadow: "0 1px 0 rgba(20, 20, 20, 0.18)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255,255,255,0.45) 2px, rgba(255,255,255,0.45) 3px, transparent 3px, transparent 7px)",
              }}
            />
          </div>

          {/* Wall-Mount End Caps (Static Desktop Mode) */}
          {!isCarousel && (
            <>
              <div
                className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-4 rounded-[3px] flex flex-col items-center justify-between py-1"
                style={{
                  background: "linear-gradient(to right, #d6d2cf, #8d8885 55%, #5c5855)",
                  boxShadow: "0 3px 6px rgba(20,20,20,0.18)",
                }}
              >
                <span className="w-1 h-1 rounded-full bg-ink/40" />
                <span className="w-1 h-1 rounded-full bg-ink/40" />
              </div>
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-4 rounded-[3px] flex flex-col items-center justify-between py-1"
                style={{
                  background: "linear-gradient(to right, #d6d2cf, #8d8885 55%, #5c5855)",
                  boxShadow: "0 3px 6px rgba(20,20,20,0.18)",
                }}
              >
                <span className="w-1 h-1 rounded-full bg-ink/40" />
                <span className="w-1 h-1 rounded-full bg-ink/40" />
              </div>
            </>
          )}
        </div>

        {/* Edge Fades in Carousel Mode */}
        {isCarousel && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-40 w-10 bg-gradient-to-r from-paper from-25% to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-40 w-10 bg-gradient-to-l from-paper from-25% to-transparent"
            />
          </>
        )}

        {/* Hanging Role Badges */}
        {TEAM_ROLES.map((role, index) => {
          const Icon = role.icon;
          const isFlipped = flippedId === role.id;
          const isHovered = hoveredId === role.id;
          const isActive = activeIndex === index;
          const isDraggingThis = dragState?.index === index;

          // Neighbor collision push when dragging horizontally
          let neighborPushX = 0;
          let neighborSwing = 0;
          if (dragState && dragState.index !== index && Math.abs(dragState.dx) > 8) {
            const dist = index - dragState.index;
            if (Math.abs(dist) <= 2) {
              const dir = Math.sign(dist);
              const strength = Math.abs(dist) === 1 ? 0.38 : 0.16;
              if (Math.sign(dragState.dx) === dir) {
                neighborPushX = dragState.dx * strength;
                neighborSwing = -dragState.dx * 0.08;
              }
            }
          }

          const slotX = getSlotX(index) + (isDraggingThis ? dragState.dx : 0) + neighborPushX;
          const pullY = isDraggingThis ? Math.max(0, dragState.dy) : 0;
          const swingDeg = isDraggingThis
            ? -dragState.dx * 0.14
            : neighborSwing || (isHovered && !reducedMotion ? role.restRot * 0.4 : 0);

          const hangLift = isHovered && !isDraggingThis ? -5 : 0;
          const hangRotate = isDraggingThis
            ? dragState.dx * 0.07
            : role.restRot;

          const cardRotateY = isFlipped
            ? 180
            : isHovered && !isDraggingThis
              ? hoverTiltY
              : 0;

          const strapW = Math.max(9, Math.round(cardW * 0.088));
          const cordRestH = 11;
          const cordScaleY = 1 + pullY / cordRestH;
          const hangTop = 18 + role.strapDrop + 24;
          const cardFontSize = cardW / 11.2;

          const zIndex = isFlipped ? 40 : isDraggingThis || isHovered ? 35 : isActive ? 22 : 10 + index;

          return (
            <div
              key={role.id}
              data-lanyard={index}
              className="absolute top-0 left-0 pointer-events-none transition-[transform] duration-300 ease-out motion-reduce:transition-none"
              style={{
                width: `${cardW}px`,
                height: `${stageHeight}px`,
                transform: `translate3d(${slotX}px, 0, 0)`,
                zIndex,
                color: role.accent,
                transitionDuration: isDraggingThis ? "0ms" : "340ms",
              }}
            >
              {/* Top Rail Ring */}
              <div
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  left: `${cardW * 0.464}px`,
                  top: "9.5px",
                  width: `${Math.max(8, cardW * 0.072)}px`,
                  height: `${Math.max(16, cardW * 0.144)}px`,
                  border: "2px solid #b8b3af",
                  boxShadow: "inset 1px 0 0 rgba(0,0,0,0.22), 1px 1px 2px rgba(0,0,0,0.18)",
                }}
              />

              {/* Swinging Pivot */}
              <div
                data-swing="true"
                className="absolute inset-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{
                  transformOrigin: "50% 24px",
                  transform: `rotate(${reducedMotion ? 0 : swingDeg}deg)`,
                  transitionDuration: isDraggingThis ? "0ms" : "420ms",
                }}
              >
                {/* Woven Lanyard Strap + Retractable Reel */}
                <div
                  data-strap="true"
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ top: "20px" }}
                  aria-hidden="true"
                >
                  {/* Woven Strap */}
                  <div
                    className="relative rounded-t-sm"
                    style={{
                      width: `${strapW}px`,
                      height: `${role.strapDrop}px`,
                      backgroundImage: `
                        repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0px 1px, transparent 1px 3px),
                        repeating-linear-gradient(45deg, rgba(0,0,0,0.13) 0px 1px, transparent 1px 3px),
                        linear-gradient(90deg, rgba(0,0,0,0.28) 0%, transparent 18%, rgba(255,255,255,0.24) 48%, transparent 80%, rgba(0,0,0,0.3) 100%)
                      `,
                      backgroundColor: role.accent,
                      boxShadow: "2px 4px 5px rgba(0,0,0,0.16)",
                    }}
                  >
                    <div className="absolute inset-y-0 left-[1.5px] right-[1.5px] border-x border-dashed border-white/35" />
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-black/25" />
                  </div>

                  {/* Swivel D-Ring Loop */}
                  <svg viewBox="0 0 30 16" className="w-[18px] h-[10px] -mt-0.5" fill="none">
                    <rect
                      x="3"
                      y="2"
                      width="24"
                      height="11"
                      rx="5"
                      stroke="#9e9996"
                      strokeWidth="3"
                    />
                    <path d="M7 4.5 H23" stroke="white" strokeOpacity="0.65" strokeWidth="1.2" />
                  </svg>

                  {/* Circular Retractable Reel */}
                  <div
                    className="relative w-5 h-5 rounded-full flex items-center justify-center -mt-0.5 shadow-sm"
                    style={{
                      background:
                        "radial-gradient(circle at 34% 30%, #6b6865 0%, #1d1c1b 60%, #0d0d0c 100%)",
                    }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/75" />
                    </div>
                  </div>

                  {/* Retractable Cord */}
                  <div
                    className="w-[1.5px] bg-ink/60 origin-top transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      height: `${cordRestH}px`,
                      transform: `scaleY(${reducedMotion ? 1 : cordScaleY})`,
                      transitionDuration: isDraggingThis ? "0ms" : "420ms",
                    }}
                  />
                </div>

                {/* Hanging Badge + Clip Assembly */}
                <div
                  data-hang="true"
                  className="absolute left-0 right-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    top: `${hangTop}px`,
                    height: `${cardH + 10}px`,
                    transform: `translate3d(0, ${reducedMotion ? 0 : pullY + hangLift}px, 0) rotate(${
                      reducedMotion ? 0 : hangRotate
                    }deg)`,
                    transitionDuration: isDraggingThis ? "0ms" : "420ms",
                  }}
                >
                  {/* Dynamic Card Drop Shadow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-1 top-2 bottom-0 rounded-[10px] bg-ink/20 blur-[7px] transition-transform duration-300"
                    style={{
                      transform: `translate3d(${4 + pullY * 0.05}px, ${5 + pullY * 0.1}px, 0) scale(${
                        isDraggingThis ? 1.03 : 0.98
                      })`,
                      opacity: isDraggingThis ? 0.9 : 0.65,
                    }}
                  />

                  {/* Metal Badge Clip */}
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                    style={{ width: "28px", height: "21px" }}
                  >
                    <div
                      className="mx-auto w-[12px] h-[10px] rounded-b-[2px] translate-y-[8px]"
                      style={{
                        background: "linear-gradient(180deg, #e7e4e1, #8a8582)",
                      }}
                    />
                    <div
                      className="absolute inset-x-0 top-0 h-[12px]"
                      style={{
                        clipPath: "polygon(24% 0, 76% 0, 100% 72%, 94% 100%, 6% 100%, 0 72%)",
                        background: "linear-gradient(180deg, #f3f1ef, #928d8a)",
                      }}
                    >
                      <div className="absolute left-[30%] right-[30%] top-[1px] h-[1px] bg-white/60" />
                    </div>
                    <div
                      className="absolute left-1/2 top-[3.5px] -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-paper"
                      style={{ boxShadow: "inset 0 1px 1px rgba(0,0,0,0.45)" }}
                    />
                  </div>

                  {/* Interactive 3D Flippable Badge Card */}
                  <button
                    type="button"
                    aria-pressed={isFlipped}
                    aria-label={`${role.role} — ${role.division}. ${
                      isFlipped ? "Click to show front" : "Click to flip for details"
                    }`}
                    onPointerDown={(e) => handlePointerDown(e, index)}
                    onPointerMove={(e) => {
                      handlePointerMove(e);
                      if (e.pointerType === "mouse" && !dragState) {
                        const r = e.currentTarget.getBoundingClientRect();
                        const relX = ((e.clientX - r.left) / r.width) * 2 - 1;
                        setHoverTiltY(relX * 14);
                      }
                    }}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onMouseEnter={() => {
                      setHoveredId(role.id);
                      setActiveIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHoveredId(null);
                      setHoverTiltY(0);
                    }}
                    onClick={() => handleCardClick(role, index)}
                    className="pointer-events-auto relative w-full text-left cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[0.85em]"
                    style={{
                      top: "8px",
                      height: `${cardH}px`,
                      fontSize: `${cardFontSize}px`,
                      perspective: "900px",
                    }}
                  >
                    <div
                      data-flip="true"
                      className="relative w-full h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateY(${cardRotateY}deg)`,
                      }}
                    >
                      {/* ── FRONT FACE (Role & Discipline Only — No Photo, No Person Name) ── */}
                      <div
                        className="absolute inset-0 rounded-[0.85em] bg-card text-ink border border-line-strong overflow-hidden flex flex-col items-center text-center px-[0.85em] pb-[0.75em]"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "translateZ(1px)",
                        }}
                      >
                        {/* Header Banner */}
                        <div
                          className="absolute inset-x-0 top-0 h-[4.1em]"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(135deg, transparent 0px 0.45em, rgba(255,255,255,0.12) 0.45em 0.56em),
                              linear-gradient(180deg, ${role.accent}dd, ${role.accent})
                            `,
                          }}
                        />
                        <div className="absolute inset-x-0 top-[4.1em] h-px bg-black/15" />

                        {/* Slot Punch */}
                        <div
                          className="relative z-10 mt-[0.68em] h-[0.52em] w-[2.6em] rounded-full bg-paper"
                          style={{
                            boxShadow:
                              "inset 0 0.08em 0.18em rgba(0,0,0,0.45), 0 0.05em 0 rgba(255,255,255,0.35)",
                          }}
                        />

                        {/* Role Emblem Icon (replaces personal photo) */}
                        <div
                          className="relative z-10 mt-[1.35em] w-[4.2em] h-[4.2em] rounded-full bg-card p-[0.22em] flex items-center justify-center"
                          style={{
                            boxShadow: "0 0.15em 0.45em rgba(20,20,20,0.18)",
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-paper border border-line flex items-center justify-center text-ink">
                            <Icon className="w-[1.85em] h-[1.85em]" style={{ color: role.accent }} aria-hidden="true" />
                          </div>
                        </div>

                        {/* Role Title */}
                        <div className="mt-[0.7em] text-[1.18em] font-bold leading-[1.15] tracking-tight text-ink w-full px-0.5">
                          {role.role}
                        </div>

                        {/* Division */}
                        <div className="mt-[0.28em] text-[0.84em] font-medium leading-snug text-ink/75 truncate w-full">
                          {role.division}
                        </div>

                        {/* Company · Team */}
                        <div className="mt-[0.5em] text-[0.62em] font-mono font-semibold uppercase tracking-[0.16em] text-ink-soft truncate w-full">
                          HEXALOGIC · TEAM
                        </div>

                        {/* Barcode Footer */}
                        <div className="mt-auto w-full border-t border-dashed border-line-strong pt-[0.45em] flex flex-col items-center gap-[0.2em]">
                          <BarcodeGraphic />
                          <span className="font-mono text-[0.56em] font-medium tracking-[0.22em] text-ink/75">
                            {role.code}
                          </span>
                        </div>
                      </div>

                      {/* ── BACK FACE (Role Capabilities & Stack) ── */}
                      <div
                        className="absolute inset-0 rounded-[0.85em] bg-card text-ink border border-line-strong overflow-hidden flex flex-col justify-between p-[0.85em] pt-[2.7em]"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg) translateZ(1px)",
                        }}
                      >
                        {/* Back Header Strip */}
                        <div
                          className="absolute inset-x-0 top-0 h-[2.1em]"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(135deg, transparent 0px 0.45em, rgba(255,255,255,0.12) 0.45em 0.56em),
                              linear-gradient(180deg, ${role.accent}dd, ${role.accent})
                            `,
                          }}
                        />
                        <div
                          className="absolute top-[0.65em] left-1/2 -translate-x-1/2 h-[0.5em] w-[2.5em] rounded-full bg-paper"
                          style={{
                            boxShadow: "inset 0 0.08em 0.18em rgba(0,0,0,0.45)",
                          }}
                        />

                        <div>
                          <div className="text-[0.95em] font-semibold leading-tight text-ink">
                            {role.role}
                          </div>
                          <div className="text-[0.7em] text-ink-soft mt-[0.12em]">
                            {role.division}
                          </div>
                          <p className="mt-[0.65em] text-[0.68em] leading-[1.38] text-ink-soft line-clamp-4">
                            {role.summary}
                          </p>
                          <div className="mt-[0.65em] flex flex-wrap gap-[0.25em]">
                            {role.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-line bg-paper px-[0.5em] py-[0.12em] font-mono text-[0.54em] text-ink"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-2 pt-1">
                          <span className="font-mono text-[0.56em] uppercase tracking-wider text-accent font-semibold">
                            {role.code}
                          </span>
                          <QrPattern seed={index + 1} />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Caption, Carousel Controls & CTA */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 pt-3 text-center">
        {isCarousel && (
          <div className="flex items-center gap-3 mb-1">
            <button
              type="button"
              aria-label="Previous role"
              onClick={() => {
                setFlippedId(null);
                setActiveIndex((prev) => (prev - 1 + TEAM_ROLES.length) % TEAM_ROLES.length);
              }}
              className="w-9 h-9 rounded-full border border-line-strong bg-card flex items-center justify-center text-ink hover:border-accent hover:text-accent ds-press"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-1.5" role="group" aria-label="Show role badge">
              {TEAM_ROLES.map((role, idx) => {
                const current = activeIndex === idx;
                return (
                  <button
                    key={role.id}
                    type="button"
                    aria-label={`Select ${role.role}`}
                    aria-current={current ? "true" : undefined}
                    onClick={() => {
                      setActiveIndex(idx);
                      setFlippedId(null);
                    }}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                      current ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/45"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Next role"
              onClick={() => {
                setFlippedId(null);
                setActiveIndex((prev) => (prev + 1) % TEAM_ROLES.length);
              }}
              className="w-9 h-9 rounded-full border border-line-strong bg-card flex items-center justify-center text-ink hover:border-accent hover:text-accent ds-press"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div aria-live="polite" className="min-h-[2.6rem]">
          <p className="text-sm font-medium text-ink">
            {activeRole.role} — {activeRole.division}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {activeIsFlipped
              ? "Click again or press Esc to turn it back"
              : "Drag along the rail, pull a badge down, or click to flip it"}
          </p>
        </div>

        <Link
          href="/contact"
          className="ds-pill px-5 py-2.5 min-h-[44px] bg-ink text-paper hover:bg-accent hover:text-white text-sm font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span>Work With Us</span>
        </Link>
      </div>
    </div>
  );
}
