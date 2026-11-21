"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const DESKTOP_SHADOW =
  "rgba(0, 0, 0, 0.3) 0px 0px, rgba(0, 0, 0, 0.29) 0px 9px 20px, rgba(0, 0, 0, 0.26) 0px 37px 37px, rgba(0, 0, 0, 0.15) 0px 84px 50px, rgba(0, 0, 0, 0.04) 0px 149px 60px, rgba(0, 0, 0, 0.01) 0px 233px 65px";

type TabletVideoSource = {
  mp4: string;
  webm?: string;
};

const TABLET_VIDEOS: TabletVideoSource[] = [
  { mp4: "/Video/1121.mp4" },
  { webm: "/hero-bg.mp4.webm", mp4: "/hero-bg.mp4" },
];

export default function TabletVideoShowcase({
  videos = TABLET_VIDEOS,
}: {
  videos?: TabletVideoSource[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const currentVideo = videos[videoIndex] ?? videos[0];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Auto-play muted when scrolled into view, pause when off-screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion, videoIndex]);

  // Exact Kodnod desktop scroll-driven 3D tilt: rotateX(18deg) -> 0deg, scale(0.94) -> 1
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "start 32%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  const animate3D = isDesktop && !reducedMotion;

  return (
    <div
      ref={sectionRef}
      className="relative flex items-start justify-center overflow-x-clip bg-paper px-3 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-16 lg:pt-24 lg:pb-24"
    >
      <div
        className="relative flex w-full flex-col gap-4 py-0 md:gap-5"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          style={
            animate3D
              ? {
                  rotateX,
                  scale,
                  transformOrigin: "center top",
                  boxShadow: DESKTOP_SHADOW,
                }
              : undefined
          }
          className="pointer-events-none relative z-10 mx-auto aspect-video h-auto w-full max-w-[48rem] shrink-0 rounded-[1.25rem] border-4 border-[#6C6C6C] bg-[#222222] p-1.5 shadow-2xl sm:rounded-[30px] sm:p-2 lg:aspect-auto lg:h-[min(32rem,68dvh)] lg:max-w-[56rem] lg:p-4 will-change-transform"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-black">
            <div className="pointer-events-auto relative h-full w-full overflow-hidden bg-black">
              <video
                key={currentVideo.mp4}
                ref={videoRef}
                className="block h-full w-full max-h-full bg-black object-cover"
                playsInline
                controls
                muted
                autoPlay={!reducedMotion}
                preload="metadata"
                onEnded={() => setVideoIndex((prev) => (prev + 1) % videos.length)}
              >
                {currentVideo.webm && <source src={currentVideo.webm} type="video/webm" />}
                <source src={currentVideo.mp4} type="video/mp4" />
              </video>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
