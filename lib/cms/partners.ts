import type { CmsLocale, CmsPartner, PartnerCategory, PartnerContent } from "./types";
import { readCmsJson, writeCmsJson, cmsNow, newId, slugify } from "./storage";
import { seedPartners } from "./seed";

const FILE = "partners.json";

export const partnerCategories: PartnerCategory[] = [
  "hotel",
  "dmc",
  "hospitality",
  "transport",
  "cultural",
];

export async function getAllPartners(): Promise<CmsPartner[]> {
  return readCmsJson<CmsPartner[]>(FILE, seedPartners);
}

export async function getPublishedPartners(): Promise<CmsPartner[]> {
  const partners = await getAllPartners();
  return partners.filter((p) => p.published);
}

export async function getFeaturedPartners(): Promise<CmsPartner[]> {
  const partners = await getPublishedPartners();
  return partners.filter((p) => p.featured);
}

export async function getPartnersByCategory(category: PartnerCategory): Promise<CmsPartner[]> {
  const partners = await getPublishedPartners();
  return partners.filter((p) => p.category === category);
}

export function getPartnerContent(partner: CmsPartner, locale: string): PartnerContent {
  const loc = (locale === "ru" ? "ru" : "en") as CmsLocale;
  return partner.content[loc] ?? partner.content.en;
}

export async function getPartnerById(id: string): Promise<CmsPartner | undefined> {
  const partners = await getAllPartners();
  return partners.find((p) => p.id === id);
}

export async function savePartner(partner: CmsPartner): Promise<CmsPartner> {
  const partners = await getAllPartners();
  const index = partners.findIndex((p) => p.id === partner.id);
  const next = { ...partner, updatedAt: cmsNow() };
  if (index >= 0) partners[index] = next;
  else partners.push(next);
  await writeCmsJson(FILE, partners);
  return next;
}

export async function deletePartner(id: string): Promise<boolean> {
  const partners = await getAllPartners();
  const filtered = partners.filter((p) => p.id !== id);
  if (filtered.length === partners.length) return false;
  await writeCmsJson(FILE, filtered);
  return true;
}

export function createEmptyPartner(): CmsPartner {
  const now = cmsNow();
  return {
    id: newId("partner"),
    slug: "",
    published: false,
    category: "dmc",
    country: "",
    initials: "NP",
    featured: false,
    content: {
      en: { name: "", desc: "" },
      ru: { name: "", desc: "" },
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizePartnerSlug(input: Partial<CmsPartner>): string {
  return slugify(input.slug || input.content?.en?.name || "new-partner");
}