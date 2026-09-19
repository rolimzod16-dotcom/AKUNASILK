import { getTranslations } from "next-intl/server";

const KEYS = ["rooted", "ground", "private", "team"] as const;

export default async function HomeWhy() {
  const t = await getTranslations("home.why");

  return (
    <section className="apple-section bg-silk-cream">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">{t("title")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KEYS.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm"
            >
              <h3 className="silk-headline text-xl text-silk-indigo">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-apple-muted">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
