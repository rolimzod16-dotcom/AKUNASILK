import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const CARDS = [
  { slug: "transport-rental", title: "Transport and 4x4 Rental" },
  { slug: "drivers-guides", title: "Drivers and Guides" },
  { slug: "visa-support", title: "Visas and Invitation Letters" },
  { slug: "permits-gbao", title: "Permits and Special Access" },
  { slug: "tailor-made", title: "Tailor-Made Planning" },
] as const;

export default async function HomeServices() {
  const t = await getTranslations("home.services");

  return (
    <section className="apple-section border-t border-silk-gold/15 bg-white">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-apple-muted">{t("subtitle")}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CARDS.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className="rounded-2xl border border-silk-gold/20 bg-silk-cream/70 px-4 py-5 transition hover:border-silk-gold/50 hover:shadow-md"
            >
              <h3 className="silk-headline text-[1.05rem] leading-snug text-silk-indigo">
                {item.title}
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
