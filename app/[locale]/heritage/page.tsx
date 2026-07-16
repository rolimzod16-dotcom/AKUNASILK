import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";

const eventKeys = ["130bce", "1stc", "7thc", "13thc", "2013", "today"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.heritage" });
  return buildPageMetadata({
    locale,
    path: "/heritage",
    title: t("title"),
    description: t("subtitle"),
  });
}


export default async function HeritagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.heritage" });
  const heritage = await getTranslations({ locale, namespace: "heritage" });
  const timeline = await getTranslations({ locale, namespace: "timeline.events" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <section className="apple-section">
        <div className="mx-auto max-w-[780px] px-6 text-center">
          <p className="apple-subhead text-lg text-apple-muted sm:text-xl">
            {heritage("intro")}
          </p>
        </div>
      </section>

      <section className="silk-pattern-dark apple-section">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="space-y-8">
            {eventKeys.map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-silk-gold/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-silk-gold">
                  {timeline(`${key}.year`)}
                </span>
                <h3 className="silk-headline mt-2 text-xl text-white sm:text-2xl">
                  {timeline(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-white/70 sm:text-base">
                  {timeline(`${key}.desc`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="silk" size="pill" asChild>
              <Link href="/journeys">{heritage("cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}