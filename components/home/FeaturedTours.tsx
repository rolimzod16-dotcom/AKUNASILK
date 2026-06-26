import { getLocale } from "next-intl/server";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";
import FeaturedToursClient from "./FeaturedToursClient";

export default async function FeaturedTours() {
  const locale = await getLocale();
  const tours = (await getPublishedTours()).filter((t) => t.featured);
  const items = tours.map((tour) => ({
    tour,
    content: getTourContent(tour, locale),
  }));
  return <FeaturedToursClient items={items} />;
}