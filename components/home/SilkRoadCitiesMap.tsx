"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
};

const CITIES: City[] = [
  { id: "istanbul", country: "turkey", x: 78, y: 258, anchor: "end", dx: -10, dy: -8 },
  { id: "tbilisi", country: "georgia", x: 204, y: 248, anchor: "middle", dx: 0, dy: -14 },
  { id: "tehran", country: "iran", x: 262, y: 332, anchor: "start", dx: 8, dy: 4 },
  { id: "mashhad", country: "iran", x: 348, y: 318, anchor: "start", dx: 8, dy: 14 },
  { id: "khiva", country: "uzbekistan", x: 402, y: 246, anchor: "end", dx: -8, dy: -12 },
  { id: "merv", country: "turkmenistan", x: 386, y: 304, anchor: "end", dx: -8, dy: 16 },
  { id: "bukhara", country: "uzbekistan", x: 436, y: 276, anchor: "end", dx: -8, dy: -10 },
  { id: "samarkand", country: "uzbekistan", x: 468, y: 258, anchor: "middle", dx: 0, dy: -22 },
  { id: "tashkent", country: "uzbekistan", x: 498, y: 222, anchor: "start", dx: 8, dy: -8 },
  { id: "dushanbe", country: "tajikistan", x: 496, y: 304, anchor: "end", dx: -8, dy: 16 },
  { id: "khorog", country: "tajikistan", x: 538, y: 334, anchor: "start", dx: 8, dy: 14 },
  { id: "bishkek", country: "kyrgyzstan", x: 552, y: 196, anchor: "middle", dx: 0, dy: -14 },
  { id: "osh", country: "kyrgyzstan", x: 556, y: 242, anchor: "start", dx: 8, dy: 4 },
  { id: "almaty", country: "kazakhstan", x: 648, y: 208, anchor: "start", dx: 8, dy: -8 },
  { id: "kashgar", country: "china", x: 632, y: 268, anchor: "start", dx: 10, dy: 4 },
  { id: "gilgit", country: "pakistan", x: 590, y: 368, anchor: "start", dx: 8, dy: 14 },
  { id: "turpan", country: "china", x: 742, y: 214, anchor: "middle", dx: 0, dy: -14 },
  { id: "dunhuang", country: "china", x: 828, y: 236, anchor: "middle", dx: 0, dy: -14 },
  { id: "xian", country: "china", x: 938, y: 286, anchor: "end", dx: -10, dy: 16 },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80";

const LABEL = "var(--font-cormorant), Georgia, serif";
const MAIN_ROUTE = "M 78 258 Q 160 300 262 332 L 348 318 L 386 304 L 436 276 L 468 258 L 498 222 L 556 242 L 632 268 L 742 214 L 828 236 L 938 286";
const PAMIR_ROUTE = "M 468 258 L 496 304 L 538 334 L 632 268";
const KARAKORAM_ROUTE = "M 632 268 L 590 368";
const CAUCASUS_ROUTE = "M 78 258 Q 140 250 204 248";
const STEPPE_ROUTE = "M 498 222 L 552 196 L 648 208";
const KHIVA_ROUTE = "M 436 276 L 402 246";

type LightSpec = {
  id: string;
  route: Exclude<RouteId, "all">;
  path: string;
  color: string;
  dur: number;
  offset: number;
  fromEnd?: boolean;
};

const LIGHTS: LightSpec[] = [
  { id: "main-a", route: "main", path: MAIN_ROUTE, color: "#f0c84a", dur: 16000, offset: 0, fromEnd: true },
  { id: "main-b", route: "main", path: MAIN_ROUTE, color: "#fff1c2", dur: 16000, offset: 0.5, fromEnd: true },
  { id: "steppe", route: "main", path: STEPPE_ROUTE, color: "#e8a020", dur: 7000, offset: 0.2, fromEnd: true },
  { id: "khiva", route: "main", path: KHIVA_ROUTE, color: "#e8a020", dur: 5200, offset: 0.35 },
  { id: "pamir", route: "pamir", path: PAMIR_ROUTE, color: "#c45c38", dur: 9000, offset: 0, fromEnd: true },
  { id: "karakoram", route: "karakoram", path: KARAKORAM_ROUTE, color: "#e07a6a", dur: 6000, offset: 0 },
  { id: "caucasus", route: "caucasus", path: CAUCASUS_ROUTE, color: "#5ed0bf", dur: 6500, offset: 0, fromEnd: true },
];

function pathPoint(d: string, atEnd: boolean) {
  const matches = [...d.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)];
  const match = atEnd ? matches[matches.length - 1] : matches[0];
  return { x: match ? Number(match[1]) : 0, y: match ? Number(match[2]) : 0 };
}

