/** Public product policy from GST TZ. Visual system stays navy / cream / gold. */

export const SHOW_PRICES = false;
export const SHOW_REVIEWS = false;
export const SHOW_LANGUAGE_SWITCHER = false;
export const PRICE_FALLBACK = "Request a quote";
export const PRIVATE_DEPARTURE_LABEL = "Private departure on request";

export const CONTACT = {
  brand: "GREAT SILK TRAILS",
  brandCompact: "GREATSILKTRAILS",
  legalName: "Great Silk Trails",
  email: "hello@greatsilktrails.com",
  phoneDisplay: "+998 71 200 45 67",
  phoneTel: "+998712004567",
  whatsapp: "998712004567",
  hours: "Mon–Sat, 9:00–19:00 (GMT+5)",
} as const;

const WHATSAPP_GREETING =
  "Hello, I would like to ask about a Silk Road journey with Great Silk Trails.";

export function whatsappUrl(text = WHATSAPP_GREETING): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const PUBLIC_COUNTRY_SLUGS = [
  "tajikistan",
  "uzbekistan",
  "kyrgyzstan",
  "kazakhstan",
] as const;

export type PublicCountrySlug = (typeof PUBLIC_COUNTRY_SLUGS)[number];

export const HOME_DESTINATIONS = [
  {
    slug: "tajikistan",
    name: "Tajikistan",
    line: "Pamirs, Wakhan and the Fann Mountains",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  },
  {
    slug: "uzbekistan",
    name: "Uzbekistan",
    line: "Silk Road cities and living craft traditions",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
  },
  {
    slug: "kyrgyzstan",
    name: "Kyrgyzstan",
    line: "Mountain roads, nomad culture and highland lakes",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  },
  {
    slug: "kazakhstan",
    name: "Kazakhstan",
    line: "Steppe landscapes, canyons and modern cities",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a8fe05?w=1200&q=80",
  },
] as const;

export const CENTRAL_ASIA = {
  slug: "central-asia",
  name: "Central Asia",
  line: "One journey across several Silk Road countries",
  image: "https://images.unsplash.com/photo-1501785880828-f9571f0630af?w=1600&q=80",
} as const;

export const FEATURED_JOURNEY_SLUGS = [
  "pamir-silk-trail-tajikistan-flagship",
  "golden-cities-silk-trail-uzbekistan",
  "nomads-mountains-silk-trail-kyrgyzstan",
] as const;

export const SERVICE_PAGES = [
  "transport-rental",
  "drivers-guides",
  "visa-support",
  "permits-gbao",
  "accommodation",
  "tailor-made",
] as const;

export const HOME_SERVICE_SLUGS = [
  "transport-rental",
  "drivers-guides",
  "visa-support",
  "permits-gbao",
  "tailor-made",
] as const;

export function isFutureIsoDate(value?: string | null): boolean {
  if (!value || value.length < 10) return false;
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
}

export function publicPriceLabel(): string {
  return PRICE_FALLBACK;
}

export function planJourneyHref(opts?: {
  tour?: string;
  date?: string;
  source?: string;
  service?: string;
  style?: string;
  destination?: string;
}): string {
  const q = new URLSearchParams();
  if (opts?.tour && opts.tour !== "any") q.set("tour", opts.tour);
  if (opts?.date) q.set("date", opts.date);
  if (opts?.source) q.set("source", opts.source);
  if (opts?.service) q.set("service", opts.service);
  if (opts?.style) q.set("style", opts.style);
  if (opts?.destination) q.set("destination", opts.destination);
  const query = q.toString();
  return query ? `/plan-my-journey?${query}` : "/plan-my-journey";
}
