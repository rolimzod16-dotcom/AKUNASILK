import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import TourCard from "@/components/tours/TourCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import BookNowButton from "@/components/automation/BookNowButton";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getCatalogTours, getTourContent } from "@/lib/data/tours";
import {
  getTravelStyleLabel,
  styleFromPageSlug,
  tourMatchesStyle,
  TRAVEL_STYLE_PAGES,
} from "@/lib/travel-styles";

export async function generateStaticParams() {
  return TRAVEL_STYLE_PAGES.map((item) => ({ style: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; style: string }>;
}): Promise<Metadata> {
  const { locale, style } = await params;
  const key = styleFromPageSlug(style);
  if (!key) return { title: "Great Silk Trails" };
  if (key === "overland") {
    return buildPageMetadata({
      locale,
      path: `/travel-styles/${style}`,
      title: "4x4 Tours in Tajikistan & Central Asia | GST",
      description:
        "Discover locally operated 4x4 journeys through Tajikistan and Central Asia, with experienced drivers, suitable vehicles and clear route information.",
    });
  }
  if (key === "motorcycle") {
    return buildPageMetadata({
      locale,
      path: `/travel-styles/${style}`,
      title: "Motorcycle Journeys on the Pamir Highway | GST",
      description:
        "Motorcycle journeys on the Pamir Highway and across Central Asia, planned with local road knowledge.",
    });
  }
  return buildPageMetadata({
    locale,
    path: `/travel-styles/${style}`,
    title: `${getTravelStyleLabel(key)} | Great Silk Trails`,
    description: `Travel the Silk Road through ${getTravelStyleLabel(key).toLowerCase()}.`,
  });
}

export default async function TravelStylePage({
  params,
}: {
  params: Promise<{ locale: string; style: string }>;
}) {
  const { locale, style } = await params;
  const key = styleFromPageSlug(style);
  if (!key) notFound();

  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });
  const tours = (await getCatalogTours()).filter((tour) => tourMatchesStyle(tour, key));
  const title =
    key === "overland"
      ? "4x4 journeys across the Pamirs and Central Asia"
      : key === "motorcycle"
        ? "Motorcycle journeys on the Pamir Highway"
        : t(`styles.${key}.title`);

  return (
    <>
      <PageHero title={title} subtitle={t(`styles.${key}.desc`)} />
      <section className="apple-section">
        <div className="mx-auto max-w-[1100px] px-6">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: "Home", href: "/" },
              { label: "Travel styles", href: "/travel-styles" },
              { label: getTravelStyleLabel(key, locale) },
            ]}
          />
          <div className="prose prose-sm max-w-none text-apple-muted">
            <h2 className="silk-headline text-2xl text-silk-indigo">What this style means</h2>
            <p className="mt-3">{t(`styles.${key}.desc`)}</p>
          </div>
          <div className="mt-10">
            <h2 className="silk-headline text-2xl text-silk-indigo">Related journeys</h2>
            {tours.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tours.slice(0, 6).map((tour, i) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    content={getTourContent(tour, locale)}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-apple-muted">
                No published journeys in this style yet. Ask us to plan a private trip.
              </p>
            )}
          </div>
          <div className="mt-10">
            <BookNowButton
              variant="silk"
              size="pill"
              prefill={{ source: "travel-styles", interests: key }}
              label="Plan this style of journey"
            />
          </div>
        </div>
      </section>
    </>
  );
}
