"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, Plus, Save, Trash2, Wand2 } from "lucide-react";
import type { CmsTour } from "@/lib/cms/types";
import { prepareTourForEditor } from "@/lib/cms/tour-content";
import { createEmptyTour } from "@/lib/cms/defaults";
import {
  applyTourDefaults,
  slugFromTitle,
  tourCompletionPercent,
  validateTour,
} from "@/lib/cms/validate-tour";
import {
  COUNTRY_LABELS,
  getCountriesByCorridor,
  getCorridorLabel,
  SILK_ROAD_CORRIDORS,
  type CountrySlug,
} from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploadField from "@/components/admin/ImageUploadField";
import TourLocaleEditor from "@/components/admin/TourLocaleEditor";
import AdminStorageBanner, { AdminStorageOk } from "@/components/admin/AdminStorageBanner";
import { TRAVEL_STYLES, TRAVEL_STYLE_LABELS } from "@/lib/travel-styles";

type TourEditorProps = {
  tour: CmsTour;
  isNew?: boolean;
};

export default function TourEditor({ tour, isNew }: TourEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(tour);
  const [slugTouched, setSlugTouched] = useState(!isNew && !!tour.slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  const completion = tourCompletionPercent(form);
  const previewSlug = form.slug || slugFromTitle(form.content.en.title) || "your-tour-slug";

  useEffect(() => {
    if (!slugTouched && form.content.en.title) {
      setForm((prev) => ({ ...prev, slug: slugFromTitle(prev.content.en.title) }));
    }
  }, [form.content.en.title, slugTouched]);

  async function persist(andAnother = false) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setValidationIssues([]);

    const prepared = applyTourDefaults(form);
    const issues = validateTour(prepared);
    if (issues.length > 0) {
      setValidationIssues(issues.map((i) => i.message));
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const url = isNew ? "/api/admin/tours" : `/api/admin/tours/${form.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prepared,
          countrySlugs: prepared.countrySlugs,
          content: {
            en: sanitizeLocaleContent(prepared.content.en),
            ru: sanitizeLocaleContent(prepared.content.ru),
          },
        }),
      });
      const data = (await res.json()) as CmsTour & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Не удалось сохранить тур");

      if (andAnother) {
        setSuccess("Тур сохранён! Создаёте следующий…");
        setForm(prepareTourForEditor(createEmptyTour()));
        setSlugTouched(false);
        router.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setSuccess("Тур сохранён успешно!");
      router.push(`/admin/tours/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить тур");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  function loadTemplate() {
    setForm(
      prepareTourForEditor({
        ...createEmptyTour(),
        duration: 7,
        price: 2490,
        countrySlugs: ["tajikistan"],
        travelStyle: "overland",
        content: {
          en: {
            title: "My Silk Road Adventure",
            desc: "A custom journey along the ancient Silk Road with local guides and boutique stays.",
            overview: "",
            highlights: [
              "Scenic mountain drives",
              "Local culture & bazaars",
              "Small group experience",
            ],
            itinerary: [],
            included: [],
            excluded: [],
            gallery: [],
            faq: [],
          },
          ru: {
            title: "Моё путешествие по Шёлковому пути",
            desc: "Индивидуальный маршрут по древнему Шёлковому пути с местными гидами и бутик-отелями.",
            overview: "",
            highlights: [
              "Живописные горные дороги",
              "Местная культура и базары",
              "Небольшая группа",
            ],
            itinerary: [],
            included: [],
            excluded: [],
            gallery: [],
            faq: [],
          },
        },
      })
    );
    setSlugTouched(false);
  }

  const remove = async () => {
    if (!confirm("Удалить этот тур навсегда?")) return;
    setLoading(true);
    await fetch(`/api/admin/tours/${form.id}`, { method: "DELETE" });
    router.push("/admin/tours");
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-28">
      <AdminStorageBanner />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">
            {isNew ? "Новый тур" : "Редактирование тура"}
          </h1>
          <p className="mt-1 text-sm text-apple-muted">
            Заполните все поля — страница тура появится на /journeys/{previewSlug}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-silk-gold/20">
              <div
                className="h-full rounded-full bg-silk-gold transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs text-apple-muted">Готовность: {completion}%</span>
            <AdminStorageOk />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isNew && (
            <Button variant="outline" size="sm" onClick={loadTemplate} disabled={loading}>
              <Wand2 className="size-4" />
              Шаблон
            </Button>
          )}
          {!isNew && form.slug && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/en/journeys/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Просмотр
              </a>
            </Button>
          )}
          {!isNew && (
            <Button variant="outline" size="sm" onClick={remove} disabled={loading}>
              <Trash2 className="size-4 text-silk-terracotta" />
              Удалить
            </Button>
          )}
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-silk-turquoise/30 bg-silk-turquoise/10 px-4 py-3 text-sm text-silk-indigo">
          <CheckCircle2 className="size-4 text-silk-turquoise" />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-silk-terracotta/40 bg-silk-terracotta/10 px-4 py-3 text-sm text-silk-terracotta">
          {error}
        </div>
      )}

      {validationIssues.length > 0 && (
        <div className="rounded-xl border border-silk-terracotta/40 bg-silk-terracotta/10 px-4 py-3 text-sm">
          <p className="font-semibold text-silk-indigo">Заполните обязательные поля:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-silk-terracotta">
            {validationIssues.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">1. Основное</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Название (English) *</Label>
            <Input
              value={form.content.en.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, en: { ...form.content.en, title: e.target.value } },
                })
              }
              placeholder="Pamir Silk Trail — 12 Days"
            />
          </div>
          <div className="space-y-2">
            <Label>Название (Русский) *</Label>
            <Input
              value={form.content.ru.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, ru: { ...form.content.ru, title: e.target.value } },
                })
              }
              placeholder="Pamir Silk Trail — 12 дней"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>URL (slug) *</Label>
            <Input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              placeholder="pamir-silk-trail-12-days"
            />
            <p className="text-xs text-apple-muted">
              Страница: /journeys/{previewSlug} — генерируется из названия EN, можно изменить
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Краткое описание EN *</Label>
            <Input
              value={form.content.en.desc}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, en: { ...form.content.en, desc: e.target.value } },
                })
              }
              placeholder="Hero subtitle under the tour title"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Краткое описание RU *</Label>
            <Input
              value={form.content.ru.desc}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: { ...form.content, ru: { ...form.content.ru, desc: e.target.value } },
                })
              }
              placeholder="Подзаголовок под названием тура"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">2. Цена и даты</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Обложка"
            folder="tours"
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
            hint="Загрузите файл или вставьте URL. Без картинки — подставится стандартная."
          />
          <div className="space-y-2">
            <Label>Цена (USD) *</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Старая цена (необязательно)</Label>
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
            <Label>Длительность (дней) *</Label>
            <Input
              type="number"
              min={1}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ближайший выезд</Label>
            <Input
              type="date"
              value={form.nextDeparture}
              onChange={(e) => setForm({ ...form, nextDeparture: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Стиль путешествия</Label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.travelStyle ?? "culture"}
              onChange={(e) =>
                setForm({
                  ...form,
                  travelStyle: e.target.value as CmsTour["travelStyle"],
                })
              }
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {TRAVEL_STYLE_LABELS[style].en}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Сложность</Label>
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
              <option value="easy">Лёгкий</option>
              <option value="moderate">Средний</option>
              <option value="adventurous">Приключенческий</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Макс. группа</Label>
            <Input
              type="number"
              value={form.maxGroupSize ?? 12}
              onChange={(e) =>
                setForm({ ...form, maxGroupSize: Number(e.target.value) || 12 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Мест осталось</Label>
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
            <Label>Рейтинг</Label>
            <Input
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Отзывов</Label>
            <Input
              type="number"
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-4 sm:col-span-2">
            <Label>Страны маршрута *</Label>
            {SILK_ROAD_CORRIDORS.map((corridor) => (
              <div key={corridor}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-silk-turquoise">
                  {getCorridorLabel(corridor, "ru")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {getCountriesByCorridor(corridor).map((slug) => {
                    const checked = form.countrySlugs?.includes(slug) ?? false;
                    return (
                      <label
                        key={slug}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          checked
                            ? "border-silk-gold bg-silk-gold/10 text-silk-indigo"
                            : "border-silk-gold/20 hover:border-silk-gold/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = form.countrySlugs ?? [];
                            const next = checked
                              ? current.filter((s) => s !== slug)
                              : [...current, slug];
                            setForm({ ...form, countrySlugs: next as CountrySlug[] });
                          }}
                        />
                        {COUNTRY_LABELS[slug].ru}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Опубликовать на сайте
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              В избранном
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.bestseller}
                onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
              />
              Бестселлер
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">3. Контент страницы тура</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-6">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
            </TabsList>
            <TabsContent value="en">
              <TourLocaleEditor
                locale="en"
                tour={form}
                content={form.content.en}
                onChange={(en) => setForm({ ...form, content: { ...form.content, en } })}
              />
            </TabsContent>
            <TabsContent value="ru">
              <TourLocaleEditor
                locale="ru"
                tour={form}
                content={form.content.ru}
                onChange={(ru) => setForm({ ...form, content: { ...form.content, ru } })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-silk-gold/25 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-apple-muted">
            {form.published ? "Будет виден на сайте" : "Черновик — не виден посетителям"}
            {" · "}
            /journeys/{previewSlug}
          </p>
          <div className="flex flex-wrap gap-2">
            {isNew && (
              <Button
                variant="outline"
                size="pill-sm"
                onClick={() => void persist(true)}
                disabled={loading}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Сохранить и добавить ещё
              </Button>
            )}
            <Button variant="silk" size="pill-sm" onClick={() => void persist(false)} disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Сохранить тур
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function sanitizeLocaleContent(content: CmsTour["content"]["en"]) {
  return {
    ...content,
    gallery: (content.gallery ?? []).filter(Boolean),
    faq: (content.faq ?? []).filter((item) => item.question.trim() || item.answer.trim()),
    itinerary: (content.itinerary ?? []).filter((day) => day.title.trim() || day.description.trim()),
  };
}