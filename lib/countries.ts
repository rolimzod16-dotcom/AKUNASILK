import type { CmsTour } from "@/lib/cms/types";

/**
 * Modern countries whose territory lay on historic overland Silk Road corridors
 * (UNESCO Chang'an–Tianshan, Zarafshan–Karakum, Karakoram, Persia, Caucasus, Anatolia).
 * Cities are intentionally omitted — those belong in tour copy.
 */
export const SILK_ROAD_CORRIDORS = [
  "east",
  "tianshan",
  "transoxiana",
  "pamir",
  "persia",
  "southAsia",
  "caucasus",
  "anatolia",
] as const;

export type SilkRoadCorridor = (typeof SILK_ROAD_CORRIDORS)[number];

export const COUNTRY_SLUGS = [
  "china",
  "kazakhstan",
  "kyrgyzstan",
  "uzbekistan",
  "turkmenistan",
  "tajikistan",
  "afghanistan",
  "iran",
  "pakistan",
  "india",
  "georgia",
  "armenia",
  "azerbaijan",
  "turkey",
] as const;

export type CountrySlug = (typeof COUNTRY_SLUGS)[number];

/** Quick-filter regions on homepage / catalog */
export type RegionSlug =
  | "china"
  | "central"
  | "pamir"
  | "persia"
  | "southAsia"
  | "caucasus"
  | "anatolia";

type CountryMeta = {
  corridor: SilkRoadCorridor;
  labels: { en: string; ru: string };
};

export const SILK_ROAD_COUNTRIES: Record<CountrySlug, CountryMeta> = {
  china: {
    corridor: "east",
    labels: { en: "China", ru: "Китай" },
  },
  kazakhstan: {
    corridor: "tianshan",
    labels: { en: "Kazakhstan", ru: "Казахстан" },
  },
  kyrgyzstan: {
    corridor: "tianshan",
    labels: { en: "Kyrgyzstan", ru: "Кыргызстан" },
  },
  uzbekistan: {
    corridor: "transoxiana",
    labels: { en: "Uzbekistan", ru: "Узбекистан" },
  },
  turkmenistan: {
    corridor: "transoxiana",
    labels: { en: "Turkmenistan", ru: "Туркменистан" },
  },
  tajikistan: {
    corridor: "pamir",
    labels: { en: "Tajikistan", ru: "Таджикистан" },
  },
  afghanistan: {
    corridor: "pamir",
    labels: { en: "Afghanistan", ru: "Афганистан" },
  },
  iran: {
    corridor: "persia",
    labels: { en: "Iran", ru: "Иран" },
  },
  pakistan: {
    corridor: "southAsia",
    labels: { en: "Pakistan", ru: "Пакистан" },
  },
  india: {
    corridor: "southAsia",
    labels: { en: "India", ru: "Индия" },
  },
  georgia: {
    corridor: "caucasus",
    labels: { en: "Georgia", ru: "Грузия" },
  },
  armenia: {
    corridor: "caucasus",
    labels: { en: "Armenia", ru: "Армения" },
  },
  azerbaijan: {
    corridor: "caucasus",
    labels: { en: "Azerbaijan", ru: "Азербайджан" },
  },
  turkey: {
    corridor: "anatolia",
    labels: { en: "Turkey", ru: "Турция" },
  },
};

export const COUNTRY_LABELS: Record<CountrySlug, { en: string; ru: string }> =
  Object.fromEntries(
    COUNTRY_SLUGS.map((slug) => [slug, SILK_ROAD_COUNTRIES[slug].labels])
  ) as Record<CountrySlug, { en: string; ru: string }>;

/** All Silk Road countries shown on /destinations */
export const DESTINATION_SLUGS = COUNTRY_SLUGS;

export type DestinationSlug = CountrySlug;

export const CORRIDOR_LABELS: Record<SilkRoadCorridor, { en: string; ru: string }> = {
  east: { en: "Eastern terminus", ru: "Восточный край" },
  tianshan: { en: "Tian Shan corridor", ru: "Коридор Тянь-Шаня" },
  transoxiana: { en: "Transoxiana", ru: "Мавераннахр" },
  pamir: { en: "Pamir & Hindu Kush", ru: "Памир и Гиндукуш" },
  persia: { en: "Persian corridor", ru: "Персидский коридор" },
  southAsia: { en: "South Asia", ru: "Южная Азия" },
  caucasus: { en: "Caucasus", ru: "Кавказ" },
  anatolia: { en: "Anatolia", ru: "Анатолия" },
};

