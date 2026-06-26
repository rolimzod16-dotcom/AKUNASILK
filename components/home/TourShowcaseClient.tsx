"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import type { Tour, TourContent } from "@/lib/data/tours";

type TourShowcaseClientProps = {
  items: { tour: Tour; content: TourContent }[];
};

export default function TourShowcaseClient({ items }: TourShowcaseClientProps) {
  const t = useTranslations("shop");

  return (
    <section id="packages" className="apple-section silk-gradient-warm silk-pattern">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ tour, content }, i) => (
            <TourCard key={tour.id} tour={tour} content={content} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}