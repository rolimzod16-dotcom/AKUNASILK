"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Headphones, BadgeCheck, RotateCcw } from "lucide-react";

const items = [
  { key: "cancel", icon: RotateCcw },
  { key: "support", icon: Headphones },
  { key: "guides", icon: BadgeCheck },
  { key: "secure", icon: ShieldCheck },
] as const;

export default function TrustBar() {
  const t = useTranslations("traveler.trust");

  return (
    <section className="border-y border-silk-gold/20 bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 px-4 py-5 sm:grid-cols-4 sm:gap-6 sm:px-6">
        {items.map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-silk-gold/15">
              <Icon className="size-4 text-silk-terracotta" />
            </div>
            <div>
              <p className="text-xs font-bold text-silk-indigo sm:text-sm">{t(`${key}.title`)}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-apple-muted sm:text-xs">
                {t(`${key}.desc`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}