import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import TourCard from "@/components/tours/TourCard";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";
import { TRAVEL_STYLES, tourMatchesStyle, type TravelStyle } from "@/lib/travel-styles";

const stylePageKeys: TravelStyle[] = [...TRAVEL_STYLES];

const styleAnchors: Record<TravelStyle, string> = {
  overland: "overland",
  horseRiding: "horse-riding",
  trekking: "trekking",
  culture: "culture",
  photo: "photo",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function TravelStylesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });
  const tours = await getPublishedTours();
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
  }));

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="apple-section">
        <div className="mx-auto max-w-[1100px] space-y-14 px-6">
          {stylePageKeys.map((key) => {
            const styleTours = items.filter(({ tour }) => tourMatchesStyle(tour, key));
            return (
              <article
                key={key}
                id={styleAnchors[key]}
                className="scroll-mt-24 rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="silk-headline text-2xl text-silk-indigo">{t(`styles.${key}.title`)}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-apple-muted">
                      {t(`styles.${key}.desc`)}
                    </p>
                  </div>
                  <Link
                    href={`/journeys?style=${key}`}
                    className="text-sm font-semibold text-silk-gold hover:underline"
                  >
                    {t("viewPackages", { count: styleTours.length })}
                  </Link>
                </div>

                {styleTours.length > 0 ? (
                  <>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {styleTours.slice(0, 3).map(({ tour, content }, i) => (
                        <TourCard key={tour.id} tour={tour} content={content} index={i} />
                      ))}
                    </div>
                    {styleTours.length > 3 && (
                      <Link
                        href={`/journeys?style=${key}`}
                        className="mt-4 inline-block text-sm font-semibold text-silk-gold hover:underline"
                      >
                        {t("viewAllStyle")} ({styleTours.length}) →
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-sm text-apple-muted">{t("noPackages")}</p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}