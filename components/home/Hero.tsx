"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const HERO_IMAGE =
  "https://images.pexels.com/videos/33255422/gobi-march-25-33255422.jpeg?auto=compress&w=2400&h=1400&fit=crop";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[88svh] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Camel caravan crossing Central Asian desert on a historic Silk Road corridor"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-silk-indigo/85 via-silk-indigo/55 to-silk-indigo/25" />
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-[1280px] items-center px-6 pb-16 pt-24 sm:pt-28">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.1 }}
          className="max-w-[650px] text-left"
        >
          <motion.p
            variants={item}
            className="text-[11px] font-bold uppercase tracking-[0.28em] text-silk-gold"
          >
            {t("badge")}
          </motion.p>
          <motion.h1
            variants={item}
            className="silk-headline mt-4 text-[2.35rem] leading-[1.1] text-white sm:text-5xl md:text-6xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="silk" size="pill" className="h-12 min-w-[180px]" asChild>
              <Link href="/journeys">{t("cta")}</Link>
            </Button>
            <Button
              variant="silkOutline"
              size="pill"
              className="h-12 border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/plan-my-journey">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
