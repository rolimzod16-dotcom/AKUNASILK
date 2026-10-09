import TourCard from "@/components/tours/TourCard";
import type { Tour, TourContent } from "@/lib/data/tours";

type CatalogItem = { tour: Tour; content: TourContent; showPrice?: boolean };

type JourneyCatalogProps = {
  items: CatalogItem[];
};

export default function JourneyCatalog({ items }: JourneyCatalogProps) {
  if (items.length === 0) return null;

  return (
    <section className="pb-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ tour, content, showPrice }, i) => (
            <TourCard key={tour.id} tour={tour} content={content} index={i} showPrice={showPrice} />
          ))}
        </div>
      </div>
    </section>
  );
}
