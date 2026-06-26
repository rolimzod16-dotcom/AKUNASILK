"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";

const keys = ["1", "2", "3"] as const;

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="apple-section silk-gradient-warm">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {keys.map((key, i) => (
            <ScrollReveal key={key} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm transition duration-500 hover:border-silk-gold/40 hover:shadow-lg hover:shadow-silk-gold/10">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-3.5 fill-silk-gold text-silk-gold" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-apple-subtle">
                  &ldquo;{t(`items.${key}.text`)}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-silk-indigo">
                  {t(`items.${key}.author`)}
                </p>
                <p className="text-xs text-apple-muted">{t(`items.${key}.location`)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}