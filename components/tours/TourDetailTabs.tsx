"use client";

import Image from "next/image";
import { Check, X, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BookNowButton from "@/components/automation/BookNowButton";
import { formatDepartureDate, getTourDepartures } from "@/lib/tours/departures";

type TourDetailTabsProps = {
  tour: Tour;
  content: Required<TourContent>;
  departure: string;
  locale: string;
};

export default function TourDetailTabs({
  tour,
  content,
  locale,
}: TourDetailTabsProps) {
  const t = useTranslations("tours.detail");
  const toursT = useTranslations("tours");
  const shop = useTranslations("shop");
  const loc = useLocale();

  const departures = getTourDepartures(tour, loc);

  const tabItems = [
    ["about", t("tabs.about")],
    ["itinerary", t("tabs.itinerary")],
    ["dates", t("tabs.dates")],
    ["included", t("tabs.included")],
    ["gallery", t("tabs.gallery")],
    ["faq", t("tabs.faq")],
  ] as const;

  return (
    <Tabs defaultValue="about" className="w-full">
      <div className="sticky top-[60px] z-20 -mx-1 border-b border-silk-gold/20 bg-silk-cream/95 px-1 py-2 backdrop-blur-md">
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0"
        >
          {tabItems.map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-apple-muted data-active:border-silk-gold data-active:bg-transparent data-active:text-silk-indigo sm:text-xs"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="about" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-silk-gold">
          {t("aboutLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.about")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />
        <p className="mt-6 text-base leading-relaxed text-apple-muted">{content.overview}</p>

        <h3 className="silk-headline mt-10 text-xl text-silk-indigo">{shop("highlights")}</h3>
        <ul className="mt-4 space-y-3">
          {content.highlights.map((h) => (
            <li
              key={h}
              className="flex items-center gap-3 rounded-xl border border-silk-gold/15 bg-white px-4 py-3 text-sm text-silk-indigo"
            >
              <span className="size-2 rounded-full bg-silk-gold" />
              {h}
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="itinerary" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-silk-gold">
          {t("itineraryLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.itinerary")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />
        <ol className="mt-8 space-y-0">
          {content.itinerary.map((day, index) => (
            <li key={day.day} className="relative flex gap-4 pb-8 last:pb-0">
              {index < content.itinerary.length - 1 && (
                <span className="absolute left-5 top-12 bottom-0 w-px bg-silk-gold/30" />
              )}
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-silk-indigo text-sm font-bold text-silk-gold">
                {day.day}
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="font-semibold text-silk-indigo">{day.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-apple-muted">{day.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </TabsContent>

      <TabsContent value="dates" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-silk-gold">
          {t("datesLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.dates")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />

        <div className="mt-6 overflow-x-auto rounded-2xl border border-silk-gold/20 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-silk-gold/15 bg-silk-cream/60 text-[10px] font-bold uppercase tracking-wider text-apple-muted">
              <tr>
                <th className="px-4 py-3">{t("tableDeparture")}</th>
                <th className="px-4 py-3">{t("tableStatus")}</th>
                <th className="px-4 py-3">{t("tablePlaces")}</th>
                <th className="px-4 py-3">{t("tableSingle")}</th>
                <th className="px-4 py-3">{t("tablePrice")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {departures.map((dep) => (
                <tr key={dep.date} className="border-b border-silk-gold/10 last:border-0">
                  <td className="px-4 py-3 font-semibold text-silk-indigo">
                    {formatDepartureDate(dep.date, locale)}
                  </td>
                  <td className="px-4 py-3 text-apple-muted capitalize">{dep.status}</td>
                  <td className="px-4 py-3 text-apple-subtle">{dep.placesLabel}</td>
                  <td className="px-4 py-3 text-apple-muted">
                    {dep.singleSupplement
                      ? `+$${dep.singleSupplement.toLocaleString(locale)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-silk-indigo">
                    ${tour.price.toLocaleString(locale)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BookNowButton
                      variant="silk"
                      size="pill-sm"
                      prefill={{
                        tourSlug: tour.slug,
                        preferredDate: dep.date,
                        price: tour.price,
                        source: "card",
                      }}
                      label={t("bookDeparture")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-silk-gold/20 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-apple-muted">
              {t("durationLabel")}
            </p>
            <p className="mt-2 text-lg font-semibold text-silk-indigo">
              {tour.duration} {toursT("days")}
            </p>
          </div>
          <div className="rounded-2xl border border-silk-gold/20 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-apple-muted">
              {t("groupLabel")}
            </p>
            <p className="mt-2 text-lg font-semibold text-silk-indigo">
              {t("groupValue", { count: tour.maxGroupSize ?? 12 })}
            </p>
          </div>
        </div>
        <p className="mt-6 flex items-start gap-2 text-sm text-apple-muted">
          <MapPin className="mt-0.5 size-4 shrink-0 text-silk-turquoise" />
          {t("datesNote")}
        </p>
      </TabsContent>

      <TabsContent value="included" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-wide text-silk-gold">
          {t("includedLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.included")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />
        <p className="mt-4 text-sm text-apple-muted">{t("includedNote")}</p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-silk-indigo">
              {t("includedTitle")}
            </h3>
            <ul className="mt-4 space-y-2">
              {content.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-apple-subtle">
                  <Check className="mt-0.5 size-4 shrink-0 text-silk-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-silk-terracotta">
              {t("excludedTitle")}
            </h3>
            <ul className="mt-4 space-y-2">
              {content.excluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-apple-muted">
                  <X className="mt-0.5 size-4 shrink-0 text-silk-terracotta/80" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="gallery" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-silk-gold">
          {t("galleryLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.gallery")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {content.gallery.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden rounded-2xl silk-frame ${i === 0 ? "sm:col-span-2 aspect-[16/7]" : "aspect-[4/3]"}`}
            >
              <Image
                src={src}
                alt={`${content.title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
                unoptimized={src.startsWith("/uploads/")}
              />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="faq" className="mt-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-silk-gold">
          {t("faqLabel")}
        </p>
        <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">{t("tabs.faq")}</h2>
        <div className="mt-1 h-0.5 w-12 bg-silk-gold" />
        <Accordion
          type="single"
          collapsible
          className="mt-6 rounded-2xl border border-silk-gold/20 bg-white px-4"
        >
          {content.faq.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-silk-indigo hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-apple-muted">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-4 text-xs text-apple-muted">
          {t("policyLinks")}{" "}
          <Link href="/cancellation" className="font-semibold text-silk-gold hover:underline">
            Cancellation Policy
          </Link>
          {" · "}
          <Link href="/terms" className="font-semibold text-silk-gold hover:underline">
            Terms of Service
          </Link>
        </p>
      </TabsContent>
    </Tabs>
  );
}
