import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import JourneyCatalog from "@/components/journeys/JourneyCatalog";
import { getCatalogTours, getTourContent, tourShowsPrice } from "@/lib/data/tours";
import { getSiteSettings } from "@/lib/cms/settings";
import { getPublishedDestinations, publicCountrySlugsFrom } from "@/lib/cms/destinations";
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
      "Explore private and small-group tours across Tajikistan and Central Asia. Filter journeys by destination, style, duration and difficulty.",
  });
}

function CatalogFallback() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-12">
      <div className="h-32 animate-pulse rounded-2xl bg-silk-gold/10" />
    </div>
  );
}

export default async function JourneysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.journeys" });
  const [tours, settings, destinations] = await Promise.all([
    getCatalogTours(),
    getSiteSettings(),
    getPublishedDestinations(),
  ]);
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
    showPrice: tourShowsPrice(tour, settings.showPrices),
  }));

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />
      <Suspense fallback={<CatalogFallback />}>
        <JourneyCatalog items={items} countries={publicCountrySlugsFrom(destinations)} />
      </Suspense>
    </>
  );
}