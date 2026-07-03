import type { CmsLocale, CmsTour, TourContent } from "./types";
import { resolveTourContent } from "./tour-content";
import { createEmptyTour } from "./defaults";
import { readCmsJson, writeCmsJson, cmsNow, newId, slugify } from "./storage";

export { createEmptyTour } from "./defaults";
import { seedTours } from "./seed";
import { syncTourCountries, type CountrySlug } from "@/lib/countries";
import { isTravelStyle } from "@/lib/travel-styles";

const FILE = "tours.json";

function mergeLocaleContent(
  existing: TourContent,
  input?: Partial<TourContent>
): TourContent {
  return {
    title: input?.title ?? existing.title,
    desc: input?.desc ?? existing.desc,
    overview: input?.overview ?? existing.overview,
    highlights: input?.highlights ?? existing.highlights,
    itinerary: input?.itinerary ?? existing.itinerary,
    included: input?.included ?? existing.included,
    excluded: input?.excluded ?? existing.excluded,
    gallery: input?.gallery ?? existing.gallery,
    faq: input?.faq ?? existing.faq,
  };
}

function normalizeTours(tours: CmsTour[]): CmsTour[] {
  return tours.map(syncTourCountries);
}

export async function getAllTours(): Promise<CmsTour[]> {
  const tours = await readCmsJson<CmsTour[]>(FILE, seedTours);
  return normalizeTours(tours);
}

export async function getPublishedTours(): Promise<CmsTour[]> {
  const tours = await getAllTours();
  return tours.filter((t) => t.published);
}

export async function getTourBySlug(slug: string): Promise<CmsTour | undefined> {
  const tours = await getAllTours();
  return tours.find((t) => t.slug === slug);
}

export async function getPublishedTourBySlug(slug: string): Promise<CmsTour | undefined> {
  const tour = await getTourBySlug(slug);
  return tour?.published ? tour : undefined;
}

export async function getBestseller(): Promise<CmsTour> {
  const tours = await getPublishedTours();
  return tours.find((t) => t.bestseller) ?? tours[0] ?? seedTours[0];
}

export function getTourContent(tour: CmsTour, locale: string): TourContent {
  return resolveTourContent(tour, locale);
}

export async function getTourById(id: string): Promise<CmsTour | undefined> {
  const tours = await getAllTours();
  return tours.find((t) => t.id === id);
}

export async function saveTour(tour: CmsTour): Promise<CmsTour> {
  const tours = await getAllTours();
  const index = tours.findIndex((t) => t.id === tour.id);
  const next = { ...tour, updatedAt: cmsNow() };
  if (index >= 0) {
    tours[index] = next;
  } else {
    tours.push(next);
  }
  if (next.bestseller) {
    for (const item of tours) {
      if (item.id !== next.id) item.bestseller = false;
    }
  }
  await writeCmsJson(FILE, tours);
  return next;
}

export async function deleteTour(id: string): Promise<boolean> {
  const tours = await getAllTours();
  const filtered = tours.filter((t) => t.id !== id);
  if (filtered.length === tours.length) return false;
  await writeCmsJson(FILE, filtered);
  return true;
}

export function normalizeTourInput(input: Partial<CmsTour> & { id?: string }): CmsTour {
  const base = input.id ? undefined : createEmptyTour(cmsNow());
  const existing = base ?? createEmptyTour(cmsNow());
  const slug = slugify(input.slug || input.content?.en?.title || existing.slug || "new-tour");
  return syncTourCountries({
    ...existing,
    ...input,
    id: input.id ?? existing.id,
    slug,
    countrySlugs: Array.isArray(input.countrySlugs)
      ? (input.countrySlugs as CountrySlug[])
      : existing.countrySlugs ?? [],
    travelStyle:
      input.travelStyle && isTravelStyle(input.travelStyle)
        ? input.travelStyle
        : existing.travelStyle ?? "culture",
    content: {
      en: mergeLocaleContent(existing.content.en, input.content?.en),
      ru: mergeLocaleContent(existing.content.ru, input.content?.ru),
    },
    updatedAt: cmsNow(),
    createdAt: input.createdAt ?? existing.createdAt,
  });
}