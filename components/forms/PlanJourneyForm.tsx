"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TourOption = { slug: string; label: string };

export type JourneyContact = {
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappHref: string;
  hours: string;
  address?: string;
};

type JourneyRequestProps = {
  tourOptions: TourOption[];
  contact: JourneyContact;
};

export default function JourneyRequest({ tourOptions, contact }: JourneyRequestProps) {
  const t = useTranslations("contact.request");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tour, setTour] = useState("any");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const tourParam = searchParams.get("tour");
    const selected = tourOptions.find((item) => item.slug === tourParam);
    if (selected && selected.slug !== "any") {
      setTour(selected.slug);
      setSubject((current) => current || selected.label);
    }
  }, [searchParams, tourOptions]);

  function reset() {
    setInquiryId("");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setError(null);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) return setError(t("nameError"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t("emailError"));
    if (!subject.trim()) return setError(t("subjectError"));
    if (!message.trim()) return setError(t("messageError"));
    if (honeypot) return;

    const service = searchParams.get("service") || "";
    const body = [message.trim(), service ? `Service: ${service}` : null].filter(Boolean).join("\n");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          tour,
          message: `Subject: ${subject.trim()}\n${body}`,
          locale,
          source: searchParams.get("source") || (tour !== "any" ? "tour" : "plan-my-journey"),
          sendClientConfirmation: true,
          website: honeypot,
          tourTitle: tourOptions.find((item) => item.slug === tour)?.label,
          service,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error"));
      setInquiryId(data.inquiryId || "ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      key: "phone",
      label: t("phone"),
      value: contact.phoneDisplay,
      href: `tel:${contact.phoneTel}`,
      icon: Phone,
    },
    {
      key: "email",
      label: t("emailLabel"),
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
    },
    {
      key: "office",
      label: t("office"),
      value: contact.address?.trim() || t("officeFallback"),
      href: "",
      icon: MapPin,
    },
    {
      key: "hours",
      label: t("hours"),
      value: contact.hours,
      href: "",
      icon: Clock,
    },
  ];

  return (
    <section className="relative bg-background pb-20 pt-28 sm:pb-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("eyebrow")}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">{t("intro")}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {cards.map((card) => {
                const Icon = card.icon;
                const inner = (
                  <>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {card.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-foreground">{card.value}</div>
                    </div>
                  </>
                );
                const className =
                  "flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30";
                return card.href ? (
                  <a key={card.key} href={card.href} className={className}>
                    {inner}
                  </a>
                ) : (
                  <div key={card.key} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_50px_-28px_rgba(120,72,24,0.45)] sm:p-8">
            {inquiryId ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-9 w-9 text-primary" aria-hidden />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">{t("success")}</h2>
                <p className="max-w-sm text-sm text-muted-foreground">{t("successDetail")}</p>
                {inquiryId !== "ok" ? (
                  <p className="text-xs text-muted-foreground">{t("reference", { id: inquiryId })}</p>
                ) : null}
                <Button type="button" variant="outline" onClick={reset}>
                  {t("another")}
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-name">{t("name")}</Label>
                    <Input
                      id="c-name"
                      name="name"
                      autoComplete="name"
                      placeholder={t("namePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-9 rounded-md bg-transparent px-3 text-base shadow-xs md:text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-email">{t("email")}</Label>
                    <Input
                      id="c-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 rounded-md bg-transparent px-3 text-base shadow-xs md:text-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-subject">{t("subject")}</Label>
                  <Input
                    id="c-subject"
                    name="subject"
                    placeholder={t("subjectPlaceholder")}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-9 rounded-md bg-transparent px-3 text-base shadow-xs md:text-sm"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-message">{t("message")}</Label>
                  <Textarea
                    id="c-message"
                    name="message"
                    rows={5}
                    placeholder={t("messagePlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-28 rounded-md bg-transparent px-3 py-2 text-base shadow-xs md:text-sm"
                  />
                </div>
                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 w-fit gap-2 rounded-md bg-primary px-6 text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? t("submitting") : t("submit")}
                </Button>
                <p className="text-center text-xs text-muted-foreground">{t("note")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
