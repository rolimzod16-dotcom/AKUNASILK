import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import BookNowButton from "@/components/automation/BookNowButton";
import { Button } from "@/components/ui/button";

const serviceKeys = [
  "visa-support",
  "permits-gbao",
  "transport-rental",
  "drivers-guides",
  "accommodation",
  "tailor-made",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  return buildPageMetadata({
    locale,
    path: "/services-logistics",
    title: t("title"),
    description: t("subtitle"),
  });
}


export default async function ServicesLogisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="apple-section">
        <div className="mx-auto grid max-w-[900px] gap-4 px-6 sm:grid-cols-2">
          {serviceKeys.map((slug) => (
            <div
              key={slug}
              className="flex flex-col rounded-2xl border border-silk-gold/20 bg-white p-5 shadow-sm transition hover:border-silk-gold/50 hover:shadow-md"
            >
              <h2 className="silk-headline text-lg text-silk-indigo">
                {t(`items.${slug}.title`)}
              </h2>
              <p className="mt-2 flex-1 text-sm text-apple-muted">{t(`items.${slug}.desc`)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="silkOutline" size="pill-sm" asChild>
                  <Link href={`/services/${slug}`}>{t("learnMore")}</Link>
                </Button>
                <BookNowButton
                  variant="silk"
                  size="pill-sm"
                  prefill={{ source: "info-page", tourSlug: "any" }}
                  label={t("cta")}
                />
                <Button variant="link" size="sm" className="h-auto px-1 text-xs" asChild>
                  <Link href="/contact">{t("contactSpecialist")}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
