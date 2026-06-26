"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  scale?: boolean;
  blur?: boolean;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  scale = false,
  blur = false,
}: ScrollRevealProps) {
  const offsets = {
    up: { y: 48, x: 0 },
    down: { y: -48, x: 0 },
    left: { y: 0, x: 48 },
    right: { y: 0, x: -48 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: offsets[direction].y,
        x: offsets[direction].x,
        scale: scale ? 0.94 : 1,
        filter: blur ? "blur(8px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  offset?: number;
};

export function Parallax({ children, className, offset = 80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

type ScrollScaleProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollScale({ children, className }: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.8, 1]);

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={{ scale, opacity }}>{children}</motion.div>
    </div>
  );
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}