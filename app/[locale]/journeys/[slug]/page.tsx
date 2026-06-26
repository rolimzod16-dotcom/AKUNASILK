import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getTourBySlug, getPublishedTours, getTourContent } from "@/lib/data/tours";
import TourDetailView from "@/components/tours/TourDetailView";

export async function generateStaticParams() {
  const tours = await getPublishedTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  const content = getTourContent(tour, locale);
  return {
    title: `${content.title} — $${tour.price} | GREATSILKTRAILS`,
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <TourDetailView
      tour={tour}
      slug={slug}
      locale={locale}
      content={getTourContent(tour, locale)}
    />
  );
}