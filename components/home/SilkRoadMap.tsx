"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const CITY_LINKS: Record<string, { destination?: string; journeys?: string }> = {
  xian: { destination: "china", journeys: "silk-road-origins-trail-china" },
  dunhuang: { destination: "china", journeys: "silk-road-origins-trail-china" },
  samarkand: { destination: "uzbekistan", journeys: "golden-cities-silk-trail-uzbekistan" },
  bukhara: { destination: "uzbekistan", journeys: "golden-cities-silk-trail-uzbekistan" },
  merv: { destination: "turkmenistan", journeys: "caravan-desert-silk-trail-turkmenistan" },
  tehran: { destination: "iran", journeys: "persian-silk-trail-iran" },
  istanbul: { destination: "turkey", journeys: "anatolian-silk-trail-turkey" },
};

const routeOrder = [
  "xian",
  "dunhuang",
  "samarkand",
  "bukhara",
  "merv",
  "tehran",
  "istanbul",
] as const;

type CityId = (typeof routeOrder)[number];

type CityPoint = {
  id: CityId;
  x: number;
  y: number;
  labelY: number;
};

const cities: CityPoint[] = [
  { id: "istanbul", x: 78, y: 222, labelY: 198 },
  { id: "tehran", x: 218, y: 248, labelY: 272 },
  { id: "merv", x: 372, y: 232, labelY: 256 },
  { id: "bukhara", x: 472, y: 202, labelY: 178 },
  { id: "samarkand", x: 522, y: 222, labelY: 248 },
  { id: "dunhuang", x: 732, y: 182, labelY: 158 },
  { id: "xian", x: 882, y: 218, labelY: 194 },
];

const routePath =
  "M 882 218 C 834 194 774 176 732 182 C 654 162 594 198 522 222 C 492 208 482 198 472 202 C 432 218 402 226 372 232 C 304 246 259 254 218 248 C 156 235 116 222 78 222";

