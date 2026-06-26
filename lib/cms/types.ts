export type CmsLocale = "en" | "ru";

export type TourContent = {
  title: string;
  desc: string;
  highlights: string[];
};

export type CmsTour = {
  id: string;
  slug: string;
  published: boolean;
  image: string;
  duration: number;
  price: number;
  originalPrice?: number;
  countries: string[];
  difficulty: "easy" | "moderate" | "adventurous";
  featured: boolean;
  bestseller?: boolean;
  spotsLeft?: number;
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