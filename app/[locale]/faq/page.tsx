import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import FAQAccordion from "@/components/faq/FAQAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.faq" });
  const t = await getTranslations({ locale, namespace: "faq" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={t("subtitle")} compact />
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}