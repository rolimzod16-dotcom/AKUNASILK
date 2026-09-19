"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { CmsSiteSettings } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsEditor({ settings }: { settings: CmsSiteSettings }) {
  const [form, setForm] = useState(settings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const contact = form.contact;

  async function save() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось сохранить");
      setForm(data);
      setMessage("Настройки сохранены. Обновите сайт, чтобы увидеть изменения.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Настройки сайта</h1>
          <p className="mt-1 text-sm text-apple-muted">
            Контакты, юридические данные и что показывать посетителям. Меняется без кода.
          </p>
        </div>
        <Button variant="silk" size="pill" onClick={() => void save()} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Сохранить
        </Button>
      </div>
      {message && <p className="text-sm text-silk-indigo">{message}</p>}

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">Что показывать на сайте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.showPrices}
              onChange={(e) => setForm({ ...form, showPrices: e.target.checked })}
            />
            <span>
              <strong>Разрешить цены.</strong> Даже при включении цена появится только у туров, где
              отмечено «Показывать цену».
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.showReviews}
              onChange={(e) => setForm({ ...form, showReviews: e.target.checked })}
            />
            <span>
              <strong>Показывать отзывы.</strong> На сайте видны только опубликованные отзывы с
              отмеченным согласием гостя.
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.showPartners}
              onChange={(e) => setForm({ ...form, showPartners: e.target.checked })}
            />
            <span>
              <strong>Показывать партнёров.</strong> Только опубликованные карточки из раздела
              Partners.
            </span>
          </label>
        </CardContent>
      </Card>

      <Card className="border-silk-gold/20">
        <CardHeader>
          <CardTitle className="text-silk-indigo">Контакты и юр. данные</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["legalName", "Юридическое название"],
              ["address", "Адрес"],
              ["email", "Email"],
              ["phoneDisplay", "Телефон как на сайте"],
              ["phoneTel", "Телефон для tel: (только цифры и +)"],
              ["whatsapp", "WhatsApp (цифры без +)"],
              ["hours", "Часы ответа"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <Input
                value={contact[key]}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...contact, [key]: e.target.value } })
                }
              />
            </div>
          ))}
          <div className="space-y-2 sm:col-span-2">
            <Label>Emergency contact (только для путешествующих клиентов)</Label>
            <Input
              value={contact.emergencyNote}
              onChange={(e) =>
                setForm({ ...form, contact: { ...contact, emergencyNote: e.target.value } })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Короткое описание компании (footer)</Label>
            <Textarea
              rows={3}
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Приветствие WhatsApp (без персональных данных)</Label>
            <Input
              value={form.whatsappGreeting}
              onChange={(e) => setForm({ ...form, whatsappGreeting: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
