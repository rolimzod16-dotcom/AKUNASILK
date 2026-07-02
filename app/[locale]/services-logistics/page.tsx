import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";

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
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
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
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="rounded-2xl border border-silk-gold/20 bg-white p-5 shadow-sm transition hover:border-silk-gold/50 hover:shadow-md"
            >
              <h2 className="silk-headline text-lg text-silk-indigo">{t(`items.${slug}.title`)}</h2>
              <p className="mt-2 text-sm text-apple-muted">{t(`items.${slug}.desc`)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}