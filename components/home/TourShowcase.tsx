import { getLocale } from "next-intl/server";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";
import TourShowcaseClient from "./TourShowcaseClient";

export default async function TourShowcase() {
  const locale = await getLocale();
  const tours = await getPublishedTours();
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
  }));
  return <TourShowcaseClient items={items} />;
}