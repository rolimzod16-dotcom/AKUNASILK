import type { CmsTour } from "@/lib/cms/types";

export type TourDeparture = {
  date: string;
  status: "open" | "limited" | "request";
  placesLabel: string;
  singleSupplement?: number;
};

/** Build a small departures table from nextDeparture (+30d, +60d) when CMS has no list. */
export function getTourDepartures(tour: CmsTour, locale: string): TourDeparture[] {
  const base = new Date(tour.nextDeparture);
  if (Number.isNaN(base.getTime())) {
    return [
      {
        date: tour.nextDeparture,
        status: "request",
        placesLabel: locale === "ru" ? "По запросу" : "On request",
        singleSupplement: Math.round(tour.price * 0.25),
      },
    ];
  }

  const offsets = [0, 30, 60];
  return offsets.map((days, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    const iso = d.toISOString().slice(0, 10);
    const status: TourDeparture["status"] =
      i === 0 ? "open" : i === 1 ? "limited" : "request";
    const placesLabel =
      status === "open"
        ? locale === "ru"
          ? "Открыта запись"
          : "Open for enquiry"
        : status === "limited"
          ? locale === "ru"
            ? "Ограниченные места"
            : "Limited availability"
          : locale === "ru"
            ? "По запросу"
            : "On request";
    return {
      date: iso,
      status,
      placesLabel,
      singleSupplement: Math.round(tour.price * 0.25),
    };
  });
}

export function formatDepartureDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
