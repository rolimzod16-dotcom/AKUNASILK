import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import JourneyCatalog from "@/components/journeys/JourneyCatalog";
import { getCatalogTours, getTourContent, tourShowsPrice } from "@/lib/data/tours";
import { getSiteSettings } from "@/lib/cms/settings";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.journeys" });
  return buildPageMetadata({
    locale,
    path: "/journeys",
    title: "Silk Road & Central Asia Tours | Great Silk Trails",
    description:
      "Explore private and small-group tours across Tajikistan and Central Asia.",
  });
}

export default async function JourneysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.journeys" });
  const [tours, settings] = await Promise.all([getCatalogTours(), getSiteSettings()]);
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
    showPrice: tourShowsPrice(tour, settings.showPrices),
  }));

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />
      <JourneyCatalog items={items} />
    </>
  );
}