import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllTours } from "@/lib/cms/tours";
import PublishBadge from "@/components/admin/PublishBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminToursPage() {
  const tours = await getAllTours();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Tour Packages</h1>
          <p className="text-sm text-apple-muted">Add, edit, or remove journeys shown on /journeys</p>
        </div>
        <Button variant="silk" size="pill-sm" asChild>
          <Link href="/admin/tours/new">
            <Plus className="size-4" />
            New package
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {tours.map((tour) => (
          <Card key={tour.id} className="border-silk-gold/20 transition hover:border-silk-gold/40">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-silk-indigo">{tour.content.en.title}</h2>
                  <PublishBadge published={tour.published} />
                  {tour.bestseller && (
                    <span className="text-[10px] font-bold uppercase text-silk-gold">Bestseller</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-apple-muted">
                  /journeys/{tour.slug} · ${tour.price} · {tour.duration} days
                </p>
              </div>
              <Button variant="silkOutline" size="pill-sm" asChild>
                <Link href={`/admin/tours/${tour.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}