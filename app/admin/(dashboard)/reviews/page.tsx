import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllReviews } from "@/lib/cms/reviews";
import PublishBadge from "@/components/admin/PublishBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Отзывы</h1>
          <p className="text-sm text-apple-muted">
            На сайте показываются только опубликованные отзывы с отмеченным согласием.
          </p>
        </div>
        <Button variant="silk" size="pill-sm" asChild>
          <Link href="/admin/reviews/new">
            <Plus className="size-4" />
            Добавить отзыв
          </Link>
        </Button>
      </div>
      {reviews.length === 0 ? (
        <Card className="border-dashed border-silk-gold/40">
          <CardContent className="py-12 text-center text-sm text-apple-muted">
            Пока нет отзывов. Добавьте подтверждённый отзыв — блок появится на главной.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((item) => (
            <Card key={item.id} className="border-silk-gold/20">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-silk-indigo">{item.guestName || "Без имени"}</h2>
                    <PublishBadge published={item.published} />
                  </div>
                  <p className="text-xs text-apple-muted">
                    {item.country} · {item.year} · {item.tourTitle || "общий"}
                  </p>
                </div>
                <Button variant="silkOutline" size="pill-sm" asChild>
                  <Link href={`/admin/reviews/${item.id}`}>Редактировать</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
