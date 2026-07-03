import type { CountrySlug } from "@/lib/countries";
import type { TravelStyle } from "@/lib/travel-styles";

export type CmsLocale = "en" | "ru";

export type TourItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type TourFaqItem = {
  question: string;
  answer: string;
};

export type TourContent = {
  title: string;
  desc: string;
  /** Long-form “About the trip” copy */
  overview?: string;
  highlights: string[];
  itinerary?: TourItineraryDay[];
  included?: string[];
  excluded?: string[];
  gallery?: string[];
  faq?: TourFaqItem[];
};

export type CmsTour = {
  id: string;
  slug: string;
  published: boolean;
  image: string;
  duration: number;
  price: number;
  originalPrice?: number;
  /** Canonical slugs for filtering — source of truth in admin */
  countrySlugs: CountrySlug[];
  /** English display labels — kept in sync with countrySlugs */
  countries: string[];
  difficulty: "easy" | "moderate" | "adventurous";
  /** Primary travel style — powers style filters and travel-styles page */
  travelStyle: TravelStyle;
  featured: boolean;
  bestseller?: boolean;
  spotsLeft?: number;
  maxGroupSize?: number;
  nextDeparture: string;
  rating: number;
  reviews: number;
  content: Record<CmsLocale, TourContent>;
  createdAt: string;
  updatedAt: string;
};

export type StoryContent = {
  title: string;
  excerpt: string;
  body: string[];
};

export type CmsStory = {
  id: string;
  slug: string;
  published: boolean;
  image: string;
  date: string;
  readTime: number;
  content: Record<CmsLocale, StoryContent>;
  createdAt: string;
  updatedAt: string;
};

export type PartnerCategory = "hotel" | "dmc" | "transport" | "cultural" | "hospitality";

export type PartnerContent = {
  name: string;
  desc: string;
};

export type CmsPartner = {
  id: string;
  slug: string;
  published: boolean;
  category: PartnerCategory;
  country: string;
  initials: string;
  featured: boolean;
  website?: string;
  content: Record<CmsLocale, PartnerContent>;
  createdAt: string;
  updatedAt: string;
};