import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";

export default async function HomeCta() {
  const t = await getTranslations("home.cta");

  return (
    <section className="silk-pattern-dark apple-section">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <h2 className="silk-headline text-3xl text-white sm:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{t("subtitle")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="silk" size="pill" asChild>
            <Link href="/plan-my-journey">{t("plan")}</Link>
          </Button>
          <Button
            variant="silkOutline"
            size="pill"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {t("whatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
