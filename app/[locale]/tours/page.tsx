import { redirect } from "@/i18n/routing";

export default async function LegacyToursRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/journeys", locale });
}