import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import PartnerCard from "@/components/partners/PartnerCard";
import { Button } from "@/components/ui/button";
import {
  partnerCategories,
  getPartnersByCategory,
  getPublishedPartners,
  getPartnerContent,
} from "@/lib/data/partners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.partners" });
  return buildPageMetadata({
    locale,
    path: "/partners",
    title: t("title"),
    description: t("subtitle"),
  });
}


export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.partners" });
  const t = await getTranslations({ locale, namespace: "partners" });
  const allPartners = await getPublishedPartners();

  const categorySections = [];
  for (let catIndex = 0; catIndex < partnerCategories.length; catIndex++) {
    const category = partnerCategories[catIndex];
    const categoryPartners = await getPartnersByCategory(category);
    if (categoryPartners.length === 0) continue;

    categorySections.push(
      <section
        key={category}
        className={catIndex % 2 === 0 ? "pb-16" : "silk-gradient-warm pb-16"}
      >
        <div className="mx-auto max-w-[980px] px-6">
          <AnimateIn delay={catIndex * 0.05}>
            <h2 className="silk-headline text-center text-2xl text-silk-indigo sm:text-3xl">
              {t(`categories.${category}`)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-apple-muted">
              {t(`categoryDesc.${category}`)}
            </p>
          </AnimateIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {categoryPartners.map((partner, i) => (
              <AnimateIn key={partner.id} delay={0.08 + i * 0.05}>
                <PartnerCard
                  partner={partner}
                  content={getPartnerContent(partner, locale)}
                />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />

      <section className="apple-section">
        <div className="mx-auto max-w-[780px] px-6 text-center">
          <AnimateIn>
            <p className="text-base leading-relaxed text-apple-muted">{t("pageIntro")}</p>
            <p className="mt-4 text-sm font-semibold text-silk-indigo">
              {t("stats", { count: allPartners.length })}
            </p>
          </AnimateIn>
        </div>
      </section>

      {categorySections.length > 0 ? (
        categorySections
      ) : (
        <section className="pb-16">
          <div className="mx-auto max-w-[680px] px-6 text-center">
            <p className="text-sm leading-relaxed text-apple-muted">{t("empty")}</p>
          </div>
        </section>
      )}

      <section className="silk-pattern-dark apple-section">
        <div className="mx-auto max-w-[680px] px-6 text-center">
          <AnimateIn>
            <h2 className="silk-headline text-2xl text-white sm:text-3xl">
              {t("becomeTitle")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{t("becomeDesc")}</p>
            <Button variant="silk" size="pill" className="mt-8" asChild>
              <Link href="/contact">{t("becomeCta")}</Link>
            </Button>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}