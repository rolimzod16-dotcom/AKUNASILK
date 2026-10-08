export const SEASONS = [
  { id: "spring", months: [3, 4, 5], ru: "Весна", en: "Spring" },
  { id: "summer", months: [6, 7, 8], ru: "Лето", en: "Summer" },
  { id: "autumn", months: [9, 10, 11], ru: "Осень", en: "Autumn" },
  { id: "winter", months: [12, 1, 2], ru: "Зима", en: "Winter" },
] as const;

export type SeasonId = (typeof SEASONS)[number]["id"];

const SEASON_IDS = new Set<string>(SEASONS.map((season) => season.id));

export function isSeasonId(value: string | null | undefined): value is SeasonId {
  return Boolean(value && SEASON_IDS.has(value));
}

export function seasonById(id: SeasonId) {
  return SEASONS.find((season) => season.id === id) ?? SEASONS[0];
}

export function normalizeDepartureMonths(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const months = value
    .map((item) => Number(item))
    .filter((month) => Number.isInteger(month) && month >= 1 && month <= 12);
  return [...new Set(months)].sort((a, b) => a - b);
}

export function monthFromIso(iso?: string | null): number | null {
  if (!iso || iso.length < 7) return null;
  const month = Number(iso.slice(5, 7));
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

export function tourDepartureMonths(tour: {
  departureMonths?: number[] | null;
  nextDeparture?: string | null;
}): number[] {
  const explicit = normalizeDepartureMonths(tour.departureMonths);
  if (explicit.length > 0) return explicit;
  const fromDate = monthFromIso(tour.nextDeparture);
  return fromDate ? [fromDate] : [];
}

export function tourMatchesMonth(
  tour: { departureMonths?: number[] | null; nextDeparture?: string | null },
  filter: string,
): boolean {
  if (!filter || filter === "all") return true;
  const months = tourDepartureMonths(tour);
  if (/^\d{4}-\d{2}/.test(filter)) {
    const month = Number(filter.slice(5, 7));
    if (months.includes(month)) return true;
    return Boolean(tour.nextDeparture?.startsWith(filter));
  }
  const month = Number(filter);
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  return months.includes(month);
}

export function tourMatchesSeason(
  tour: { departureMonths?: number[] | null; nextDeparture?: string | null },
  seasonId: SeasonId,
): boolean {
  const seasonMonths = seasonById(seasonId).months;
  return tourDepartureMonths(tour).some((month) =>
    (seasonMonths as readonly number[]).includes(month),
  );
}

/** 15th of the next selected month, using the local calendar. */
export function upcomingDeparture(months: number[], from = new Date()): string {
  const selected = normalizeDepartureMonths(months);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (selected.length === 0) {
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    return `${start.getFullYear()}-${month}-${day}`;
  }

  const year = start.getFullYear();
  const candidates = selected.flatMap((month) => [
    new Date(year, month - 1, 15),
    new Date(year + 1, month - 1, 15),
  ]);
  const next = candidates
    .filter((date) => date >= start)
    .sort((a, b) => a.getTime() - b.getTime())[0];
  const picked = next ?? new Date(year + 1, selected[0] - 1, 15);
  const month = String(picked.getMonth() + 1).padStart(2, "0");
  return `${picked.getFullYear()}-${month}-15`;
}
