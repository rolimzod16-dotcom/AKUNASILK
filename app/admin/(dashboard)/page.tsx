import Link from "next/link";
import { Map, BookOpen, Handshake, ArrowRight, Plus } from "lucide-react";
import AdminStorageBanner from "@/components/admin/AdminStorageBanner";
import { getAllTours } from "@/lib/cms/tours";
import { getAllStories } from "@/lib/cms/stories";
import { getAllPartners } from "@/lib/cms/partners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [tours, stories, partners] = await Promise.all([
    getAllTours(),
    getAllStories(),
    getAllPartners(),
  ]);

  const stats = [
    {
      label: "Tour packages",
      total: tours.length,
      published: tours.filter((t) => t.published).length,
      href: "/admin/tours",
      icon: Map,
    },
    {
      label: "Stories",
      total: stories.length,
      published: stories.filter((s) => s.published).length,
      href: "/admin/stories",
      icon: BookOpen,
    },
    {
      label: "Partners",
      total: partners.length,
      published: partners.filter((p) => p.published).length,
      href: "/admin/partners",
      icon: Handshake,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminStorageBanner />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Панель управления</h1>
          <p className="mt-2 text-sm text-apple-muted">
            Управляйте турами, историями и партнёрами. Опубликованные туры сразу видны на сайте.
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 rounded-full bg-silk-gold px-5 py-2.5 text-sm font-bold text-silk-indigo shadow-md shadow-silk-gold/30 transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Добавить тур
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, total, published, href, icon: Icon }) => (
          <Card key={href} className="border-silk-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base text-silk-indigo">{label}</CardTitle>
              <Icon className="size-5 text-silk-gold" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-silk-indigo">{total}</p>
              <p className="text-xs text-apple-muted">{published} published</p>
              <Button variant="link" className="mt-3 h-auto p-0" asChild>
                <Link href={href}>
                  Manage <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}