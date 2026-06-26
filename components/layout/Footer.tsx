"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SilkDivider from "@/components/shared/SilkDivider";

const links = [
  { key: "destinations", href: "/destinations" },
  { key: "journeys", href: "/journeys" },
  { key: "experiences", href: "/experiences" },
  { key: "heritage", href: "/heritage" },
  { key: "stories", href: "/stories" },
  { key: "about", href: "/about" },
  { key: "partners", href: "/partners" },
  { key: "contact", href: "/contact" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = useTranslations("contact.info");

  return (
    <footer className="silk-pattern-dark border-t border-silk-gold/20 text-white">
      <div className="mx-auto max-w-[980px] px-6 py-12">
        <SilkDivider light className="mb-8" />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="silk-headline text-xl text-white">
              GREAT<span className="text-silk-gold">SILK</span>TRAILS
            </p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/60">
              {t("tagline")}
            </p>
            <p className="mt-4 text-xs text-white/50">
              <a href={`mailto:${contact("email")}`} className="hover:text-silk-gold">
                {contact("email")}
              </a>
              <span className="mx-2">·</span>
              <a href={`tel:${contact("phone").replace(/\s/g, "")}`} className="hover:text-silk-gold">
                {contact("phone")}
              </a>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-silk-gold">
              Menu
            </p>
            <ul className="mt-3 space-y-2">
              {links.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-xs font-medium uppercase tracking-wide text-white/60 transition hover:text-silk-gold"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-silk-gold">
              {t("newsletter")}
            </p>
            <p className="mt-2 text-xs text-white/60">{t("newsletterDesc")}</p>
            <form
              className="mt-3 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="h-8 border-white/20 bg-white/10 text-xs text-white placeholder:text-white/40"
              />
              <Button variant="silk" size="pill-sm" type="submit" className="shrink-0">
                {t("subscribe")}
              </Button>
            </form>
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
            <Link href="/faq" className="transition hover:text-silk-gold">
              {nav("faq")}
            </Link>
          </div>
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}