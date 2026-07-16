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

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.title,
    description: content.desc,
    image: tour.image,
    url,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: tour.price,
      availability: "https://schema.org/InStock",
      url,
      seller: {
        "@type": "TravelAgency",
        name: SITE_NAME,
      },
    },
  };

  const trip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: content.title,
    description: content.desc,
    touristType: tour.travelStyle,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.duration,
      itemListElement: (content.highlights || []).slice(0, 8).map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: h,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trip) }}
      />
    </>
  );
}
