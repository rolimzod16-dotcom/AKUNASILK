"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqKeys = ["visa", "group", "fitness", "cancel", "insurance", "solo"] as const;

export default function FAQAccordion() {
  const t = useTranslations("faq");

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="visa"
      className="space-y-3"
    >
      {faqKeys.map((key) => (
        <AccordionItem
          key={key}
          value={key}
          className="overflow-hidden rounded-2xl border border-indigo/10 bg-card px-2 shadow-sm"
        >
          <AccordionTrigger className="px-4 py-5 font-display text-lg font-semibold text-indigo hover:no-underline [&[data-state=open]]:text-gold">
            {t(`items.${key}.q`)}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
            {t(`items.${key}.a`)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}