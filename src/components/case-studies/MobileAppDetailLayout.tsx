"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_EDITORIAL } from "@/components/motion/EditorialReveal";

export function TitaniumPhoneFrame({
  src,
  alt,
  caption,
  aspect = "portrait",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: "portrait" | "landscape";
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col items-center">
      <div
        className={`mm-titanium-bezel relative p-2.5 sm:p-3 ${
          aspect === "portrait"
            ? "w-full max-w-[300px] sm:max-w-[330px] rounded-[46px]"
            : "w-full max-w-[680px] rounded-[28px] sm:rounded-[34px]"
        }`}
      >
        <div
          className={`relative w-full overflow-hidden bg-[#040406] ${
            aspect === "portrait"
              ? "aspect-[9/19.2] rounded-[36px]"
              : "aspect-[16/10] rounded-[20px] sm:rounded-[24px]"
          }`}
        >
          {/* Dynamic Island for portrait phone mockups */}
          {aspect === "portrait" && (
            <div
              aria-hidden="true"
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[86px] h-[24px] rounded-full bg-black border border-white/10"
            />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes={
              aspect === "portrait"
                ? "(max-width: 640px) 85vw, 330px"
                : "(max-width: 1024px) 100vw, 680px"
            }
          />
        </div>
      </div>
      {caption && (
        <figcaption className="text-center text-xs sm:text-sm text-mm-soft mt-5 max-w-md leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MobileAppReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
