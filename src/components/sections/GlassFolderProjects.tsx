"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TeamLanyardRail from "@/components/sections/TeamLanyardRail";

export type FolderProject = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  alt: string;
  accent: "brand" | "yellow";
  fit?: "cover" | "contain";
  externalUrl?: string;
};

type FolderKey = "web" | "ai" | "mobile";

type FolderDefinition = {
  key: FolderKey;
  label: string;
  subheading: string;
  projects: FolderProject[];
  tint: string;
  note?: boolean;
};

const BACK_PATH =
  "M 22 34 L 146 34 C 170 34 172 0 198 0 L 318 0 C 330.15 0 340 9.85 340 22 L 340 250 C 340 262.15 330.15 272 318 272 L 22 272 C 9.85 272 0 262.15 0 250 L 0 56 C 0 43.85 9.85 34 22 34 Z";

const FRONT_PATH =
  "M 22 0 L 112 0 C 128 0 132 24 148 24 L 192 24 C 208 24 212 0 228 0 L 318 0 C 330.15 0 340 9.85 340 22 L 340 176 C 340 188.15 330.15 198 318 198 L 22 198 C 9.85 198 0 188.15 0 176 L 0 22 C 0 9.85 9.85 0 22 0 Z";

function FolderCard({
  folder,
  isOpen,
  onToggle,
}: {
  folder: FolderDefinition;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [tilt, setTilt] = useState({ px: 0, py: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ px: Math.max(-1, Math.min(1, px)), py: Math.max(-1, Math.min(1, py)) });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ px: 0, py: 0 });
  }, []);

  const count = folder.projects.length;
  const gradId = `gf-rim-${folder.key}`;

  return (
    <div
      className="gf-root flex flex-col items-center pt-14 pb-4 px-5 sm:px-2"
      data-open={isOpen ? "true" : "false"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          "--gf-px": tilt.px,
          "--gf-py": tilt.py,
        } as React.CSSProperties
      }
    >
      <div className="gf-tilt relative w-full max-w-[296px] sm:max-w-[332px] aspect-[340/272]">
        {/* Ambient Ground Shadow */}
        <div
          aria-hidden="true"
          className="absolute left-5 right-5 -bottom-2 h-14 rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            background: "rgba(20, 20, 20, 0.22)",
            filter: "blur(20px)",
            opacity: isOpen ? 0.45 : 0.28,
          }}
        />

        {/* Back Folder Body + Raised Right Tab */}
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `path('${BACK_PATH}')`,
            background: "linear-gradient(180deg, #ede9e6 0%, #dcd6d1 100%)",
          }}
        >
          {/* Subtle editorial tint wash inside folder pocket */}
          <div
            className="absolute inset-0 opacity-75"
            style={{ background: folder.tint }}
          />
          <svg
            viewBox="0 0 340 272"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
          >
            <path d={BACK_PATH} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Stacked Inner Project Sheets */}
        <div
          className="absolute inset-x-0 top-0 bottom-2 z-[5] pointer-events-none"
          style={{ clipPath: "inset(-220px -120px 10px -120px)" }}
        >
          {folder.projects.map((project, idx) => {
            const centerOffset = idx - (count - 1) / 2;
            const depth = count - 1 - idx;
            const jx = (idx % 2 === 0 ? -1 : 1) * 3;
            const jr = centerOffset * 1.2;

            return (
              <Link
                key={project.slug}
                href={`/case-studies/${project.slug}`}
                tabIndex={isOpen ? 0 : -1}
                aria-label={`${project.title} — ${project.tag}`}
                className={`gf-sheet absolute left-[10%] right-[10%] top-[28%] aspect-[272/176] rounded-2xl overflow-hidden bg-card border border-line-strong shadow-[var(--ds-shadow-card)] flex flex-col ${
                  isOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={
                  {
                    "--gf-slot": centerOffset,
                    "--gf-depth": depth,
                    "--gf-jx": `${jx}px`,
                    "--gf-jr": `${jr}deg`,
                    zIndex: 5 + idx,
                  } as React.CSSProperties
                }
              >
                <div className="relative flex-1 bg-night overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className={
                      project.fit === "contain"
                        ? "object-contain p-2 bg-night"
                        : "object-cover object-top"
                    }
                    sizes="280px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute inset-x-3 bottom-2 flex items-center justify-between gap-2 text-white">
                    <span className="text-xs font-semibold truncate">{project.title}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/80 shrink-0">
                      {project.tag}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Front Frosted Glass Flap (Tap / Click Trigger) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`folder-panel-${folder.key}`}
          aria-label={`Open ${folder.label} projects folder — ${folder.subheading}`}
          className="gf-front-flap absolute left-0 right-0 bottom-0 h-[72.8%] z-10 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          style={{
            clipPath: `path('${FRONT_PATH}')`,
          }}
        >
          {/* Frosted Glass Base */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(18px) saturate(1.45)",
              WebkitBackdropFilter: "blur(18px) saturate(1.45)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.72) 45%, rgba(249,247,246,0.95) 100%)",
            }}
          />

          {/* Pointer-Tracked Specular Highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(240px 180px at calc(50% + var(--gf-px) * 42%) calc(30% + var(--gf-py) * 36%), rgba(255,255,255,0.65), transparent 70%)",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Glass Bevel SVG Rim */}
          <svg
            viewBox="0 0 340 198"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#141414" stopOpacity="0.14" />
              </linearGradient>
            </defs>
            <path
              d={FRONT_PATH}
              stroke={isOpen ? "#e8463c" : `url(#${gradId})`}
              strokeWidth={isOpen ? "2.5" : "2"}
            />
          </svg>

          {/* Front Label Content */}
          <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-2xl sm:text-[26px] ds-heading text-ink">{folder.label}</div>
                <p className="text-xs text-ink-soft mt-1 leading-snug">{folder.subheading}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 pb-1">
                <span className="ds-meta text-ink-soft" aria-hidden="true">
                  0{folder.key === "web" ? 1 : folder.key === "ai" ? 2 : 3}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-accent" : "bg-ink/20"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function GlassFolderProjects({
  webProjects,
  mobileProjects,
  aiProjects,
}: {
  webProjects: FolderProject[];
  mobileProjects: FolderProject[];
  aiProjects: FolderProject[];
}) {
  const [openFolder, setOpenFolder] = useState<FolderKey>("web");

  const folders: FolderDefinition[] = [
    {
      key: "web",
      label: "Web",
      subheading: "E-Commerce & Web Platforms",
      projects: webProjects,
      tint: "radial-gradient(circle at 80% 15%, rgba(232,70,60,0.16), transparent 62%)",
    },
    {
      key: "ai",
      label: "AI",
      subheading: "AI-Powered Products",
      projects: aiProjects,
      tint: "radial-gradient(circle at 20% 20%, rgba(74,11,16,0.16), transparent 65%)",
      note: true,
    },
    {
      key: "mobile",
      label: "Mobile",
      subheading: "Mobile Applications",
      projects: mobileProjects,
      tint: "radial-gradient(circle at 75% 20%, rgba(20,20,20,0.12), transparent 62%)",
    },
  ];

  return (
    <div id="projects" className="w-full pt-20 sm:pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-[var(--ds-gutter)]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.25rem,4.6vw,3.5rem)] ds-display text-ink mb-4 text-balance">
              Successful Projects
            </h2>
            <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
              Take a look at the custom-engineered digital systems and solutions we have deployed globally for our clients.
            </p>
          </div>

          {/* Accessible folder selector pills (synchronized with folder cards) */}
          <div
            className="inline-flex bg-paper-alt border border-line p-1 rounded-full shrink-0 self-start lg:self-auto"
            role="tablist"
            aria-label="Project categories"
          >
            {folders.map((folder) => {
              const selected = openFolder === folder.key;
              return (
                <button
                  key={folder.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setOpenFolder(folder.key)}
                  className={`px-5 py-2 min-h-[44px] rounded-full text-sm font-semibold whitespace-nowrap ds-press ${
                    selected
                      ? "bg-ink text-paper shadow-[var(--ds-shadow-card)]"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {folder.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Three Glass Folder Cards: Web, AI, Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end mb-12 sm:mb-16">
          {folders.map((folder) => (
            <FolderCard
              key={folder.key}
              folder={folder}
              isOpen={openFolder === folder.key}
              onToggle={() => setOpenFolder(folder.key)}
            />
          ))}
        </div>
      </div>

      {/* Team Lanyard Rail (Full-width zoomed-in rail) */}
      <TeamLanyardRail />
    </div>
  );
}
