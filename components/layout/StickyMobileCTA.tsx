"use client";

import { useTranslations } from "next-intl";
import BookNowButton from "@/components/automation/BookNowButton";

export default function StickyMobileCTA({ whatsappUrl }: { whatsappUrl?: string }) {
  const nav = useTranslations("nav");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-silk-gold/30 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,18,37,0.08)] backdrop-blur-md lg:hidden">
      <div className="mx-auto max-w-lg">
        <BookNowButton
          variant="silk"
          size="pill-sm"
          className="w-full text-xs font-semibold"
          prefill={{ source: "header", tourSlug: "any" }}
          label={nav("planMyJourney")}
        />
      </div>
    </div>
  );
}
