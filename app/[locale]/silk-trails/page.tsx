import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import BookNowButton from "@/components/automation/BookNowButton";
import { Button } from "@/components/ui/button";
import SilkRoadSection from "@/components/home/SilkRoadSection";

const FLAGSHIP_TRAILS = [
  { key: "tourChina", href: "/journeys/silk-road-origins-trail-china" },
  { key: "tourKyrgyzstan", href: "/journeys/nomads-mountains-silk-trail-kyrgyzstan" },
  { key: "tourUzbekistan", href: "/journeys/golden-cities-silk-trail-uzbekistan" },
  { key: "tourTajikistan", href: "/journeys/pamir-silk-trail-tajikistan-flagship" },
  { key: "tourKazakhstan", href: "/journeys/great-steppe-silk-trail-kazakhstan" },
  { key: "tourTurkmenistan", href: "/journeys/caravan-desert-silk-trail-turkmenistan" },
  { key: "tourPakistan", href: "/journeys/karakoram-silk-trail-pakistan" },
  { key: "tourIran", href: "/journeys/persian-silk-trail-iran" },
  { key: "tourTurkey", href: "/journeys/anatolian-silk-trail-turkey" },
] as const;

const BRANCHES = [
  { key: "pamir", href: "/journeys?region=pamir" },
  { key: "wakhan", href: "/journeys?region=pamir" },
  { key: "fann", href: "/journeys?country=tajikistan" },
  { key: "bartang", href: "/journeys?country=tajikistan" },
  { key: "sarez", href: "/journeys?country=tajikistan" },
  { key: "karakoram", href: "/journeys?country=pakistan" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.silkTrails" });
  return buildPageMetadata({
    locale,
    path: "/silk-trails",
    title: t("title"),
    description: t("subtitle"),
  });
}


export default async function SilkTrailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.silkTrails" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="apple-section">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-base leading-relaxed text-apple-muted">{t("intro")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="silk" size="pill" asChild>
              <Link href="/journeys">{t("ctaTours")}</Link>
            </Button>
            <BookNowButton
              variant="silkOutline"
              size="pill"
              prefill={{ source: "info-page", tourSlug: "any" }}
              label={t("ctaPlan")}
            />
          </div>
        </div>
      </section>

      <SilkRoadSection />

      <section className="apple-section border-t border-silk-gold/15">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="silk-headline text-2xl text-silk-indigo sm:text-3xl">
            {t("flagshipsTitle")}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FLAGSHIP_TRAILS.map((trail) => (
              <Link
                key={trail.key}
                href={trail.href}
                className="rounded-2xl border border-silk-gold/20 bg-white p-5 shadow-sm transition hover:border-silk-gold/50 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-silk-indigo">{nav(trail.key)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="apple-section silk-pattern border-t border-silk-gold/15">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="silk-headline text-2xl text-silk-indigo sm:text-3xl">
            {t("branchesTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {BRANCHES.map((b) => (
              <Link
                key={b.key}
                href={b.href}
                className="rounded-full border border-silk-gold/30 bg-white px-4 py-2 text-sm font-medium text-silk-indigo transition hover:border-silk-gold hover:bg-silk-gold/10"
              >
                {t(`branches.${b.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
