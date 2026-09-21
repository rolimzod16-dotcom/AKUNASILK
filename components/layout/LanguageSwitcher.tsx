"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
};

export default function LanguageSwitcher({
  light = false,
  onLightBg = false,
}: {
  light?: boolean;
  onLightBg?: boolean;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center rounded-full border px-1 py-0.5 text-[11px] font-bold tracking-wide",
        onLightBg
          ? "border-silk-gold/40 bg-silk-cream"
          : light
            ? "border-white/35 bg-white/10"
            : "border-white/25 bg-white/5"
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const active = locale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => {
              if (loc !== locale) router.replace(pathname, { locale: loc });
            }}
            className={cn(
              "rounded-full px-2 py-1 transition",
              active
                ? "bg-silk-gold text-silk-indigo"
                : onLightBg
                  ? "text-silk-indigo/70 hover:text-silk-indigo"
                  : "text-white/80 hover:text-white"
            )}
            aria-pressed={active}
            aria-label={loc === "ru" ? "Русский" : "English"}
          >
            {LABELS[loc] ?? loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
