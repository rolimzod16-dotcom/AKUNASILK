"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { CmsDestination } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function DestinationEditor({
  destination,
  isNew,
}: {
  destination: CmsDestination;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(destination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    const url = isNew ? "/api/admin/destinations" : `/api/admin/destinations/${form.id}`;
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
    router.push(`/admin/destinations/${data.id}`);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Удалить направление?")) return;
    await fetch(`/api/admin/destinations/${form.id}`, { method: "DELETE" });
    router.push("/admin/destinations");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">
          {isNew ? "Новое направление" : form.content.en.name || "Направление"}
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
        <CardHeader>
          <CardTitle className="text-silk-indigo">Публикация</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Slug URL (/destinations/...)</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Порядок на главной</Label>
            <Input
              type="number"
              value={form.homeOrder}
              onChange={(e) => setForm({ ...form, homeOrder: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Лучшее время (коротко)</Label>
            <Input value={form.bestTime} onChange={(e) => setForm({ ...form, bestTime: e.target.value })} />
          </div>
          <ImageUploadField
            label="Фото направления"
            folder="destinations"
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Опубликовать
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.showOnHome}
              onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
            />
            Показывать на главной
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.wide}
              onChange={(e) => setForm({ ...form, wide: e.target.checked })}
            />
            Широкая карточка (как Central Asia)
          </label>
        </CardContent>
      </Card>

      {(["en", "ru"] as const).map((locale) => (
        <Card key={locale} className="border-silk-gold/20">
          <CardHeader>
            <CardTitle className="text-silk-indigo">Тексты {locale.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {(
              [
                ["name", "Название"],
                ["line", "Одна строка на карточке"],
                ["seoTitle", "SEO title"],
                ["seoDescription", "SEO description"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  value={form.content[locale][key] || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: {
                        ...form.content,
                        [locale]: { ...form.content[locale], [key]: e.target.value },
                      },
                    })
                  }
                />
              </div>
            ))}
            {(
              [
                ["intro", "Вводный текст (H1 subtitle)"],
                ["why", "Why travel here"],
                ["season", "Best time / season"],
                ["practical", "Practical information"],
                ["visa", "Visa / permits"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Textarea
                  rows={3}
                  value={form.content[locale][key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: {
                        ...form.content,
                        [locale]: { ...form.content[locale], [key]: e.target.value },
                      },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
