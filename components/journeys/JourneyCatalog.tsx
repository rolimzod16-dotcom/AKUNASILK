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
} from "@/lib/travel-styles";
import {
  SEASONS,
  isSeasonId,
  seasonById,
  tourMatchesMonth,
  tourMatchesSeason,
  type SeasonId,
} from "@/lib/tours/departure-months";

const FALLBACK_COUNTRIES: CountrySlug[] = [
  "tajikistan",
  "uzbekistan",
  "kyrgyzstan",
  "kazakhstan",
];

type CatalogItem = { tour: Tour; content: TourContent; showPrice?: boolean };

type JourneyCatalogProps = {
  items: CatalogItem[];
  countries?: string[];
};

type DifficultyFilter = "all" | Tour["difficulty"];
type DurationFilter = "all" | "short" | "medium" | "long";
type SortKey = "recommended" | "price-asc" | "price-desc" | "duration" | "departure";

function matchesDuration(days: number, filter: DurationFilter) {
  if (filter === "all") return true;
  if (filter === "short") return days <= 7;
  if (filter === "medium") return days >= 8 && days <= 12;
  return days >= 13;
}

function isDurationFilter(value: string | null): value is Exclude<DurationFilter, "all"> {
  return value === "short" || value === "medium" || value === "long";
}

function selectedMonthNumber(filter: string): number | null {
  if (!filter || filter === "all") return null;
  if (/^\d{4}-\d{2}/.test(filter)) {
    const month = Number(filter.slice(5, 7));
    return month >= 1 && month <= 12 ? month : null;
  }
  const month = Number(filter);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

export default function JourneyCatalog({ items, countries }: JourneyCatalogProps) {
  const countryFilters = (countries?.length ? countries : FALLBACK_COUNTRIES) as string[];
  const t = useTranslations("traveler.catalog");
  const toursT = useTranslations("tours");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const regionParam = searchParams.get("region");
  const styleParam = searchParams.get("style");
  const durationParam = searchParams.get("duration");
  const monthParam = searchParams.get("month");
  const seasonParam = searchParams.get("season");

  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const duration: DurationFilter = isDurationFilter(durationParam) ? durationParam : "all";
  const month = monthParam || "all";
  const season: SeasonId | null = isSeasonId(seasonParam) ? seasonParam : null;
  const [sort, setSort] = useState<SortKey>("recommended");

  const activeCountry = countryParam || null;
  const activeRegion =
    !activeCountry && regionParam && isRegionSlug(regionParam) ? regionParam : null;
  const activeStyle = styleParam && isTravelStyle(styleParam) ? styleParam : null;

  const filtered = useMemo(() => {
    let list = [...items];

    if (activeCountry === "central-asia") {
      list = list.filter(({ tour }) => (tour.countrySlugs?.length ?? 0) > 1);
    } else if (activeCountry) {
      list = list.filter(({ tour }) =>
        isCountrySlug(activeCountry)
          ? tourMatchesCountry(tour, activeCountry)
          : (tour.countrySlugs as string[] | undefined)?.includes(activeCountry)
      );
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
      list = list.filter(({ tour }) => tourMatchesMonth(tour, month));
    } else if (season) {
      list = list.filter(({ tour }) => tourMatchesSeason(tour, season));
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
  }, [items, difficulty, duration, month, season, sort, activeCountry, activeRegion, activeStyle]);

  const difficulties: DifficultyFilter[] = ["all", "easy", "moderate", "adventurous"];
  const durations: DurationFilter[] = ["all", "short", "medium", "long"];

  const filterLabel = activeCountry
    ? t("countryActive", {
        country: isCountrySlug(activeCountry)
          ? getCountryLabel(activeCountry, locale)
          : activeCountry,
      })
    : activeRegion
      ? t("regionActiveLabel", { region: t(`regions.${activeRegion}`) })
      : activeStyle
        ? t("styleActive", { style: getTravelStyleLabel(activeStyle, locale) })
        : null;

  function filterHref(
    patch: Partial<
      Record<"country" | "style" | "month" | "season" | "duration", string | null>
    >,
  ) {
    const q = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      if (value === null || value === "" || value === "all") q.delete(key);
      else q.set(key, value);
    }
    const query = q.toString();
    return query ? `/journeys?${query}` : "/journeys";
  }

  const monthLabels = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, index, 1)),
  );
  const pickedMonth = selectedMonthNumber(month);
  const seasonMonths: number[] = season ? [...seasonById(season).months] : [];

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
              {[...countryFilters, "central-asia"].map((slug) => {
                const active = activeCountry === slug;
                return (
                  <Link
                    key={slug}
                    href={active ? filterHref({ country: null }) : filterHref({ country: slug })}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-silk-indigo text-silk-gold"
                        : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                    }`}
                  >
                    {slug === "central-asia"
                      ? "Multi-country"
                      : isCountrySlug(slug)
                        ? getCountryLabel(slug, locale)
                        : slug}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {locale === "ru" ? "Сезон" : "Season"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SEASONS.map((item) => {
                const active = season === item.id && !pickedMonth;
                return (
                  <Link
                    key={item.id}
                    href={filterHref({
                      season: active ? null : item.id,
                      month: null,
                    })}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-silk-indigo text-silk-gold"
                        : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                    }`}
                  >
                    {locale === "ru" ? item.ru : item.en}
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
              <Link
                href={filterHref({ month: null, season: null })}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  !pickedMonth && !season
                    ? "bg-silk-indigo text-silk-gold"
                    : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                }`}
              >
                {t("monthAll")}
              </Link>
              {monthLabels.map((label, index) => {
                const value = index + 1;
                const active = pickedMonth === value || (!pickedMonth && seasonMonths.includes(value));
                return (
                  <Link
                    key={value}
                    href={filterHref({ month: String(value), season: null })}
                    aria-current={pickedMonth === value ? "true" : undefined}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? "bg-silk-indigo text-silk-gold"
                        : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              {t("filterByDuration")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {durations.map((d) => (
                <Link
                  key={d}
                  href={filterHref({ duration: d === "all" ? null : d })}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    duration === d
                      ? "bg-silk-indigo text-silk-gold"
                      : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                  }`}
                >
                  {t(`duration.${d}`)}
                </Link>
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
                    href={active ? filterHref({ style: null }) : filterHref({ style })}
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
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/journeys"
                className="text-sm font-semibold text-silk-gold hover:underline"
                onClick={() => setDifficulty("all")}
              >
                {t("clearFilter")}
              </Link>
              <Link href="/plan-my-journey" className="text-sm font-semibold text-silk-indigo hover:underline">
                Ask us to design a private trip
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ tour, content, showPrice }, i) => (
              <TourCard key={tour.id} tour={tour} content={content} index={i} showPrice={showPrice} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
