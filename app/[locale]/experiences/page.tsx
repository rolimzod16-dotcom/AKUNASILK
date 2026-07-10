import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import VideoShowcase from "@/components/home/VideoShowcase";
import { portfolioItems } from "@/lib/data/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.experiences" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.experiences" });
  const tours = await getTranslations({ locale, namespace: "tours.items" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} />
      <VideoShowcase />
      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {portfolioItems.map((item, i) => {
              const titleKey = item.tourSlug;
              let title = item.tourSlug;
              try {
                title = tours(`${titleKey}.title`);
              } catch {
                title = item.tourSlug;
              }
              return (
                <AnimateIn key={item.id} delay={i * 0.08} className="mb-4 break-inside-avoid">
                  <Link
                    href={`/journeys/${item.tourSlug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-silk-gold/20 transition duration-500 hover:border-silk-gold/50 hover:shadow-xl hover:shadow-silk-gold/10"
                  >
                    <Image
                      src={item.image}
                      alt={title}
                      width={800}
                      height={i % 3 === 0 ? 1000 : 600}
                      className="w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-silk-indigo/85 to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                      <p className="silk-headline text-lg text-white">{title}</p>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
