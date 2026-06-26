import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import LegalContent from "@/components/legal/LegalContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.cancellation" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.cancellation" });
  const legal = await getTranslations({ locale, namespace: "legal.cancellation" });
  const sections = legal.raw("sections") as { title: string; paragraphs: string[] }[];

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <LegalContent lastUpdated={legal("lastUpdated")} sections={sections} />
    </>
  );
}