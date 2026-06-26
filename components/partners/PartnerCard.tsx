"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, Hotel, Plane, Landmark, Users, MapPin } from "lucide-react";
import type { Partner, PartnerCategory, PartnerContent } from "@/lib/data/partners";
import { Badge } from "@/components/ui/badge";
import PartnerLogo from "./PartnerLogo";

const categoryIcons: Record<PartnerCategory, typeof Hotel> = {
  hotel: Hotel,
  dmc: MapPin,
  hospitality: Users,
  transport: Plane,
  cultural: Landmark,
};

type PartnerCardProps = {
  partner: Partner;
  content: PartnerContent;
};

export default function PartnerCard({ partner, content }: PartnerCardProps) {
  const t = useTranslations("partners");
  const Icon = categoryIcons[partner.category];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm transition duration-500 hover:border-silk-gold/50 hover:shadow-xl hover:shadow-silk-gold/10">
      <div className="flex items-start gap-4">
        <PartnerLogo
          initials={partner.initials}
          name={content.name}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <Badge
            variant="outline"
            className="border-silk-gold/30 bg-silk-gold/10 text-[10px] font-bold uppercase tracking-wider text-silk-indigo"
          >
            <Icon className="mr-1 size-3" />
            {t(`categories.${partner.category}`)}
          </Badge>
          <h3 className="silk-headline mt-2 text-xl text-silk-indigo group-hover:text-silk-gold">
            {content.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-silk-turquoise">
            {partner.country}
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-apple-muted">
        {content.desc}
      </p>
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-silk-turquoise hover:text-silk-indigo"
        >
          {t("visitWebsite")}
          <ExternalLink className="size-3" />
        </a>
      )}
    </article>
  );
}