"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function StickyMobileCTA() {
  const nav = useTranslations("nav");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-silk-gold/40 bg-silk-cream/95 p-3 shadow-[0_-8px_30px_rgba(201,162,39,0.2)] backdrop-blur-md xl:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Button
          variant="silkOutline"
          size="pill"
          className="flex-1 border-2 border-silk-gold/60 bg-white text-[11px] font-bold uppercase tracking-wide"
          asChild
        >
          <Link href="/journeys">{nav("journeys")}</Link>
        </Button>
        <Button variant="silk" size="pill" className="flex-1 text-[11px] font-bold uppercase tracking-wide shadow-lg" asChild>
          <Link href="/contact">{nav("contact")}</Link>
        </Button>
      </div>
    </div>
  );
}