import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCountryLabel, type CountrySlug } from "@/lib/countries";
import { cn } from "@/lib/utils";
import {
  COUNTRY_LABELS_POS,
  COUNTRY_PATHS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ROUTE_FERGANA,
  ROUTE_MAIN,
  ROUTE_PAMIR,
  SILK_CITIES,
  type SilkCityId,
} from "@/components/home/silk-road-geometry";

const LABEL_CLASS = {
  top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
} as const;

function routePath(ids: SilkCityId[]) {
  const byId = new Map(SILK_CITIES.map((city) => [city.id, city]));
  return ids
    .map((id, index) => {
      const city = byId.get(id);
      if (!city) return "";
      return `${index === 0 ? "M" : "L"} ${city.x} ${city.y}`;
    })
    .join(" ");
}

export default async function SilkRoadCitiesMap({ locale }: { locale: string }) {
  const t = await getTranslations("home.map");

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-silk-gold/25 bg-[#d7e6ee]">
      <div className="flex flex-col gap-1 border-b border-silk-gold/15 bg-[#faf6ee] px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <h3 className="silk-headline text-2xl text-silk-indigo sm:text-3xl">{t("title")}</h3>
        <p className="max-w-md text-sm text-apple-muted">{t("hint")}</p>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={t("title")}
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#d7e6ee" />
          <path d={COUNTRY_PATHS.kazakhstan} fill="#f3e6c4" stroke="#c4a574" strokeWidth="1.2" />
          <path d={COUNTRY_PATHS.uzbekistan} fill="#f8f1df" stroke="#c4a574" strokeWidth="1.2" />
          <path d={COUNTRY_PATHS.kyrgyzstan} fill="#efe0c0" stroke="#c4a574" strokeWidth="1.2" />
          <path d={COUNTRY_PATHS.tajikistan} fill="#e7d2ab" stroke="#c4a574" strokeWidth="1.2" />
          <path
            d={routePath(ROUTE_MAIN)}
            fill="none"
            stroke="#d4a82a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={routePath(ROUTE_PAMIR)}
            fill="none"
            stroke="#c45c38"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={routePath(ROUTE_FERGANA)}
            fill="none"
            stroke="#c45c38"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {COUNTRY_LABELS_POS.map((item) => (
            <text
              key={item.country}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              fill="#8a7560"
              style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.14em" }}
            >
              {getCountryLabel(item.country, locale).toUpperCase()}
            </text>
          ))}
        </svg>

        {SILK_CITIES.map((city) => {
          const name = t(`cities.${city.id}`);
          const country = getCountryLabel(city.country as CountrySlug, locale);
          return (
            <Link
              key={city.id}
              href={`/journeys?country=${city.country}`}
              aria-label={t("open", { city: name, country })}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(city.x / MAP_WIDTH) * 100}%`,
                top: `${(city.y / MAP_HEIGHT) * 100}%`,
              }}
            >
              <span className="relative block size-3.5">
                <span className="absolute -inset-2 rounded-full bg-silk-gold/50 blur-[1px] transition group-hover:bg-silk-gold" />
                <span className="absolute inset-0 rounded-full border-2 border-white bg-[#ffe56a] shadow-[0_0_10px_2px_rgba(255,214,60,0.95)] transition group-hover:scale-125" />
              </span>
              <span
                className={cn(
                  "pointer-events-none absolute whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-silk-indigo shadow-sm sm:text-[11px]",
                  LABEL_CLASS[city.label],
                )}
              >
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
