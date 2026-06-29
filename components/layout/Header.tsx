"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Globe, Phone, MessageCircle } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const primaryNav = [
  { key: "journeys", href: "/journeys" },
  { key: "destinations", href: "/destinations" },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
  { key: "stories", href: "/stories" },
] as const;

const secondaryNav = [
  { key: "experiences", href: "/experiences" },
  { key: "heritage", href: "/heritage" },
  { key: "partners", href: "/partners" },
  { key: "contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const t = useTranslations("nav");
  const contact = useTranslations("contact.info");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "ru" : "en";
    router.replace(pathname, { locale: next });
  };

  const phoneHref = `tel:${contact("phone").replace(/\s/g, "")}`;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-silk-gold/25 bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-silk-cream/90 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-silk-indigo text-[11px] font-bold text-silk-gold shadow-md">
            GS
          </span>
          <span className="hidden text-sm font-bold tracking-tight text-silk-indigo sm:inline">
            GREAT<span className="text-silk-gold">SILK</span>TRAILS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {primaryNav.map(({ key, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-silk-gold/15 text-silk-indigo"
                    : "text-apple-subtle hover:bg-silk-cream hover:text-silk-indigo"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={phoneHref}
            className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-silk-indigo transition hover:bg-silk-cream xl:flex"
            title={contact("phone")}
          >
            <Phone className="size-3.5 text-silk-turquoise" />
            <span className="hidden 2xl:inline">{contact("phone")}</span>
          </a>

          <a
            href="https://wa.me/998712004567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg p-2 text-silk-turquoise transition hover:bg-silk-cream lg:flex"
            aria-label="WhatsApp"
          >
            <MessageCircle className="size-4" />
          </a>

          <button
            type="button"
            onClick={switchLocale}
            className="flex items-center gap-1 rounded-lg border border-silk-gold/30 px-2.5 py-1.5 text-xs font-bold text-silk-indigo transition hover:bg-silk-gold/10"
            aria-label="Switch language"
          >
            <Globe className="size-3.5" />
            <span className="uppercase">{locale}</span>
          </button>

          <Button
            variant="silk"
            size="pill-sm"
            className="hidden font-semibold shadow-md sm:inline-flex"
            asChild
          >
            <Link href="/contact">{t("getQuote")}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 border-silk-gold/30 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l border-silk-gold/30 bg-white">
              <SheetHeader>
                <SheetTitle className="text-left text-base font-bold text-silk-indigo">
                  GREAT<span className="text-silk-gold">SILK</span>TRAILS
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {primaryNav.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition",
                      isActive(pathname, href)
                        ? "bg-silk-gold/20 text-silk-indigo"
                        : "text-apple-subtle hover:bg-silk-cream"
                    )}
                  >
                    {t(key)}
                  </Link>
                ))}
                <div className="my-2 border-t border-silk-gold/15" />
                {secondaryNav.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className="rounded-xl px-4 py-2.5 text-sm text-apple-muted hover:bg-silk-cream hover:text-silk-indigo"
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 space-y-2">
                <Button variant="silk" size="pill" className="w-full" asChild>
                  <Link href="/contact">{t("getQuote")}</Link>
                </Button>
                <a
                  href="https://wa.me/998712004567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-silk-gold/30 py-3 text-sm font-semibold text-silk-indigo"
                >
                  <MessageCircle className="size-4 text-silk-turquoise" />
                  WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}