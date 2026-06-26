"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Handshake,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tours", label: "Tour Packages", icon: Map },
  { href: "/admin/stories", label: "Stories", icon: BookOpen },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-silk-cream">
      <header className="border-b border-silk-gold/25 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="silk-headline text-lg text-silk-indigo">
            GREAT<span className="text-silk-gold">SILK</span>
            <span className="ml-2 text-xs font-sans font-bold uppercase tracking-widest text-apple-muted">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="silkOutline" size="pill-sm" asChild>
              <Link href="/en" target="_blank">
                <ExternalLink className="size-3.5" />
                View site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-apple-muted hover:text-silk-terracotta"
              onClick={async () => {
                await fetch("/api/admin/auth/logout", { method: "POST" });
                router.push("/admin/login");
                router.refresh();
              }}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-8 lg:grid-cols-[220px_1fr] sm:px-6">
        <aside className="h-fit rounded-2xl border border-silk-gold/20 bg-white p-3 shadow-sm">
          <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-silk-gold text-silk-indigo shadow-md shadow-silk-gold/30"
                      : "text-silk-indigo hover:bg-silk-gold/15"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}