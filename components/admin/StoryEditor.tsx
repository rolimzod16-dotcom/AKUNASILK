"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { CmsStory } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadField from "@/components/admin/ImageUploadField";

type StoryEditorProps = {
  story: CmsStory;
  isNew?: boolean;
};

function linesToArray(value: string) {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default function StoryEditor({ story, isNew }: StoryEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(story);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const url = isNew ? "/api/admin/stories" : `/api/admin/stories/${form.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const saved = (await res.json()) as CmsStory;
      router.push(`/admin/stories/${saved.id}`);
      router.refresh();
    }
    setLoading(false);
  };

  const remove = async () => {
    if (!confirm("Delete this story?")) return;
    await fetch(`/api/admin/stories/${form.id}`, { method: "DELETE" });
    router.push("/admin/stories");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">
          {isNew ? "New Story" : "Edit Story"}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" size="sm" onClick={remove}>
              <Trash2 className="size-4 text-silk-terracotta" />
            </Button>
          )}
          <Button variant="silk" size="pill-sm" onClick={save} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save
          </Button>
        </div>
      </div>

      <Card className="border-silk-gold/20">
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <ImageUploadField
            label="Cover image"
            folder="stories"
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
            hint="Upload a photo — auto-compressed for fast page loads."
          />
          <div className="space-y-2">
            <Label>Read time (min)</Label>
            <Input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })} />
          </div>
          <label className="flex items-center gap-2 self-end text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </CardContent>
      </Card>

      {(["en", "ru"] as const).map((locale) => (
        <Card key={locale} className="border-silk-gold/20">
          <CardHeader>
            <CardTitle className="uppercase text-silk-indigo">{locale}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={form.content[locale].title}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, [locale]: { ...form.content[locale], title: e.target.value } },
                })
              }
            />
            <Textarea
              placeholder="Excerpt"
              rows={2}
              value={form.content[locale].excerpt}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, [locale]: { ...form.content[locale], excerpt: e.target.value } },
                })
              }
            />
            <Textarea
              placeholder="Body paragraphs (one per line)"
              rows={6}
              value={form.content[locale].body.join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: {
                    ...form.content,
                    [locale]: { ...form.content[locale], body: linesToArray(e.target.value) },
                  },
                })
              }
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}