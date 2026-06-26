import { redirect } from "@/i18n/routing";

export default async function BlogRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/stories", locale });
}