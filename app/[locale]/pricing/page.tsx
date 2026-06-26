import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pricing" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

const tiers = ["explorer", "signature", "bespoke"] as const;

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  const pages = await getTranslations({ locale, namespace: "pages.pricing" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <PageHero title={pages("title")} subtitle={t("subtitle")} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier, i) => {
              const popular = tier === "signature";
              const features = t.raw(`tiers.${tier}.features`) as string[];

              return (
                <AnimateIn key={tier} delay={i * 0.1}>
                  <Card
                    className={cn(
                      "relative flex h-full flex-col",
                      popular
                        ? "border-gold bg-indigo text-white shadow-xl shadow-gold/10"
                        : "border-indigo/10"
                    )}
                  >
                    {popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-indigo hover:bg-gold">
                        POPULAR
                      </Badge>
                    )}
                    <CardHeader>
                      <h3
                        className={cn(
                          "font-display text-2xl font-semibold",
                          popular ? "text-gold" : "text-indigo"
                        )}
                      >
                        {t(`tiers.${tier}.name`)}
                      </h3>
                      <p
                        className={cn(
                          "font-display text-3xl font-bold",
                          popular ? "text-white" : "text-gold"
                        )}
                      >
                        {t(`tiers.${tier}.price`)}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          popular ? "text-white/70" : "text-muted-foreground"
                        )}
                      >
                        {t(`tiers.${tier}.desc`)}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check
                              className={cn(
                                "mt-0.5 size-4 shrink-0",
                                popular ? "text-gold" : "text-turquoise"
                              )}
                            />
                            <span className={popular ? "text-white/90" : "text-foreground/80"}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant={popular ? "silk" : "silkOutline"}
                        size="pill"
                        className="w-full"
                        asChild
                      >
                        <Link href="/contact">{nav("book")}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </AnimateIn>
              );
            })}
          </div>

          <AnimateIn className="mt-16">
            <Card className="border-indigo/10 bg-cream">
              <CardContent className="p-8">
            <h3 className="font-display text-xl font-semibold text-indigo">
              {t("included")}
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(t.raw("includedItems") as string[]).map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-indigo/80">
                  <Check className="h-4 w-4 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
              </CardContent>
            </Card>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}