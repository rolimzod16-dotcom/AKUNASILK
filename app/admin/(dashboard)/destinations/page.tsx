import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllDestinations } from "@/lib/cms/destinations";
import PublishBadge from "@/components/admin/PublishBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDestinationsPage() {
  const items = await getAllDestinations();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Направления</h1>
          <p className="text-sm text-apple-muted">
            Страны на главной и в меню. Новая опубликованная страна сразу появится на сайте.
          </p>
        </div>
        <Button variant="silk" size="pill-sm" asChild>
          <Link href="/admin/destinations/new">
            <Plus className="size-4" />
            Добавить страну
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="border-silk-gold/20">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-silk-indigo">
                    {item.content.en.name || item.slug}
                  </h2>
                  <PublishBadge published={item.published} />
                </div>
                <p className="text-xs text-apple-muted">
                  /destinations/{item.slug}
                  {item.showOnHome ? " · на главной" : ""}
                </p>
              </div>
              <Button variant="silkOutline" size="pill-sm" asChild>
                <Link href={`/admin/destinations/${item.id}`}>Редактировать</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
