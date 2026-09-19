"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { CmsReview } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewEditor({
  review,
  isNew,
  tourOptions,
}: {
  review: CmsReview;
  isNew?: boolean;
  tourOptions: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(review);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    const url = isNew ? "/api/admin/reviews" : `/api/admin/reviews/${form.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Не удалось сохранить");
      return;
    }
    router.push(`/admin/reviews/${data.id}`);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Удалить отзыв?")) return;
    await fetch(`/api/admin/reviews/${form.id}`, { method: "DELETE" });
    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">
          {isNew ? "Новый отзыв" : "Отзыв"}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" size="sm" onClick={() => void remove()}>
              <Trash2 className="size-4 text-silk-terracotta" />
            </Button>
          )}
          <Button variant="silk" size="pill-sm" onClick={() => void save()} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Сохранить
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-silk-terracotta">{error}</p>}

      <Card className="border-silk-gold/20">
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Имя гостя</Label>
            <Input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Страна гостя</Label>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Год поездки</Label>
            <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Тур (необязательно)</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.tourSlug || ""}
              onChange={(e) => {
                const slug = e.target.value;
                const tour = tourOptions.find((item) => item.slug === slug);
                setForm({ ...form, tourSlug: slug, tourTitle: tour?.title || "" });
              }}
            >
              <option value="">Общий отзыв</option>
              {tourOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Текст отзыва</Label>
            <Textarea rows={5} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Ссылка на источник (Google / TripAdvisor / Facebook)</Label>
            <Input
              value={form.sourceUrl || ""}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.consentRecorded}
              onChange={(e) => setForm({ ...form, consentRecorded: e.target.checked })}
            />
            Согласие гостя на публикацию записано
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Опубликовать на сайте
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
