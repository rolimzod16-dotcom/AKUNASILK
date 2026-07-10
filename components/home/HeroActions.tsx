"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import BookNowButton from "@/components/automation/BookNowButton";

type HeroActionsProps = {
  bestsellerSlug: string;
};

export default function HeroActions({ bestsellerSlug }: HeroActionsProps) {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button
        variant="silk"
        size="pill"
        className="silk-glow-pulse"
        asChild
      >
        <Link href="/journeys">{t("cta")}</Link>
      </Button>
      <BookNowButton
        variant="silkOutline"
        size="pill"
        className="border-silk-gold/60 bg-white/10 text-white backdrop-blur-sm hover:bg-silk-gold/20 hover:text-white"
        prefill={{ source: "hero", tourSlug: "any" }}
        label={nav("planYourJourney")}
      />
      <Button
        variant="link"
        size="pill"
        className="text-silk-gold hover:text-silk-gold-light"
        asChild
      >
        <Link href={`/journeys/${bestsellerSlug}`}>
          {t("ctaSecondary")} ›
        </Link>
      </Button>
    </div>
  );
}
