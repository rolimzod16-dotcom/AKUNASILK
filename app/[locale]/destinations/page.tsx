import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import DestinationsCatalog, {
  type DestinationItem,
} from "@/components/destinations/DestinationsCatalog";
import {
  COUNTRY_SLUGS,
  SILK_ROAD_COUNTRIES,
  type CountrySlug,
} from "@/lib/countries";

const DESTINATION_IMAGES: Record<CountrySlug, string> = {
  china: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80",
  kazakhstan: "https://images.unsplash.com/photo-1517824801-6512-773c5b6a8f0?w=800&q=80",
  kyrgyzstan: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  uzbekistan: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
  turkmenistan: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
  tajikistan: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  afghanistan: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80",
  iran: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
  pakistan: "https://images.unsplash.com/photo-1584551246679-0daf3d849d1c?w=800&q=80",
  india: "https://images.unsplash.com/photo-1524492412937-280ceb9ccd21?w=800&q=80",
  georgia: "https://images.unsplash.com/photo-1565007996395-3ab4ddc7a9b0?w=800&q=80",
  armenia: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
  azerbaijan: "https://images.unsplash.com/photo-1590073242678-ac2a4a9163bb?w=800&q=80",
  turkey: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.destinations" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.destinations" });

  const items: DestinationItem[] = COUNTRY_SLUGS.map((slug) => ({
    slug,
    corridor: SILK_ROAD_COUNTRIES[slug].corridor,
    image: DESTINATION_IMAGES[slug],
  }));

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />
      <DestinationsCatalog items={items} />
    </>
  );
}