import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";

type JsonLdProps = {
  locale: string;
  description: string;
  email?: string;
  telephone?: string;
};

export default function JsonLd({ locale, description, email, telephone }: JsonLdProps) {
  const site = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    alternateName: "GREAT SILK TRAILS",
    url: site,
    description,
    email: email || "hello@greatsilktrails.com",
    telephone: telephone || "+998712004567",
    knowsAbout: [
      "Silk Road tours",
      "Tajikistan tours",
      "Pamir Highway",
      "Central Asia tours",
    ],
    areaServed: ["Tajikistan", "Uzbekistan", "Kyrgyzstan", "Kazakhstan", "Central Asia"],
    sameAs: ["https://wa.me/998712004567"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "GREATSILKTRAILS Silk Road Tours",
    url: site,
    description,
    inLanguage: ["en"],
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
