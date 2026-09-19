import type { Metadata } from "next";
import Image from "next/image";
import { getCatalogTours } from "@/lib/data/tours";
import PageHero from "@/components/shared/PageHero";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import {
  getPublishedDestinations,
  getDestinationContent,
} from "@/lib/cms/destinations";
import { Link } from "@/i18n/routing";
import { tourMatchesCountry, isCountrySlug } from "@/lib/countries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/destinations",
    title: "Where We Travel | Great Silk Trails",
    description:
      "Explore the Silk Road through countries we know, routes we operate and local teams we trust.",
  });
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [destinations, tours] = await Promise.all([
    getPublishedDestinations(),
    getCatalogTours(),
  ]);
  const cards = destinations.filter((item) => !item.wide);
  const wide = destinations.filter((item) => item.wide);

  return (
    <>
      <PageHero
        title="Where we travel"
        subtitle="Explore the Silk Road through countries we know, routes we operate and local teams we trust."
        compact
      />
      <section className="apple-section">
        <div className="mx-auto max-w-[1200px] px-6">
          <Breadcrumbs
            locale={locale}
            items={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
          />
          <p className="mb-6 text-sm text-apple-muted">
            {cards.length} {cards.length === 1 ? "country" : "countries"}
            {wide.length ? " plus multi-country journeys." : "."}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((item) => {
              const content = getDestinationContent(item, locale);
              const count = tours.filter((tour) =>
                (tour.countrySlugs as string[] | undefined)?.includes(item.slug)
              ).length;
              return (
                <Link
                  key={item.id}
                  href={`/destinations/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-silk-gold/20 bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9] bg-silk-indigo">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={`${content.name} — ${content.line}`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h2 className="silk-headline text-2xl text-silk-indigo">{content.name}</h2>
                    <p className="mt-1 text-sm text-apple-muted">{content.line}</p>
                    <p className="mt-3 text-xs text-silk-turquoise">
                      {item.bestTime ? `Best time: ${item.bestTime} · ` : ""}
                      {count} active journey{count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          {wide.map((item) => {
            const content = getDestinationContent(item, locale);
            return (
              <Link
                key={item.id}
                href={`/destinations/${item.slug}`}
                className="group mt-5 block overflow-hidden rounded-2xl border border-silk-gold/20 bg-white shadow-sm"
              >
                <div className="relative aspect-[21/7] min-h-[160px] bg-silk-indigo">
                  {item.image ? (
                    <Image src={item.image} alt={content.line} fill className="object-cover" sizes="100vw" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-r from-silk-indigo/75 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h2 className="silk-headline text-2xl text-white">{content.name}</h2>
                    <p className="mt-1 text-sm text-silk-sand">{content.line}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
