import type { MetadataRoute } from "next";
import { getPublishedTours } from "@/lib/cms/tours";
import { getPublishedStories } from "@/lib/cms/stories";
import {
  ACTIVE_DESTINATIONS,
  DEFAULT_LOCALE,
  LOCALES,
  SERVICE_SLUGS,
  STATIC_PATHS,
  getSiteUrl,
  localePath,
} from "@/lib/seo/site";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

function entry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: ChangeFreq;
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${getSiteUrl()}${localePath(locale, path)}`;
  }
  languages["x-default"] = `${getSiteUrl()}${localePath(DEFAULT_LOCALE, path)}`;

  return {
    url: `${getSiteUrl()}${localePath(DEFAULT_LOCALE, path)}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.7,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, stories] = await Promise.all([
    getPublishedTours().catch(() => []),
    getPublishedStories().catch(() => []),
  ]);

  const staticEntries = STATIC_PATHS.map((path) =>
    entry(path, {
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority:
        path === "/"
          ? 1
          : path === "/journeys" || path === "/silk-trails"
            ? 0.9
            : path === "/contact"
              ? 0.85
              : 0.7,
    })
  );

  const tourEntries = tours.flatMap((tour) => [
    entry(`/journeys/${tour.slug}`, {
      lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }),
    entry(`/tours/${tour.slug}`, {
      lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  ]);

  const destinationEntries = ACTIVE_DESTINATIONS.map((country) =>
    entry(`/destinations/${country}`, {
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const serviceEntries = SERVICE_SLUGS.map((slug) =>
    entry(`/services/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.65,
    })
  );

  const storyEntries = stories.map((story) =>
    entry(`/stories/${story.slug}`, {
      lastModified: story.updatedAt
        ? new Date(story.updatedAt)
        : story.date
          ? new Date(story.date)
          : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [
    ...staticEntries,
    ...destinationEntries,
    ...serviceEntries,
    ...tourEntries,
    ...storyEntries,
  ];
}
