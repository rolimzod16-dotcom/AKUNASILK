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
    path: "/contact",
    title: "Contact Great Silk Trails | Plan a Central Asia Trip",
    description:
      "Contact Great Silk Trails to discuss a private journey, group tour, transport, guide, visa support or permits in Tajikistan and Central Asia.",
  });
}

export default async function ContactPage({
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
