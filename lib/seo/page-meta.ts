import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  LOCALES,
  localeAbsoluteUrl,
  SITE_NAME,
} from "@/lib/seo/site";

/** Build indexable page metadata with canonical. RU is hidden until fully translated. */
export function buildPageMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const { locale, path, title, description, image, noIndex } = opts;
  const url = localeAbsoluteUrl(locale === "ru" ? DEFAULT_LOCALE : locale, path);

  const languages: Record<string, string> = {
    en: localeAbsoluteUrl(DEFAULT_LOCALE, path),
    "x-default": localeAbsoluteUrl(DEFAULT_LOCALE, path),
  };

  return {
    title: {
      absolute: title.includes("|") ? title : `${title} | ${SITE_NAME}`,
    },
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
      images: image
        ? [{ url: image, alt: title }]
        : [{ url: "/og-default.png", alt: title }],
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
