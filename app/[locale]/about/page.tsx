import { getTranslations } from "next-intl/server";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import SectionHeading from "@/components/shared/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

const valueKeys = ["authentic", "sustainable", "excellence"] as const;
const memberKeys = ["1", "2", "3"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const pages = await getTranslations({ locale, namespace: "pages.about" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={t("subtitle")} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1565008576549-57569a49371d?w=900&q=80"
                  alt="Samarkand"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="font-display text-3xl font-semibold text-indigo">
                {t("title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-indigo/70">
                {t("mission")}
              </p>
            </AnimateIn>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {valueKeys.map((key, i) => (
              <AnimateIn key={key} delay={i * 0.1}>
                <div className="rounded-2xl border border-indigo/10 bg-cream p-6">
                  <h3 className="font-display text-xl font-semibold text-gold">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-indigo/70">
                    {t(`values.${key}.desc`)}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("team.title")} dark />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {memberKeys.map((key, i) => (
              <AnimateIn key={key} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 font-display text-2xl font-bold text-gold">
                    {t(`team.members.${key}.name`).charAt(0)}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-white">
                    {t(`team.members.${key}.name`)}
                  </h3>
                  <p className="text-sm text-gold">{t(`team.members.${key}.role`)}</p>
                  <p className="mt-3 text-sm text-white/70">
                    {t.has(`team.members.${key}.bio`)
                      ? t(`team.members.${key}.bio`)
                      : t(`team.members.${key}.desc`)}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}