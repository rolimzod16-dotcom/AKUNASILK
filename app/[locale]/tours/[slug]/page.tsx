import { redirect } from "@/i18n/routing";

export default async function LegacyTourRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  redirect({ href: `/journeys/${slug}`, locale });
}