const REGION_COUNTRIES: Record<RegionSlug, CountrySlug[]> = {
  china: ["china"],
  central: ["kazakhstan", "kyrgyzstan", "uzbekistan", "turkmenistan", "tajikistan"],
  pamir: ["tajikistan", "afghanistan"],
  persia: ["iran", "turkmenistan"],
  southAsia: ["afghanistan", "pakistan", "india"],
  caucasus: ["georgia", "armenia", "azerbaijan"],
  anatolia: ["turkey"],
};

const NAME_TO_SLUG: Record<string, CountrySlug> = {
  china: "china",
  kazakhstan: "kazakhstan",
  kyrgyzstan: "kyrgyzstan",
  uzbekistan: "uzbekistan",
  turkmenistan: "turkmenistan",
  tajikistan: "tajikistan",
  afghanistan: "afghanistan",
  iran: "iran",
  pakistan: "pakistan",
  india: "india",
  georgia: "georgia",
  armenia: "armenia",
  azerbaijan: "azerbaijan",
  turkey: "turkey",
  китай: "china",
  казахстан: "kazakhstan",
  кыргызстан: "kyrgyzstan",
  узбекистан: "uzbekistan",
  туркменистан: "turkmenistan",
  таджикистан: "tajikistan",
  афганистан: "afghanistan",
  иран: "iran",
  пакистан: "pakistan",
  индия: "india",
  грузия: "georgia",
  армения: "armenia",
  азербайджан: "azerbaijan",
  турция: "turkey",
};

export function isCountrySlug(value: string): value is CountrySlug {
  return (COUNTRY_SLUGS as readonly string[]).includes(value);
}

export function isRegionSlug(value: string): value is RegionSlug {
  return Object.keys(REGION_COUNTRIES).includes(value);
}

export function getCountriesByCorridor(corridor: SilkRoadCorridor): CountrySlug[] {
  return COUNTRY_SLUGS.filter((slug) => SILK_ROAD_COUNTRIES[slug].corridor === corridor);
}

export function getCorridorLabel(corridor: SilkRoadCorridor, locale = "en"): string {
  const loc = locale === "ru" ? "ru" : "en";
  return CORRIDOR_LABELS[corridor][loc];
}

export function inferSlugsFromCountryNames(names: string[]): CountrySlug[] {
  const slugs = new Set<CountrySlug>();
  for (const name of names) {
    const key = name.trim().toLowerCase();
    const slug = NAME_TO_SLUG[key];
    if (slug) slugs.add(slug);
    else {
      for (const candidate of COUNTRY_SLUGS) {
        if (
          key.includes(candidate) ||
          key.includes(COUNTRY_LABELS[candidate].en.toLowerCase())
        ) {
          slugs.add(candidate);
        }
      }
    }
  }
  return [...slugs].filter(isCountrySlug);
}

export function resolveTourCountrySlugs(tour: CmsTour): CountrySlug[] {
  const raw = tour.countrySlugs?.length
    ? tour.countrySlugs
    : inferSlugsFromCountryNames(tour.countries ?? []);
  return raw.filter(isCountrySlug);
}

export function countrySlugsToLabels(slugs: CountrySlug[], locale = "en"): string[] {
  const loc = locale === "ru" ? "ru" : "en";
  return slugs.map((slug) => COUNTRY_LABELS[slug][loc]);
}

export function syncTourCountries(tour: CmsTour): CmsTour {
  const countrySlugs = resolveTourCountrySlugs(tour);
  return {
    ...tour,
    countrySlugs,
    countries: countrySlugsToLabels(countrySlugs, "en"),
  };
}

export function tourMatchesCountry(tour: CmsTour, country: CountrySlug): boolean {
  return resolveTourCountrySlugs(tour).includes(country);
}

export function tourMatchesRegion(tour: CmsTour, region: RegionSlug): boolean {
  const slugs = resolveTourCountrySlugs(tour);
  const regionSet = REGION_COUNTRIES[region];
  return slugs.some((slug) => regionSet.includes(slug));
}

export function getCountryLabel(slug: CountrySlug, locale = "en"): string {
  const loc = locale === "ru" ? "ru" : "en";
  return COUNTRY_LABELS[slug][loc];
}