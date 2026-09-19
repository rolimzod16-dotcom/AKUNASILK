import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import TourCard from "@/components/tours/TourCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import BookNowButton from "@/components/automation/BookNowButton";
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
    path: "/destinations/central-asia",
    title: "Central Asia Tours | Great Silk Trails",
    description:
      "One journey across several Silk Road countries, designed with local teams in Tajikistan, Uzbekistan, Kyrgyzstan and Kazakhstan.",
  });
}

export default async function CentralAsiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tours = await getCatalogTours();
  const multi = tours.filter((tour) => (tour.countrySlugs?.length ?? 0) > 1);
  const list = (multi.length > 0 ? multi : tours).slice(0, 6);

  return (
    <>
      <PageHero
        title="Central Asia journeys"
        subtitle="One journey across several Silk Road countries, coordinated with local teams on the ground."
      />
      <section className="apple-section">
        <div className="mx-auto max-w-[1100px] px-6">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: "Central Asia" },
            ]}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                content={getTourContent(tour, locale)}
                index={i}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <BookNowButton
              variant="silk"
              size="pill"
              prefill={{ source: "info-page", countries: "central-asia" }}
              label="Plan a private trip"
            />
          </div>
        </div>
      </section>
    </>
  );
}
