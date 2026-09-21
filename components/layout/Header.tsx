"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BookNowButton from "@/components/automation/BookNowButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavMenu from "@/components/layout/NavMenu";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { withDestinationNav, type NavChild } from "@/lib/navigation";

export default function Header({ destinations = [] }: { destinations?: NavChild[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        overHero
          ? "bg-transparent"
          : "border-b border-silk-gold/20 bg-silk-indigo shadow-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-silk-gold text-[11px] font-bold text-silk-indigo shadow-md">
            GS
          </span>
          <span
            className={cn(
              "text-sm font-bold tracking-[0.08em] sm:text-[15px]",
              overHero ? "text-white" : "text-white"
            )}
          >
            GREAT SILK TRAILS
          </span>
        </Link>

        <NavMenu light={overHero} items={withDestinationNav(destinations)} />

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher light={overHero} />
          <BookNowButton
            variant="silk"
            size="pill-sm"
            className="inline-flex font-semibold shadow-md max-sm:px-3 max-sm:text-[11px]"
            prefill={{ source: "header", tourSlug: "any" }}
            label={t("planMyJourney")}
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "size-9 lg:hidden",
                  overHero
                    ? "border-white/40 bg-white/10 text-white hover:bg-white/20"
                    : "border-silk-gold/40 bg-transparent text-white hover:bg-white/10"
                )}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l border-silk-gold/30 bg-white">
              <SheetHeader>
                <SheetTitle className="text-left text-base font-bold tracking-wide text-silk-indigo">
                  GREAT SILK TRAILS
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavMenu
                  variant="mobile"
                  onNavigate={() => undefined}
                  items={withDestinationNav(destinations)}
                />
              </div>
              <div className="mt-6 space-y-3">
                <LanguageSwitcher onLightBg />
                <BookNowButton
                  variant="silk"
                  size="pill"
                  className="w-full"
                  prefill={{ source: "header", tourSlug: "any" }}
                  label={t("planMyJourney")}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}