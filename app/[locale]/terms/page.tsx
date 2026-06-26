import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import LegalContent from "@/components/legal/LegalContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.terms" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.terms" });
  const legal = await getTranslations({ locale, namespace: "legal.terms" });
  const sections = legal.raw("sections") as { title: string; paragraphs: string[] }[];

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <LegalContent lastUpdated={legal("lastUpdated")} sections={sections} />
    </>
  );
}