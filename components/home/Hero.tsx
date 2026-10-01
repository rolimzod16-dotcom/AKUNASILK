"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getCountryLabel, type CountrySlug } from "@/lib/countries";

const HERO_IMAGE =
  "https://images.pexels.com/videos/33255422/gobi-march-25-33255422.jpeg?auto=compress&w=2400&h=1400&fit=crop";

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
    : "border-silk-gold/35 bg-white text-silk-indigo hover:border-silk-gold hover:bg-silk-gold/15";
}

export default function Hero() {
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
    <section className="relative min-h-[88svh] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt={t("photoAlt")}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-silk-indigo/88 via-silk-indigo/58 to-silk-indigo/20" />

      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-[1280px] items-center px-6 pb-16 pt-28">
        <div className="w-full max-w-[680px] text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-silk-gold">
            {t("badge")}
          </p>
          <h1 className="silk-headline mt-4 text-[2.35rem] leading-[1.08] text-white sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="silk" size="pill" className="h-12 min-w-[180px]" asChild>
              <Link href="/journeys">{t("cta")}</Link>
            </Button>
            <Button
              variant="silkOutline"
              size="pill"
              className="h-12 border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/plan-my-journey">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-silk-gold/30 bg-silk-cream/95 p-5 text-silk-indigo shadow-2xl shadow-silk-indigo/30">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/70">
              {t("when")}
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/70">
                  {t("howLong")}
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
                        {t(`durations.${key}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silk-indigo/70">
                  {t("where")}
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

            <Button variant="silk" size="pill" className="mt-5 h-11 w-full sm:w-auto" asChild>
              <Link href={exploreHref()}>{t("explore")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
