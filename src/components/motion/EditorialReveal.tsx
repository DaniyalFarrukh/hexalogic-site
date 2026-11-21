"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;
export const EASE_SNAP = [0.23, 1, 0.32, 1] as const;
export const EASE_SPRING = [0.34, 1.36, 0.5, 1] as const;

type EditorialRevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView" | "viewport" | "transition">;

/**
 * Transform + opacity only scroll reveal using the centralized editorial curve.
 * Respects prefers-reduced-motion automatically via Framer Motion's reducedMotion support
 * and CSS reduced-motion rules.
 */
export function EditorialReveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  ...rest
}: EditorialRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: EASE_EDITORIAL }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line entrance inspired by Leather Design Studio (Reference 1).
 * Never mutates text content — only slides the block upward out of an overflow-hidden mask.
 */
export function MaskedLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%", opacity: 0.001 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, delay, ease: EASE_EDITORIAL }}
      >
        {children}
      </motion.span>
    </span>
  );
}
