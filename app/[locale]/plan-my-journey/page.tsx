import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import JourneyRequest from "@/components/forms/PlanJourneyForm";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getCatalogTours, getTourContent } from "@/lib/data/tours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/plan-my-journey",
    title: "Plan My Journey | Great Silk Trails",
    description:
      "Tell Great Silk Trails where you want to go in Tajikistan and Central Asia. Approximate dates are enough to start.",
  });
}

export default async function PlanMyJourneyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const form = await getTranslations({ locale, namespace: "contact.form" });
  const tours = await getCatalogTours();
  const tourOptions = [
    ...tours.map((tour) => ({
      slug: tour.slug,
      label: getTourContent(tour, locale).title,
      price: tour.price,
    })),
    { slug: "bespoke", label: form("tourOptions.bespoke") },
  ];

  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-[#f6f1e8]" />}>
      <JourneyRequest tourOptions={tourOptions} />
    </Suspense>
  );
}
