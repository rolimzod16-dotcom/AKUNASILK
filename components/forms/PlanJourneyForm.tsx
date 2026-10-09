"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export type BookingTourOption = {
  slug: string;
  label: string;
  price?: number;
};

type JourneyRequestProps = {
  tourOptions: BookingTourOption[];
};

const fieldClass =
  "h-11 w-full rounded-xl border border-[#e7dccb] bg-white px-3 text-sm text-silk-indigo outline-none transition placeholder:text-[#b3a898] focus:border-[#c4471c]";

export default function JourneyRequest({ tourOptions }: JourneyRequestProps) {
  const t = useTranslations("contact.book");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pricedTours = tourOptions.filter((item) => item.slug !== "any" && item.slug !== "bespoke");
  const [tour, setTour] = useState(pricedTours[0]?.slug ?? tourOptions[0]?.slug ?? "any");
  const [travelers, setTravelers] = useState("2");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const tourParam = searchParams.get("tour");
    if (tourParam && tourOptions.some((item) => item.slug === tourParam)) {
      setTour(tourParam);
    }
  }, [searchParams, tourOptions]);

  const selected = tourOptions.find((item) => item.slug === tour);
  const unitPrice = selected?.price && selected.price > 0 ? selected.price : 0;
  const count = Math.max(1, Number(travelers) || 1);
  const total = unitPrice * count;
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim() || !tour || !date) {
      setError(t("required"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("emailError"));
      return;
    }
    if (honeypot) return;

    const message = [
      `Tour: ${selected?.label ?? tour}`,
      unitPrice ? `Price: $${unitPrice} × ${count} = $${total}` : null,
      `Start date: ${date}`,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          tour,
          message,
          locale,
          travelers: count,
          preferredDate: date,
          price: unitPrice || undefined,
          source: searchParams.get("source") || "book-tour",
          sendClientConfirmation: true,
          website: honeypot,
          tourTitle: selected?.label,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error"));
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f6f1e8] px-4 pb-20 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-lg rounded-[28px] border border-[#eadfce] bg-[#fbf7f1] p-6 shadow-[0_24px_60px_-28px_rgba(90,48,20,0.45)] sm:p-8">
        <h1 className="font-display text-3xl font-semibold text-silk-indigo">{t("title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6f675e]">{t("intro")}</p>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c4471c]/10">
              <CheckCircle2 className="h-9 w-9 text-[#c4471c]" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-silk-indigo">{t("successTitle")}</h2>
            <p className="max-w-sm text-sm text-[#6f675e]">
              {t("success", {
                name: name || t("traveler"),
                tour: selected?.label ?? tour,
                email,
              })}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden
            />

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-silk-indigo">{t("tour")}</span>
              <select
                value={tour}
                onChange={(e) => setTour(e.target.value)}
                className={fieldClass}
                required
              >
                {tourOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.price && item.price > 0
                      ? `${item.label} — $${item.price.toLocaleString(locale)}`
                      : item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-silk-indigo">{t("travelers")}</span>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className={fieldClass}
                >
                  {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((value) => (
                    <option key={value} value={value}>
                      {t(value === "1" ? "personCount" : "peopleCount", { count: value })}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-silk-indigo">{t("date")}</span>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={fieldClass}
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-silk-indigo">{t("name")}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                autoComplete="name"
                required
                className={fieldClass}
              />
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-silk-indigo">{t("email")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-silk-indigo">{t("phone")}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder")}
                  autoComplete="tel"
                  required
                  className={fieldClass}
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-silk-indigo">{t("notes")}</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={3}
                className={`${fieldClass} h-auto resize-none py-3`}
              />
            </label>

            {unitPrice > 0 ? (
              <div className="flex items-center justify-between rounded-xl border border-[#ead9c2] bg-[#f4e7d4] px-4 py-3">
                <span className="text-sm text-[#6f675e]">
                  {t(count === 1 ? "totalOne" : "total", { count: String(count) })}
                </span>
                <span className="font-display text-2xl font-semibold text-[#c4471c]">
                  ${total.toLocaleString(locale)}
                </span>
              </div>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-[#c4471c]/30 bg-[#c4471c]/10 px-3 py-2 text-sm text-[#9a3412]" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c4471c] text-base font-semibold text-white transition hover:bg-[#a83b16] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? t("submitting") : t("submit")}
            </button>
            <p className="text-center text-xs leading-relaxed text-[#8a8176]">{t("legal")}</p>
          </form>
        )}
      </div>
    </section>
  );
}
