import type { CmsLocale, CmsTour, TourContent } from "./types";
import { readCmsJson, writeCmsJson, cmsNow, newId, slugify } from "./storage";
import { seedTours } from "./seed";
import { syncTourCountries, type CountrySlug } from "@/lib/countries";
import { isTravelStyle } from "@/lib/travel-styles";

const FILE = "tours.json";

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
  const loc = (locale === "ru" ? "ru" : "en") as CmsLocale;
  return tour.content[loc] ?? tour.content.en;
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

export function createEmptyTour(): CmsTour {
  const now = cmsNow();
  return {
    id: newId("tour"),
    slug: "",
    published: false,
    image: "",
    duration: 7,
    price: 1990,
    countrySlugs: [],
    countries: [],
    difficulty: "easy",
    travelStyle: "culture",
    featured: false,
    spotsLeft: 8,
    nextDeparture: new Date().toISOString().slice(0, 10),
    rating: 4.8,
    reviews: 0,
    content: {
      en: { title: "", desc: "", highlights: [] },
      ru: { title: "", desc: "", highlights: [] },
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeTourInput(input: Partial<CmsTour> & { id?: string }): CmsTour {
  const base = input.id ? undefined : createEmptyTour();
  const existing = base ?? createEmptyTour();
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
      en: {
        title: input.content?.en?.title ?? existing.content.en.title,
        desc: input.content?.en?.desc ?? existing.content.en.desc,
        highlights: input.content?.en?.highlights ?? existing.content.en.highlights,
      },
      ru: {
        title: input.content?.ru?.title ?? existing.content.ru.title,
        desc: input.content?.ru?.desc ?? existing.content.ru.desc,
        highlights: input.content?.ru?.highlights ?? existing.content.ru.highlights,
      },
    },
    updatedAt: cmsNow(),
    createdAt: input.createdAt ?? existing.createdAt,
  });
}