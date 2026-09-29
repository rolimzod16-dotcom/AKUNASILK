import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getHomeDestinations, getDestinationContent } from "@/lib/cms/destinations";
import SilkRoadCitiesMap from "@/components/home/SilkRoadCitiesMap";
import { getCatalogTours, getTourContent } from "@/lib/data/tours";

export default async function HomeDestinations({ locale }: { locale: string }) {
  const t = await getTranslations("home.destinations");
  const [items, tours] = await Promise.all([getHomeDestinations(), getCatalogTours()]);
  const cards = items.filter((item) => !item.wide);
  const mapTours = tours.map((tour) => ({
    slug: tour.slug,
    title: getTourContent(tour, locale).title,
    days: tour.duration,
    countries: tour.countrySlugs ?? [],
    image: tour.image,
  }));

  return (
    <>
    <SilkRoadCitiesMap tours={mapTours} />
    <section className="apple-section bg-silk-cream">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-apple-muted sm:text-base">
          {t("subtitle")}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => {
            const content = getDestinationContent(item, locale);
            return (
              <Link
                key={item.id}
                href={`/destinations/${item.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-silk-gold/20"
              >
                <div className="relative aspect-[4/3]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${content.name} — ${content.line}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-silk-indigo" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/80 via-silk-indigo/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="silk-headline text-xl text-white">{content.name}</p>
                  <p className="mt-1 text-sm text-silk-sand/90">{content.line}</p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
    </>
  );
}
