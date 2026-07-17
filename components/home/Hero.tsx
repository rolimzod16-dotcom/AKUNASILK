"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import SilkRouteStrip from "@/components/shared/SilkRouteStrip";
import SilkDivider from "@/components/shared/SilkDivider";
import SilkParticles from "@/components/shared/SilkParticles";
import SilkRoadVideoBackground from "@/components/shared/SilkRoadVideoBackground";
import { ScrollScale } from "@/components/shared/ScrollReveal";
import TripFinder from "@/components/home/TripFinder";
import HeroActions from "@/components/home/HeroActions";
import type { Tour } from "@/lib/data/tours";

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type HeroProps = {
  tour: Tour;
  tourTitle: string;
};

export default function Hero({ tour, tourTitle }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-14">
      <SilkRoadVideoBackground
        className="min-h-[520px] silk-grain"
        overlayClassName="from-silk-indigo/85 via-silk-indigo/55 to-silk-cream/98"
      >
        <SilkParticles />
        <div className="mx-auto max-w-[980px] px-6 pt-16 pb-8 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.p
              variants={item}
              className="inline-block rounded-full border border-silk-gold/40 bg-silk-gold/15 px-4 py-1 text-sm font-semibold text-silk-gold-light backdrop-blur-sm"
            >
              {t("badge")}
            </motion.p>

            <motion.h1
              variants={item}
              className="silk-headline mt-4 text-5xl text-white sm:text-6xl md:text-7xl"
            >
              {t("title")}
            </motion.h1>

            <SilkDivider light className="my-5" />

            <motion.p
              variants={item}
              className="apple-subhead mx-auto mt-2 max-w-xl text-xl text-silk-sand/90 sm:text-2xl"
            >
              {t("subtitle")}
            </motion.p>

            <motion.p variants={item} className="mt-4 text-2xl font-semibold sm:text-3xl">
              <span className="text-gradient-silk">{t("priceFrom", { price: "1,980" })}</span>
            </motion.p>

            <motion.div variants={item}>
              <HeroActions bestsellerSlug={tour.slug} />
            </motion.div>

            <TripFinder />
          </motion.div>
        </div>
      </SilkRoadVideoBackground>

      <SilkRouteStrip />

      <ScrollScale className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-8">
        <div className="silk-frame silk-glow-pulse relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={tour.image}
            alt={t("imageAlt", { title: tourTitle })}
            fill
            priority
            className="animate-ken-burns object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/85 via-silk-indigo/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-silk-gold">
              {t("bestseller")}
            </p>
            <p className="silk-headline mt-1 text-2xl text-white sm:text-3xl">
              {tourTitle} · ${tour.price.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-silk-sand/90">
              {t("priceFrom", { price: tour.price.toLocaleString() })} · {tour.duration}{" "}
              days
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute right-4 top-4 rounded-full border border-silk-gold/50 bg-silk-indigo/70 px-3 py-1 text-xs font-bold text-silk-gold backdrop-blur-md"
          >
            {t("premiumBadge")}
          </motion.div>
        </div>
      </ScrollScale>
    </section>
  );
}