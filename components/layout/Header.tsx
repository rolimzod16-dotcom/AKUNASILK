"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Globe } from "lucide-react";
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
import StickyMobileCTA from "./StickyMobileCTA";

const navItems = [
  { key: "destinations", href: "/destinations" },
  { key: "journeys", href: "/journeys" },
  { key: "experiences", href: "/experiences" },
  { key: "heritage", href: "/heritage" },
  { key: "stories", href: "/stories" },
  { key: "about", href: "/about" },
  { key: "partners", href: "/partners" },
  { key: "contact", href: "/contact" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const t = useTranslations("nav");
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "apple-glass border-b border-silk-gold/30 shadow-md shadow-silk-gold/10"
            : "bg-silk-cream/80 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-silk-gold text-[11px] font-bold text-silk-indigo shadow-md shadow-silk-gold/30 transition group-hover:scale-105">
              GS
            </span>
            <span className="hidden text-sm font-bold tracking-tight text-silk-indigo xl:inline">
              GREAT<span className="text-silk-gold">SILK</span>TRAILS
            </span>
          </Link>

          <nav className="hidden items-center gap-1.5 xl:flex">
            {navItems.map(({ key, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={cn(
                    "rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all",
                    active
                      ? "bg-silk-gold text-silk-indigo shadow-md shadow-silk-gold/35 ring-2 ring-silk-gold/50"
                      : "bg-white text-silk-indigo shadow-sm ring-1 ring-silk-gold/25 hover:bg-silk-gold/20 hover:ring-silk-gold/50"
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={switchLocale}
              className="flex items-center gap-1.5 rounded-full bg-silk-indigo px-3 py-2 text-xs font-bold text-white shadow-md transition hover:bg-silk-indigo/90"
              aria-label="Switch language"
            >
              <Globe className="size-3.5" />
              <span className="uppercase">{locale}</span>
            </button>

            <Button
              variant="silk"
              size="pill-sm"
              className="hidden font-bold uppercase tracking-wide shadow-lg shadow-silk-gold/40 lg:inline-flex"
              asChild
            >
              <Link href="/contact">{t("planYourJourney")}</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="silk"
                  size="icon"
                  className="size-10 rounded-full shadow-md xl:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l-2 border-silk-gold bg-silk-cream">
                <SheetHeader>
                  <SheetTitle className="text-left text-base font-bold text-silk-indigo">
                    GREAT<span className="text-silk-gold">SILK</span>TRAILS
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2.5">
                  {navItems.map(({ key, href }) => {
                    const active = isActive(pathname, href);
                    return (
                      <Link
                        key={key}
                        href={href}
                        className={cn(
                          "rounded-2xl px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wider transition-all",
                          active
                            ? "bg-silk-gold text-silk-indigo shadow-lg shadow-silk-gold/40 ring-2 ring-silk-gold"
                            : "bg-white text-silk-indigo shadow-md ring-1 ring-silk-gold/30 hover:bg-silk-gold/25"
                        )}
                      >
                        {t(key)}
                      </Link>
                    );
                  })}
                  <Link
                    href="/contact"
                    className="mt-2 rounded-full bg-silk-indigo px-5 py-4 text-center text-sm font-bold uppercase tracking-wider text-silk-gold shadow-lg"
                  >
                    {t("planYourJourney")} →
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <StickyMobileCTA />
    </>
  );
}