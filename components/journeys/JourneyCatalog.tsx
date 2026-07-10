"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { SlidersHorizontal, X } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import type { Tour, TourContent } from "@/lib/data/tours";
import {
  getCountryLabel,
  isCountrySlug,
  isRegionSlug,
  tourMatchesCountry,
  tourMatchesRegion,
  type CountrySlug,
} from "@/lib/countries";
import {
  TRAVEL_STYLES,
  getTravelStyleLabel,
  isTravelStyle,
  tourMatchesStyle,
  type TravelStyle,
} from "@/lib/travel-styles";

/** Active GST destinations with products (TZ: hide empty countries) */
const ACTIVE_COUNTRY_FILTERS: CountrySlug[] = [
  "tajikistan",
  "kyrgyzstan",
  "uzbekistan",
  "kazakhstan",
  "china",
  "pakistan",
  "turkmenistan",
  "iran",
  "turkey",
];

type CatalogItem = { tour: Tour; content: TourContent };

type JourneyCatalogProps = {
  items: CatalogItem[];
};

type DifficultyFilter = "all" | Tour["difficulty"];
type DurationFilter = "all" | "short" | "medium" | "long";
type SortKey = "recommended" | "price-asc" | "price-desc" | "duration" | "departure";

function matchesDuration(days: number, filter: DurationFilter) {
  if (filter === "all") return true;
  if (filter === "short") return days <= 8;
  if (filter === "medium") return days >= 9 && days <= 12;
  return days >= 13;
}

