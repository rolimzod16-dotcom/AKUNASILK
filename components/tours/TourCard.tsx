"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { getTravelStyleLabel } from "@/lib/travel-styles";

type TourCardProps = {
  tour: Tour;
  content: TourContent;
  index?: number;
  showPrice?: boolean;
};

export default function TourCard({ tour, content, showPrice = false }: TourCardProps) {
  const t = useTranslations("tours");
  const shop = useTranslations("shop");
  const locale = useLocale();
  const countries = countrySlugsToLabels(resolveTourCountrySlugs(tour), locale);
  const difficulty =
    tour.difficulty === "adventurous" ? "Challenging" : t(`difficulty.${tour.difficulty}`);

  return (
    <Link
      href={`/journeys/${tour.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-silk-gold/25 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-silk-gold/50 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={`${content.title} — ${countries.join(", ")}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 py-4">
        <h3 className="silk-headline line-clamp-2 text-xl text-silk-indigo">{content.title}</h3>
        <p className="mt-2 text-sm text-apple-muted">
          {countries.join(" · ")} · {tour.duration} {t("days")} ·{" "}
          {getTravelStyleLabel(tour.travelStyle, locale)} · {difficulty}
        </p>
        {content.highlights[0] ? (
          <p className="mt-2 line-clamp-1 text-sm text-apple-subtle">{content.highlights[0]}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm font-semibold text-silk-indigo">
            {showPrice ? `$${tour.price.toLocaleString()}` : shop("requestQuote")}
          </p>
          <span className="text-sm font-semibold text-silk-gold">{shop("viewTrip")}</span>
        </div>
      </div>
    </Link>
  );
}