export default function SilkRoadMap() {
  const t = useTranslations("silkRoad");
  const [activeCity, setActiveCity] = useState<CityId>("samarkand");
  const [hoveredCity, setHoveredCity] = useState<CityId | null>(null);
  const progress = useMotionValue(0.35);
  const offsetDistance = useTransform(progress, (v) => `${v * 100}%`);

  const focusCity = hoveredCity ?? activeCity;

  useEffect(() => {
    const controls = animate(progress, [0, 1], {
      duration: 80,
      repeat: Infinity,
      ease: "linear",
    });
    return controls.stop;
  }, [progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const segment = 1 / (routeOrder.length - 1);
    const idx = Math.min(Math.floor(latest / segment + 0.001), routeOrder.length - 1);
    setActiveCity(routeOrder[idx]);
  });

  return (
    <figure className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-silk-gold/20 bg-[#faf8f5]">
        {/* Editorial header */}
        <div className="flex flex-col gap-4 border-b border-silk-gold/15 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-apple-muted">
              {t("mapEra")}
            </p>
            <h3 className="silk-headline mt-2 text-3xl text-silk-indigo sm:text-4xl">
              {t("mapTitle")}
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-apple-muted">
              {t("routeLabel")}
            </p>
            <p className="mt-1 text-sm text-silk-indigo">
              {t(`cities.xian.name`)} — {t(`cities.istanbul.name`)}
            </p>
          </div>
        </div>

        {/* Map canvas — no overlays */}
        <div className="px-4 pt-8 pb-4 sm:px-10 sm:pt-10 sm:pb-6">
          <svg
            viewBox="0 0 960 300"
            className="h-auto w-full"
            role="img"
            aria-label={t("mapTitle")}
          >
            <defs>
              <linearGradient id="landFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5f0e8" />
                <stop offset="100%" stopColor="#ebe4d8" />
              </linearGradient>
              <linearGradient id="routeLine" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#d4a82a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c45c38" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Fine grid */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={80 + i * 70}
                y1="60"
                x2={80 + i * 70}
                y2="260"
                stroke="#e0d8cc"
                strokeWidth="0.5"
                opacity="0.6"
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="60"
                y1={80 + i * 55}
                x2="900"
                y2={80 + i * 55}
                stroke="#e0d8cc"
                strokeWidth="0.5"
                opacity="0.6"
              />
            ))}

            {/* Landmass */}
            <path
              d="M 50 95 C 140 73 240 83 360 77 C 500 69 640 75 780 71 C 880 67 930 85 940 115 L 940 255 C 860 273 700 263 520 269 C 340 273 180 267 80 261 C 55 259 45 245 50 215 Z"
              fill="url(#landFill)"
              stroke="#d8d0c4"
              strokeWidth="0.75"
            />

            {/* Water — minimal */}
            <ellipse cx="195" cy="188" rx="44" ry="26" fill="#d4e8ec" opacity="0.55" />
            <ellipse cx="438" cy="175" rx="24" ry="12" fill="#d4e8ec" opacity="0.4" />

            {/* Terrain hint */}
            <path
              d="M 400 118 L 438 168 L 488 128 L 538 176 L 588 132 L 638 180 L 688 138 L 738 172"
              fill="none"
              stroke="#c8c0b4"
              strokeWidth="0.75"
              opacity="0.7"
            />

            {/* Route */}
            <path
              d={routePath}
              fill="none"
              stroke="url(#routeLine)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Tracer — subtle gold dot, not a cartoon */}
            <motion.circle
              r="3.5"
              fill="#d4a82a"
              stroke="#faf8f5"
              strokeWidth="1.5"
              style={{ offsetPath: `path("${routePath}")`, offsetDistance }}
            />

            {/* Cities */}
            {cities.map((city) => {
              const focused = focusCity === city.id;
              return (
                <g
                  key={city.id}
                  className="cursor-default"
                  onMouseEnter={() => setHoveredCity(city.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  {focused && (
                    <circle cx={city.x} cy={city.y} r="14" fill="#d4a82a" opacity="0.12" />
                  )}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={focused ? 4 : 3}
                    fill={focused ? "#0f1225" : "#d4a82a"}
                    stroke="#faf8f5"
                    strokeWidth="1.5"
                  />
                  <text
                    x={city.x}
                    y={city.labelY}
                    textAnchor="middle"
                    fill={focused ? "#0f1225" : "#5a6080"}
                    fontSize={focused ? 11 : 10}
                    fontWeight={focused ? 500 : 400}
                    letterSpacing="0.04em"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {t(`cities.${city.id}.name`).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* City info — below map, never overlapping */}
        <div className="min-h-[88px] border-y border-silk-gold/15 bg-white/60 px-6 py-5 sm:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={focusCity}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto flex max-w-lg flex-col items-center text-center sm:flex-row sm:gap-6 sm:text-left"
            >
              <div className="shrink-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-apple-muted">
                  {t(`cities.${focusCity}.country`)}
                </p>
                <p className="silk-headline mt-0.5 text-xl text-silk-indigo sm:text-2xl">
                  {t(`cities.${focusCity}.name`)}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 sm:border-l sm:border-silk-gold/20 sm:pl-6">
                <p className="text-xs leading-relaxed text-apple-subtle">
                  {t(`cities.${focusCity}.tag`)}
                </p>
                {CITY_LINKS[focusCity] && (
                  <div className="mt-2 flex flex-wrap justify-center gap-3 sm:justify-start">
                    {CITY_LINKS[focusCity].destination && (
                      <Link
                        href={`/destinations/${CITY_LINKS[focusCity].destination}`}
                        className="text-xs font-semibold text-silk-gold hover:underline"
                      >
                        {t("viewDestination")}
                      </Link>
                    )}
                    {CITY_LINKS[focusCity].journeys && (
                      <Link
                        href={`/journeys/${CITY_LINKS[focusCity].journeys}`}
                        className="text-xs font-semibold text-silk-turquoise hover:underline"
                      >
                        {t("viewTours")}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Editorial city index */}
        <div className="px-6 py-6 sm:px-10">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-apple-muted">
            {t("mapLegend")}
          </p>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {routeOrder.map((id, i) => (
              <span key={id} className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseEnter={() => setHoveredCity(id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onFocus={() => setHoveredCity(id)}
                  onBlur={() => setHoveredCity(null)}
                  className={cn(
                    "text-xs transition-colors duration-300",
                    focusCity === id
                      ? "font-medium text-silk-indigo"
                      : "text-apple-muted hover:text-silk-indigo"
                  )}
                >
                  {t(`cities.${id}.name`)}
                </button>
                {i < routeOrder.length - 1 && (
                  <span className="text-silk-gold/40" aria-hidden>
                    —
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-apple-muted">{t("mapSubtitle")}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-apple-muted">{t("editorialNote")}</p>
        </div>
      </div>
    </figure>
  );
}