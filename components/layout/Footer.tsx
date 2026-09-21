"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import SilkDivider from "@/components/shared/SilkDivider";
import type { CmsSiteSettings } from "@/lib/cms/types";
import type { NavChild } from "@/lib/navigation";

const journeyLinks = [
  { label: "All journeys", href: "/journeys" },
  { label: "Tajikistan", href: "/destinations/tajikistan" },
  { label: "Uzbekistan", href: "/destinations/uzbekistan" },
  { label: "Kyrgyzstan", href: "/destinations/kyrgyzstan" },
  { label: "Kazakhstan", href: "/destinations/kazakhstan" },
] as const;

const destinationLinks = [
  { label: "Tajikistan", href: "/destinations/tajikistan" },
  { label: "Uzbekistan", href: "/destinations/uzbekistan" },
  { label: "Kyrgyzstan", href: "/destinations/kyrgyzstan" },
  { label: "Kazakhstan", href: "/destinations/kazakhstan" },
  { label: "Central Asia", href: "/destinations/central-asia" },
] as const;

const serviceLinks = [
  { label: "Transport and 4x4", href: "/services/transport-rental" },
  { label: "Drivers and guides", href: "/services/drivers-guides" },
  { label: "Visas", href: "/services/visa-support" },
  { label: "Permits", href: "/services/permits-gbao" },
  { label: "Tailor-made", href: "/services/tailor-made" },
] as const;

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Plan my journey", href: "/plan-my-journey" },
] as const;

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-silk-gold">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="text-sm text-white/60 transition hover:text-silk-gold">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  settings,
  destinations = [],
}: {
  settings: CmsSiteSettings;
  destinations?: NavChild[];
}) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const ru = locale === "ru";
  const contact = settings.contact;
  const tagline = settings.tagline || t("tagline");
  const phone = settings.contact.whatsapp.replace(/[^\d]/g, "");
  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(settings.whatsappGreeting)}`;
  const destLinks =
    destinations.length > 0
      ? destinations.map((item) => ({ label: item.label || item.key, href: item.href }))
      : destinationLinks;

  return (
    <footer className="silk-pattern-dark border-t border-silk-gold/20 text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <SilkDivider light className="mb-8" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="silk-headline text-xl tracking-wide text-white">
              GREAT SILK TRAILS
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
              {tagline}
            </p>
          </div>

          <FooterCol
            title={ru ? "Путешествия" : "Journeys"}
            links={
              ru
                ? [
                    { label: "Все маршруты", href: "/journeys" },
                    { label: "Таджикистан", href: "/destinations/tajikistan" },
                    { label: "Узбекистан", href: "/destinations/uzbekistan" },
                    { label: "Кыргызстан", href: "/destinations/kyrgyzstan" },
                    { label: "Казахстан", href: "/destinations/kazakhstan" },
                  ]
                : journeyLinks
            }
          />
          <FooterCol title={ru ? "Направления" : "Destinations"} links={destLinks} />
          <FooterCol
            title={ru ? "Услуги" : "Travel Services"}
            links={
              ru
                ? [
                    { label: "Транспорт и 4x4", href: "/services/transport-rental" },
                    { label: "Водители и гиды", href: "/services/drivers-guides" },
                    { label: "Визы", href: "/services/visa-support" },
                    { label: "Разрешения", href: "/services/permits-gbao" },
                    { label: "Индивидуальный маршрут", href: "/services/tailor-made" },
                  ]
                : serviceLinks
            }
          />
          <FooterCol
            title={ru ? "Компания" : "Company"}
            links={
              ru
                ? [
                    { label: "О нас", href: "/about" },
                    { label: "Контакты", href: "/contact" },
                    { label: "FAQ", href: "/faq" },
                    { label: "Спланировать поездку", href: "/plan-my-journey" },
                  ]
                : companyLinks
            }
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
          {contact.address ? <span className="w-full text-white/50">{contact.address}</span> : null}
          <a href={`mailto:${contact.email}`} className="transition hover:text-silk-gold">
            {contact.email}
          </a>
          <a href={`tel:${contact.phoneTel}`} className="transition hover:text-silk-gold">
            {contact.phoneDisplay}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="text-silk-turquoise transition hover:text-white"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-[11px] text-white/40">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="transition hover:text-silk-gold">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition hover:text-silk-gold">
              {t("terms")}
            </Link>
            <Link href="/cancellation" className="transition hover:text-silk-gold">
              {t("cancellation")}
            </Link>
            <Link href="/cookies" className="transition hover:text-silk-gold">
              Cookie Settings
            </Link>
          </div>
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
