"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import SilkRoadMap from "./SilkRoadMap";

export default function SilkRoadSection() {
  const t = useTranslations("silkRoad");

  return (
    <section className="apple-section relative overflow-hidden silk-gradient-warm">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <SilkRoadMap />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-apple-subtle">
            {t("desc")}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}