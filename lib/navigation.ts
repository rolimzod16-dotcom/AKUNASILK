export type NavChild = {
  key: string;
  href: string;
};

export type NavItem =
  | { type: "link"; key: string; href: string }
  | { type: "dropdown"; key: string; href?: string; children: NavChild[] };

/** Mirrors https://greatsilktrails.com/ main menu */
export const mainNavigation: NavItem[] = [
  { type: "link", key: "home", href: "/" },
  {
    type: "dropdown",
    key: "silkTrails",
    children: [
      { key: "tourChina", href: "/journeys/silk-road-origins-trail-china" },
      { key: "tourKyrgyzstan", href: "/journeys/nomads-mountains-silk-trail-kyrgyzstan" },
      { key: "tourUzbekistan", href: "/journeys/golden-cities-silk-trail-uzbekistan" },
      { key: "tourTajikistan", href: "/journeys/pamir-silk-trail-tajikistan-flagship" },
      { key: "tourKazakhstan", href: "/journeys/great-steppe-silk-trail-kazakhstan" },
      { key: "tourTurkmenistan", href: "/journeys/caravan-desert-silk-trail-turkmenistan" },
      { key: "tourPakistan", href: "/journeys/karakoram-silk-trail-pakistan" },
      { key: "tourIran", href: "/journeys/persian-silk-trail-iran" },
      { key: "tourTurkey", href: "/journeys/anatolian-silk-trail-turkey" },
    ],
  },
  {
    type: "dropdown",
    key: "destination",
    children: [
      { key: "destTajikistan", href: "/journeys?country=tajikistan" },
      { key: "destKyrgyzstan", href: "/journeys?country=kyrgyzstan" },
      { key: "destUzbekistan", href: "/journeys?country=uzbekistan" },
      { key: "destKazakhstan", href: "/journeys?country=kazakhstan" },
      { key: "destChina", href: "/journeys?country=china" },
      { key: "destPakistan", href: "/journeys?country=pakistan" },
      { key: "destTurkmenistan", href: "/journeys?country=turkmenistan" },
      { key: "destIran", href: "/journeys?country=iran" },
      { key: "destTurkey", href: "/journeys?country=turkey" },
    ],
  },
  {
    type: "dropdown",
    key: "travelStyles",
    href: "/travel-styles",
    children: [
      { key: "styleOverland", href: "/journeys?style=overland" },
      { key: "styleHorseRiding", href: "/journeys?style=horseRiding" },
      { key: "styleTrekking", href: "/journeys?style=trekking" },
      { key: "styleCulture", href: "/journeys?style=culture" },
      { key: "stylePhoto", href: "/journeys?style=photo" },
    ],
  },
  {
    type: "dropdown",
    key: "servicesLogistics",
    href: "/services-logistics",
    children: [
      { key: "serviceVisa", href: "/services/visa-support" },
      { key: "servicePermits", href: "/services/permits-gbao" },
      { key: "serviceTransport", href: "/services/transport-rental" },
      { key: "serviceDrivers", href: "/services/drivers-guides" },
      { key: "serviceAccommodation", href: "/services/accommodation" },
      { key: "serviceTailorMade", href: "/services/tailor-made" },
    ],
  },
  { type: "link", key: "aboutGst", href: "/about" },
];