import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import SectionHeading from "@/components/shared/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const a = await getTranslations({ locale, namespace: "about" });
  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: a("subtitle"),
  });
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

      <section className="apple-section">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div className="silk-frame relative aspect-[4/3] overflow-hidden rounded-2xl">
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
              <h2 className="silk-headline text-3xl text-silk-indigo">{t("title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-apple-muted">{t("mission")}</p>
            </AnimateIn>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {valueKeys.map((key, i) => (
              <AnimateIn key={key} delay={i * 0.1}>
                <div className="rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm">
                  <h3 className="silk-headline text-xl text-silk-gold">{t(`values.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-apple-muted">{t(`values.${key}.desc`)}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="silk-pattern-dark apple-section">
        <div className="mx-auto max-w-[980px] px-6">
          <SectionHeading title={t("team.title")} dark />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {memberKeys.map((key, i) => (
              <AnimateIn key={key} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-silk-gold/20 silk-headline text-2xl font-bold text-silk-gold">
                    {t(`team.members.${key}.name`).charAt(0)}
                  </div>
                  <h3 className="mt-4 silk-headline text-xl text-white">
                    {t(`team.members.${key}.name`)}
                  </h3>
                  <p className="text-sm text-silk-gold">{t(`team.members.${key}.role`)}</p>
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