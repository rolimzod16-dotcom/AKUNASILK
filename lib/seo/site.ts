import { routing } from "@/i18n/routing";

/** Canonical production origin — override with NEXT_PUBLIC_SITE_URL on Vercel. */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (fromEnv) {
    const withProto = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
    return withProto.replace(/\/$/, "");
  }

  return "https://greatsilktrails.com";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Locale-prefixed public path (en is default with prefix in next-intl always). */
export function localePath(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function localeAbsoluteUrl(locale: string, path = "/"): string {
  return absoluteUrl(localePath(locale, path));
}

export const SITE_NAME = "GREATSILKTRAILS";
export const LOCALES = routing.locales;
export const DEFAULT_LOCALE = routing.defaultLocale;

/** Static marketing routes (no dynamic slug). */
export const STATIC_PATHS = [
  "/",
  "/journeys",
  "/tours",
  "/destinations",
  "/silk-trails",
  "/travel-styles",
  "/services-logistics",
  "/about",
  "/partners",
  "/heritage",
  "/experiences",
  "/stories",
  "/blog",
  "/faq",
  "/contact",
  "/pricing",
  "/portfolio",
  "/trekking",
  "/privacy",
  "/terms",
  "/cancellation",
] as const;

export const SERVICE_SLUGS = [
  "visa-support",
  "permits-gbao",
  "transport-rental",
  "drivers-guides",
  "accommodation",
  "tailor-made",
] as const;

export const ACTIVE_DESTINATIONS = [
  "tajikistan",
  "kyrgyzstan",
  "uzbekistan",
  "kazakhstan",
  "china",
  "pakistan",
  "turkmenistan",
  "iran",
  "turkey",
] as const;
