"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";
import { useBooking } from "@/lib/automation/booking-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Answers = {
  style?: string;
  duration?: string;
  region?: string;
};

const STYLE_MAP: Record<string, string> = {
  culture: "golden-caravan",
  adventure: "pamir-odyssey",
  nature: "heavenly-mountains",
  luxury: "spice-and-silk",
};

const REGION_MAP: Record<string, string> = {
  uzbekistan: "golden-caravan",
  centralAsia: "desert-echoes",
  pamir: "pamir-odyssey",
  china: "jade-gate",
  caucasus: "spice-and-silk",
};

const DURATION_MAP: Record<string, string> = {
  short: "golden-caravan",
  medium: "desert-echoes",
  long: "pamir-odyssey",
};

export default function TripMatcher() {
  const t = useTranslations("automation.matcher");
  const { openBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const questions = ["style", "duration", "region"] as const;

  const recommendation = useMemo(() => {
    const votes = [
      answers.style && STYLE_MAP[answers.style],
      answers.duration && DURATION_MAP[answers.duration],
      answers.region && REGION_MAP[answers.region],
    ].filter(Boolean) as string[];

    if (votes.length === 0) return "golden-caravan";
    const counts = votes.reduce<Record<string, number>>((acc, slug) => {
      acc[slug] = (acc[slug] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [answers]);

  const tourLabel = t(`tours.${recommendation}` as "tours.golden-caravan");

  function select(question: (typeof questions)[number], value: string) {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <section className="apple-section bg-white">
      <div className="mx-auto max-w-[720px] px-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-silk-gold/15">
            <Compass className="size-6 text-silk-gold" />
          </div>
          <h2 className="silk-headline text-3xl text-silk-indigo sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-apple-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-8 rounded-3xl border border-silk-gold/25 bg-silk-cream/50 p-6 sm:p-8">
          {!done ? (
            <>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-silk-turquoise">
                {t("step", { current: step + 1, total: questions.length })}
              </p>
              <h3 className="silk-headline text-xl text-silk-indigo">
                {t(`questions.${questions[step]}.title`)}
              </h3>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {Object.entries(
                  t.raw(`questions.${questions[step]}.options`) as Record<string, string>
                ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => select(questions[step], key)}
                      className={cn(
                        "rounded-2xl border border-silk-gold/25 bg-white px-4 py-3 text-left text-sm font-medium text-silk-indigo transition hover:border-silk-gold hover:bg-silk-gold/10",
                        answers[questions[step]] === key && "border-silk-gold bg-silk-gold/15"
                      )}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Sparkles className="mx-auto size-8 text-silk-gold" />
              <h3 className="silk-headline mt-3 text-2xl text-silk-indigo">
                {t("resultTitle")}
              </h3>
              <p className="mt-2 text-lg font-semibold text-gradient-silk">{tourLabel}</p>
              <p className="mt-2 text-sm text-apple-muted">{t("resultBody")}</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  variant="silk"
                  size="pill"
                  className="silk-glow-pulse"
                  onClick={() =>
                    openBooking({
                      tourSlug: recommendation,
                      source: "matcher",
                      notes: t("matcherNote", { tour: tourLabel }),
                    })
                  }
                >
                  {t("bookMatch")}
                </Button>
                <Button variant="outline" size="pill" onClick={reset}>
                  {t("retake")}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}