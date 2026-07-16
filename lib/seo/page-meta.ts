import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  localeAbsoluteUrl,
  SITE_NAME,
} from "@/lib/seo/site";

/** Build indexable page metadata with canonical + hreflang for en/ru. */
export function buildPageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const { locale, path, title, description, image, noIndex } = opts;
  const url = localeAbsoluteUrl(locale, path);

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = localeAbsoluteUrl(loc, path);
  }
  languages["x-default"] = localeAbsoluteUrl(DEFAULT_LOCALE, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
