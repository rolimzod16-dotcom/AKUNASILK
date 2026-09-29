"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getCountryLabel, type CountrySlug } from "@/lib/countries";
import { cn } from "@/lib/utils";

export type SilkMapTour = {
  slug: string;
  title: string;
  days: number;
  countries: string[];
  image: string;
};

type CityId =
  | "istanbul"
  | "tbilisi"
  | "tehran"
  | "mashhad"
  | "khiva"
  | "merv"
  | "bukhara"
  | "dushanbe"
  | "khorog"
  | "gilgit"
  | "tashkent"
  | "bishkek"
  | "osh"
  | "almaty"
  | "kashgar"
  | "turpan"
  | "dunhuang"
  | "xian"
  | "samarkand";

type RouteId = "all" | "main" | "pamir" | "karakoram" | "caucasus";

type City = {
  id: CityId;
  country: CountrySlug;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  dx: number;
  dy: number;
  r?: number;
};

const CITIES: City[] = [
  { id: "istanbul", country: "turkey", x: 70, y: 240, anchor: "end", dx: -8, dy: -10, r: 4.5 },
  { id: "tbilisi", country: "georgia", x: 195, y: 220, anchor: "middle", dx: 0, dy: -8, r: 3.8 },
  { id: "tehran", country: "iran", x: 270, y: 305, anchor: "start", dx: -6, dy: 14, r: 4 },
  { id: "mashhad", country: "iran", x: 330, y: 300, anchor: "start", dx: 2, dy: 13, r: 3.5 },
  { id: "khiva", country: "uzbekistan", x: 380, y: 225, anchor: "start", dx: -5, dy: -7, r: 3.5 },
  { id: "merv", country: "turkmenistan", x: 380, y: 280, anchor: "start", dx: 7, dy: 12, r: 3.5 },
  { id: "bukhara", country: "uzbekistan", x: 415, y: 265, anchor: "start", dx: -8, dy: -7, r: 4 },
  { id: "samarkand", country: "uzbekistan", x: 440, y: 255, anchor: "middle", dx: 0, dy: -28, r: 4.5 },
  { id: "dushanbe", country: "tajikistan", x: 450, y: 270, anchor: "start", dx: -10, dy: 13, r: 3.8 },
  { id: "khorog", country: "tajikistan", x: 485, y: 285, anchor: "start", dx: 8, dy: 12, r: 3.5 },
  { id: "tashkent", country: "uzbekistan", x: 470, y: 230, anchor: "start", dx: 6, dy: -8, r: 4.2 },
  { id: "bishkek", country: "kyrgyzstan", x: 520, y: 218, anchor: "middle", dx: 0, dy: -8, r: 3.6 },
  { id: "osh", country: "kyrgyzstan", x: 515, y: 248, anchor: "start", dx: 6, dy: -6, r: 3.5 },
  { id: "almaty", country: "kazakhstan", x: 575, y: 200, anchor: "start", dx: 8, dy: -4, r: 4 },
  { id: "gilgit", country: "pakistan", x: 550, y: 320, anchor: "start", dx: 7, dy: 11, r: 3.5 },
  { id: "kashgar", country: "china", x: 565, y: 260, anchor: "start", dx: 8, dy: 4, r: 4.8 },
  { id: "turpan", country: "china", x: 670, y: 210, anchor: "middle", dx: 0, dy: -8, r: 3.5 },
  { id: "dunhuang", country: "china", x: 760, y: 235, anchor: "middle", dx: 0, dy: -8, r: 3.8 },
  { id: "xian", country: "china", x: 905, y: 290, anchor: "start", dx: 10, dy: 4, r: 5 },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80";

function routeOn(tab: RouteId, route: Exclude<RouteId, "all">) {
  return tab === "all" || tab === route;
}

export default function SilkRoadCitiesMap({ tours }: { tours: SilkMapTour[] }) {
  const t = useTranslations("home.map");
  const locale = useLocale();
  const [tab, setTab] = useState<RouteId>("all");
  const [selectedId, setSelectedId] = useState<CityId>("samarkand");
  const [cardOpen, setCardOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [relief, setRelief] = useState(true);

  const selected = CITIES.find((city) => city.id === selectedId) ?? CITIES[7];
  const cityTours = useMemo(
    () => tours.filter((tour) => tour.countries.includes(selected.country)).slice(0, 2),
    [tours, selected.country],
  );
  const countryName = getCountryLabel(selected.country, locale);
  const cityName = t(`cities.${selected.id}`);
  const cardImage = cityTours[0]?.image || FALLBACK_IMAGE;

  const tabs: { id: RouteId; label: string }[] = [
    { id: "all", label: t("tabs.all") },
    { id: "main", label: t("tabs.main") },
    { id: "pamir", label: t("tabs.pamir") },
    { id: "karakoram", label: t("tabs.karakoram") },
    { id: "caucasus", label: t("tabs.caucasus") },
  ];

  function choose(id: CityId) {
    setSelectedId(id);
    setCardOpen(true);
  }

  return (
    <section className="relative overflow-hidden border-b border-amber-900/10 bg-[#f7f4ed] py-12 [background-image:radial-gradient(#dfd7c5_0.75px,transparent_0.75px)] [background-size:16px_16px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-slate-300/80 pb-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
              <span className="h-px w-6 bg-silk-gold" />
              {t("eyebrow")}
            </span>
            <h2 className="silk-headline mt-2 text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{t("hint")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-stone-300 bg-white/80 p-1 shadow-sm backdrop-blur" role="tablist">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded px-3 py-1.5 text-xs uppercase tracking-wider transition",
                  tab === item.id
                    ? "bg-silk-indigo font-semibold text-silk-gold shadow-sm"
                    : "font-medium text-slate-700 hover:bg-slate-100",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px] w-full select-none overflow-hidden rounded-2xl border-2 border-stone-300 bg-[#e8eff4] shadow-2xl lg:min-h-[640px]">
          <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 rounded-xl border border-stone-300/80 bg-white/90 p-1.5 shadow-md backdrop-blur-md">
            <button type="button" className="flex size-8 items-center justify-center rounded-lg text-base font-bold text-slate-700 hover:bg-slate-100" title={t("zoomIn")} onClick={() => setZoom((value) => Math.min(1.8, +(value + 0.2).toFixed(2)))}>＋</button>
            <button type="button" className="flex size-8 items-center justify-center rounded-lg text-base font-bold text-slate-700 hover:bg-slate-100" title={t("zoomOut")} onClick={() => setZoom((value) => Math.max(1, +(value - 0.2).toFixed(2)))}>－</button>
            <button type="button" className="flex size-8 items-center justify-center rounded-lg text-sm text-slate-700 hover:bg-slate-100" title={t("reset")} onClick={() => setZoom(1)}>⤢</button>
            <div className="mx-1 h-px bg-slate-200" />
            <button type="button" aria-pressed={relief} className={cn("flex size-8 items-center justify-center rounded-lg text-xs", relief ? "bg-amber-50 text-amber-800" : "text-slate-500 hover:bg-slate-100")} title={t("relief")} onClick={() => setRelief((value) => !value)}>🏔</button>
          </div>

          <div className="absolute bottom-5 left-5 z-20 hidden max-w-xs rounded-xl border border-stone-300/80 bg-white/92 px-4 py-3 text-xs shadow-lg backdrop-blur-md sm:block">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-900">
              <span className="font-serif">{t("legend.title")}</span>
              <span className="text-[10px] font-normal normal-case text-silk-gold">{t("legend.era")}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5"><span className="inline-block h-1 w-6 rounded bg-[#c59b43]" /><span>{t("legend.main")}</span></div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-6 border-t-2 border-dashed border-[#d48b38]" /><span>{t("legend.pamir")}</span></div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-6 border-t-2 border-dotted border-[#c26b48]" /><span>{t("legend.karakoram")}</span></div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-6 border-t border-[#8b4f3b]" /><span>{t("legend.caucasus")}</span></div>
            </div>
            <p className="mt-2.5 border-t border-slate-200 pt-2 text-[10px] text-slate-500">{t("legend.tip")}</p>
          </div>

          <svg viewBox="0 0 1000 560" className="h-full min-h-[520px] w-full lg:min-h-[640px]" preserveAspectRatio="xMidYMid meet" style={{ transform: `scale(${zoom})`, transformOrigin: "50% 50%" }} role="img" aria-label={t("title")}>
            <rect width="1000" height="560" fill="#c4d5e2" />
            <path d="M 0,0 L 1000,0 L 1000,560 L 780,560 C 760,520 720,490 680,480 C 630,470 600,520 570,550 C 550,560 520,530 500,480 C 470,440 430,430 390,460 C 350,490 320,490 300,460 C 280,430 250,420 220,430 C 180,440 160,420 140,390 C 120,380 90,390 80,420 C 60,450 30,440 0,430 Z" fill="#f6f2e9" stroke="#dcd3c1" strokeWidth="1.2" />
            <path d="M 0,260 Q 60,250 80,280 T 110,360 Q 40,380 0,390 Z" fill="#b9cbd8" />
            <path d="M 90,190 Q 140,170 190,185 T 225,230 Q 180,255 125,245 Q 85,225 90,190 Z" fill="#b1c5d3" stroke="#9bb1c0" strokeWidth="0.8" />
            <path d="M 270,150 Q 295,140 310,180 Q 325,230 320,290 Q 295,310 270,295 Q 260,240 265,190 Z" fill="#acc3d2" stroke="#9bb1c0" strokeWidth="0.8" />
            <path d="M 370,165 Q 395,160 400,190 Q 395,215 375,210 Q 365,190 370,165 Z" fill="#bad0de" stroke="#a4bac8" strokeWidth="0.7" />
            <path d="M 520,150 Q 565,145 610,170 Q 580,185 535,165 Z" fill="#bed1dd" stroke="#a4bac8" strokeWidth="0.7" />
            <ellipse cx="560" cy="225" rx="14" ry="6" fill="#a8c1d2" stroke="#9bb1c0" strokeWidth="0.6" />
            <path d="M 290,440 Q 330,430 365,470 L 330,510 Q 285,465 290,440 Z" fill="#b4c7d5" stroke="#9bb1c0" strokeWidth="0.8" />
            {relief ? (
              <g fill="none" stroke="#d5c8b2" strokeWidth="0.9" opacity="0.85">
                <path d="M 470,225 l 10,-8 l 10,8 l 10,-8 l 10,8 l 10,-7" />
                <path d="M 480,235 l 8,-6 l 8,6 l 8,-6 l 8,6" />
                <path d="M 515,220 l 12,-10 l 12,10 l 12,-9 l 12,9 l 12,-8" />
                <path d="M 525,232 l 10,-7 l 10,7 l 10,-7 l 10,7" />
                <path d="M 495,260 l 14,-10 l 14,10 l 14,-10 l 14,10" />
                <path d="M 480,275 l 10,-8 l 10,8 l 10,-8 l 10,8" />
                <path d="M 180,215 l 12,-8 l 12,8 l 12,-8 l 12,8" />
                <path d="M 195,225 l 8,-6 l 8,6 l 8,-6" />
                <path d="M 600,285 l 15,-10 l 15,10 l 15,-10 l 15,10 l 15,-10" />
                <path d="M 640,300 l 14,-8 l 14,8 l 14,-8" />
              </g>
            ) : null}
            <g fill="none" stroke="#c7bda9" strokeDasharray="3 3" strokeWidth="1" opacity="0.75">
              <path d="M 390,195 Q 430,220 440,250 T 470,295" />
              <path d="M 480,230 Q 500,245 490,270 T 520,300" />
              <path d="M 450,230 L 530,230 L 570,200" />
              <path d="M 330,310 Q 370,320 420,320" />
              <path d="M 230,250 Q 250,290 270,340" />
            </g>
            {selected.country === "uzbekistan" ? (
              <path d="M 370,175 Q 410,185 450,215 L 485,225 L 475,250 L 450,255 L 430,280 L 390,265 L 360,220 Z" fill="#cda85d" fillOpacity="0.18" stroke="#cda85d" strokeDasharray="4 2" strokeWidth="1.8" />
            ) : null}
            {routeOn(tab, "caucasus") ? (
              <path d="M 70,240 Q 130,230 195,220" fill="none" stroke="#9b5134" strokeDasharray="4 4" strokeWidth="2.2" />
            ) : null}
            {routeOn(tab, "main") ? (
              <path d="M 70,240 Q 170,280 270,305 L 330,300 L 380,280 L 420,265 L 440,255 L 470,230 L 515,248 L 565,260 L 670,210 L 760,235 L 905,290" fill="none" stroke="#c59b43" strokeLinecap="round" strokeWidth="3.5" />
            ) : null}
            {routeOn(tab, "pamir") ? (
              <>
                <path d="M 450,270 L 485,285 L 565,260" fill="none" stroke="#d48b38" strokeDasharray="5 4" strokeWidth="2.8" />
                <path d="M 440,255 L 450,270" fill="none" stroke="#d48b38" strokeWidth="2.5" />
              </>
            ) : null}
            {routeOn(tab, "karakoram") ? (
              <path d="M 565,260 L 550,320" fill="none" stroke="#c26b48" strokeDasharray="3 3" strokeWidth="2.8" />
            ) : null}
            {routeOn(tab, "main") ? (
              <>
                <path d="M 470,230 L 520,218 L 575,200" fill="none" stroke="#b88f3e" strokeDasharray="4 3" strokeWidth="2" />
                <path d="M 575,200 L 670,210" fill="none" stroke="#b88f3e" strokeDasharray="4 3" strokeWidth="1.8" />
              </>
            ) : null}

            {CITIES.map((city) => {
              const active = city.id === selected.id;
              const name = t(`cities.${city.id}`);
              const pill = name.toUpperCase();
              const pillWidth = Math.max(86, pill.length * 8.2);
              return (
                <g key={city.id} transform={`translate(${city.x} ${city.y})`} className="cursor-pointer" onClick={() => choose(city.id)}>
                  {active ? (
                    <>
                      <circle r="24" fill="#cda85d" fillOpacity="0.28" />
                      <circle r="14" fill="none" stroke="#cda85d" strokeWidth="1.5" />
                      <circle r="6" fill="#cda85d" stroke="#ffffff" strokeWidth="2.5" />
                      <g transform="translate(0 -18)">
                        <rect x={-pillWidth / 2} y="-12" width={pillWidth} height="17" rx="3.5" fill="#0c1322" fillOpacity="0.92" stroke="#cda85d" />
                        <text textAnchor="middle" y="0" fill="#f8f4ec" fontSize="11" fontWeight="700">
                          {pill}
                        </text>
                      </g>
                    </>
                  ) : (
                    <>
                      <circle r={city.r ?? 4} fill="#1b2a47" stroke="#ffffff" strokeWidth="1.4" />
                      <text x={city.dx} y={city.dy} textAnchor={city.anchor} fill="#1e293b" fontSize="11" fontWeight="600">
                        {name}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {cardOpen ? (
            <article className="absolute bottom-4 right-4 z-30 w-[min(100%-2rem,22rem)] overflow-hidden rounded-xl border border-silk-gold/30 bg-white shadow-2xl sm:top-1/2 sm:bottom-auto sm:right-auto sm:left-[42%] sm:w-96 sm:-translate-y-1/2">
              <div className="relative h-36 w-full bg-slate-900 sm:h-44">
                <img src={cardImage} alt={cityName} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute left-3 top-3 rounded border border-silk-gold/40 bg-silk-indigo/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-silk-gold">
                  {countryName}
                </div>
                <button type="button" aria-label={t("close")} className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-black/50 text-sm text-white" onClick={() => setCardOpen(false)}>
                  ×
                </button>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="silk-headline text-2xl leading-none text-white">{cityName}</h3>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {selected.id === "samarkand" ? t("blurbSamarkand") : t("blurb", { city: cityName, country: countryName })}
                </p>
                {cityTours.length > 0 ? (
                  <ul className="mt-3 space-y-1 rounded-lg border border-amber-900/10 bg-[#fbf9f5] p-2.5 text-xs text-slate-800">
                    {cityTours.map((tour) => (
                      <li key={tour.slug}>
                        <Link href={`/journeys/${tour.slug}`} className="flex items-center justify-between gap-3 font-medium hover:text-silk-indigo">
                          <span>{tour.title}</span>
                          <span className="shrink-0 text-[11px] font-semibold text-amber-800">{t("days", { count: tour.days })}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link href={`/journeys?country=${selected.country}`} className="mt-4 block rounded-md bg-silk-gold py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-silk-indigo hover:brightness-95">
                  {t("explore")}
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