export default function JourneyCatalog({ items }: JourneyCatalogProps) {
  const t = useTranslations("traveler.catalog");
  const toursT = useTranslations("tours");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const regionParam = searchParams.get("region");
  const styleParam = searchParams.get("style");

  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [month, setMonth] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recommended");

  const activeCountry = countryParam && isCountrySlug(countryParam) ? countryParam : null;
  const activeRegion =
    !activeCountry && regionParam && isRegionSlug(regionParam) ? regionParam : null;
  const activeStyle = styleParam && isTravelStyle(styleParam) ? styleParam : null;

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    for (const { tour } of items) {
      if (tour.nextDeparture?.length >= 7) set.add(tour.nextDeparture.slice(0, 7));
    }
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];

    if (activeCountry) {
      list = list.filter(({ tour }) => tourMatchesCountry(tour, activeCountry));
    } else if (activeRegion) {
      list = list.filter(({ tour }) => tourMatchesRegion(tour, activeRegion));
    }

    if (activeStyle) {
      list = list.filter(({ tour }) => tourMatchesStyle(tour, activeStyle));
    }

    if (difficulty !== "all") {
      list = list.filter(({ tour }) => tour.difficulty === difficulty);
    }

    if (duration !== "all") {
      list = list.filter(({ tour }) => matchesDuration(tour.duration, duration));
    }

    if (month !== "all") {
      list = list.filter(({ tour }) => tour.nextDeparture?.startsWith(month));
    }

    list.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.tour.price - b.tour.price;
        case "price-desc":
          return b.tour.price - a.tour.price;
        case "duration":
          return a.tour.duration - b.tour.duration;
        case "departure":
          return a.tour.nextDeparture.localeCompare(b.tour.nextDeparture);
        default:
          return (b.tour.featured ? 1 : 0) - (a.tour.featured ? 1 : 0);
      }
    });

    return list;
  }, [items, difficulty, duration, month, sort, activeCountry, activeRegion, activeStyle]);

  const difficulties: DifficultyFilter[] = ["all", "easy", "moderate", "adventurous"];
  const durations: DurationFilter[] = ["all", "short", "medium", "long"];

  const filterLabel = activeCountry
    ? t("countryActive", { country: getCountryLabel(activeCountry, locale) })
    : activeRegion
      ? t("regionActiveLabel", { region: t(`regions.${activeRegion}`) })
      : activeStyle
        ? t("styleActive", { style: getTravelStyleLabel(activeStyle, locale) })
        : null;

  function journeysHref(params?: { country?: string; style?: TravelStyle }) {
    const q = new URLSearchParams();
    if (params?.country) q.set("country", params.country);
    if (params?.style) q.set("style", params.style);
    const query = q.toString();
    return query ? `/journeys?${query}` : "/journeys";
  }

  function monthLabel(ym: string) {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, (m || 1) - 1, 1);
    return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }

  return (
    <section className="pb-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-4 rounded-2xl border border-silk-gold/20 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-silk-indigo">
              <SlidersHorizontal className="size-4 text-silk-gold" />
              {t("filterTitle")}
            </div>
            <p className="text-xs text-apple-muted">
              {t("results", { count: filtered.length })}
            </p>
          </div>

          <p className="mt-2 text-[11px] text-apple-muted">{t("silkRoadNote")}</p>

          {filterLabel && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-silk-turquoise/15 px-3 py-1 text-xs font-bold text-silk-turquoise">
                {filterLabel}
                <Link
                  href="/journeys"
                  className="rounded-full p-0.5 transition hover:bg-silk-turquoise/20"
                  aria-label={t("clearFilter")}
                >
                  <X className="size-3" />
                </Link>
              </span>
            </div>
          )}

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByCountry")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVE_COUNTRY_FILTERS.map((slug) => {
                const active = activeCountry === slug;
                return (
                  <Link
                    key={slug}
                    href={
                      active
                        ? journeysHref({ style: activeStyle ?? undefined })
                        : journeysHref({ country: slug, style: activeStyle ?? undefined })
                    }
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-silk-indigo text-silk-gold"
                        : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                    }`}
                  >
                    {getCountryLabel(slug, locale)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByMonth")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setMonth("all")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  month === "all"
                    ? "bg-silk-indigo text-silk-gold"
                    : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                }`}
              >
                {t("monthAll")}
              </button>
              {availableMonths.map((ym) => (
                <button
                  key={ym}
                  type="button"
                  onClick={() => setMonth(ym)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    month === ym
                      ? "bg-silk-indigo text-silk-gold"
                      : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                  }`}
                >
                  {monthLabel(ym)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByDuration")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    duration === d
                      ? "bg-silk-indigo text-silk-gold"
                      : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                  }`}
                >
                  {t(`duration.${d}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByStyle")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TRAVEL_STYLES.map((style) => {
                const active = activeStyle === style;
                return (
                  <Link
                    key={style}
                    href={journeysHref({
                      country: activeCountry ?? undefined,
                      style: active ? undefined : style,
                    })}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-silk-indigo text-silk-gold"
                        : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                    }`}
                  >
                    {getTravelStyleLabel(style, locale)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByDifficulty")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    difficulty === d
                      ? "bg-silk-indigo text-silk-gold"
                      : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                  }`}
                >
                  {d === "all" ? t("difficulty.all") : toursT(`difficulty.${d}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-apple-muted">{t("sort")}:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-8 rounded-lg border border-silk-gold/25 bg-silk-cream px-2 text-xs font-medium text-silk-indigo"
            >
              <option value="recommended">{t("sortOptions.recommended")}</option>
              <option value="price-asc">{t("sortOptions.priceAsc")}</option>
              <option value="price-desc">{t("sortOptions.priceDesc")}</option>
              <option value="duration">{t("sortOptions.duration")}</option>
              <option value="departure">{t("sortOptions.departure")}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-silk-gold/30 bg-silk-cream/50 px-6 py-12 text-center">
            <p className="text-sm text-apple-muted">{t("empty")}</p>
            {(activeCountry || activeRegion || activeStyle || month !== "all" || duration !== "all") && (
              <Link
                href="/journeys"
                className="mt-4 inline-block text-sm font-semibold text-silk-gold hover:underline"
                onClick={() => {
                  setMonth("all");
                  setDuration("all");
                  setDifficulty("all");
                }}
              >
                {t("clearFilter")}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ tour, content }, i) => (
              <TourCard key={tour.id} tour={tour} content={content} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
