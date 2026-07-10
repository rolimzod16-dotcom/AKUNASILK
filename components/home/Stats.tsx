"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/shared/ScrollReveal";

/** Only verifiable operational facts — no invented traveler counts or ratings (TZ §1). */
const stats = [
  { value: "16+", key: "tours" },
  { value: "9", key: "countries" },
  { value: "5", key: "styles" },
  { value: "24/7", key: "support" },
] as const;

export default function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="apple-section bg-apple-gray">
      <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-12 px-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.key} delay={i * 0.08} className="text-center">
            <span className="apple-headline text-5xl text-apple-black sm:text-6xl md:text-7xl">
              {stat.value}
            </span>
            <p className="mt-2 text-sm text-apple-muted">{t(stat.key)}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
