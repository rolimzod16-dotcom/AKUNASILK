import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, Clock, MessageCircle } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import ContactForm from "@/components/contact/ContactForm";
import { getPublishedTours, getTourContent } from "@/lib/data/tours";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const c = await getTranslations({ locale, namespace: "contact" });
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: c("subtitle"),
  });
}


function ContactFormFallback() {
  return (
    <Card className="border-silk-gold/15 shadow-sm">
      <CardContent className="p-8">
        <div className="h-64 animate-pulse rounded-lg bg-silk-gold/10" />
      </CardContent>
    </Card>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.contact" });
  const t = await getTranslations({ locale, namespace: "contact" });
  const info = await getTranslations({ locale, namespace: "contact.info" });
  const form = await getTranslations({ locale, namespace: "contact.form" });
  const publishedTours = await getPublishedTours();
  const tourOptions = [
    { slug: "any", label: form("tourOptions.any") },
    ...publishedTours.map((tour) => ({
      slug: tour.slug,
      label: getTourContent(tour, locale).title,
    })),
    { slug: "bespoke", label: form("tourOptions.bespoke") },
  ];

  return (
    <>
      <PageHero title={pages("title")} subtitle={t("subtitle")} compact />
      <section className="apple-section">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <AnimateIn className="lg:col-span-3">
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm tourOptions={tourOptions} />
              </Suspense>
            </AnimateIn>
            <AnimateIn delay={0.1} className="lg:col-span-2">
              <Card className="silk-pattern-dark h-full border-silk-gold/20 bg-silk-indigo text-white">
                <CardContent className="p-8">
                  <h3 className="silk-headline text-xl text-white">
                    GREAT<span className="text-silk-gold">SILK</span>TRAILS
                  </h3>
                  <ul className="mt-6 space-y-5">
                    <li className="flex items-start gap-3">
                      <Mail className="mt-0.5 size-5 text-silk-gold" />
                      <a
                        href={`mailto:${info("email")}`}
                        className="text-sm text-white/80 hover:text-silk-gold"
                      >
                        {info("email")}
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="mt-0.5 size-5 text-silk-gold" />
                      <a
                        href={`tel:${info("phone").replace(/\s/g, "")}`}
                        className="text-sm text-white/80 hover:text-silk-gold"
                      >
                        {info("phone")}
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 size-5 text-silk-gold" />
                      <a
                        href="https://wa.me/998712004567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/80 hover:text-silk-gold"
                      >
                        {info("whatsapp")}
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-5 text-silk-gold" />
                      <span className="text-sm text-white/80">{info("hours")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}