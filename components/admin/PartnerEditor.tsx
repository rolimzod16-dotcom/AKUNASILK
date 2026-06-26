"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { CmsPartner, PartnerCategory } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PartnerEditorProps = {
  partner: CmsPartner;
  isNew?: boolean;
};

const categories: PartnerCategory[] = ["hotel", "dmc", "hospitality", "transport", "cultural"];

export default function PartnerEditor({ partner, isNew }: PartnerEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(partner);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const url = isNew ? "/api/admin/partners" : `/api/admin/partners/${form.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const saved = (await res.json()) as CmsPartner;
      router.push(`/admin/partners/${saved.id}`);
      router.refresh();
    }
    setLoading(false);
  };

  const remove = async () => {
    if (!confirm("Delete this partner?")) return;
    await fetch(`/api/admin/partners/${form.id}`, { method: "DELETE" });
    router.push("/admin/partners");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">
          {isNew ? "New Partner" : "Edit Partner"}
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
            <Label>Initials (logo)</Label>
            <Input value={form.initials} maxLength={3} onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })} />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as PartnerCategory })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Website (optional)</Label>
            <Input value={form.website ?? ""} onChange={(e) => setForm({ ...form, website: e.target.value || undefined })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured on homepage
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
              placeholder="Name"
              value={form.content[locale].name}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, [locale]: { ...form.content[locale], name: e.target.value } },
                })
              }
            />
            <Textarea
              placeholder="Description"
              rows={3}
              value={form.content[locale].desc}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, [locale]: { ...form.content[locale], desc: e.target.value } },
                })
              }
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}