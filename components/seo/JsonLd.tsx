import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";

type JsonLdProps = {
  locale: string;
  description: string;
};

export default function JsonLd({ locale, description }: JsonLdProps) {
  const site = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: site,
    description,
    email: "hello@greatsilktrails.com",
    telephone: "+998712004567",
    areaServed: [
      "Central Asia",
      "China",
      "Tajikistan",
      "Uzbekistan",
      "Kyrgyzstan",
      "Kazakhstan",
      "Pakistan",
      "Iran",
      "Turkey",
      "Turkmenistan",
    ],
    sameAs: [
      "https://wa.me/998712004567",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: site,
    inLanguage: [locale === "ru" ? "ru" : "en", "en", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site}/${locale}/journeys`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
