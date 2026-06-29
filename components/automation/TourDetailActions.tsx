"use client";

import { useTranslations } from "next-intl";
import BookNowButton from "@/components/automation/BookNowButton";
import TourInlineFAQ from "@/components/automation/TourInlineFAQ";

type TourDetailActionsProps = {
  slug: string;
  price: number;
  spotsLeft?: number;
};

export default function TourDetailActions({
  slug,
  price,
  spotsLeft,
}: TourDetailActionsProps) {
  const shop = useTranslations("shop");
  const auto = useTranslations("automation.tour");

  return (
    <>
      <BookNowButton
        variant="silk"
        size="pill"
        className="mt-6 w-full"
        prefill={{ tourSlug: slug, source: "card" }}
        label={auto("reserveNow")}
      />
      <BookNowButton
        variant="silkOutline"
        size="pill"
        className="mt-3 w-full"
        prefill={{ tourSlug: slug, source: "card", notes: shop("askExpert") }}
        label={shop("askExpert")}
      />
      {spotsLeft != null && spotsLeft <= 6 && (
        <p className="mt-3 text-center text-xs font-semibold text-silk-terracotta">
          {auto("scarcity", { count: spotsLeft })}
        </p>
      )}
      <p className="mt-2 text-center text-[11px] text-apple-muted">
        {auto("priceLock", { price: price.toLocaleString() })}
      </p>
      <p className="mt-2 text-center text-[11px] text-apple-muted">
        {shop("guaranteeShort")}
      </p>
      <TourInlineFAQ />
    </>
  );
}