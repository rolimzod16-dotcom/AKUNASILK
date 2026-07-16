import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTourBySlug, getPublishedTours, getTourContent } from "@/lib/data/tours";
import TourDetailView from "@/components/tours/TourDetailView";
import TourJsonLd from "@/components/seo/TourJsonLd";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateStaticParams() {
  const tours = await getPublishedTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour || !tour.published) return { robots: { index: false, follow: false } };
  const content = getTourContent(tour, locale);
  return buildPageMetadata({
    locale,
    path: `/journeys/${slug}`,
    title: `${content.title} — from $${tour.price}`,
    description: content.desc,
    image: tour.image,
  });
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();
  const content = getTourContent(tour, locale);

  return (
    <>
      <TourJsonLd tour={tour} content={content} locale={locale} />
      <TourDetailView tour={tour} slug={slug} locale={locale} content={content} />
    </>
  );
}