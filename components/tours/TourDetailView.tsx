import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Tour, TourContent } from "@/lib/data/tours";
import { countrySlugsToLabels, resolveTourCountrySlugs } from "@/lib/countries";
import { getTravelStyleLabel } from "@/lib/travel-styles";
import { resolveTourContent } from "@/lib/cms/tour-content";
import { Button } from "@/components/ui/button";
import TourDetailActions from "@/components/automation/TourDetailActions";
import TourAnchorNav from "@/components/tours/TourAnchorNav";
import { getSiteSettings } from "@/lib/cms/settings";
import { tourShowsPrice } from "@/lib/cms/tours";
import { getCatalogTours, getTourContent } from "@/lib/data/tours";
import { getPublishedReviews } from "@/lib/cms/reviews";
import TourCard from "@/components/tours/TourCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TourDetailViewProps = {
  tour: Tour;
  slug: string;
  locale: string;
  content: TourContent;
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-silk-gold/15 py-10 last:border-0">
      <h2 className="silk-headline text-2xl text-silk-indigo sm:text-3xl">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-apple-muted">{children}</div>
    </section>
  );
}

export default async function TourDetailView({ tour, slug, locale, content }: TourDetailViewProps) {
  const t = await getTranslations({ locale, namespace: "tours" });
  const shop = await getTranslations({ locale, namespace: "shop" });
  const fullContent = resolveTourContent(tour, locale);
  const settings = await getSiteSettings();
  const showPrice = tourShowsPrice(tour, settings.showPrices);
  const countries = countrySlugsToLabels(resolveTourCountrySlugs(tour), locale);
  const difficulty =
    tour.difficulty === "adventurous" ? "Challenging" : t(`difficulty.${tour.difficulty}`);

  const [related, reviews] = await Promise.all([
    getCatalogTours(),
    settings.showReviews ? getPublishedReviews() : Promise.resolve([]),
  ]);
  const relatedTours = related
    .filter((item) => item.slug !== slug)
    .filter((item) =>
      item.countrySlugs.some((c) => tour.countrySlugs.includes(c))
    )
    .slice(0, 3);
  const tourReviews = reviews.filter((item) => item.tourSlug === slug).slice(0, 3);

  const fallback =
    "Details are confirmed with your itinerary after we review your request.";

  return (
    <div className="bg-silk-cream">
      <section className="border-b border-silk-gold/15 pt-20 sm:pt-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-6 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:pb-14">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silk-gold">
              {getTravelStyleLabel(tour.travelStyle, locale)} · {countries.join(" · ")}
            </p>
            <h1 className="silk-headline mt-3 text-3xl text-silk-indigo sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-apple-muted sm:text-lg">
              {content.desc}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-silk-indigo sm:grid-cols-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Duration</dt>
                <dd className="mt-0.5 font-semibold">
                  {tour.duration} {t("days")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Difficulty</dt>
                <dd className="mt-0.5 font-semibold">{difficulty}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Group</dt>
                <dd className="mt-0.5 font-semibold">
                  {t("groupUpTo", { count: tour.maxGroupSize ?? 12 })}
                </dd>
              </div>
              {tour.startLocation ? (
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Start</dt>
                  <dd className="mt-0.5 font-semibold">{tour.startLocation}</dd>
                </div>
              ) : null}
              {tour.finishLocation ? (
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Finish</dt>
                  <dd className="mt-0.5 font-semibold">{tour.finishLocation}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-apple-muted">Price</dt>
                <dd className="mt-0.5 font-semibold">
                  {showPrice ? `$${tour.price.toLocaleString(locale)}` : shop("requestQuote")}
                </dd>
              </div>
            </dl>
            <div className="mt-6 max-w-sm">
              <TourDetailActions slug={slug} nextDeparture={undefined} />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-silk-indigo shadow-xl">
            <Image
              src={tour.image}
              alt={`${content.title} — ${countries.join(", ")}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <TourAnchorNav />

      <div className="mx-auto max-w-[860px] px-6 py-4">
        <Section id="overview" title="Overview">
          <p>{fullContent.overview || content.desc || fallback}</p>
        </Section>

        <Section id="highlights" title="Highlights">
          {fullContent.highlights.length > 0 ? (
            <ul className="space-y-2">
              {fullContent.highlights.slice(0, 6).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-silk-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{fallback}</p>
          )}
        </Section>

        <Section id="itinerary" title="Itinerary">
          {fullContent.itinerary && fullContent.itinerary.length > 0 ? (
            <ol className="space-y-5">
              {fullContent.itinerary.map((day) => (
                <li key={day.day}>
                  <p className="font-semibold text-silk-indigo">
                    Day {day.day} · {day.title}
                  </p>
                  <p className="mt-1">{day.description}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p>{fallback}</p>
          )}
        </Section>

        <Section id="dates" title="Dates and price">
          <p>
            {showPrice
              ? `From $${tour.price.toLocaleString(locale)} per person. Private departure on request.`
              : "Private departure on request. We confirm availability and a written quote before any payment."}
          </p>
        </Section>

        <Section id="included" title="Included and not included">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-silk-indigo">Included</h3>
              <ul className="mt-2 space-y-1">
                {(fullContent.included?.length ? fullContent.included : [fallback]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-silk-indigo">Not included</h3>
              <ul className="mt-2 space-y-1">
                {(fullContent.excluded?.length ? fullContent.excluded : [fallback]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="practical" title="Practical information">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-silk-indigo">Transport and team</h3>
              <p className="mt-1">{fallback}</p>
            </div>
            <div>
              <h3 className="font-semibold text-silk-indigo">Difficulty and altitude</h3>
              <p className="mt-1">
                Level: {difficulty}. Altitude, road conditions and health requirements are confirmed
                with your itinerary.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-silk-indigo">Permits and visa</h3>
              <p className="mt-1">
                GST can advise on visas and special permits such as GBAO. Official rules vary by
                nationality and season.
              </p>
            </div>
          </div>
        </Section>

        <Section id="gallery" title="Gallery">
          {fullContent.gallery && fullContent.gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fullContent.gallery.slice(0, 12).map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={src} alt={`${content.title} route photograph`} fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </div>
          ) : (
            <p>Photographs of this route will be published after GST approval.</p>
          )}
        </Section>

        {tourReviews.length > 0 ? (
          <Section id="reviews" title="Guest notes">
            <div className="space-y-4">
              {tourReviews.map((item) => (
                <blockquote key={item.id} className="rounded-xl border border-silk-gold/20 bg-white p-4">
                  <p>“{item.text}”</p>
                  <footer className="mt-2 text-sm font-semibold text-silk-indigo">
                    {item.guestName}
                    {item.country ? `, ${item.country}` : ""} · {item.year}
                  </footer>
                </blockquote>
              ))}
            </div>
          </Section>
        ) : null}

        <Section id="faq" title="FAQ">
          {fullContent.faq && fullContent.faq.length > 0 ? (
            <Accordion type="single" collapsible>
              {fullContent.faq.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>{fallback}</p>
          )}
        </Section>
      </div>

      {relatedTours.length > 0 ? (
        <section className="border-t border-silk-gold/15 bg-white py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <h2 className="silk-headline text-2xl text-silk-indigo">Related journeys</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedTours.map((item, index) => (
                <TourCard
                  key={item.id}
                  tour={item}
                  content={getTourContent(item, locale)}
                  index={index}
                  showPrice={tourShowsPrice(item, settings.showPrices)}
                />
              ))}
            </div>
            <div className="mt-8">
              <Button variant="silkOutline" size="pill" asChild>
                <Link href="/journeys">View all journeys</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
