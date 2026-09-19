import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getHomeDestinations, getDestinationContent } from "@/lib/cms/destinations";

export default async function HomeDestinations({ locale }: { locale: string }) {
  const t = await getTranslations("home.destinations");
  const items = await getHomeDestinations();
  const cards = items.filter((item) => !item.wide);
  const wide = items.filter((item) => item.wide);

  if (items.length === 0) return null;

  return (
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

        {wide.map((item) => {
          const content = getDestinationContent(item, locale);
          return (
            <Link
              key={item.id}
              href={`/destinations/${item.slug}`}
              className="group relative mt-4 block overflow-hidden rounded-2xl border border-silk-gold/20"
            >
              <div className="relative aspect-[21/7] min-h-[180px]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={`${content.name} — ${content.line}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-silk-indigo" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-silk-indigo/80 via-silk-indigo/40 to-transparent" />
              </div>
              <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 sm:p-8">
                <p className="silk-headline text-2xl text-white sm:text-3xl">{content.name}</p>
                <p className="mt-1 text-sm text-silk-sand/90 sm:text-base">{content.line}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
