import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";

const destinationKeys = [
  { key: "uzbekistan", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80" },
  { key: "kyrgyzstan", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { key: "china", image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80" },
  { key: "tajikistan", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { key: "turkmenistan", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80" },
  { key: "georgia", image: "https://images.unsplash.com/photo-1565007996395-3ab4ddc7a9b0?w=800&q=80" },
] as const;

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
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinationKeys.map(({ key, image }) => (
            <article
              key={key}
              className="group overflow-hidden rounded-3xl border border-silk-gold/20 bg-white shadow-sm transition hover:border-silk-gold/50 hover:shadow-xl hover:shadow-silk-gold/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`${key}.name`)}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/70 to-transparent" />
                <h2 className="absolute bottom-4 left-4 silk-headline text-2xl text-white">
                  {t(`${key}.name`)}
                </h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-apple-muted">{t(`${key}.desc`)}</p>
                <Button variant="silk" size="pill-sm" className="mt-4" asChild>
                  <Link href="/journeys">{t("bookCta")}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}