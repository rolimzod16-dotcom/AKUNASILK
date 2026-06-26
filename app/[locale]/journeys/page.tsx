import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import TourCard from "@/components/tours/TourCard";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.journeys" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function JourneysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.journeys" });
  const tours = await getPublishedTours();

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                content={getTourContent(tour, locale)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}