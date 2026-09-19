import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import PlanJourneyForm from "@/components/forms/PlanJourneyForm";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
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
    { slug: "any", label: form("tourOptions.any") },
    ...tours.map((tour) => ({
      slug: tour.slug,
      label: getTourContent(tour, locale).title,
    })),
    { slug: "bespoke", label: form("tourOptions.bespoke") },
  ];

  return (
    <>
      <PageHero
        title="Plan your journey"
        subtitle="Share what you know. Approximate dates and ideas are enough to begin."
        compact
      />
      <section className="apple-section">
        <div className="mx-auto max-w-[720px] px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Plan my journey" },
            ]}
          />
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-silk-gold/10" />}>
            <PlanJourneyForm tourOptions={tourOptions} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
