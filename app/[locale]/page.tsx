import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import HomeDestinations from "@/components/home/HomeDestinations";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeWhy from "@/components/home/HomeWhy";
import HomeServices from "@/components/home/HomeServices";
import HomeCta from "@/components/home/HomeCta";
import HomeReviews from "@/components/home/HomeReviews";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/",
    title: "Silk Road Tours & Central Asia Journeys | Great Silk Trails",
    description:
      "Private and small-group Silk Road tours across Tajikistan and Central Asia, designed with local guides, drivers and trusted hosts.",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "hero" });

  return (
    <>
      <Hero />
      <HomeDestinations locale={locale} />
      <HomeFeatured locale={locale} />
      <HomeWhy />
      <HomeServices />
      <HomeReviews />
      <HomeCta />
    </>
  );
}
