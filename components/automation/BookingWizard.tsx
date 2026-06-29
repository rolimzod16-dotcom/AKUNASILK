"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useBooking } from "@/lib/automation/booking-context";
import type { PublicTour } from "@/lib/automation/concierge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STEPS = 3;

export default function BookingWizard() {
  const t = useTranslations("automation.wizard");
  const locale = useLocale();
  const { open, prefill, closeBooking } = useBooking();

  const [step, setStep] = useState(1);
  const [tours, setTours] = useState<PublicTour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState("");

  const [tourSlug, setTourSlug] = useState("any");
  const [travelers, setTravelers] = useState(2);
  const [preferredDate, setPreferredDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const selectedTour = useMemo(
    () => tours.find((tour) => tour.slug === tourSlug),
    [tours, tourSlug]
  );

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setError(null);
    setInquiryId("");
    setTourSlug(prefill.tourSlug ?? "any");
    setTravelers(prefill.travelers ?? 2);
    setPreferredDate(prefill.preferredDate ?? "");
    setName(prefill.name ?? "");
    setEmail(prefill.email ?? "");
    setPhone(prefill.phone ?? "");
    setNotes(prefill.notes ?? "");
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    setLoadingTours(true);
    fetch(`/api/tours/public?locale=${locale}`)
      .then((res) => res.json())
      .then((data: { tours: PublicTour[] }) => setTours(data.tours ?? []))
      .catch(() => setTours([]))
      .finally(() => setLoadingTours(false));
  }, [open, locale]);

  const progress = step > STEPS ? 100 : Math.round((step / STEPS) * 100);

  async function submitBooking() {
    setSubmitting(true);
    setError(null);
    const tourTitle =
      tourSlug === "any"
        ? t("tourAny")
        : tourSlug === "bespoke"
          ? t("tourBespoke")
          : (selectedTour?.title ?? tourSlug);

    const message = [
      t("messageHeader"),
      `${t("fieldTour")}: ${tourTitle}`,
      `${t("fieldTravelers")}: ${travelers}`,
      preferredDate ? `${t("fieldDate")}: ${preferredDate}` : null,
      notes.trim() ? `${t("fieldNotes")}: ${notes.trim()}` : null,
      prefill.source ? `${t("fieldSource")}: ${prefill.source}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          tour: tourSlug,
          message,
          locale,
          travelers,
          preferredDate: preferredDate || undefined,
          source: prefill.source ?? "wizard",
          sendClientConfirmation: true,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        inquiryId?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "failed");
      setInquiryId(data.inquiryId ?? "");
      setStep(4);
    } catch {
      setError(t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  function canAdvance() {
    if (step === 1) return Boolean(tourSlug);
    if (step === 2) return travelers >= 1 && travelers <= 12;
    if (step === 3) return name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return false;
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && closeBooking()}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-l border-silk-gold/30 bg-white p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-silk-gold/15 px-5 py-4 text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-silk-gold" />
            <SheetTitle className="silk-headline text-lg text-silk-indigo">
              {step === 4 ? t("successTitle") : t("title")}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-apple-muted">
            {step === 4 ? t("successSubtitle") : t("subtitle")}
          </SheetDescription>
          {step <= STEPS && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-apple-muted">
                <span>
                  {t("step", { current: step, total: STEPS })}
                </span>
                <span>{t("holdBadge")}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-silk-sand">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-silk-gold to-silk-turquoise transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-apple-subtle">{t("step1Hint")}</p>
              {loadingTours ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-6 animate-spin text-silk-gold" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>{t("chooseTour")}</Label>
                  <Select value={tourSlug} onValueChange={setTourSlug}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{t("tourAny")}</SelectItem>
                      {tours.map((tour) => (
                        <SelectItem key={tour.slug} value={tour.slug}>
                          {tour.title} · ${tour.price.toLocaleString()}
                        </SelectItem>
                      ))}
                      <SelectItem value="bespoke">{t("tourBespoke")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedTour && (
                <div className="rounded-2xl border border-silk-gold/25 bg-silk-gold/5 p-4 text-sm">
                  <p className="font-semibold text-silk-indigo">{selectedTour.title}</p>
                  <p className="mt-1 text-apple-muted">
                    {selectedTour.duration} {t("days")} · ${selectedTour.price.toLocaleString()}
                  </p>
                  {selectedTour.spotsLeft != null && selectedTour.spotsLeft <= 6 && (
                    <p className="mt-2 text-xs font-semibold text-silk-terracotta">
                      {t("scarcity", { count: selectedTour.spotsLeft })}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2 rounded-xl border border-silk-turquoise/30 bg-silk-turquoise/5 p-3 text-xs text-apple-subtle">
                <Shield className="mt-0.5 size-4 shrink-0 text-silk-turquoise" />
                {t("trustLine")}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-apple-subtle">{t("step2Hint")}</p>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="size-4 text-silk-turquoise" />
                  {t("travelers")}
                </Label>
                <Select
                  value={String(travelers)}
                  onValueChange={(v) => setTravelers(Number(v))}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {t("travelerCount", { count: n })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="size-4 text-silk-turquoise" />
                  {t("preferredDate")}
                </Label>
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="bg-background"
                />
                <p className="text-[11px] text-apple-muted">{t("dateFlexible")}</p>
              </div>
              <p className="rounded-xl bg-silk-indigo/5 px-3 py-2 text-xs text-silk-indigo">
                {t("urgencyLine")}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-apple-subtle">{t("step3Hint")}</p>
              <div className="space-y-2">
                <Label htmlFor="bw-name">{t("name")}</Label>
                <Input
                  id="bw-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bw-email">{t("email")}</Label>
                <Input
                  id="bw-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bw-phone">{t("phone")}</Label>
                <Input
                  id="bw-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bw-notes">{t("notes")}</Label>
                <Textarea
                  id="bw-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none bg-background"
                  placeholder={t("notesPlaceholder")}
                />
              </div>
              {error && <p className="text-sm text-silk-terracotta">{error}</p>}
              <p className="text-[11px] text-apple-muted">{t("privacyNote")}</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-center">
              <CheckCircle2 className="mx-auto size-14 text-silk-turquoise" />
              <p className="text-sm text-apple-subtle">{t("successBody")}</p>
              {inquiryId && (
                <p className="rounded-xl border border-silk-gold/30 bg-silk-gold/10 px-4 py-3 text-sm font-semibold text-silk-indigo">
                  {t("reference", { id: inquiryId })}
                </p>
              )}
              <ul className="space-y-2 text-left text-xs text-apple-muted">
                <li className="flex gap-2">
                  <span className="text-silk-gold">1.</span>
                  {t("next1")}
                </li>
                <li className="flex gap-2">
                  <span className="text-silk-gold">2.</span>
                  {t("next2")}
                </li>
                <li className="flex gap-2">
                  <span className="text-silk-gold">3.</span>
                  {t("next3")}
                </li>
              </ul>
            </div>
          )}
        </div>

        {step <= STEPS && (
          <div className="border-t border-silk-gold/15 px-5 py-4">
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="pill-sm"
                  className="border-silk-gold/30"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ChevronLeft className="size-4" />
                  {t("back")}
                </Button>
              )}
              <Button
                type="button"
                variant="silk"
                size="pill-sm"
                className={cn("flex-1", step === 3 && "silk-glow-pulse")}
                disabled={!canAdvance() || submitting}
                onClick={() => {
                  if (step < 3) setStep((s) => s + 1);
                  else void submitBooking();
                }}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : step === 3 ? (
                  t("reserve")
                ) : (
                  <>
                    {t("continue")}
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="border-t border-silk-gold/15 px-5 py-4">
            <Button variant="silk" size="pill" className="w-full" onClick={closeBooking}>
              {t("done")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}