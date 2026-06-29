import { getLocale } from "next-intl/server";
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