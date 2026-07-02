"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { getTravelStyleLabel } from "@/lib/travel-styles";
import { Button } from "@/components/ui/button";
import BookNowButton from "@/components/automation/BookNowButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type TourCardProps = {
  tour: Tour;
  content: TourContent;
  index?: number;
};

export default function TourCard({ tour, content, index = 0 }: TourCardProps) {
  const t = useTranslations("tours");
  const shop = useTranslations("shop");
  const locale = useLocale();

  const monthly = Math.round(tour.price / 12);
  const departure = new Date(tour.nextDeparture).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      <Card className="group h-full overflow-hidden border-silk-gold/25 py-0 shadow-none transition-all duration-500 hover:-translate-y-1 hover:border-silk-gold/60 hover:shadow-2xl hover:shadow-silk-gold/20">
        <Link href={`/journeys/${tour.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={tour.image}
              alt={content.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              <Badge className="bg-silk-indigo/90 text-silk-gold hover:bg-silk-indigo/90">
                {getTravelStyleLabel(tour.travelStyle, locale)}
              </Badge>
              {tour.bestseller && (
                <Badge className="bg-silk-gold text-silk-indigo hover:bg-silk-gold">
                  {shop("bestseller")}
                </Badge>
              )}
              {tour.spotsLeft && tour.spotsLeft <= 4 && (
                <Badge className="bg-silk-terracotta text-white hover:bg-silk-terracotta">
                  {t("spotsLeft", { count: tour.spotsLeft })}
                </Badge>
              )}
            </div>
          </div>
        </Link>

        <CardHeader className="gap-2 px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-apple-muted">
              <Star className="size-3.5 fill-silk-gold text-silk-gold" />
              <span className="font-medium text-silk-indigo">{tour.rating}</span>
              <span>({tour.reviews})</span>
            </div>
            <span className="text-xs text-silk-turquoise">{departure}</span>
          </div>
          <Link href={`/journeys/${tour.slug}`}>
            <h3 className="silk-headline text-xl text-silk-indigo transition group-hover:text-silk-gold">
              {content.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-xs text-apple-muted">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {tour.duration} {t("days")}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {countrySlugsToLabels(resolveTourCountrySlugs(tour), locale).join(" · ")}
            </span>
            <Badge variant="outline" className="border-silk-gold/30 text-[10px] font-semibold text-silk-indigo">
              {t(`difficulty.${tour.difficulty}`)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5">
          <ul className="space-y-1">
            {content.highlights
              .slice(0, 3)
              .map((h) => (
                <li key={h} className="flex items-center gap-2 text-xs text-apple-subtle">
                  <span className="size-1 shrink-0 rounded-full bg-silk-gold" />
                  {h}
                </li>
              ))}
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-silk-gold/15 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              {tour.originalPrice && (
                <span className="text-sm text-apple-muted line-through">
                  ${tour.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="silk-headline text-2xl text-gradient-silk">
                ${tour.price.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-apple-muted">
              {shop("perPerson")} · {shop("orMonthly", { price: monthly })}
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button variant="silkOutline" size="pill-sm" className="flex-1 sm:flex-none" asChild>
              <Link href={`/journeys/${tour.slug}`}>{shop("viewTrip")}</Link>
            </Button>
            <BookNowButton
              variant="silk"
              size="pill-sm"
              className="flex-1 sm:flex-none"
              prefill={{ tourSlug: tour.slug, source: "card" }}
              label={shop("getQuote")}
            />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}