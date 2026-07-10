export type NavChild = {
  key: string;
  href: string;
};

export type NavItem =
  | { type: "link"; key: string; href: string }
  | { type: "dropdown"; key: string; href?: string; children: NavChild[] };

/** Main menu — aligned with GST final TZ after full site audit */
export const mainNavigation: NavItem[] = [
  { type: "link", key: "home", href: "/" },
  {
    type: "dropdown",
    key: "silkTrails",
    href: "/silk-trails",
    children: [
      { key: "silkRoadMain", href: "/silk-trails" },
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
    key: "destinations",
    href: "/destinations",
    children: [
      { key: "destTajikistan", href: "/destinations/tajikistan" },
      { key: "destKyrgyzstan", href: "/destinations/kyrgyzstan" },
      { key: "destUzbekistan", href: "/destinations/uzbekistan" },
      { key: "destKazakhstan", href: "/destinations/kazakhstan" },
      { key: "destChina", href: "/destinations/china" },
      { key: "destPakistan", href: "/destinations/pakistan" },
      { key: "destTurkmenistan", href: "/destinations/turkmenistan" },
      { key: "destIran", href: "/destinations/iran" },
      { key: "destTurkey", href: "/destinations/turkey" },
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
  {
    type: "dropdown",
    key: "aboutGst",
    href: "/about",
    children: [
      { key: "about", href: "/about" },
      { key: "partners", href: "/partners" },
      { key: "heritage", href: "/heritage" },
      { key: "experiences", href: "/experiences" },
      { key: "contact", href: "/contact" },
    ],
  },
];
