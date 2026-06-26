"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { CmsTour } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TourEditorProps = {
  tour: CmsTour;
  isNew?: boolean;
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export default function TourEditor({ tour, isNew }: TourEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(tour);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = isNew ? "/api/admin/tours" : `/api/admin/tours/${form.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          countries: form.countries,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = (await res.json()) as CmsTour;
      router.push(`/admin/tours/${saved.id}`);
      router.refresh();
    } catch {
      setError("Could not save tour. Check all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this tour package permanently?")) return;
    setLoading(true);
    await fetch(`/api/admin/tours/${form.id}`, { method: "DELETE" });
    router.push("/admin/tours");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">
            {isNew ? "New Tour Package" : "Edit Tour Package"}
          </h1>
          <p className="mt-1 text-sm text-apple-muted">
            Published tours appear on the site with the same card & detail design.
          </p>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" size="sm" onClick={remove} disabled={loading}>
              <Trash2 className="size-4 text-silk-terracotta" />
              Delete
            </Button>
          )}
          <Button variant="silk" size="pill-sm" onClick={save} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-silk-terracotta">{error}</p>}

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">Package details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="golden-caravan"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Cover image URL</Label>
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Price (USD)</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Original price (optional)</Label>
            <Input
              type="number"
              value={form.originalPrice ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  originalPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (days)</Label>
            <Input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Next departure</Label>
            <Input
              type="date"
              value={form.nextDeparture}
              onChange={(e) => setForm({ ...form, nextDeparture: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Countries (comma-separated)</Label>
            <Input
              value={form.countries.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  countries: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as CmsTour["difficulty"],
                })
              }
            >
              <option value="easy">Leisure</option>
              <option value="moderate">Moderate</option>
              <option value="adventurous">Adventurous</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Spots left</Label>
            <Input
              type="number"
              value={form.spotsLeft ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  spotsLeft: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <Input
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Reviews count</Label>
            <Input
              type="number"
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published on site
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.bestseller}
                onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
              />
              Bestseller
            </label>
          </div>
        </CardContent>
      </Card>

      {(["en", "ru"] as const).map((locale) => (
        <Card key={locale} className="border-silk-gold/20">
          <CardHeader>
            <CardTitle className="text-silk-indigo uppercase">{locale} content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.content[locale].title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: {
                      ...form.content,
                      [locale]: { ...form.content[locale], title: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.content[locale].desc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: {
                      ...form.content,
                      [locale]: { ...form.content[locale], desc: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Highlights (one per line)</Label>
              <Textarea
                rows={4}
                value={arrayToLines(form.content[locale].highlights)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: {
                      ...form.content,
                      [locale]: {
                        ...form.content[locale],
                        highlights: linesToArray(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}