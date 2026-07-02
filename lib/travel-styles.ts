import type { CmsTour } from "@/lib/cms/types";

export const TRAVEL_STYLES = [
  "overland",
  "horseRiding",
  "trekking",
  "culture",
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
  overland: { en: "Overland & 4x4", ru: "Оверленд и 4x4" },
  horseRiding: { en: "Horse Riding", ru: "Верховая езда" },
  trekking: { en: "Trekking", ru: "Треккинг" },
  culture: { en: "Culture & Cities", ru: "Культура и города" },
  photo: { en: "Photo Journey", ru: "Фото-путешествие" },
};

export function getTravelStyleLabel(style: TravelStyle, locale = "en"): string {
  const loc = locale === "ru" ? "ru" : "en";
  return TRAVEL_STYLE_LABELS[style][loc];
}