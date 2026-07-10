import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import InfoPage from "@/components/shared/InfoPage";

const SERVICE_SLUGS = [
  "visa-support",
  "permits-gbao",
  "transport-rental",
  "drivers-guides",
  "accommodation",
  "tailor-made",
] as const;

type ServiceSlug = (typeof SERVICE_SLUGS)[number];

function isServiceSlug(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) return { title: "GREATSILKTRAILS" };
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  return { title: `${t(`items.${slug}.title`)} | GREATSILKTRAILS` };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  const isTailor = slug === "tailor-made";

  return (
    <InfoPage
      title={t(`items.${slug}.title`)}
      subtitle={t(`items.${slug}.desc`)}
      body={t(`items.${slug}.body`)}
      cta={isTailor ? t("cta") : t("cta")}
      secondaryCta={t("contactSpecialist")}
      secondaryHref="/contact"
    />
  );
}