function CaravanLights({ tab }: { tab: RouteId }) {
  const visible = LIGHTS.filter((light) => routeOn(tab, light.route));
  const paths = useRef<Record<string, SVGPathElement | null>>({});
  const halos = useRef<Record<string, SVGCircleElement | null>>({});
  const cores = useRef<Record<string, SVGCircleElement | null>>({});
  const trails = useRef<Record<string, (SVGCircleElement | null)[]>>({});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const active = LIGHTS.filter((light) => routeOn(tab, light.route));
    let frame = 0;
    const origin = performance.now();
    const tick = (now: number) => {
      const elapsed = now - origin;
      for (const light of active) {
        const path = paths.current[light.id];
        if (!path) continue;
        const len = path.getTotalLength();
        if (!len) continue;
        const progress = (elapsed / light.dur + light.offset) % 1;
        const head = len * (light.fromEnd ? 1 - progress : progress);
        const move = (el: SVGCircleElement | null, behind: number, radius: number, opacity: number) => {
          if (!el) return;
          const dir = light.fromEnd ? -1 : 1;
          let dist = head - dir * behind;
          dist = ((dist % len) + len) % len;
          const point = path.getPointAtLength(dist);
          el.setAttribute("cx", point.x.toFixed(1));
          el.setAttribute("cy", point.y.toFixed(1));
          el.setAttribute("r", radius.toFixed(1));
          el.setAttribute("opacity", opacity.toFixed(2));
        };
        move(halos.current[light.id] ?? null, 0, 18, 0.4);
        move(cores.current[light.id] ?? null, 0, 4.2, 1);
        const gap = Math.min(22, len / 9);
        (trails.current[light.id] ?? []).forEach((dot, index) => {
          const behind = gap * (index + 1);
          if (!dot) return;
          if (behind >= len * 0.8) {
            dot.setAttribute("opacity", "0");
            return;
          }
          move(dot, behind, 12 - index * 1.6, 0.24 - index * 0.04);
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [tab]);

  return (
    <g pointerEvents="none" aria-hidden="true">
      {visible.map((light) => {
        const start = pathPoint(light.path, Boolean(light.fromEnd));
        return (
          <g key={light.id}>
            <path
              ref={(el) => {
                paths.current[light.id] = el;
              }}
              d={light.path}
              fill="none"
              stroke="none"
            />
            {Array.from({ length: 5 }, (_, index) => (
              <circle
                key={index}
                ref={(el) => {
                  const trail = trails.current[light.id] ?? [];
                  trail[index] = el;
                  trails.current[light.id] = trail;
                }}
                cx={start.x}
                cy={start.y}
                r={12 - index * 1.6}
                fill={light.color}
                opacity={0.24 - index * 0.04}
                filter="url(#lanternGlow)"
              />
            ))}
            <circle
              ref={(el) => {
                halos.current[light.id] = el;
              }}
              cx={start.x}
              cy={start.y}
              r="18"
              fill={light.color}
              opacity="0.4"
              filter="url(#lanternGlow)"
            />
            <circle
              ref={(el) => {
                cores.current[light.id] = el;
              }}
              data-caravan={light.id}
              cx={start.x}
              cy={start.y}
              r="4.2"
              fill="#fff8e4"
            />
          </g>
        );
      })}
    </g>
  );
}

function routeOn(tab: RouteId, route: Exclude<RouteId, "all">) {
  return tab === "all" || tab === route;
}

export default function SilkRoadCitiesMap({ tours }: { tours: SilkMapTour[] }) {
  const t = useTranslations("home.map");
  const locale = useLocale();
  const [tab, setTab] = useState<RouteId>("all");
  const [selectedId, setSelectedId] = useState<CityId | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [relief, setRelief] = useState(true);

  const selected = CITIES.find((city) => city.id === selectedId) ?? null;
  const cityTours = useMemo(
    () => (selected ? tours.filter((tour) => tour.countries.includes(selected.country)).slice(0, 2) : []),
    [tours, selected],
  );
  const countryName = selected ? getCountryLabel(selected.country, locale) : "";
  const cityName = selected ? t(`cities.${selected.id}`) : "";
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
    <section className="border-b border-silk-gold/15 bg-silk-cream py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-silk-gold">{t("eyebrow")}</p>
            <h2 className="silk-headline mt-3 text-3xl text-silk-indigo sm:text-5xl">{t("title")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-apple-muted sm:text-base">{t("hint")}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-full border border-silk-gold/25 bg-white p-1" role="tablist">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wider transition",
                  tab === item.id ? "bg-silk-indigo font-semibold text-silk-gold" : "text-silk-indigo/70 hover:bg-silk-sand/60",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[540px] overflow-hidden rounded-[1.75rem] border border-silk-gold/30 bg-silk-indigo shadow-[0_28px_60px_-28px_rgba(15,18,37,0.55)] lg:min-h-[640px]">
          <div className="absolute right-4 top-4 z-20 flex flex-col gap-1 rounded-2xl border border-silk-gold/25 bg-silk-cream/95 p-1.5">
            <button type="button" className="flex size-8 items-center justify-center rounded-xl text-silk-indigo hover:bg-silk-sand" title={t("zoomIn")} onClick={() => setZoom((value) => Math.min(1.8, +(value + 0.2).toFixed(2)))}>＋</button>
            <button type="button" className="flex size-8 items-center justify-center rounded-xl text-silk-indigo hover:bg-silk-sand" title={t("zoomOut")} onClick={() => setZoom((value) => Math.max(1, +(value - 0.2).toFixed(2)))}>－</button>
            <button type="button" className="flex size-8 items-center justify-center rounded-xl text-sm text-silk-indigo hover:bg-silk-sand" title={t("reset")} onClick={() => setZoom(1)}>⤢</button>
            <button type="button" aria-pressed={relief} className={cn("flex size-8 items-center justify-center rounded-xl text-xs", relief ? "bg-silk-indigo text-silk-gold" : "text-silk-indigo/50 hover:bg-silk-sand")} title={t("relief")} onClick={() => setRelief((value) => !value)}>⛰</button>
          </div>

          <div className="absolute bottom-5 left-5 z-20 hidden max-w-xs rounded-2xl border border-silk-gold/25 bg-silk-cream/95 px-4 py-3 text-xs text-silk-indigo sm:block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-[family-name:var(--font-cormorant)] text-sm font-semibold uppercase tracking-[0.14em]">{t("legend.title")}</span>
              <span className="text-[10px] text-silk-gold">{t("legend.era")}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5"><span className="inline-block h-1 w-7 rounded-full bg-silk-gold" />{t("legend.main")}</div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-7 border-t-2 border-dashed border-silk-terracotta" />{t("legend.pamir")}</div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-7 border-t-2 border-dotted border-silk-crimson" />{t("legend.karakoram")}</div>
              <div className="flex items-center gap-2.5"><span className="inline-block w-7 border-t-2 border-silk-emerald" />{t("legend.caucasus")}</div>
            </div>
            <p className="mt-2 border-t border-silk-gold/20 pt-2 text-[10px] text-apple-muted">{t("legend.tip")}</p>
          </div>

          <svg viewBox="0 0 1000 560" className="h-full min-h-[540px] w-full lg:min-h-[640px]" preserveAspectRatio="xMidYMid meet" style={{ transform: `scale(${zoom})`, transformOrigin: "46% 48%" }} role="img" aria-label={t("title")}>
            <rect width="1000" height="560" fill="#0f1225" />
            <path
              d="M 0 78 H 1000 V 392 C 940 360 880 400 820 378 C 760 352 700 410 640 390 C 590 430 540 400 500 448 C 450 510 390 470 340 520 C 280 560 210 500 150 470 C 90 445 40 480 0 450 Z"
              fill="#f4ead7"
            />
            <path d="M 0 78 H 1000 V 150 C 860 128 700 150 560 132 C 400 112 220 146 0 118 Z" fill="#e7d7b8" opacity="0.55" />
            <path d="M 0 292 C 70 268 108 314 86 362 C 62 412 18 430 0 418 Z" fill="#1a2040" />
            <path d="M 118 156 C 168 136 214 158 220 196 C 226 236 176 258 132 246 C 96 236 86 188 118 156 Z" fill="#1a2040" />
            <path d="M 292 168 C 328 156 352 188 354 236 C 356 292 332 328 304 322 C 278 314 270 236 284 196 C 286 176 286 172 292 168 Z" fill="#1a2040" />
            <path d="M 248 468 C 300 442 352 468 360 512 L 292 548 C 250 516 230 490 248 468 Z" fill="#1a2040" />
            <ellipse cx="430" cy="196" rx="22" ry="12" fill="#1a2040" opacity="0.85" />
            <path d="M 590 128 C 650 118 720 134 734 152 C 680 166 620 154 590 142 Z" fill="#1a2040" opacity="0.8" />
            <ellipse cx="575" cy="228" rx="16" ry="7" fill="#1a2040" opacity="0.75" />
            {relief ? (
              <g fill="none" stroke="#c4a36a" strokeWidth="1.1" strokeLinecap="round" opacity="0.8">
                <path d="M 150 206 l 14-10 14 10 14-10 12 10" />
                <path d="M 168 218 l 12-8 12 8 12-8" />
                <path d="M 470 250 l 16-12 16 12 16-11 14 11" />
                <path d="M 488 268 l 14-10 14 10 14-9 12 9" />
                <path d="M 510 292 l 18-13 16 13 16-12 14 12" />
                <path d="M 530 314 l 14-10 14 10 14-9" />
                <path d="M 560 210 l 16-12 16 12 16-11" />
                <path d="M 640 248 l 18-12 18 12 16-11 16 11" />
                <path d="M 700 268 l 16-11 16 11 16-10" />
              </g>
            ) : null}
            <defs>
              <filter id="lanternGlow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="4.5" />
              </filter>
            </defs>
            {routeOn(tab, "caucasus") ? (
              <path d={CAUCASUS_ROUTE} fill="none" stroke="#1a7a6d" strokeWidth="2.4" strokeDasharray="5 4" strokeLinecap="round" />
            ) : null}
            {routeOn(tab, "main") ? (
              <>
                <path d={MAIN_ROUTE} fill="none" stroke="#f0c84a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.28" />
                <path d={MAIN_ROUTE} fill="none" stroke="#d4a82a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d={KHIVA_ROUTE} fill="none" stroke="#e8a020" strokeWidth="1.8" strokeLinecap="round" />
              </>
            ) : null}
            {routeOn(tab, "pamir") ? (
              <path d={PAMIR_ROUTE} fill="none" stroke="#c45c38" strokeWidth="2.4" strokeDasharray="6 4" strokeLinecap="round" />
            ) : null}
            {routeOn(tab, "karakoram") ? (
              <path d={KARAKORAM_ROUTE} fill="none" stroke="#9e3b3b" strokeWidth="2.4" strokeDasharray="2 4" strokeLinecap="round" />
            ) : null}
            {routeOn(tab, "main") ? (
              <path d={STEPPE_ROUTE} fill="none" stroke="#e8a020" strokeWidth="1.8" strokeDasharray="4 3" strokeLinecap="round" />
            ) : null}
            <CaravanLights tab={tab} />

            {CITIES.map((city) => {
              const active = city.id === selectedId;
              const name = t(`cities.${city.id}`);
              const pill = name.toUpperCase();
              const pillWidth = Math.max(92, pill.length * 8.4);
              return (
                <g
                  key={city.id}
                  transform={`translate(${city.x} ${city.y})`}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => choose(city.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") choose(city.id);
                  }}
                >
                  {active ? (
                    <>
                      <circle r="22" fill="#d4a82a" fillOpacity="0.22" />
                      <circle r="12" fill="none" stroke="#f0c84a" strokeWidth="1.4" />
                      <circle r="5.5" fill="#d4a82a" stroke="#faf5eb" strokeWidth="2" />
                      <g transform="translate(0 -20)">
                        <rect x={-pillWidth / 2} y="-13" width={pillWidth} height="18" rx="9" fill="#0f1225" stroke="#d4a82a" />
                        <text textAnchor="middle" y="0" fill="#f0c84a" fontFamily={LABEL} fontSize="12" fontWeight="600">
                          {pill}
                        </text>
                      </g>
                    </>
                  ) : (
                    <>
                      <circle r="8" fill="transparent" />
                      <circle r="4.2" fill="#0f1225" stroke="#f4ead7" strokeWidth="1.6" />
                      <text x={city.dx} y={city.dy} textAnchor={city.anchor} fill="#0f1225" fontFamily={LABEL} fontSize="13" fontWeight="600">
                        {name}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {cardOpen && selected ? (
            <article className="absolute bottom-4 right-4 z-30 w-[min(100%-2rem,22rem)] overflow-hidden rounded-2xl border border-silk-gold/30 bg-white shadow-2xl sm:bottom-auto sm:left-auto sm:right-6 sm:top-16 sm:w-80">
              <div className="relative h-36 w-full bg-silk-indigo">
                <img src={cardImage} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/80 via-silk-indigo/10 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-silk-gold/40 bg-silk-indigo/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-silk-gold">
                  {countryName}
                </div>
                <button type="button" aria-label={t("close")} className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-silk-indigo/70 text-sm text-silk-cream" onClick={() => { setCardOpen(false); setSelectedId(null); }}>
                  ×
                </button>
                <h3 className="silk-headline absolute bottom-3 left-3 right-3 text-2xl leading-none text-white">{cityName}</h3>
              </div>
              <div className="bg-white p-4">
                <p className="text-[13px] leading-relaxed text-apple-muted">
                  {selected.id === "samarkand" ? t("blurbSamarkand") : t("blurb", { city: cityName, country: countryName })}
                </p>
                {cityTours.length > 0 ? (
                  <ul className="mt-3 space-y-1 rounded-xl border border-silk-gold/20 bg-silk-cream p-2.5 text-xs">
                    {cityTours.map((tour) => (
                      <li key={tour.slug}>
                        <Link href={`/journeys/${tour.slug}`} className="flex items-center justify-between gap-3 font-medium text-silk-indigo hover:text-silk-gold">
                          <span>{tour.title}</span>
                          <span className="shrink-0 text-[11px] font-semibold text-silk-gold">{t("days", { count: tour.days })}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link href={`/journeys?country=${selected.country}`} className="mt-4 block rounded-full bg-silk-gold py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-silk-indigo hover:brightness-95">
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
