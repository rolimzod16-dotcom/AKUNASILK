import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getCatalogTours } from "@/lib/data/tours";
import {
  TRAVEL_STYLE_PAGES,
  getTravelStyleLabel,
  tourMatchesStyle,
} from "@/lib/travel-styles";

const STYLE_IMAGES: Record<string, string> = {
  overland: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
  trekking: "https://images.unsplash.com/photo-1501785880828-f9571f0630af?w=1200&q=80",
  motorcycle: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80",
  culture: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
  horseRiding: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=80",
  photo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/travel-styles",
    title: "Travel Styles | Great Silk Trails",
    description:
      "From high-altitude 4x4 routes to trekking, motorcycle journeys and Silk Road cities, choose the pace and experience that suits you.",
  });
}

export default async function TravelStylesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });
  const tours = await getCatalogTours();

  return (
    <>
      <PageHero
        title="Choose how you want to travel"
        subtitle="From high-altitude 4x4 routes to trekking, motorcycle journeys and Silk Road cities, choose the pace and experience that suits you."
      />
      <section className="apple-section">
        <div className="mx-auto grid max-w-[1100px] gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <Breadcrumbs
              locale={locale}
              items={[{ label: "Home", href: "/" }, { label: "Travel styles" }]}
            />
          </div>
          {TRAVEL_STYLE_PAGES.map((item) => {
            const count = tours.filter((tour) => tourMatchesStyle(tour, item.key)).length;
            return (
              <Link
                key={item.slug}
                href={`/travel-styles/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-silk-gold/20 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={STYLE_IMAGES[item.key]}
                    alt={getTravelStyleLabel(item.key, locale)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="silk-headline text-xl text-silk-indigo">
                    {t.has(`styles.${item.key}.title`)
                      ? t(`styles.${item.key}.title`)
                      : getTravelStyleLabel(item.key, locale)}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-apple-muted">
                    {t.has(`styles.${item.key}.desc`)
                      ? t(`styles.${item.key}.desc`)
                      : "Motorcycle journeys on the Pamir Highway, planned with local road knowledge."}
                  </p>
                  <p className="mt-3 text-xs text-apple-muted">
                    {item.key === "overland" && "Suitable for: travellers comfortable with long driving days · Typical: 8–14 days"}
                    {item.key === "trekking" && "Suitable for: good fitness at altitude · Typical: 8–12 days"}
                    {item.key === "motorcycle" && "Suitable for: licensed riders · Typical: 7–14 days"}
                    {item.key === "culture" && "Suitable for: cities, crafts and slower pace · Typical: 7–12 days"}
                    {item.key === "horseRiding" && "Suitable for: basic riding experience · Typical: 6–10 days"}
                    {item.key === "photo" && "Suitable for: photographers and visual travellers · Typical: 8–12 days"}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-silk-gold">
                    Explore this style{count ? ` · ${count} journeys` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
