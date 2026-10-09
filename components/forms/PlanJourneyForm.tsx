"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "@/i18n/routing";

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

const fieldClass =
  "h-11 w-full rounded-lg border border-silk-gold/30 bg-white px-3 text-sm text-silk-indigo outline-none transition placeholder:text-apple-muted/70 focus:border-silk-gold";

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
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const tourParam = searchParams.get("tour");
    const selected = tourOptions.find((item) => item.slug === tourParam);
    if (selected && selected.slug !== "any") {
      setTour(selected.slug);
      setSubject((current) => current || selected.label);
    }
  }, [searchParams, tourOptions]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) return setError(t("nameError"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t("emailError"));
    if (!message.trim()) return setError(t("messageError"));
    if (!consent) return setError(t("consentError"));
    if (honeypot) return;

    const service = searchParams.get("service") || "";
    const body = [
      subject.trim() ? `Subject: ${subject.trim()}` : null,
      message.trim(),
      service ? `Service: ${service}` : null,
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
          tour,
          message: body,
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
      setInquiryId(data.inquiryId || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    contact.phoneDisplay
      ? {
          key: "phone",
          label: t("phone"),
          value: contact.phoneDisplay,
          href: `tel:${contact.phoneTel}`,
          icon: Phone,
        }
      : null,
    contact.email
      ? {
          key: "email",
          label: t("emailLabel"),
          value: contact.email,
          href: `mailto:${contact.email}`,
          icon: Mail,
        }
      : null,
    contact.address
      ? {
          key: "office",
          label: t("office"),
          value: contact.address,
          href: "",
          icon: MapPin,
        }
      : {
          key: "whatsapp",
          label: t("whatsapp"),
          value: "WhatsApp",
          href: contact.whatsappHref,
          icon: MessageCircle,
        },
    contact.hours
      ? {
          key: "hours",
          label: t("hours"),
          value: contact.hours,
          href: "",
          icon: Clock,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="bg-silk-cream py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silk-gold">{t("eyebrow")}</p>
          <h1 className="silk-headline mt-3 text-3xl text-silk-indigo sm:text-5xl">{t("heading")}</h1>
          <p className="mt-4 text-base leading-relaxed text-apple-muted sm:text-lg">{t("intro")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-silk-gold/15 text-silk-indigo">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span>
                    <span className="block text-xs font-medium text-apple-muted">{card.label}</span>
                    <span className="mt-0.5 block text-sm font-medium text-silk-indigo">{card.value}</span>
                  </span>
                </>
              );
              const className =
                "flex items-start gap-3 rounded-2xl border border-silk-gold/25 bg-white p-4 transition hover:border-silk-gold/60";
              return card.href ? (
                <a
                  key={card.key}
                  href={card.href}
                  className={className}
                  {...(card.key === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
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

        <div className="rounded-2xl border border-silk-gold/25 bg-white p-6 shadow-[0_25px_50px_-12px_rgba(15,18,37,0.12)] sm:p-8">
          {inquiryId ? (
            <div className="py-8 text-center">
              <h2 className="silk-headline text-2xl text-silk-indigo">{t("success")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-apple-muted">{t("successDetail")}</p>
              <p className="mt-3 text-xs text-apple-muted">{t("reference", { id: inquiryId })}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <label className="block">
                <span className="text-sm font-medium text-silk-indigo">{t("name")}</span>
                <input
                  className={`${fieldClass} mt-1.5`}
                  name="name"
                  autoComplete="name"
                  placeholder={t("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-silk-indigo">{t("email")}</span>
                <input
                  className={`${fieldClass} mt-1.5`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-silk-indigo">{t("subject")}</span>
                <input
                  className={`${fieldClass} mt-1.5`}
                  name="subject"
                  placeholder={t("subjectPlaceholder")}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-silk-indigo">{t("message")}</span>
                <textarea
                  className={`${fieldClass} mt-1.5 h-32 resize-none py-3`}
                  name="message"
                  placeholder={t("messagePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
              <label className="flex items-start gap-2 text-sm text-apple-muted">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  <Link href="/privacy" className="text-silk-gold underline">
                    {t("consent")}
                  </Link>
                </span>
              </label>
              {error ? (
                <p className="text-sm text-silk-terracotta" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-silk-gold to-silk-amber text-sm font-bold text-silk-indigo shadow-md shadow-silk-gold/30 transition hover:from-silk-gold-light hover:to-silk-gold disabled:opacity-60"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? t("submitting") : t("submit")}
              </button>
              <p className="text-center text-xs text-apple-muted">{t("note")}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
