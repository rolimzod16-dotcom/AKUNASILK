import type { CmsTour } from "@/lib/cms/types";
import type { TourContent } from "@/lib/cms/types";
import { getSiteUrl, localePath, SITE_NAME } from "@/lib/seo/site";

type TourJsonLdProps = {
  tour: CmsTour;
  content: TourContent;
  locale: string;
};

export default function TourJsonLd({ tour, content, locale }: TourJsonLdProps) {
  const site = getSiteUrl();
  const url = `${site}${localePath(locale, `/journeys/${tour.slug}`)}`;

  const trip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: content.title,
    description: content.desc,
    url,
    image: tour.image,
    touristType: tour.travelStyle,
    provider: {
      "@type": "TravelAgency",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(trip) }}
    />
  );
}
