"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import BookNowButton from "@/components/automation/BookNowButton";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SilkDivider from "@/components/shared/SilkDivider";
import VideoBackground from "@/components/shared/VideoBackground";
import { ctaVideo } from "@/lib/data/videos";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="apple-section relative overflow-hidden">
      <VideoBackground
        src={ctaVideo.src}
        poster={ctaVideo.poster}
        overlayClassName="from-silk-indigo/92 via-silk-indigo/80 to-silk-indigo/95"
      >
        <div className="silk-aurora absolute inset-0" />
        <div className="relative mx-auto max-w-[980px] px-6 py-4 text-center">
          <ScrollReveal blur>
            <SilkDivider light className="mb-6" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="silk-headline text-4xl text-white sm:text-5xl md:text-6xl"
            >
              {t("title")}
            </motion.h2>
            <p className="apple-subhead mx-auto mt-4 max-w-lg text-xl text-silk-sand/85">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <BookNowButton
                variant="silk"
                size="pill"
                className="silk-glow-pulse"
                prefill={{ source: "hero" }}
                label={t("button")}
              />
              <Button
                variant="link"
                className="text-silk-gold hover:text-silk-gold-light"
                asChild
              >
                <a href="https://wa.me/998712004567" target="_blank" rel="noopener noreferrer">
                  WhatsApp ›
                </a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/50">{t("guarantee")}</p>
          </ScrollReveal>
        </div>
      </VideoBackground>
    </section>
  );
}