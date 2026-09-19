import type { CmsDestination, CmsLocale, DestinationContent } from "./types";
import { readCmsJson, writeCmsJson, cmsNow, newId, slugify } from "./storage";
import { HOME_DESTINATIONS, CENTRAL_ASIA } from "@/lib/site";

const FILE = "destinations.json";

function emptyContent(): DestinationContent {
  return {
    name: "",
    line: "",
    intro: "",
    why: "",
    season: "",
    practical: "",
    visa: "",
    seoTitle: "",
    seoDescription: "",
  };
}

function seedDestination(
  slug: string,
  name: string,
  line: string,
  image: string,
  extras: Partial<CmsDestination> = {}
): CmsDestination {
  const now = "2026-07-01T12:00:00.000Z";
  return {
    id: `dest-${slug}`,
    slug,
    published: true,
    image,
    showOnHome: true,
    homeOrder: 0,
    bestTime: "",
    content: {
      en: { ...emptyContent(), name, line, intro: line },
      ru: { ...emptyContent(), name, line, intro: line },
    },
    createdAt: now,
    updatedAt: now,
    ...extras,
  };
}

export const seedDestinations: CmsDestination[] = [
  seedDestination(
    "tajikistan",
    "Tajikistan",
    "Pamirs, Wakhan and the Fann Mountains",
    HOME_DESTINATIONS[0].image,
    {
      homeOrder: 1,
      bestTime: "Late May–September",
      content: {
        en: {
          name: "Tajikistan",
          line: "Pamirs, Wakhan and the Fann Mountains",
          intro:
            "Travel the Pamir Highway, Wakhan Valley and Fann Mountains with local teams who understand the roads, permits, altitude and communities of Tajikistan.",
          why: "Pamir Highway, Wakhan views, and high-altitude village hospitality.",
          season: "Best overland windows: late May–September for high passes.",
          practical: "Altitude, long driving days, and GBAO permit planning are central to itinerary design.",
          visa: "Entry rules vary by nationality. GST provides visa support — no visa guarantee.",
          seoTitle: "Tajikistan Tours & Pamir Highway Journeys | GST",
          seoDescription:
            "Travel the Pamir Highway, Wakhan Valley and Fann Mountains with local teams experienced in Tajikistan's roads, permits and altitude.",
        },
        ru: {
          name: "Таджикистан",
          line: "Памир, Вахан и Фанские горы",
          intro: "Памирский тракт, Вахан и Фанские горы с местной командой.",
          why: "",
          season: "",
          practical: "",
          visa: "",
        },
      },
    }
  ),
  seedDestination(
    "uzbekistan",
    "Uzbekistan",
    "Silk Road cities and living craft traditions",
    HOME_DESTINATIONS[1].image,
    { homeOrder: 2, bestTime: "April–June and September–October" }
  ),
  seedDestination(
    "kyrgyzstan",
    "Kyrgyzstan",
    "Mountain roads, nomad culture and highland lakes",
    HOME_DESTINATIONS[2].image,
    { homeOrder: 3, bestTime: "June–September" }
  ),
  seedDestination(
    "kazakhstan",
    "Kazakhstan",
    "Steppe landscapes, canyons and modern cities",
    HOME_DESTINATIONS[3].image,
    { homeOrder: 4, bestTime: "May–September" }
  ),
  seedDestination(
    "central-asia",
    "Central Asia",
    "One journey across several Silk Road countries",
    CENTRAL_ASIA.image,
    { homeOrder: 5, wide: true, bestTime: "May–October" }
  ),
];

export async function getAllDestinations(): Promise<CmsDestination[]> {
  const items = await readCmsJson<CmsDestination[]>(FILE, seedDestinations);
  return [...items].sort((a, b) => a.homeOrder - b.homeOrder);
}

export async function getPublishedDestinations(): Promise<CmsDestination[]> {
  const items = await getAllDestinations();
  return items.filter((item) => item.published);
}

export async function getHomeDestinations(): Promise<CmsDestination[]> {
  return (await getPublishedDestinations()).filter((item) => item.showOnHome);
}

export async function getDestinationBySlug(slug: string): Promise<CmsDestination | undefined> {
  const items = await getAllDestinations();
  return items.find((item) => item.slug === slug);
}

export async function getPublishedDestinationBySlug(slug: string): Promise<CmsDestination | undefined> {
  const item = await getDestinationBySlug(slug);
  return item?.published ? item : undefined;
}

export async function getDestinationById(id: string): Promise<CmsDestination | undefined> {
  const items = await getAllDestinations();
  return items.find((item) => item.id === id);
}

export function getDestinationContent(item: CmsDestination, locale: string): DestinationContent {
  const loc = (locale === "ru" ? "ru" : "en") as CmsLocale;
  return item.content[loc] ?? item.content.en;
}

export async function saveDestination(item: CmsDestination): Promise<CmsDestination> {
  const items = await getAllDestinations();
  const next = { ...item, slug: slugify(item.slug || item.content.en.name), updatedAt: cmsNow() };
  const index = items.findIndex((row) => row.id === item.id);
  if (index >= 0) items[index] = next;
  else items.push(next);
  await writeCmsJson(FILE, items);
  return next;
}

export async function deleteDestination(id: string): Promise<boolean> {
  const items = await getAllDestinations();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  await writeCmsJson(FILE, filtered);
  return true;
}

export function createEmptyDestination(): CmsDestination {
  const now = cmsNow();
  return {
    id: newId("dest"),
    slug: "",
    published: false,
    image: "",
    wide: false,
    showOnHome: true,
    homeOrder: 10,
    bestTime: "",
    content: { en: emptyContent(), ru: emptyContent() },
    createdAt: now,
    updatedAt: now,
  };
}

export function publicCountrySlugsFrom(destinations: CmsDestination[]): string[] {
  return destinations.filter((item) => item.slug !== "central-asia").map((item) => item.slug);
}
