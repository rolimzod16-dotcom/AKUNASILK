"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookNowButton from "@/components/automation/BookNowButton";

export default function StickyMobileCTA() {
  const nav = useTranslations("nav");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-silk-gold/30 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,18,37,0.08)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Button variant="outline" size="pill-sm" className="flex-1 border-silk-gold/40 text-xs font-semibold" asChild>
          <a href="https://wa.me/998712004567" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-3.5 text-silk-turquoise" />
            WhatsApp
          </a>
        </Button>
        <BookNowButton
          variant="silk"
          size="pill-sm"
          className="flex-1 text-xs font-semibold"
          prefill={{ source: "header", tourSlug: "any" }}
          label={nav("planYourJourney")}
        />
      </div>
    </div>
  );
}
