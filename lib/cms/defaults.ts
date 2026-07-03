import type { CmsTour } from "./types";

export const DEFAULT_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80";

export function createEmptyTour(now = new Date().toISOString()): CmsTour {
  return {
    id: `tour-${Date.now().toString(36)}`,
    slug: "",
    published: false,
    image: DEFAULT_TOUR_IMAGE,
    duration: 7,
    price: 1990,
    countrySlugs: [],
    countries: [],
    difficulty: "easy",
    travelStyle: "culture",
    featured: false,
    spotsLeft: 8,
    maxGroupSize: 12,
    nextDeparture: now.slice(0, 10),
    rating: 4.8,
    reviews: 0,
    content: {
      en: {
        title: "",
        desc: "",
        overview: "",
        highlights: [],
        itinerary: [],
        included: [],
        excluded: [],
        gallery: [],
        faq: [],
      },
      ru: {
        title: "",
        desc: "",
        overview: "",
        highlights: [],
        itinerary: [],
        included: [],
        excluded: [],
        gallery: [],
        faq: [],
      },
    },
    createdAt: now,
    updatedAt: now,
  };
}