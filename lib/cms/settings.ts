import type { CmsSiteSettings } from "./types";
import { readCmsJson, writeCmsJson } from "./storage";

const FILE = "settings.json";

export const defaultSiteSettings: CmsSiteSettings = {
  showPrices: false,
  showReviews: true,
  showPartners: false,
  tagline:
    "Private and small-group journeys across Tajikistan and Central Asia, designed with local guides, drivers and hosts.",
  whatsappGreeting:
    "Hello, I would like to ask about a Silk Road journey with Great Silk Trails.",
  contact: {
    legalName: "Great Silk Trails",
    address: "",
    email: "hello@greatsilktrails.com",
    phoneDisplay: "+998 71 200 45 67",
    phoneTel: "+998712004567",
    whatsapp: "998712004567",
    hours: "Mon–Sat, 9:00–19:00 (GMT+5)",
    emergencyNote: "",
  },
};

export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const stored = await readCmsJson<CmsSiteSettings>(FILE, defaultSiteSettings);
  return {
    ...defaultSiteSettings,
    ...stored,
    contact: { ...defaultSiteSettings.contact, ...stored.contact },
  };
}

export async function saveSiteSettings(next: CmsSiteSettings): Promise<CmsSiteSettings> {
  const merged: CmsSiteSettings = {
    ...defaultSiteSettings,
    ...next,
    contact: { ...defaultSiteSettings.contact, ...next.contact },
  };
  await writeCmsJson(FILE, merged);
  return merged;
}

export function whatsappHref(settings: CmsSiteSettings, text?: string): string {
  const greeting = text || settings.whatsappGreeting;
  const phone = settings.contact.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
}
