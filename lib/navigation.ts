export type NavChild = {
  key: string;
  href: string;
  label?: string;
};

export type NavItem =
  | { type: "link"; key: string; href: string }
  | { type: "dropdown"; key: string; href?: string; children: NavChild[] };

/** Main menu — aligned with GST final TZ after full site audit */
/** Main menu — TZ: Journeys · Destinations · Travel Styles · Travel Services · About Us · Contact */
export const mainNavigation: NavItem[] = [
  { type: "link", key: "journeys", href: "/journeys" },
  {
    type: "dropdown",
    key: "destinations",
    href: "/destinations",
    children: [
      { key: "destTajikistan", href: "/destinations/tajikistan" },
      { key: "destUzbekistan", href: "/destinations/uzbekistan" },
      { key: "destKyrgyzstan", href: "/destinations/kyrgyzstan" },
      { key: "destKazakhstan", href: "/destinations/kazakhstan" },
      { key: "destCentralAsia", href: "/destinations/central-asia" },
    ],
  },
  {
    type: "dropdown",
    key: "travelStyles",
    href: "/travel-styles",
    children: [
      { key: "styleOverland", href: "/travel-styles/overland-4x4" },
      { key: "styleTrekking", href: "/travel-styles/trekking" },
      { key: "styleMotorcycle", href: "/travel-styles/motorcycle" },
      { key: "styleCulture", href: "/travel-styles/culture-cities" },
      { key: "styleHorseRiding", href: "/travel-styles/horse-riding" },
      { key: "stylePhoto", href: "/travel-styles/photography" },
    ],
  },
  {
    type: "dropdown",
    key: "travelServices",
    href: "/services",
    children: [
      { key: "serviceTransport", href: "/services/transport-rental" },
      { key: "serviceDrivers", href: "/services/drivers-guides" },
      { key: "serviceVisa", href: "/services/visa-support" },
      { key: "servicePermits", href: "/services/permits-gbao" },
      { key: "serviceAccommodation", href: "/services/accommodation" },
      { key: "serviceTailorMade", href: "/services/tailor-made" },
    ],
  },
  { type: "link", key: "about", href: "/about" },
  { type: "link", key: "contact", href: "/contact" },
];

export function withDestinationNav(destinations: NavChild[]): NavItem[] {
  return mainNavigation.map((item) => {
    if (item.type === "dropdown" && item.key === "destinations" && destinations.length > 0) {
      return { ...item, children: destinations };
    }
    return item;
  });
}
