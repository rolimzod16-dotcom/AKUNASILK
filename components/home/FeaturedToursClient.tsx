"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import TourCard from "@/components/tours/TourCard";
import { Button } from "@/components/ui/button";
import type { Tour, TourContent } from "@/lib/data/tours";

type FeaturedToursClientProps = {
  items: { tour: Tour; content: TourContent }[];
};

export default function FeaturedToursClient({ items }: FeaturedToursClientProps) {
  const t = useTranslations("tours");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  return (
    <section className="apple-section overflow-hidden bg-apple-bg">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>
      </div>

      <div
        ref={scrollRef}
        className="mt-14 flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide md:px-[max(1.5rem,calc((100vw-980px)/2))]"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map(({ tour, content }, i) => (
          <div key={tour.id} className="w-[min(340px,85vw)] shrink-0 snap-center sm:w-[380px]">
            <TourCard tour={tour} content={content} index={i} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 hidden h-0.5 max-w-xs overflow-hidden rounded-full bg-apple-border md:block">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-apple-blue"
          style={{ scaleX: scrollXProgress }}
        />
      </div>

      <ScrollReveal className="mt-12 text-center">
        <Button variant="link" asChild>
          <Link href="/journeys">
            {t("viewAll")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </ScrollReveal>
    </section>
  );
}