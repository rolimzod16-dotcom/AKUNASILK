"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import type { Tour, TourContent } from "@/lib/data/tours";

type CatalogItem = { tour: Tour; content: TourContent };

type JourneyCatalogProps = {
  items: CatalogItem[];
};

type DifficultyFilter = "all" | Tour["difficulty"];
type SortKey = "recommended" | "price-asc" | "price-desc" | "duration" | "departure";

const regionMatchers: Record<string, (tour: Tour) => boolean> = {
  uzbekistan: (tour) => tour.countries.some((c) => c.toLowerCase().includes("uzbekistan")),
  central: (tour) =>
    tour.countries.some((c) =>
      ["uzbekistan", "turkmenistan", "kyrgyzstan", "kazakhstan"].some((r) =>
        c.toLowerCase().includes(r)
      )
    ),
  pamir: (tour) => tour.countries.some((c) => c.toLowerCase().includes("tajikistan")),
  china: (tour) => tour.countries.some((c) => c.toLowerCase().includes("china")),
  caucasus: (tour) =>
    tour.countries.some((c) =>
      ["georgia", "azerbaijan"].some((r) => c.toLowerCase().includes(r))
    ),
};

export default function JourneyCatalog({ items }: JourneyCatalogProps) {
  const t = useTranslations("traveler.catalog");
  const toursT = useTranslations("tours");
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");

  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    let list = [...items];

    if (regionParam && regionMatchers[regionParam]) {
      list = list.filter(({ tour }) => regionMatchers[regionParam](tour));
    }

    if (difficulty !== "all") {
      list = list.filter(({ tour }) => tour.difficulty === difficulty);
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
  }, [items, difficulty, sort, regionParam]);

  const difficulties: DifficultyFilter[] = ["all", "easy", "moderate", "adventurous"];

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-8 rounded-2xl border border-silk-gold/20 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-silk-indigo">
              <SlidersHorizontal className="size-4 text-silk-gold" />
              {t("filterTitle")}
            </div>
            <p className="text-xs text-apple-muted">
              {t("results", { count: filtered.length })}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
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
            {regionParam && (
              <span className="rounded-full bg-silk-turquoise/15 px-2 py-1 text-[10px] font-bold uppercase text-silk-turquoise">
                {t("regionActive")}
              </span>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-silk-gold/30 bg-silk-cream/50 px-6 py-12 text-center text-sm text-apple-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ tour, content }, i) => (
              <TourCard key={tour.id} tour={tour} content={content} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}