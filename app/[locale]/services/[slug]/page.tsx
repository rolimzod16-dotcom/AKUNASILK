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
  if (!isServiceSlug(slug)) return { title: "Great Silk Trails" };
  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  if (slug === "transport-rental") {
    return {
      title: "4x4 Rental with Driver in Tajikistan | GST",
      description:
        "Request a suitable 4x4 and experienced local driver for the Pamir Highway, Wakhan Valley and routes across Tajikistan.",
    };
  }
  return { title: `${t(`items.${slug}.title`)} | Great Silk Trails` };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const t = await getTranslations({ locale, namespace: "pages.servicesLogistics" });
  const title =
    slug === "transport-rental"
      ? "4x4 rental with driver in Tajikistan"
      : t(`items.${slug}.title`);
  const subtitle =
    slug === "transport-rental"
      ? "Arrange a suitable vehicle and experienced local driver for the Pamir Highway, Wakhan Valley and routes across Tajikistan."
      : t(`items.${slug}.desc`);

  return (
    <InfoPage
      title={title}
      subtitle={subtitle}
      body={t(`items.${slug}.body`)}
      cta={slug === "transport-rental" ? "Request Transport" : "Request this service"}
      serviceSlug={slug}
      secondaryCta={t("contactSpecialist")}
      secondaryHref="/contact"
    />
  );
}
