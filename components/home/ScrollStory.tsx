"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/shared/ScrollReveal";

const panels = [
  {
    key: "desert",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1400&q=85",
    color: "from-amber-900/60",
  },
  {
    key: "mountains",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
    color: "from-slate-900/60",
  },
  {
    key: "cities",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=85",
    color: "from-blue-900/50",
  },
] as const;

function StoryPanel({
  panel,
  index,
}: {
  panel: (typeof panels)[number];
  index: number;
}) {
  const t = useTranslations("scrollStory");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden py-20"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={panel.image}
          alt={t(`panels.${panel.key}.title`)}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${panel.color} to-black/30`} />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-3xl px-6 text-center text-white"
      >
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/70">
            {t(`panels.${panel.key}.label`)}
          </p>
          <h3 className="apple-headline mt-3 text-4xl sm:text-5xl md:text-6xl">
            {t(`panels.${panel.key}.title`)}
          </h3>
          <p className="apple-subhead mx-auto mt-4 max-w-xl text-lg text-white/75 sm:text-xl">
            {t(`panels.${panel.key}.desc`)}
          </p>
        </ScrollReveal>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">
        {String(index + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function ScrollStory() {
  const t = useTranslations("scrollStory");

  return (
    <section className="bg-apple-black">
      <div className="apple-section bg-apple-bg">
        <ScrollReveal className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="apple-headline text-4xl text-apple-black sm:text-5xl md:text-6xl">
            {t("title")}
          </h2>
          <p className="apple-subhead mx-auto mt-4 max-w-2xl text-xl text-apple-muted">
            {t("subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {panels.map((panel, i) => (
        <StoryPanel key={panel.key} panel={panel} index={i} />
      ))}
    </section>
  );
}