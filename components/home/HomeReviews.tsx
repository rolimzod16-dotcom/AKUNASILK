import { getSiteSettings } from "@/lib/cms/settings";
import { getPublishedReviews } from "@/lib/cms/reviews";

export default async function HomeReviews() {
  const settings = await getSiteSettings();
  if (!settings.showReviews) return null;
  const reviews = (await getPublishedReviews()).slice(0, 3);
  if (reviews.length === 0) return null;

  return (
    <section className="apple-section bg-silk-cream">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">Guest stories</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {reviews.map((item) => (
            <blockquote
              key={item.id}
              className="rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-apple-muted">“{item.text}”</p>
              <footer className="mt-4 text-sm font-semibold text-silk-indigo">
                {item.guestName}
                {item.country ? `, ${item.country}` : ""}
                {item.year ? ` · ${item.year}` : ""}
              </footer>
              {item.tourTitle && (
                <p className="mt-1 text-xs text-apple-muted">{item.tourTitle}</p>
              )}
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-silk-gold"
                >
                  Original review
                </a>
              )}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
