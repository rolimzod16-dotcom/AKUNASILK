import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  getCountriesByCorridor,
  getCorridorLabel,
  SILK_ROAD_CORRIDORS,
  type CountrySlug,
} from "@/lib/countries";

const DESTINATION_IMAGES: Record<CountrySlug, string> = {
  china: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80",
  kazakhstan: "https://images.unsplash.com/photo-1517824801-6512-773c5b6a8f0?w=800&q=80",
  kyrgyzstan: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  uzbekistan: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
  turkmenistan: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
  tajikistan: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  afghanistan: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80",
  iran: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
  pakistan: "https://images.unsplash.com/photo-1584551246679-0daf3d849d1c?w=800&q=80",
  india: "https://images.unsplash.com/photo-1524492412937-280ceb9ccd21?w=800&q=80",
  georgia: "https://images.unsplash.com/photo-1565007996395-3ab4ddc7a9b0?w=800&q=80",
  armenia: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
  azerbaijan: "https://images.unsplash.com/photo-1590073242678-ac2a4a9163bb?w=800&q=80",
  turkey: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.destinations" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.destinations" });
  const t = await getTranslations({ locale, namespace: "destinations" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] space-y-14 px-6">
          {SILK_ROAD_CORRIDORS.map((corridor) => {
            const countries = getCountriesByCorridor(corridor);
            if (countries.length === 0) return null;

            return (
              <div key={corridor}>
                <h2 className="silk-headline mb-1 text-2xl text-silk-indigo">
                  {getCorridorLabel(corridor, locale)}
                </h2>
                <p className="mb-5 text-sm text-apple-muted">
                  {t(`corridors.${corridor}`)}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {countries.map((key) => (
                    <article
                      key={key}
                      className="group overflow-hidden rounded-3xl border border-silk-gold/20 bg-white shadow-sm transition hover:border-silk-gold/50 hover:shadow-xl hover:shadow-silk-gold/10"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={DESTINATION_IMAGES[key]}
                          alt={t(`${key}.name`)}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/70 to-transparent" />
                        <h3 className="absolute bottom-4 left-4 silk-headline text-2xl text-white">
                          {t(`${key}.name`)}
                        </h3>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-apple-muted">{t(`${key}.desc`)}</p>
                        <Button variant="silk" size="pill-sm" className="mt-4" asChild>
                          <Link href={`/journeys?country=${key}`}>{t("bookCta")}</Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}