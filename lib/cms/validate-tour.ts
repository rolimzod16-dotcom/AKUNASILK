import type { CmsTour } from "./types";

export type TourValidationIssue = {
  field: string;
  message: string;
};

import { DEFAULT_TOUR_IMAGE } from "./defaults";

export function applyTourDefaults(form: CmsTour): CmsTour {
  return {
    ...form,
    image: form.image?.trim() || DEFAULT_TOUR_IMAGE,
    slug: form.slug?.trim() || slugFromTitle(form.content.en.title) || "new-tour",
    price: Number.isFinite(form.price) && form.price > 0 ? form.price : 1990,
    duration: Number.isFinite(form.duration) && form.duration > 0 ? form.duration : 7,
    maxGroupSize: form.maxGroupSize && form.maxGroupSize > 0 ? form.maxGroupSize : 12,
    rating: Number.isFinite(form.rating) ? form.rating : 4.8,
    reviews: Number.isFinite(form.reviews) ? form.reviews : 0,
    nextDeparture:
      form.nextDeparture || new Date().toISOString().slice(0, 10),
  };
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function validateTour(form: CmsTour): TourValidationIssue[] {
  const issues: TourValidationIssue[] = [];

  if (!form.content.en.title.trim()) {
    issues.push({ field: "title_en", message: "Укажите название тура на английском" });
  }
  if (!form.content.ru.title.trim()) {
    issues.push({ field: "title_ru", message: "Укажите название тура на русском" });
  }
  if (!form.content.en.desc.trim()) {
    issues.push({ field: "desc_en", message: "Краткое описание (EN) — подзаголовок на странице тура" });
  }
  if (!form.content.ru.desc.trim()) {
    issues.push({ field: "desc_ru", message: "Краткое описание (RU)" });
  }
  if (!form.slug.trim() && !form.content.en.title.trim()) {
    issues.push({ field: "slug", message: "Укажите slug (URL) или название тура" });
  }
  if (!form.duration || form.duration < 1) {
    issues.push({ field: "duration", message: "Длительность — минимум 1 день" });
  }
  if (!form.price || form.price < 1) {
    issues.push({ field: "price", message: "Укажите цену тура" });
  }
  if (!form.countrySlugs?.length) {
    issues.push({ field: "countries", message: "Выберите хотя бы одну страну маршрута" });
  }

  return issues;
}

export function tourCompletionPercent(form: CmsTour): number {
  const checks = [
    !!form.content.en.title.trim(),
    !!form.content.ru.title.trim(),
    !!form.content.en.desc.trim(),
    !!form.content.ru.desc.trim(),
    !!(form.slug.trim() || form.content.en.title.trim()),
    !!form.image?.trim(),
    form.countrySlugs.length > 0,
    form.price > 0,
    form.duration > 0,
    (form.content.en.highlights?.length ?? 0) > 0,
    (form.content.en.itinerary?.length ?? 0) > 0,
    (form.content.en.included?.length ?? 0) > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}