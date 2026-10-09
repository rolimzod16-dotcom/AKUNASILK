"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CircleCheck, Clock, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { planJourneyHref } from "@/lib/site";

type TourCardProps = {
  tour: Tour;
  content: TourContent;
  index?: number;
  showPrice?: boolean;
};

export default function TourCard({ tour, content }: TourCardProps) {
  const t = useTranslations("tours");
  const shop = useTranslations("shop");
  const locale = useLocale();
  const countries = countrySlugsToLabels(resolveTourCountrySlugs(tour), locale);
  const difficulty = t(`difficulty.${tour.difficulty}`);
  const nights = Math.max(tour.duration - 1, 0);
  const priced = tour.price > 0 && tour.showPrice !== false;
  const compareAt = tour.originalPrice;
  const hasDiscount = priced && compareAt != null && compareAt > tour.price;
  const discount = hasDiscount ? Math.round(((compareAt - tour.price) / compareAt) * 100) : 0;
  const seasonFavorite = tour.seasonFavorite ?? Boolean(tour.featured || tour.bestseller);
  const highlights = content.highlights.slice(0, 2);
  const journeyHref = `/journeys/${tour.slug}`;
  const bookHref = planJourneyHref({ tour: tour.slug, source: "tour-card" });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-silk-gold/25 bg-white shadow-[0_25px_50px_-12px_rgba(15,18,37,0.12)] transition-all hover:-translate-y-1 hover:border-silk-gold/50 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link href={journeyHref} className="absolute inset-0" tabIndex={-1} aria-hidden>
          <Image
            src={tour.image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        {seasonFavorite || hasDiscount ? (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            {seasonFavorite ? (
              <span className="inline-flex items-center rounded-md bg-silk-gold px-2 py-0.5 text-xs font-medium text-silk-indigo">
                {t("seasonFavorite")}
              </span>
            ) : null}
            {hasDiscount ? (
              <span className="inline-flex items-center rounded-md bg-silk-indigo px-2 py-0.5 text-xs font-medium text-silk-gold">
                −{discount}%
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs backdrop-blur-sm">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{countries.join(" / ")}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs backdrop-blur-sm">
            <Clock className="h-3 w-3" aria-hidden />
            {t("durationLine", { days: tour.duration, nights })}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {tour.rating > 0 ? (
          <div className="flex items-center gap-2 text-xs text-apple-muted">
            <Star className="h-3.5 w-3.5 fill-silk-gold text-silk-gold" aria-hidden />
            <span className="font-medium text-silk-indigo">{tour.rating}</span>
            {tour.reviews > 0 ? (
              <span>
                · {tour.reviews} {shop("reviews")}
              </span>
            ) : null}
          </div>
        ) : null}

        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-silk-indigo">
          <Link href={journeyHref} className="hover:text-silk-gold">
            {content.title}
          </Link>
        </h3>
        {content.desc ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-apple-muted">{content.desc}</p>
        ) : null}

        {highlights.length > 0 ? (
          <ul className="mt-4 space-y-1.5 text-sm text-silk-indigo/80">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-silk-gold" aria-hidden />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-apple-muted">
          {tour.maxGroupSize ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {t("detail.groupValue", { count: tour.maxGroupSize })}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            {difficulty}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-silk-gold/20 pt-4">
          <div>
            {priced ? (
              <>
                {hasDiscount ? (
                  <div className="text-xs text-apple-muted line-through">
                    ${compareAt.toLocaleString(locale)}
                  </div>
                ) : null}
                <div className="font-display text-2xl font-semibold leading-none text-silk-indigo">
                  ${tour.price.toLocaleString(locale)}
                </div>
                <div className="mt-1 text-xs text-apple-muted">{shop("perPerson")}</div>
              </>
            ) : (
              <p className="text-sm font-semibold text-silk-indigo">{shop("requestQuote")}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={journeyHref}
              className="inline-flex h-8 items-center justify-center rounded-md border border-silk-gold/50 bg-white px-3 text-sm font-medium text-silk-indigo transition hover:bg-silk-gold/10"
            >
              {shop("details")}
            </Link>
            <Link
              href={bookHref}
              className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-gradient-to-r from-silk-gold to-silk-amber px-3 text-sm font-bold text-silk-indigo shadow-md shadow-silk-gold/30 transition hover:from-silk-gold-light hover:to-silk-gold"
            >
              {shop("book")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
