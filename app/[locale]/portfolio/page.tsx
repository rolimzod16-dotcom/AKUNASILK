import Image from "next/image";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import { portfolioItems } from "@/lib/data/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.portfolio" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.portfolio" });
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tours = await getTranslations({ locale, namespace: "tours.items" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={t("subtitle")} />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {portfolioItems.map((item, i) => (
              <AnimateIn key={item.id} delay={i * 0.08} className="mb-4 break-inside-avoid">
                <div className="group relative overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt={tours(`${item.tourSlug}.title`)}
                    width={800}
                    height={i % 3 === 0 ? 1000 : 600}
                    className="w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-indigo/80 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <p className="font-display text-lg font-semibold text-white">
                      {tours(`${item.tourSlug}.title`)}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}