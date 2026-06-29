"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = ["visa", "cancel", "group", "solo", "payment"] as const;

export default function TourInlineFAQ() {
  const t = useTranslations("automation.tourFaq");

  return (
    <div className="mt-8 border-t border-silk-gold/20 pt-6">
      <p className="mb-3 text-sm font-bold text-silk-indigo">{t("title")}</p>
      <Accordion type="single" collapsible className="w-full">
        {ITEMS.map((key) => (
          <AccordionItem key={key} value={key} className="border-silk-gold/15">
            <AccordionTrigger className="text-left text-xs font-semibold text-silk-indigo hover:text-silk-gold">
              {t(`items.${key}.q`)}
            </AccordionTrigger>
            <AccordionContent className="text-xs text-apple-muted">
              {t(`items.${key}.a`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}