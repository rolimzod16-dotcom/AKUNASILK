import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import JourneyCatalog from "@/components/journeys/JourneyCatalog";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";
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
    title: t("title"),
    description: t("subtitle"),
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
  const tours = await getPublishedTours();
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
  }));

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />
      <Suspense fallback={<CatalogFallback />}>
        <JourneyCatalog items={items} />
      </Suspense>
    </>
  );
}