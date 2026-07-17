import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AutomationShell from "@/components/automation/AutomationShell";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const site = getSiteUrl();
  const title = t("title");
  const description = t("description");
  const ogImage = `${site}/og-default.png`;

  // No site-wide canonical to "/" — pages set their own via buildPageMetadata.
  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_YANDEX_VERIFICATION) {
    verification.yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION,
    };
  }

  return {
    metadataBase: new URL(site),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: site }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "travel",
    keywords: [
      "Silk Road tours",
      "Silk Road tour",
      "Great Silk Road tours",
      "Silk Road travel",
      "Central Asia tours",
      "Uzbekistan tour",
      "Tajikistan tour",
      "Pamir Highway",
      "GREATSILKTRAILS",
    ],
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? ["en_US"] : ["ru_RU"],
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "geo.region": "UZ",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification:
      Object.keys(verification).length > 0 ? verification : undefined,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ru")) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "meta" });

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-silk-cream font-sans antialiased [--font-sans:var(--font-inter)]">
        <JsonLd locale={locale} description={t("description")} />
        <NextIntlClientProvider messages={messages}>
          <AutomationShell>
            <Header />
            <main className="pb-24 lg:pb-0">{children}</main>
            <Footer />
            <StickyMobileCTA />
          </AutomationShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
