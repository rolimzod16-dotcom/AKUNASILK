"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COUNTRY_SLUGS,
  getCorridorLabel,
  SILK_ROAD_CORRIDORS,
  type CountrySlug,
  type SilkRoadCorridor,
} from "@/lib/countries";

export type DestinationItem = {
  slug: CountrySlug;
  corridor: SilkRoadCorridor;
  image: string;
};

type DestinationsCatalogProps = {
  items: DestinationItem[];
};

export default function DestinationsCatalog({ items }: DestinationsCatalogProps) {
  const t = useTranslations("destinations");
  const locale = useLocale();
  const [corridor, setCorridor] = useState<SilkRoadCorridor | "all">("all");

  const filtered = useMemo(
    () => (corridor === "all" ? items : items.filter((item) => item.corridor === corridor)),
    [items, corridor]
  );

  return (
    <section className="border-t border-silk-gold/15 bg-silk-cream pb-12 pt-6 sm:pb-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-apple-muted">
            <MapPin className="size-3.5 text-silk-turquoise" />
            {t("stats", { countries: COUNTRY_SLUGS.length, corridors: SILK_ROAD_CORRIDORS.length })}
          </p>
          <p className="text-xs text-apple-muted">
            {t("results", { count: filtered.length })}
          </p>
        </div>

        <div className="sticky top-[60px] z-30 -mx-4 border-b border-silk-gold/20 bg-silk-cream/95 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setCorridor("all")}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                corridor === "all"
                  ? "bg-silk-indigo text-silk-gold"
                  : "bg-white text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
              )}
            >
              {t("filterAll")}
            </button>
            {SILK_ROAD_CORRIDORS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCorridor(key)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  corridor === key
                    ? "bg-silk-indigo text-silk-gold"
                    : "bg-white text-silk-indigo ring-1 ring-silk-gold/25 hover:ring-silk-gold/50"
                )}
              >
                {getCorridorLabel(key, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(({ slug, corridor: itemCorridor, image }) => (
            <Link
              key={slug}
              href={`/destinations/${slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-silk-gold/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-silk-gold/45 hover:shadow-lg hover:shadow-silk-gold/15"
            >
              <div className="relative aspect-[5/3] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`${slug}.name`)}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/80 via-silk-indigo/10 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-silk-indigo/75 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-silk-gold backdrop-blur-sm">
                  {getCorridorLabel(itemCorridor, locale)}
                </span>
                <h3 className="absolute bottom-2.5 left-2.5 right-2 silk-headline text-base leading-tight text-white sm:text-lg">
                  {t(`${slug}.name`)}
                </h3>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 flex-1 text-[11px] leading-snug text-apple-muted sm:text-xs">
                  {t(`${slug}.desc`)}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-silk-gold transition group-hover:gap-1.5">
                  {t("bookCta")}
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}