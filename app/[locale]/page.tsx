import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/layout/TrustBar";
import SocialProofTicker from "@/components/automation/SocialProofTicker";
import TripMatcher from "@/components/automation/TripMatcher";
import { getBestseller, getTourContent } from "@/lib/data/tours";
import VideoShowcase from "@/components/home/VideoShowcase";
import SilkRoadSection from "@/components/home/SilkRoadSection";
import TourShowcase from "@/components/home/TourShowcase";
import PackageIncludes from "@/components/home/PackageIncludes";
import PricingTiers from "@/components/home/PricingTiers";
import PartnersSection from "@/components/home/PartnersSection";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildPageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage() {
  const locale = await getLocale();
  const bestseller = await getBestseller();
  const bestsellerContent = getTourContent(bestseller, locale);

  return (
    <>
      <Hero tour={bestseller} tourTitle={bestsellerContent.title} />
      <TrustBar />
      <SocialProofTicker />
      <VideoShowcase />
      <SilkRoadSection />
      <TourShowcase />
      <TripMatcher />
      <PackageIncludes />
      <PricingTiers />
      <PartnersSection />
      <Testimonials />
      <CTA />
    </>
  );
}