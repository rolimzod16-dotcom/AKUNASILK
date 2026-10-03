import type { CmsHeroCopy, CmsSiteSettings } from "./types";
import { readCmsJson, writeCmsJson } from "./storage";

const FILE = "settings.json";

const defaultHero: Record<"en" | "ru", CmsHeroCopy> = {
  en: {
    badge: "Local Silk Road experts",
    title: "Travel the Silk Roads with local experts",
    subtitle:
      "Private and small-group journeys across Tajikistan and Central Asia, designed with trusted local guides, drivers and hosts.",
    cta: "Explore Journeys",
    ctaSecondary: "Plan a Private Trip",
    when: "When?",
    howLong: "How long?",
    where: "Where?",
    durationShort: "~ 1 week",
    durationMedium: "2 weeks",
    durationLong: "3 weeks +",
    explore: "Explore inspirations",
  },
  ru: {
    badge: "Местные эксперты Шёлкового пути",
    title: "Путешествуйте по Шёлковым путям с местными экспертами",
    subtitle:
      "Частные и небольшие групповые поездки по Таджикистану и Центральной Азии с проверенными гидами, водителями и хозяевами.",
    cta: "Смотреть путешествия",
    ctaSecondary: "Спланировать частную поездку",
    when: "Когда?",
    howLong: "На сколько?",
    where: "Куда?",
    durationShort: "~ 1 неделя",
    durationMedium: "2 недели",
    durationLong: "3 недели +",
    explore: "Смотреть идеи",
  },
};

export const defaultSiteSettings: CmsSiteSettings = {
  showPrices: false,
  showReviews: true,
  showPartners: false,
  tagline:
    "Private and small-group journeys across Tajikistan and Central Asia, designed with local guides, drivers and hosts.",
  whatsappGreeting:
    "Hello, I would like to ask about a Silk Road journey with Great Silk Trails.",
  hero: defaultHero,
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

function mergeHero(stored?: Partial<CmsSiteSettings["hero"]>): CmsSiteSettings["hero"] {
  return {
    en: { ...defaultHero.en, ...stored?.en },
    ru: { ...defaultHero.ru, ...stored?.ru },
  };
}

export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const stored = await readCmsJson<CmsSiteSettings>(FILE, defaultSiteSettings);
  return {
    ...defaultSiteSettings,
    ...stored,
    contact: { ...defaultSiteSettings.contact, ...stored.contact },
    hero: mergeHero(stored.hero),
  };
}

export async function saveSiteSettings(next: CmsSiteSettings): Promise<CmsSiteSettings> {
  const merged: CmsSiteSettings = {
    ...defaultSiteSettings,
    ...next,
    contact: { ...defaultSiteSettings.contact, ...next.contact },
    hero: mergeHero(next.hero),
  };
  await writeCmsJson(FILE, merged);
  return merged;
}

export function whatsappHref(settings: CmsSiteSettings, text?: string): string {
  const greeting = text || settings.whatsappGreeting;
  const phone = settings.contact.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
}
