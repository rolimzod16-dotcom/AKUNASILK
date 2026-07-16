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

/**
 * Paths that permanently/temporarily redirect and must never appear in the sitemap.
 * /tours → /journeys, /blog → /stories (and any /tours/* slug).
 */
function isRedirectPath(path: string): boolean {
  if (path === "/tours" || path.startsWith("/tours/")) return true;
  if (path === "/blog" || path.startsWith("/blog/")) return true;
  return false;
}

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

/** Only accept final 200 responses — never follow redirects into the sitemap. */
async function returnsHttp200(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      headers: {
        "User-Agent": "GREATSILKTRAILS-SitemapValidator/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    return res.status === 200;
  } catch {
    // Build environment cannot reach production: keep non-redirect candidates.
    return true;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, stories] = await Promise.all([
    getPublishedTours().catch(() => []),
    getPublishedStories().catch(() => []),
  ]);

  // --- Candidates (canonical paths only; no /tours, no /blog) ---
  const staticPaths = STATIC_PATHS.filter((path) => !isRedirectPath(path));

  const candidates: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    candidates.push(
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
  }

  // Tours: only /journeys/{slug} — never /tours/{slug}
  for (const tour of tours) {
    candidates.push(
      entry(`/journeys/${tour.slug}`, {
        lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      })
    );
  }

  for (const country of ACTIVE_DESTINATIONS) {
    candidates.push(
      entry(`/destinations/${country}`, {
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );
  }

  for (const slug of SERVICE_SLUGS) {
    candidates.push(
      entry(`/services/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.65,
      })
    );
  }

  for (const story of stories) {
    candidates.push(
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
  }

  // How many we would have emitted before redirect cleanup (old logic)
  const previousStyleCount =
    STATIC_PATHS.length +
    tours.length * 2 + // journeys + tours per slug
    ACTIVE_DESTINATIONS.length +
    SERVICE_SLUGS.length +
    stories.length;

  // Verify every candidate is a final HTTP 200 (no 3xx)
  const verified: MetadataRoute.Sitemap = [];
  let failed200 = 0;

  for (const item of candidates) {
    const ok = await returnsHttp200(item.url);
    if (ok) {
      verified.push(item);
    } else {
      failed200 += 1;
    }
  }

  const removed = previousStyleCount - verified.length;
  console.info(
    `[sitemap] previous≈${previousStyleCount} candidates=${candidates.length} removed=${removed} (failed200=${failed200}) remain=${verified.length}`
  );

  return verified;
}
