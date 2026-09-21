import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import TourCard from "@/components/tours/TourCard";
import BookNowButton from "@/components/automation/BookNowButton";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import {
  getCountryLabel,
  isCountrySlug,
  tourMatchesCountry,
  type CountrySlug,
} from "@/lib/countries";
import { getCatalogTours, getTourContent, tourShowsPrice } from "@/lib/data/tours";
import { getTravelStyleLabel, type TravelStyle } from "@/lib/travel-styles";
import {
  getAllDestinations,
  getDestinationContent,
  getPublishedDestinationBySlug,
} from "@/lib/cms/destinations";
import { getSiteSettings } from "@/lib/cms/settings";

/** Active GST destinations with real products / landings */
const ACTIVE_COUNTRIES: CountrySlug[] = [
  "tajikistan",
  "uzbekistan",
  "kyrgyzstan",
  "kazakhstan",
];

const COUNTRY_NOTES: Record<
  CountrySlug,
  { why: string; season: string; practical: string; visa: string }
> = {
  tajikistan: {
    why: "Pamir Highway, Wakhan views, and high-altitude village hospitality on the roof of the world.",
    season: "Best overland windows: late May–September for high passes; shoulder months for lower valleys.",
    practical: "Altitude, long driving days, and GBAO permit planning are central to itinerary design.",
    visa: "Entry rules vary by nationality. GST provides visa support and timing guidance — no visa guarantee.",
  },
  kyrgyzstan: {
    why: "Jailoos, Issyk-Kul, horse culture, and mountain corridors linking China to Central Asia.",
    season: "June–September for high pastures; city and lake travel works longer into the year.",
    practical: "Combine with Uzbekistan or Tajikistan for multi-country overland routes.",
    visa: "Many nationalities enjoy simplified entry; we confirm requirements with your passport.",
  },
  uzbekistan: {
    why: "Samarkand, Bukhara, and Khiva — classic Silk Road city culture and architecture.",
    season: "Spring and autumn for comfortable city walking; summer is hot, winter quiet.",
    practical: "Excellent base for first-time Silk Road travelers and culture-led packages.",
    visa: "E-visa and visa-free options exist for many passports; we guide the process per nationality.",
  },
  kazakhstan: {
    why: "Steppe landscapes and northern corridors between China and Central Asia.",
    season: "Late spring to early autumn for overland comfort.",
    practical: "Often paired with Kyrgyzstan or China Silk Road modules.",
    visa: "Requirements vary; share nationality early for accurate guidance.",
  },
  china: {
    why: "Eastern Silk Road origins — Xi’an, Dunhuang, and desert oasis corridors.",
    season: "Spring and autumn preferred for desert and cave sites.",
    practical: "Logistics and site tickets are coordinated with local specialists.",
    visa: "China visas are nationality-dependent; GST supports invitation and checklist guidance only.",
  },
  pakistan: {
    why: "Karakoram scenery and high-mountain overland drama on the southern branch.",
    season: "Summer for high passes; exact windows depend on route and conditions.",
    practical: "4x4 suitability and local guides are essential for remote segments.",
    visa: "Visa process is case-by-case; no guarantee of embassy approval.",
  },
  turkmenistan: {
    why: "Karakum desert, Merv heritage, and caravan atmosphere unique on the corridor.",
    season: "Spring and autumn to avoid extreme heat.",
    practical: "Guided logistics and permit timing are critical — plan early.",
    visa: "Invitation and guided process usually required; GST coordinates with partners, no approval guarantee.",
  },
  iran: {
    why: "Persian plateau cities and historic westward Silk Road arteries.",
    season: "Spring and autumn for city and desert comfort.",
    practical: "Cultural etiquette and route planning are part of pre-trip briefings.",
    visa: "Nationality-dependent; GST assists with documentation guidance only.",
  },
  turkey: {
    why: "Anatolian western gateway where overland Silk Road stories meet the Mediterranean world.",
    season: "Spring and autumn for balanced weather on classic routes.",
    practical: "Often used as a western extension or arrival hub.",
    visa: "Many travelers use e-visa systems; confirm your nationality rules before booking.",
  },
  afghanistan: {
    why: "Historic southern crossroads — currently not offered as a standard GST product landing.",
    season: "—",
    practical: "Contact us only for specialist historical context; not a standard tour market.",
    visa: "Not actively sold as standard itineraries.",
  },
  india: {
    why: "Southern terminus of historic caravan trade — listed for corridor context.",
    season: "—",
    practical: "Standard GST packages focus on core Silk Road land corridors above.",
    visa: "Not a primary GST fixed-price destination at this time.",
  },
  georgia: {
    why: "Caucasus transit culture between Caspian and Black Sea networks.",
    season: "Late spring to early autumn.",
    practical: "Available as culture extensions where packaged.",
    visa: "Confirm nationality rules before travel.",
  },
  armenia: {
    why: "Highland monasteries and Caucasus crossroads culture.",
    season: "Late spring to early autumn.",
    practical: "Often combined with neighboring Caucasus routes when offered.",
    visa: "Confirm nationality rules before travel.",
  },
  azerbaijan: {
    why: "Caspian corridor linking Central Asian silk narratives westward.",
    season: "Spring and autumn preferred.",
    practical: "Included when relevant to multi-country packages.",
    visa: "Confirm nationality rules before travel.",
  },
};

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((item) => ({ country: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const cms = await getPublishedDestinationBySlug(country);
  if (cms) {
    const content = getDestinationContent(cms, locale);
    return buildPageMetadata({
      locale,
      path: `/destinations/${country}`,
      title: content.seoTitle || `${content.name} tours | Great Silk Trails`,
      description: content.seoDescription || content.intro || content.line,
    });
  }
  if (!isCountrySlug(country) || !ACTIVE_COUNTRIES.includes(country)) {
    return { title: "Great Silk Trails" };
  }
  const name = getCountryLabel(country, locale);
  return buildPageMetadata({
    locale,
    path: `/destinations/${country}`,
    title: `${name} tours | Great Silk Trails`,
    description: `Travel ${name} with local teams who understand the roads, permits and communities.`,
  });
}

export default async function CountryLandingPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const cms = await getPublishedDestinationBySlug(country);
  if (!cms && (!isCountrySlug(country) || !ACTIVE_COUNTRIES.includes(country))) notFound();

  const t = await getTranslations({ locale, namespace: "pages.countryLanding" });
  const dest = await getTranslations({ locale, namespace: "destinations" });
  const cmsContent = cms ? getDestinationContent(cms, locale) : null;
  const name =
    cmsContent?.name ||
    (isCountrySlug(country) ? getCountryLabel(country, locale) : country);
  const notes = isCountrySlug(country) ? COUNTRY_NOTES[country] : undefined;
  const settings = await getSiteSettings();

  const tours = (await getCatalogTours()).filter((tour) =>
    isCountrySlug(country)
      ? tourMatchesCountry(tour, country)
      : (tour.countrySlugs as string[] | undefined)?.includes(country)
  );
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
    showPrice: tourShowsPrice(tour, settings.showPrices),
  }));

  const styles = Array.from(
    new Set(tours.map((tour) => tour.travelStyle).filter(Boolean))
  ) as TravelStyle[];

  const signatureRoutes = items.slice(0, 4);

  return (
    <>
      <PageHero
        title={
          country === "tajikistan"
            ? "Tajikistan tours and Pamir journeys"
            : cmsContent?.name || name
        }
        subtitle={cmsContent?.intro || cmsContent?.line || notes?.why || name}
        image={cms?.image}
        imageAlt={`${cmsContent?.name || name} — ${cmsContent?.line || "Silk Road destination"}`}
      />

      <section className="apple-section">
        <div className="mx-auto max-w-[900px] space-y-8 px-6">
          <div>
            <h2 className="silk-headline text-xl text-silk-indigo">{t("overview")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-muted">
              {cmsContent?.intro || notes?.why || ""}
            </p>
          </div>
          <div>
            <h2 className="silk-headline text-xl text-silk-indigo">{t("whyGo")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-muted">
              {cmsContent?.why || notes?.why || ""}
            </p>
          </div>
          <div>
            <h2 className="silk-headline text-xl text-silk-indigo">{t("bestSeason")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-muted">
              {cmsContent?.season || notes?.season || cms?.bestTime || ""}
            </p>
          </div>
          <div>
            <h2 className="silk-headline text-xl text-silk-indigo">{t("practical")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-muted">
              {cmsContent?.practical || notes?.practical || ""}
            </p>
          </div>
          <div>
            <h2 className="silk-headline text-xl text-silk-indigo">{t("visaNotes")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-muted">
              {cmsContent?.visa || notes?.visa || ""}
            </p>
          </div>
          {styles.length > 0 && (
            <div>
              <h2 className="silk-headline text-xl text-silk-indigo">{t("styles")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {styles.map((style) => (
                  <Link
                    key={style}
                    href={`/journeys?country=${country}&style=${style}`}
                    className="rounded-full border border-silk-gold/30 bg-white px-3 py-1.5 text-xs font-semibold text-silk-indigo hover:border-silk-gold"
                  >
                    {getTravelStyleLabel(style, locale)}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {signatureRoutes.length > 0 && (
            <div>
              <h2 className="silk-headline text-xl text-silk-indigo">{t("signatureRoutes")}</h2>
              <ul className="mt-3 space-y-2">
                {signatureRoutes.map(({ tour, content }) => (
                  <li key={tour.id}>
                    <Link
                      href={`/journeys/${tour.slug}`}
                      className="text-sm font-semibold text-silk-gold hover:underline"
                    >
                      {content.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="silk" size="pill" asChild>
              <Link href={`/journeys?country=${country}`}>{t("viewTours")}</Link>
            </Button>
            <BookNowButton
              variant="silkOutline"
              size="pill"
              prefill={{
                source: "info-page",
                tourSlug: "any",
                notes: `Plan a journey to ${name}`,
              }}
              label={t("planJourney", { country: name })}
            />
          </div>
        </div>
      </section>

      <section className="apple-section border-t border-silk-gold/15">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="silk-headline text-2xl text-silk-indigo">{t("availableTours")}</h2>
          {items.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ tour, content, showPrice }, i) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  content={content}
                  index={i}
                  showPrice={showPrice}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-apple-muted">
              No fixed-price tours listed for this destination right now. Plan a private journey instead.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
