"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import SilkDivider from "@/components/shared/SilkDivider";

const exploreLinks = [
  { key: "journeys", href: "/journeys" },
  { key: "destinations", href: "/destinations" },
  { key: "faq", href: "/faq" },
  { key: "stories", href: "/stories" },
] as const;

const companyLinks = [
  { key: "about", href: "/about" },
  { key: "partners", href: "/partners" },
  { key: "heritage", href: "/heritage" },
  { key: "experiences", href: "/experiences" },
  { key: "contact", href: "/contact" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact.info");

  return (
    <footer className="silk-pattern-dark border-t border-silk-gold/20 text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <SilkDivider light className="mb-8" />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="silk-headline text-xl text-white">
              GREAT<span className="text-silk-gold">SILK</span>TRAILS
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">
              {t("tagline")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a
                href={`mailto:${contact("email")}`}
                className="text-white/70 transition hover:text-silk-gold"
              >
                {contact("email")}
              </a>
              <a
                href={`tel:${contact("phone").replace(/\s/g, "")}`}
                className="text-white/70 transition hover:text-silk-gold"
              >
                {contact("phone")}
              </a>
              <a
                href="https://wa.me/998712004567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silk-turquoise transition hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-silk-gold">
              {t("explore")}
            </p>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition hover:text-silk-gold"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-silk-gold">
              {t("company")}
            </p>
            <ul className="mt-3 space-y-2">
              {companyLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition hover:text-silk-gold"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
          </div>
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}