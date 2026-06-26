"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { heroScenes } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

const SCENE_DURATION_MS = 7000;

type SilkRoadVideoBackgroundProps = {
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
};

export default function SilkRoadVideoBackground({
  className,
  overlayClassName,
  children,
}: SilkRoadVideoBackgroundProps) {
  const t = useTranslations("video.heroScenes");
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scene = heroScenes[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroScenes.length);
    }, SCENE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || scene.type !== "video") return;

    video.load();
    video.play().catch(() => undefined);
  }, [index, scene]);

  const label = t(scene.labelKey);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {scene.type === "video" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={scene.poster}
              className="h-full w-full object-cover animate-ken-burns"
              aria-hidden
            >
              <source src={scene.src} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={scene.src}
              alt={label}
              fill
              priority={index === 0}
              className="animate-ken-burns object-cover"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Silk route overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
          <motion.path
            d="M 920 220 C 750 180 620 200 480 240 C 350 270 220 290 80 260"
            fill="none"
            stroke="#d4a82a"
            strokeWidth="2"
            strokeDasharray="8 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -28] }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut" },
              opacity: { duration: 1 },
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
          />
          {[
            [920, 220],
            [620, 200],
            [480, 240],
            [220, 290],
            [80, 260],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill="#f0c84a"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-silk-indigo/80 via-silk-indigo/45 to-silk-cream/95",
          overlayClassName
        )}
      />

      {/* Scene label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-6 z-10 rounded-full border border-silk-gold/40 bg-silk-indigo/60 px-4 py-1.5 text-xs font-bold tracking-widest text-silk-gold uppercase backdrop-blur-md"
        >
          {label}
        </motion.div>
      </AnimatePresence>

      {/* Scene dots */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-1.5">
        {heroScenes.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "size-2 rounded-full transition-all",
              i === index ? "w-6 bg-silk-gold" : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={t(s.labelKey)}
          />
        ))}
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}