"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export type TourOption = {
  slug: string;
  label: string;
};

type ContactFormProps = {
  tourOptions: TourOption[];
};

export default function ContactForm({ tourOptions }: ContactFormProps) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tour, setTour] = useState<string>("any");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const validSlugs = new Set(tourOptions.map((o) => o.slug));

  useEffect(() => {
    const tourParam = searchParams.get("tour");
    if (tourParam && validSlugs.has(tourParam)) {
      setTour(tourParam);
    }
  }, [searchParams, tourOptions]);

  if (submitted) {
    return (
      <Card className="border-silk-gold/30 bg-silk-gold/5">
        <CardContent className="p-8 text-center">
          <p className="silk-headline text-xl text-silk-indigo">{t("success")}</p>
          {inquiryId && (
            <p className="mt-3 text-sm text-apple-muted">
              {t("successDetail", { id: inquiryId })}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-silk-gold/15 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, tour, message, locale }),
              });
              const data = (await res.json()) as { ok?: boolean; inquiryId?: string; error?: string };
              if (!res.ok) {
                throw new Error(data.error ?? "Request failed");
              }
              setInquiryId(data.inquiryId ?? "");
              setSubmitted(true);
            } catch {
              setError(t("error"));
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("tour")}</Label>
              <Select value={tour} onValueChange={setTour}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tourOptions.map((opt) => (
                    <SelectItem key={opt.slug} value={opt.slug}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none bg-background"
            />
          </div>

          {error && <p className="text-sm text-silk-terracotta">{error}</p>}

          <Button
            type="submit"
            variant="silk"
            size="pill"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {loading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}