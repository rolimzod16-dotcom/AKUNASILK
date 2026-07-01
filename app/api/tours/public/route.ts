import { NextResponse } from "next/server";
import { getPublishedTours, getTourContent } from "@/lib/cms/tours";
import { resolveTourCountrySlugs } from "@/lib/countries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "ru" ? "ru" : "en";

  const tours = await getPublishedTours();
  const payload = tours.map((tour) => {
    const content = getTourContent(tour, locale);
    return {
      slug: tour.slug,
      title: content.title,
      price: tour.price,
      originalPrice: tour.originalPrice,
      duration: tour.duration,
      spotsLeft: tour.spotsLeft,
      nextDeparture: tour.nextDeparture,
      difficulty: tour.difficulty,
      countries: tour.countries,
      countrySlugs: resolveTourCountrySlugs(tour),
      bestseller: tour.bestseller,
      image: tour.image,
      rating: tour.rating,
      reviews: tour.reviews,
    };
  });

  return NextResponse.json({ tours: payload });
}