"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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
    ? "bg-white text-silk-indigo border-white"
    : "bg-white/10 text-white border-white/30 hover:bg-white/20";
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
    <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden md:min-h-[860px]">
      <Image
        src={HERO_IMAGE}
        alt={t("photoAlt")}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-br from-silk-gold/20 via-transparent to-transparent opacity-40" />

      <div className="relative z-10 mx-auto w-full max-w-[860px] px-6 py-24 text-center text-white md:py-28">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-white/85 sm:text-sm">
          <span className="opacity-60">·</span> {t("ticker")} <span className="opacity-60">·</span>
        </p>
        <h1 className="silk-headline mb-5 text-4xl font-medium leading-[1.1] text-silk-gold-light md:text-5xl lg:text-[3.75rem]">
          {t("title")}
        </h1>
        <p className="mx-auto mb-8 max-w-[640px] text-base leading-relaxed text-white/85 md:text-lg">
          {t("subtitle")}
        </p>

        <div className="mx-auto mb-8 max-w-[720px] rounded-3xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-md md:p-6">
          <p className="mb-2 text-left text-[11px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
            {t("when")}
          </p>
          <div className="flex flex-wrap justify-start gap-1.5">
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

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-left text-[11px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                {t("howLong")}
              </p>
              <div className="flex flex-wrap justify-start gap-1.5">
                {DURATIONS.map((key) => {
                  const active = duration === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDuration(active ? null : key)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition sm:text-sm ${chipClass(active)}`}
                    >
                      {t(`durations.${key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-left text-[11px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                {t("where")}
              </p>
              <div className="flex flex-wrap justify-start gap-1.5">
                {DESTINATIONS.map((slug) => {
                  const active = country === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCountry(active ? null : slug)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition sm:text-sm ${chipClass(active)}`}
                    >
                      {getCountryLabel(slug, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href={exploreHref()}
            className="mt-5 block w-full rounded-full bg-white/85 px-6 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-white"
          >
            {t("explore")} →
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/plan-my-journey"
            className="rounded-full bg-silk-gold px-7 py-3 text-sm font-semibold text-silk-indigo shadow-lg transition hover:brightness-110"
          >
            {t("talk")}
          </Link>
          <Link
            href="/destinations"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
          >
            {t("discover")}
          </Link>
        </div>
        <p className="mt-8 text-xs italic tracking-wide text-white/80 sm:text-sm">{t("footnote")}</p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden>
        <div className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <div className="h-2.5 w-1.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
