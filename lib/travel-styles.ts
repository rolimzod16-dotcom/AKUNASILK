import type { CmsTour } from "@/lib/cms/types";

export const TRAVEL_STYLES = [
  "overland",
  "trekking",
  "motorcycle",
  "culture",
  "horseRiding",
  "photo",
] as const;

export type TravelStyle = (typeof TRAVEL_STYLES)[number];

export function isTravelStyle(value: string): value is TravelStyle {
  return (TRAVEL_STYLES as readonly string[]).includes(value);
}

export function tourMatchesStyle(tour: CmsTour, style: TravelStyle): boolean {
  return tour.travelStyle === style;
}

export const TRAVEL_STYLE_LABELS: Record<TravelStyle, { en: string; ru: string }> = {
  overland: { en: "Overland and 4x4", ru: "Оверленд и 4x4" },
  trekking: { en: "Trekking", ru: "Треккинг" },
  motorcycle: { en: "Motorcycle", ru: "Мотопутешествия" },
  culture: { en: "Culture and Cities", ru: "Культура и города" },
  horseRiding: { en: "Horse Riding", ru: "Верховая езда" },
  photo: { en: "Photography", ru: "Фото-путешествия" },
};

export const TRAVEL_STYLE_PAGES = [
  { slug: "overland-4x4", key: "overland" as const },
  { slug: "trekking", key: "trekking" as const },
  { slug: "motorcycle", key: "motorcycle" as const },
  { slug: "culture-cities", key: "culture" as const },
  { slug: "horse-riding", key: "horseRiding" as const },
  { slug: "photography", key: "photo" as const },
] as const;

export type TravelStylePageSlug = (typeof TRAVEL_STYLE_PAGES)[number]["slug"];

export function styleFromPageSlug(slug: string): TravelStyle | null {
  const found = TRAVEL_STYLE_PAGES.find((item) => item.slug === slug);
  return found ? found.key : null;
}

export function pageSlugFromStyle(style: TravelStyle): TravelStylePageSlug {
  const found = TRAVEL_STYLE_PAGES.find((item) => item.key === style);
  return found ? found.slug : "overland-4x4";
}

export function getTravelStyleLabel(style: TravelStyle, locale = "en"): string {
  const loc = locale === "ru" ? "ru" : "en";
  return TRAVEL_STYLE_LABELS[style][loc];
}