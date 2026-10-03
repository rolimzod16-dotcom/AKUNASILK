"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import SilkDivider from "@/components/shared/SilkDivider";
import SilkRoadVideoBackground from "@/components/shared/SilkRoadVideoBackground";
import SilkRouteStrip from "@/components/shared/SilkRouteStrip";
import { getCountryLabel, type CountrySlug } from "@/lib/countries";
import type { CmsHeroCopy } from "@/lib/cms/types";

const DESTINATIONS: CountrySlug[] = [
  "tajikistan",
  "uzbekistan",
  "kyrgyzstan",
  "kazakhstan",
];

const DURATIONS = ["short", "medium", "long"] as const;
type DurationKey = (typeof DURATIONS)[number];

function chipClass(active: boolean) {
  return active
    ? "border-silk-indigo bg-silk-indigo text-silk-gold"
    : "border-silk-gold/35 bg-silk-cream text-silk-indigo hover:border-silk-gold hover:bg-silk-gold/20";
}

function heroText(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export default function Hero({ copy }: { copy?: CmsHeroCopy }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [month, setMonth] = useState<number | null>(null);
  const [duration, setDuration] = useState<DurationKey | null>(null);
  const [country, setCountry] = useState<CountrySlug | null>(null);

  const months = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2026, index, 1)),
  );

  function exploreHref() {
    const query = new URLSearchParams();
    if (month) query.set("month", String(month));
    if (duration) query.set("duration", duration);
    if (country) query.set("country", country);
    const search = query.toString();
    return search ? `/journeys?${search}` : "/journeys";
  }

  return (
    <section>
      <SilkRoadVideoBackground className="min-h-[88svh]">
        <div className="mx-auto flex min-h-[88svh] max-w-[860px] flex-col items-center justify-center px-6 py-28 text-center">
          <p className="rounded-full border border-silk-gold/40 bg-silk-indigo/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-silk-gold-light backdrop-blur-sm">
            {heroText(copy?.badge, t("badge"))}
          </p>
          <h1 className="silk-headline mt-5 text-4xl text-white sm:text-6xl md:text-7xl">
            {heroText(copy?.title, t("title"))}
          </h1>
          <SilkDivider light className="my-5" />
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {heroText(copy?.subtitle, t("subtitle"))}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="silk" size="pill" className="h-12 min-w-[180px]" asChild>
              <Link href="/journeys">{heroText(copy?.cta, t("cta"))}</Link>
            </Button>
            <Button
              variant="silkOutline"
              size="pill"
              className="h-12 border-silk-gold/60 bg-white/10 text-white backdrop-blur-sm hover:bg-silk-gold/20 hover:text-white"
              asChild
            >
              <Link href="/plan-my-journey">{heroText(copy?.ctaSecondary, t("ctaSecondary"))}</Link>
            </Button>
          </div>

          <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-silk-gold/25 bg-white/95 p-4 text-left text-silk-indigo shadow-2xl shadow-silk-indigo/25 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/60">
              {heroText(copy?.when, t("when"))}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {months.map((label, index) => {
                const value = index + 1;
                const active = month === value;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMonth(active ? null : value)}
                    className={`rounded-full border px-2.5 py-1 text-xs transition ${chipClass(active)}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/60">
                  {heroText(copy?.howLong, t("howLong"))}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DURATIONS.map((key) => {
                    const active = duration === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDuration(active ? null : key)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${chipClass(active)}`}
                      >
                        {heroText(
                          key === "short"
                            ? copy?.durationShort
                            : key === "medium"
                              ? copy?.durationMedium
                              : copy?.durationLong,
                          t(`durations.${key}`),
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/60">
                  {heroText(copy?.where, t("where"))}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DESTINATIONS.map((slug) => {
                    const active = country === slug;
                    return (
                      <button
                        key={slug}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setCountry(active ? null : slug)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${chipClass(active)}`}
                      >
                        {getCountryLabel(slug, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <Button variant="silk" size="pill-sm" className="mt-4" asChild>
              <Link href={exploreHref()}>{heroText(copy?.explore, t("explore"))}</Link>
            </Button>
          </div>
        </div>
      </SilkRoadVideoBackground>
      <SilkRouteStrip />
    </section>
  );
}
