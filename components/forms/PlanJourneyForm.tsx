"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";
import { PUBLIC_COUNTRY_SLUGS } from "@/lib/site";

type TourOption = { slug: string; label: string };

type PlanJourneyFormProps = {
  tourOptions: TourOption[];
  compact?: boolean;
};

const STYLES = [
  "Overland and 4x4",
  "Trekking",
  "Motorcycle",
  "Culture and Cities",
  "Horse Riding",
  "Photography",
];

const DURATIONS = ["1–7 days", "8–12 days", "13+ days", "Flexible"];
const STAYS = ["Homestay and guesthouse", "Mid-range hotels", "Heritage / boutique", "Flexible"];

export default function PlanJourneyForm({ tourOptions }: PlanJourneyFormProps) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState("");

  const [destinations, setDestinations] = useState<string[]>([]);
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [preferredDate, setPreferredDate] = useState("");
  const [duration, setDuration] = useState("Flexible");
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState("");
  const [tour, setTour] = useState("any");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [residence, setResidence] = useState("");
  const [comfort, setComfort] = useState("Flexible");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const service = searchParams.get("service") || "";

  useEffect(() => {
    const tourParam = searchParams.get("tour");
    if (tourParam && tourOptions.some((item) => item.slug === tourParam)) {
      setTour(tourParam);
    }
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setPreferredDate(dateParam);
      setFlexibleDates(false);
    }
    const destParam = searchParams.get("destination");
    if (destParam) {
      setDestinations(
        destParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
    const styleParam = searchParams.get("style");
    if (styleParam) setTravelStyle(styleParam);
  }, [searchParams, tourOptions]);

  function toggleDestination(slug: string) {
    setDestinations((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  }

  async function submit() {
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if (!consent) return setError("Please confirm you agree to the Privacy Policy.");
    if (honeypot) return;

    setLoading(true);
    const selectedTour = tourOptions.find((item) => item.slug === tour);
    const message = [
      notes.trim() || "Travel request from Plan My Journey.",
      destinations.length ? `Destinations: ${destinations.join(", ")}` : null,
      `Dates: ${flexibleDates ? "Flexible" : preferredDate || "Flexible"}`,
      `Duration: ${duration}`,
      travelStyle ? `Travel style: ${travelStyle}` : null,
      `Accommodation: ${comfort}`,
      residence ? `Country of residence: ${residence}` : null,
      service ? `Service: ${service}` : null,
      typeof window !== "undefined" ? `Page: ${window.location.href}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          tour,
          message,
          locale,
          travelers,
          preferredDate: flexibleDates ? "Flexible" : preferredDate,
          source: searchParams.get("source") || (service ? "service" : tour !== "any" ? "tour" : "plan-my-journey"),
          sendClientConfirmation: true,
          website: honeypot,
          tourTitle: selectedTour?.label,
          service,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send request");
      setInquiryId(data.inquiryId || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send request");
    } finally {
      setLoading(false);
    }
  }

  if (inquiryId) {
    return (
      <div className="rounded-2xl border border-silk-gold/30 bg-white p-8 text-center">
        <h2 className="silk-headline text-2xl text-silk-indigo">Thank you</h2>
        <p className="mt-3 text-sm leading-relaxed text-apple-muted">
          Your request has been received. The GST team will review it and reply using the
          contact details you provided.
        </p>
        <p className="mt-3 text-xs text-apple-muted">Reference: {inquiryId}</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-silk-gold/20 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) setStep(2);
        else void submit();
      }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-silk-gold">
        Plan your journey · Step {step} of 2
      </p>
      <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">
        {step === 1 ? "Trip basics" : "Contact and preferences"}
      </h2>
      <p className="mt-2 text-sm text-apple-muted">
        Share what you know. Approximate dates and ideas are enough to begin.
      </p>

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

      {step === 1 ? (
        <div className="mt-6 space-y-5">
          {tourOptions.length > 1 && (
            <Field label="Journey (optional)" htmlFor="tour">
              <select
                id="tour"
                name="tour"
                value={tour}
                onChange={(e) => setTour(e.target.value)}
                className="h-11 w-full rounded-lg border border-silk-gold/30 bg-silk-cream px-3 text-sm"
              >
                {tourOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-silk-indigo">Destination(s)</p>
            <div className="flex flex-wrap gap-2">
              {PUBLIC_COUNTRY_SLUGS.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleDestination(slug)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                    destinations.includes(slug)
                      ? "bg-silk-indigo text-silk-gold"
                      : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/30"
                  }`}
                >
                  {slug}
                </button>
              ))}
              <button
                type="button"
                onClick={() => toggleDestination("central-asia")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  destinations.includes("central-asia")
                    ? "bg-silk-indigo text-silk-gold"
                    : "bg-silk-cream text-silk-indigo ring-1 ring-silk-gold/30"
                }`}
              >
                Multi-country
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Approximate dates" htmlFor="dates">
              <Input
                id="dates"
                name="preferredDate"
                type="month"
                autoComplete="off"
                disabled={flexibleDates}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-apple-muted">
                <input
                  type="checkbox"
                  checked={flexibleDates}
                  onChange={(e) => setFlexibleDates(e.target.checked)}
                />
                Flexible
              </label>
            </Field>
            <Field label="Duration" htmlFor="duration">
              <select
                id="duration"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-11 w-full rounded-lg border border-silk-gold/30 bg-silk-cream px-3 text-sm"
              >
                {DURATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Travellers" htmlFor="travelers">
              <Input
                id="travelers"
                name="travelers"
                type="number"
                min={1}
                max={12}
                autoComplete="off"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value) || 1)}
              />
            </Field>
            <Field label="Travel style" htmlFor="style">
              <select
                id="style"
                name="style"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="h-11 w-full rounded-lg border border-silk-gold/30 bg-silk-cream px-3 text-sm"
              >
                <option value="">Not sure yet</option>
                {STYLES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="name">
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp (optional)" htmlFor="phone">
              <Input
                id="phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label="Country of residence" htmlFor="residence">
              <Input
                id="residence"
                name="country"
                autoComplete="country-name"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Accommodation level" htmlFor="comfort">
            <select
              id="comfort"
              name="comfort"
              value={comfort}
              onChange={(e) => setComfort(e.target.value)}
              className="h-11 w-full rounded-lg border border-silk-gold/30 bg-silk-cream px-3 text-sm"
            >
              {STAYS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes" htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pace, interests, questions"
            />
          </Field>
          <label className="flex items-start gap-2 text-sm text-apple-muted">
            <input
              type="checkbox"
              className="mt-1"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <Link href="/privacy" className="text-silk-gold underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-silk-terracotta" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {step === 2 && (
          <Button type="button" variant="silkOutline" size="pill" onClick={() => setStep(1)}>
            <ChevronLeft className="size-4" />
            Back
          </Button>
        )}
        <Button type="submit" variant="silk" size="pill" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : step === 1 ? (
            <>
              Continue
              <ChevronRight className="size-4" />
            </>
          ) : (
            "Send My Travel Request"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm text-silk-indigo">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
