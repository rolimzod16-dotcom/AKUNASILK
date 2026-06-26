"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";

const eventKeys = ["130bce", "1stc", "7thc", "13thc", "2013", "today"] as const;

export default function Timeline() {
  const t = useTranslations("timeline");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="apple-section bg-apple-gray">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <div className="relative mt-20">
          <div className="absolute left-[7px] top-0 h-full w-px bg-apple-border md:left-1/2" />
          <motion.div
            className="absolute left-[7px] top-0 w-px origin-top bg-apple-blue md:left-1/2"
            style={{ height: lineHeight }}
          />

          <div className="space-y-16">
            {eventKeys.map((key, i) => (
              <ScrollReveal
                key={key}
                delay={i * 0.06}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <div
                  className={`relative flex flex-col md:flex-row ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="hidden w-1/2 md:block" />
                  <div
                    className={`w-full pl-8 md:w-1/2 md:pl-0 ${
                      i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                    }`}
                  >
                    <span className="text-sm font-medium text-apple-blue">
                      {t(`events.${key}.year`)}
                    </span>
                    <h3 className="apple-headline mt-1 text-xl text-apple-black sm:text-2xl">
                      {t(`events.${key}.title`)}
                    </h3>
                    <p className="apple-subhead mt-2 text-sm text-apple-muted sm:text-base">
                      {t(`events.${key}.desc`)}
                    </p>
                  </div>
                  <div className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-apple-blue bg-apple-gray md:left-1/2 md:-translate-x-1/2" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}