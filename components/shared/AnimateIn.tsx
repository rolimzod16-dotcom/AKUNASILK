"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function AnimateIn({
  children,
  className,
  delay = 0,
}: AnimateInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}