import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check, Star, Calendar, MapPin, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { Button } from "@/components/ui/button";
import TourDetailActions from "@/components/automation/TourDetailActions";
import { Badge } from "@/components/ui/badge";
import SilkDivider from "@/components/shared/SilkDivider";

type TourDetailViewProps = {
  tour: Tour;
  slug: string;
  locale: string;
  content: TourContent;
};

export default async function TourDetailView({ tour, slug, locale, content }: TourDetailViewProps) {
  const t = await getTranslations({ locale, namespace: "tours" });
  const shop = await getTranslations({ locale, namespace: "shop" });
  const pricing = await getTranslations({ locale, namespace: "pricing" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const highlights = content.highlights;
  const included = pricing.raw("includedItems") as string[];
  const monthly = Math.round(tour.price / 12);
  const departure = new Date(tour.nextDeparture).toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-silk-cream">
      <section className="silk-gradient-hero silk-pattern pt-14">
        <div className="mx-auto max-w-[980px] px-6 pt-12 text-center">
          {tour.bestseller && (
            <Badge className="mb-3 bg-silk-gold text-silk-indigo hover:bg-silk-gold">
              {shop("bestseller")}
            </Badge>
          )}
          <h1 className="silk-headline text-4xl text-silk-indigo sm:text-5xl md:text-6xl">
            {content.title}
          </h1>
          <SilkDivider className="my-5" />
          <p className="apple-subhead mx-auto max-w-2xl text-xl text-apple-muted">
            {content.desc}
          </p>
          <div className="mt-4 flex items-center justify-center gap-1 text-sm">
            <Star className="size-4 fill-silk-gold text-silk-gold" />
            <span className="font-semibold text-silk-indigo">{tour.rating}</span>
            <span className="text-apple-muted">
              · {tour.reviews} {shop("reviews")}
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-[1100px] px-6 pb-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl silk-frame">
            <Image
              src={tour.image}
              alt={content.title}
              fill
              className="object-cover"
              priority
              sizes="1100px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/40 to-transparent" />
          </div>
        </div>
      </section>

      <section className="apple-section">
        <div className="mx-auto grid max-w-[980px] gap-12 px-6 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="silk-headline text-2xl text-silk-indigo">
              {shop("packageIncludes")}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-apple-subtle">
                  <Check className="size-4 text-silk-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="silk-headline mt-12 text-2xl text-silk-indigo">
              {shop("highlights")}
            </h2>
            <ul className="mt-6 space-y-3">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-3 rounded-xl border border-silk-gold/15 bg-white px-4 py-3 text-sm text-silk-indigo"
                >
                  <span className="size-2 rounded-full bg-silk-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-3xl border border-silk-gold/25 bg-white p-6 shadow-xl shadow-silk-gold/10">
              <div className="flex items-baseline gap-2">
                {tour.originalPrice && (
                  <span className="text-lg text-apple-muted line-through">
                    ${tour.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="silk-headline text-4xl text-gradient-silk">
                  ${tour.price.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-apple-muted">
                {shop("orMonthly", { price: monthly })}
              </p>

              <div className="mt-6 space-y-3 border-t border-silk-gold/20 pt-6 text-sm">
                <div className="flex items-center gap-3 text-apple-subtle">
                  <Calendar className="size-4 text-silk-turquoise" />
                  <span>
                    {shop("nextDeparture")}:{" "}
                    <strong className="text-silk-indigo">{departure}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-apple-subtle">
                  <MapPin className="size-4 text-silk-turquoise" />
                  <span>
                    {tour.duration} {t("days")} · {tour.countries.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-apple-subtle">
                  <Users className="size-4 text-silk-turquoise" />
                  <span>
                    {t(`difficulty.${tour.difficulty}`)} ·{" "}
                    {tour.spotsLeft
                      ? t("spotsLeft", { count: tour.spotsLeft })
                      : shop("available")}
                  </span>
                </div>
              </div>

              <TourDetailActions
                slug={slug}
                price={tour.price}
                spotsLeft={tour.spotsLeft}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-silk-gold/20 bg-silk-sand/50 py-12 silk-pattern">
        <div className="mx-auto max-w-[980px] px-6 text-center">
          <p className="text-sm text-apple-muted">{shop("compareHint")}</p>
          <Button variant="link" className="mt-2" asChild>
            <Link href="/journeys">{nav("journeys")} ›</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}