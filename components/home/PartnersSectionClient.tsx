"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import PartnerLogo from "@/components/partners/PartnerLogo";
import { Button } from "@/components/ui/button";
import type { Partner, PartnerContent } from "@/lib/data/partners";

type PartnersSectionClientProps = {
  items: { partner: Partner; content: PartnerContent }[];
};

export default function PartnersSectionClient({ items }: PartnersSectionClientProps) {
  const t = useTranslations("partners");

  return (
    <section className="apple-section border-y border-silk-gold/15 bg-white">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-apple-muted">
            {t("intro")}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {items.map(({ partner, content }, i) => (
            <ScrollReveal key={partner.id} delay={i * 0.05}>
              <Link
                href="/partners"
                className="group flex flex-col items-center rounded-2xl border border-silk-gold/15 bg-gradient-to-b from-white to-silk-cream/50 p-5 text-center transition duration-500 hover:border-silk-gold/40 hover:shadow-lg hover:shadow-silk-gold/10 sm:p-6"
              >
                <PartnerLogo initials={partner.initials} name={content.name} size="lg" />
                <p className="mt-4 text-sm font-semibold text-silk-indigo transition group-hover:text-silk-gold">
                  {content.name}
                </p>
                <p className="mt-1 text-xs text-apple-muted">
                  {t(`categories.${partner.category}`)} · {partner.country}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-10 text-center">
          <Button variant="silkOutline" size="pill" asChild>
            <Link href="/partners">
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}