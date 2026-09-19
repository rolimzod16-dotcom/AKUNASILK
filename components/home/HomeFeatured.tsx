import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import TourCard from "@/components/tours/TourCard";
import { getFeaturedJourneys, getTourContent, tourShowsPrice } from "@/lib/data/tours";
import { getSiteSettings } from "@/lib/cms/settings";

export default async function HomeFeatured({ locale }: { locale: string }) {
  const t = await getTranslations("home.featured");
  const [tours, settings] = await Promise.all([getFeaturedJourneys(), getSiteSettings()]);

  if (tours.length === 0) return null;

  return (
    <section className="apple-section border-t border-silk-gold/15 bg-white">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-silk-gold">
          {t("eyebrow")}
        </p>
        <h2 className="silk-headline mt-2 text-3xl text-silk-indigo sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-apple-muted sm:text-base">
          {t("subtitle")}
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tours.slice(0, 3).map((tour, index) => (
            <TourCard
              key={tour.id}
              tour={tour}
              content={getTourContent(tour, locale)}
              index={index}
              showPrice={tourShowsPrice(tour, settings.showPrices)}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/journeys" className="text-sm font-semibold text-silk-gold hover:underline">
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
