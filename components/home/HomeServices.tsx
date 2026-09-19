import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { HOME_SERVICE_SLUGS } from "@/lib/site";

export default async function HomeServices() {
  const t = await getTranslations("home.services");
  const items = await getTranslations("pages.servicesLogistics.items");

  return (
    <section className="apple-section border-t border-silk-gold/15 bg-white">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-apple-muted sm:text-base">
          {t("subtitle")}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_SERVICE_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="rounded-2xl border border-silk-gold/20 bg-silk-cream/60 p-5 transition hover:border-silk-gold/50 hover:shadow-md"
            >
              <h3 className="silk-headline text-lg text-silk-indigo">
                {items(`${slug}.title`)}
              </h3>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="silkOutline" size="pill" asChild>
            <Link href="/services">{t("cta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
