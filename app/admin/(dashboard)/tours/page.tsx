import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { getAllTours } from "@/lib/cms/tours";
import PublishBadge from "@/components/admin/PublishBadge";
import AdminStorageBanner from "@/components/admin/AdminStorageBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminToursPage() {
  const tours = await getAllTours();

  return (
    <div className="space-y-6">
      <AdminStorageBanner />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Туры</h1>
          <p className="text-sm text-apple-muted">
            {tours.length} пакетов · добавляйте свои маршруты на /journeys
          </p>
        </div>
        <Button variant="silk" size="pill" asChild>
          <Link href="/admin/tours/new">
            <Plus className="size-4" />
            Добавить тур
          </Link>
        </Button>
      </div>

      {tours.length === 0 ? (
        <Card className="border-dashed border-silk-gold/40">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg font-semibold text-silk-indigo">Пока нет туров</p>
            <p className="max-w-md text-sm text-apple-muted">
              Нажмите «Добавить тур», заполните название, цену, страны и контент — тур появится на сайте.
            </p>
            <Button variant="silk" size="pill-sm" asChild>
              <Link href="/admin/tours/new">
                <Plus className="size-4" />
                Создать первый тур
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tours.map((tour) => (
            <Card key={tour.id} className="border-silk-gold/20 transition hover:border-silk-gold/40">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-silk-indigo">
                      {tour.content.ru.title || tour.content.en.title || "Без названия"}
                    </h2>
                    <PublishBadge published={tour.published} />
                    {tour.bestseller && (
                      <span className="text-[10px] font-bold uppercase text-silk-gold">Bestseller</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-apple-muted">
                    /journeys/{tour.slug} · ${tour.price} · {tour.duration} дн.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tour.published && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/en/journeys/${tour.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="silkOutline" size="pill-sm" asChild>
                    <Link href={`/admin/tours/${tour.id}`}>Редактировать</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}