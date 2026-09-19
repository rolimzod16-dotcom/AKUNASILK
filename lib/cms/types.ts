import type { CountrySlug } from "@/lib/countries";
import type { TravelStyle } from "@/lib/travel-styles";

export type CmsLocale = "en" | "ru";
export type CmsStatus = "draft" | "review" | "published" | "archived";

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
  status?: CmsStatus;
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
  /** When true and Settings allow prices, USD price is shown on the public site. */
  showPrice?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  startLocation?: string;
  finishLocation?: string;
  content: Record<CmsLocale, TourContent>;
  createdAt: string;
  updatedAt: string;
};

export type CmsReview = {
  id: string;
  published: boolean;
  consentRecorded: boolean;
  guestName: string;
  country: string;
  year: string;
  tourSlug?: string;
  tourTitle?: string;
  text: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type DestinationContent = {
  name: string;
  line: string;
  intro: string;
  why: string;
  season: string;
  practical: string;
  visa: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type CmsDestination = {
  id: string;
  slug: string;
  published: boolean;
  image: string;
  wide?: boolean;
  showOnHome: boolean;
  homeOrder: number;
  bestTime: string;
  content: Record<CmsLocale, DestinationContent>;
  createdAt: string;
  updatedAt: string;
};

export type CmsSiteContact = {
  legalName: string;
  address: string;
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsapp: string;
  hours: string;
  emergencyNote: string;
};

export type CmsSiteSettings = {
  showPrices: boolean;
  showReviews: boolean;
  showPartners: boolean;
  contact: CmsSiteContact;
  tagline: string;
  whatsappGreeting: string;
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