import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import BookNowButton from "@/components/automation/BookNowButton";

const styleKeys = ["overland", "horseRiding", "culture", "photo"] as const;

const styleAnchors: Record<(typeof styleKeys)[number], string> = {
  overland: "overland",
  horseRiding: "horse-riding",
  culture: "culture",
  photo: "photo",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function TravelStylesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.travelStyles" });

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="apple-section">
        <div className="mx-auto max-w-[900px] space-y-10 px-6">
          {styleKeys.map((key) => (
            <article
              key={key}
              id={styleAnchors[key]}
              className="scroll-mt-24 rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm"
            >
              <h2 className="silk-headline text-2xl text-silk-indigo">{t(`styles.${key}.title`)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-apple-muted">{t(`styles.${key}.desc`)}</p>
            </article>
          ))}
          <BookNowButton variant="silk" size="pill" label={t("cta")} prefill={{ source: "travel-styles" }} />
        </div>
      </section>
    </>
  );
}