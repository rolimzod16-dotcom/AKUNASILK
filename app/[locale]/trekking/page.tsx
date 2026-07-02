import { getTranslations } from "next-intl/server";
import InfoPage from "@/components/shared/InfoPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.trekking" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function TrekkingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.trekking" });

  return (
    <InfoPage
      title={t("title")}
      subtitle={t("subtitle")}
      body={t("body")}
      cta={t("cta")}
    />
  );
}