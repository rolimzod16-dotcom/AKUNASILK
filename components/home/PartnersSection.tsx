import { getLocale } from "next-intl/server";
import { getFeaturedPartners, getPartnerContent } from "@/lib/data/partners";
import PartnersSectionClient from "./PartnersSectionClient";

export default async function PartnersSection() {
  const locale = await getLocale();
  const partners = await getFeaturedPartners();
  const items = partners.map((partner) => ({
    partner,
    content: getPartnerContent(partner, locale),
  }));
  return <PartnersSectionClient items={items} />;
}