"use client";

import { useTranslations } from "next-intl";
import { Compass, Gem, Map, Shield } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";

const icons = {
  expert: Compass,
  luxury: Gem,
  custom: Map,
  safety: Shield,
} as const;

const keys = ["expert", "luxury", "custom", "safety"] as const;

export default function Features() {
  const t = useTranslations("features");

  return (
    <section className="apple-section bg-apple-bg">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {keys.map((key, i) => {
            const Icon = icons[key];
            const isLarge = i === 0 || i === 3;

            return (
              <ScrollReveal
                key={key}
                delay={i * 0.1}
                scale
                className={isLarge ? "sm:col-span-2" : ""}
              >
                <div className="group h-full rounded-3xl bg-apple-gray p-8 transition duration-500 hover:bg-[#ebebed] sm:p-10">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon className="size-6 text-apple-blue" />
                  </div>
                  <h3 className="apple-headline mt-6 text-2xl text-apple-black sm:text-3xl">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="apple-subhead mt-3 max-w-md text-base text-apple-muted sm:text-lg">
                    {t(`items.${key}.desc`)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}