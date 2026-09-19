"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import SilkRoadVideoBackground from "@/components/shared/SilkRoadVideoBackground";
import SilkParticles from "@/components/shared/SilkParticles";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <SilkRoadVideoBackground
        className="min-h-[85svh] silk-grain"
        overlayClassName="from-silk-indigo/80 via-silk-indigo/55 to-silk-indigo/70"
      >
        <SilkParticles />
        <div className="mx-auto flex min-h-[85svh] max-w-[1280px] items-end px-6 pb-16 pt-28 sm:items-center sm:pb-20 sm:pt-24">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
            className="max-w-[650px] text-left"
          >
            <motion.p
              variants={item}
              className="text-xs font-bold uppercase tracking-[0.22em] text-silk-gold"
            >
              {t("badge")}
            </motion.p>
            <motion.h1
              variants={item}
              className="silk-headline mt-4 text-4xl text-white sm:text-5xl md:text-6xl"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 max-w-xl text-base leading-relaxed text-silk-sand/95 sm:text-lg"
            >
              {t("subtitle")}
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="silk" size="pill" asChild>
                <Link href="/journeys">{t("cta")}</Link>
              </Button>
              <Button
                variant="silkOutline"
                size="pill"
                className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/plan-my-journey">{t("ctaSecondary")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </SilkRoadVideoBackground>
    </section>
  );
}
