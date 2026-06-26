"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = ["explorer", "signature", "bespoke"] as const;

export default function PricingTiers() {
  const t = useTranslations("pricing");
  const shop = useTranslations("shop");
  const nav = useTranslations("nav");

  return (
    <section className="apple-section silk-pattern-dark">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading
            title={shop("pricingTitle")}
            subtitle={shop("pricingSubtitle")}
            dark
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const popular = tier === "signature";
            const features = t.raw(`tiers.${tier}.features`) as string[];

            return (
              <ScrollReveal key={tier} delay={i * 0.08} scale>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl p-6 sm:p-8",
                    popular
                      ? "bg-white ring-2 ring-silk-gold shadow-xl shadow-silk-gold/10"
                      : "bg-white/95 ring-1 ring-white/20"
                  )}
                >
                  {popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-silk-gold text-silk-indigo hover:bg-silk-gold">
                      {shop("mostPopular")}
                    </Badge>
                  )}
                  <p className="text-sm font-semibold text-silk-indigo">
                    {t(`tiers.${tier}.name`)}
                  </p>
                  <p className="silk-headline mt-2 text-3xl text-silk-indigo">
                    {t(`tiers.${tier}.price`)}
                  </p>
                  <p className="mt-2 text-sm text-apple-muted">
                    {t(`tiers.${tier}.desc`)}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-apple-subtle">
                        <Check className="mt-0.5 size-4 shrink-0 text-silk-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={popular ? "silk" : "silkOutline"}
                    size="pill"
                    className="mt-6 w-full"
                    asChild
                  >
                    <Link href="/contact">{nav("book")}</Link>
                  </Button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}