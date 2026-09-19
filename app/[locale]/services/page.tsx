import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { SERVICE_PAGES, planJourneyHref } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/services",
    title: "Travel Services | Great Silk Trails",
    description:
      "Arrange transport, guides, visa support, permits or a tailor-made route with one local team.",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });

  return (
    <>
      <PageHero
        title="Travel services"
        subtitle="Need part of the journey, not a full tour? Arrange transport, guides, visa support, permits or a tailor-made route with one local team."
      />
      <section className="apple-section">
        <div className="mx-auto max-w-[900px] px-6">
          <Breadcrumbs
            locale={locale}
            items={[{ label: "Home", href: "/" }, { label: "Travel services" }]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICE_PAGES.map((slug) => (
              <div
                key={slug}
                className="flex flex-col rounded-2xl border border-silk-gold/20 bg-white p-5 shadow-sm"
              >
                <h2 className="silk-headline text-lg text-silk-indigo">
                  {t(`items.${slug}.title`)}
                </h2>
                <p className="mt-2 flex-1 text-sm text-apple-muted">{t(`items.${slug}.desc`)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="silkOutline" size="pill-sm" asChild>
                    <Link href={`/services/${slug}`}>{t("learnMore")}</Link>
                  </Button>
                  <Button variant="silk" size="pill-sm" asChild>
                    <Link href={planJourneyHref({ service: slug, source: "service" })}>
                      Request this service
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
