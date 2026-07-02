"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { mainNavigation, type NavItem } from "@/lib/navigation";

function isActive(pathname: string, href: string) {
  const base = href.split("?")[0].split("#")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isDropdownActive(pathname: string, item: Extract<NavItem, { type: "dropdown" }>) {
  if (item.href && isActive(pathname, item.href)) return true;
  return item.children.some((child) => isActive(pathname, child.href));
}

type NavMenuProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function NavMenu({ variant = "desktop", onNavigate }: NavMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (variant === "mobile") {
    return (
      <nav className="flex flex-col gap-1">
        {mainNavigation.map((item) => {
          if (item.type === "link") {
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition",
                  isActive(pathname, item.href)
                    ? "bg-silk-gold/20 text-silk-indigo"
                    : "text-apple-subtle hover:bg-silk-cream"
                )}
              >
                {t(item.key)}
              </Link>
            );
          }

          const expanded = openKey === item.key;
          const active = isDropdownActive(pathname, item);

          return (
            <div key={item.key} className="rounded-xl border border-silk-gold/10">
              <button
                type="button"
                onClick={() => setOpenKey(expanded ? null : item.key)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide transition",
                  active ? "text-silk-indigo" : "text-apple-subtle"
                )}
              >
                {t(item.key)}
                <ChevronDown className={cn("size-4 transition", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="border-t border-silk-gold/10 px-2 pb-2">
                  {item.href && (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-xs font-semibold text-silk-turquoise hover:bg-silk-cream"
                    >
                      {t("viewAll")}
                    </Link>
                  )}
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition hover:bg-silk-cream",
                        isActive(pathname, child.href)
                          ? "font-semibold text-silk-indigo"
                          : "text-apple-muted"
                      )}
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {mainNavigation.map((item) => {
        if (item.type === "link") {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors xl:px-3 xl:text-xs",
                active
                  ? "bg-silk-gold/15 text-silk-indigo"
                  : "text-apple-subtle hover:bg-silk-cream hover:text-silk-indigo"
              )}
            >
              {t(item.key)}
            </Link>
          );
        }

        const active = isDropdownActive(pathname, item);

        return (
          <div key={item.key} className="group relative">
            <div
              className={cn(
                "flex cursor-default items-center gap-0.5 rounded-lg px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors xl:px-3 xl:text-xs",
                active
                  ? "bg-silk-gold/15 text-silk-indigo"
                  : "text-apple-subtle group-hover:bg-silk-cream group-hover:text-silk-indigo"
              )}
            >
              {item.href ? (
                <Link href={item.href} className="hover:text-silk-indigo">
                  {t(item.key)}
                </Link>
              ) : (
                <span>{t(item.key)}</span>
              )}
              <ChevronDown className="size-3 opacity-60" />
            </div>

            <div className="invisible absolute left-0 top-full z-50 min-w-[280px] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="max-h-[min(70vh,520px)] overflow-y-auto rounded-xl border border-silk-gold/25 bg-white py-2 shadow-xl shadow-silk-indigo/10">
                {item.children.map((child) => (
                  <Link
                    key={child.key}
                    href={child.href}
                    className={cn(
                      "block px-4 py-2.5 text-sm transition hover:bg-silk-cream",
                      isActive(pathname, child.href)
                        ? "font-semibold text-silk-indigo"
                        : "text-apple-subtle"
                    )}
                  >
                    {t(child.key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}