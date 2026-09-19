"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { getTravelStyleLabel } from "@/lib/travel-styles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type TourCardProps = {
  tour: Tour;
  content: TourContent;
  index?: number;
  showPrice?: boolean;
};

export default function TourCard({ tour, content, index = 0, showPrice = false }: TourCardProps) {
  const t = useTranslations("tours");
  const shop = useTranslations("shop");
  const locale = useLocale();

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
              alt={`${content.title} Silk Road tour`}
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
            </div>
          </div>
        </Link>

        <CardHeader className="gap-2 px-5 pt-5 pb-0">
          <Link href={`/journeys/${tour.slug}`}>
            <h3 className="silk-headline line-clamp-2 text-xl text-silk-indigo transition group-hover:text-silk-gold">
              {content.title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-apple-muted">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {countrySlugsToLabels(resolveTourCountrySlugs(tour), locale).join(" · ")}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {tour.duration} {t("days")}
            </span>
            <span>{getTravelStyleLabel(tour.travelStyle, locale)}</span>
            <Badge variant="outline" className="border-silk-gold/30 text-[10px] font-semibold text-silk-indigo">
              {tour.difficulty === "adventurous" ? "Challenging" : t(`difficulty.${tour.difficulty}`)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5">
          {content.highlights[0] && (
            <p className="line-clamp-1 text-sm text-apple-subtle">{content.highlights[0]}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-silk-gold/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-silk-indigo">
            {showPrice ? `$${tour.price.toLocaleString()}` : shop("requestQuote")}
          </p>
          <Button variant="silk" size="pill-sm" className="w-full sm:w-auto" asChild>
            <Link href={`/journeys/${tour.slug}`}>{shop("viewTrip")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
