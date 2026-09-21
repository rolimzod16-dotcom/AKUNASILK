"use client";

const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#highlights", label: "Highlights" },
  { href: "#itinerary", label: "Itinerary" },
  { href: "#dates", label: "Dates and Price" },
  { href: "#included", label: "Included" },
  { href: "#practical", label: "Practical Information" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function TourAnchorNav() {
  return (
    <nav
      aria-label="On this journey"
      className="sticky top-16 z-30 border-b border-silk-gold/20 bg-silk-cream/95 backdrop-blur-md sm:top-20"
    >
      <div className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-silk-indigo transition hover:bg-silk-gold/15"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
