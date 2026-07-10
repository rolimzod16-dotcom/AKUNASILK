import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { getTravelStyleLabel } from "@/lib/travel-styles";
import { resolveTourContent } from "@/lib/cms/tour-content";
import { Button } from "@/components/ui/button";
import TourDetailActions from "@/components/automation/TourDetailActions";
import TourDetailTabs from "@/components/tours/TourDetailTabs";
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
  const nav = await getTranslations({ locale, namespace: "nav" });

  const fullContent = resolveTourContent(tour, locale);
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
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-silk-indigo text-silk-gold hover:bg-silk-indigo">
              {getTravelStyleLabel(tour.travelStyle, locale)}
            </Badge>
            {tour.bestseller && (
              <Badge className="bg-silk-gold text-silk-indigo hover:bg-silk-gold">
                {shop("bestseller")}
              </Badge>
            )}
          </div>
          <h1 className="silk-headline text-4xl text-silk-indigo sm:text-5xl md:text-6xl">
            {content.title}
          </h1>
          <SilkDivider className="my-5" />
          <p className="apple-subhead mx-auto max-w-2xl text-xl text-apple-muted">
            {content.desc}
          </p>
          <p className="mt-4 text-sm text-apple-muted">
            {tour.duration} {t("days")} · {shop("perPerson")} · $
            {tour.price.toLocaleString(locale)}
          </p>
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
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 lg:grid-cols-[1fr_320px] lg:gap-12">
          <TourDetailTabs
            tour={tour}
            content={fullContent}
            departure={departure}
            locale={locale}
          />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-silk-gold/25 bg-white p-6 shadow-xl shadow-silk-gold/10">
              <div className="flex items-baseline gap-2">
                {tour.originalPrice && (
                  <span className="text-lg text-apple-muted line-through">
                    ${tour.originalPrice.toLocaleString(locale)}
                  </span>
                )}
                <span className="silk-headline text-4xl text-gradient-silk">
                  ${tour.price.toLocaleString(locale)}
                </span>
              </div>
              <p className="mt-1 text-sm text-apple-muted">{shop("perPerson")}</p>

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
                    {tour.duration} {t("days")} ·{" "}
                    {countrySlugsToLabels(resolveTourCountrySlugs(tour), locale).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-apple-subtle">
                  <Users className="size-4 text-silk-turquoise" />
                  <span>
                    {t(`difficulty.${tour.difficulty}`)} · {shop("available")}
                  </span>
                </div>
              </div>

              <TourDetailActions
                slug={slug}
                price={tour.price}
                nextDeparture={tour.nextDeparture}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-silk-gold/20 bg-silk-sand/50 py-12 silk-pattern">
        <div className="mx-auto max-w-[980px] px-6 text-center">
          <p className="text-sm text-apple-muted">{shop("compareHint")}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Button variant="link" className="mt-0" asChild>
              <Link href="/journeys">{nav("journeys")} ›</Link>
            </Button>
            <Button variant="link" className="mt-0" asChild>
              <Link href="/destinations">{nav("destinations")} ›</Link>
            </Button>
            <Button variant="link" className="mt-0" asChild>
              <Link href="/services/tailor-made">{nav("planYourJourney")} ›</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}