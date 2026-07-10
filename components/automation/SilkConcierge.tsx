"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useBooking } from "@/lib/automation/booking-context";
import {
  matchConciergeTopic,
  type ConciergeTopic,
  type PublicTour,
} from "@/lib/automation/concierge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const QUICK_TOPICS: ConciergeTopic[] = [
  "visa",
  "price",
  "cancel",
  "included",
  "solo",
  "payment",
];

export default function SilkConcierge() {
  const t = useTranslations("automation.concierge");
  const locale = useLocale();
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const listRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tours, setTours] = useState<PublicTour[]>([]);
  const [pulse, setPulse] = useState(true);

  const tourSlug = useMemo(() => {
    const match = pathname.match(/\/journeys\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const activeTour = useMemo(
    () => tours.find((tour) => tour.slug === tourSlug),
    [tours, tourSlug]
  );

  useEffect(() => {
    fetch(`/api/tours/public?locale=${locale}`)
      .then((res) => res.json())
      .then((data: { tours: PublicTour[] }) => setTours(data.tours ?? []))
      .catch(() => setTours([]));
  }, [locale]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: activeTour
            ? t("welcomeTour", { tour: activeTour.title })
            : t("welcome"),
        },
      ]);
    }
  }, [open, messages.length, activeTour, t]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  function answerForTopic(topic: ConciergeTopic): string {
    if (activeTour) {
      if (topic === "price") {
        return t("tourPrice", {
          tour: activeTour.title,
          price: activeTour.price.toLocaleString(),
        });
      }
      if (topic === "when") {
        const date = new Date(activeTour.nextDeparture).toLocaleDateString(locale, {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return t("tourWhen", { tour: activeTour.title, date });
      }
      if (topic === "group" && activeTour) {
        return t("tourSpots", { tour: activeTour.title, count: activeTour.maxGroupSize ?? 12 });
      }
    }
    return t(`answers.${topic}`);
  }

  function reply(text: string) {
    const topic = matchConciergeTopic(text);
    const answer = topic ? answerForTopic(topic) : t("answers.fallback");
    const id = String(Date.now());
    setMessages((prev) => [
      ...prev,
      { id: `${id}-u`, role: "user", text },
      { id: `${id}-a`, role: "assistant", text: answer },
    ]);
  }

  function handleQuick(topic: ConciergeTopic) {
    const label = t(`quick.${topic}`);
    reply(label);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-36 right-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-silk-gold/35 bg-white shadow-2xl shadow-silk-indigo/20 lg:bottom-24"
          >
            <div className="flex items-center justify-between border-b border-silk-gold/20 bg-silk-indigo px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-silk-gold/20">
                  <Bot className="size-4 text-silk-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t("title")}</p>
                  <p className="text-[10px] text-silk-sand/80">{t("online")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-silk-sand/80 transition hover:bg-white/10"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={listRef} className="max-h-64 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-silk-gold/15 text-silk-indigo"
                      : "bg-silk-sand/60 text-apple-subtle"
                  )}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="border-t border-silk-gold/15 px-3 py-2">
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleQuick(topic)}
                    className="shrink-0 rounded-full border border-silk-gold/30 px-2.5 py-1 text-[10px] font-semibold text-silk-indigo transition hover:bg-silk-gold/10"
                  >
                    {t(`quick.${topic}`)}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = input.trim();
                  if (!text) return;
                  setInput("");
                  reply(text);
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="h-9 flex-1 border-silk-gold/20 text-sm"
                />
                <Button type="submit" size="icon-sm" variant="silk" className="shrink-0">
                  <Send className="size-3.5" />
                </Button>
              </form>
            </div>

            <div className="border-t border-silk-gold/20 bg-silk-gold/5 px-4 py-3">
              <Button
                variant="silk"
                size="pill-sm"
                className="w-full text-xs font-bold"
                onClick={() => {
                  setOpen(false);
                  openBooking({
                    tourSlug: activeTour?.slug,
                    source: "concierge",
                  });
                }}
              >
                <Sparkles className="size-3.5" />
                {t("bookCta")}
              </Button>
              <p className="mt-2 text-center text-[10px] text-apple-muted">{t("holdNote")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 lg:bottom-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group flex items-center gap-2 rounded-full border border-silk-gold/40 bg-silk-indigo px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-silk-indigo/30 transition hover:bg-silk-indigo-mid",
            pulse && !open && "animate-pulse"
          )}
        >
          <MessageCircle className="size-5 text-silk-gold" />
          <span className="hidden sm:inline">{t("fab")}</span>
          <ChevronDown
            className={cn("size-4 transition", open && "rotate-180")}
          />
        </button>
        <a
          href="https://wa.me/998712004567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-silk-gold/30 bg-white px-3 py-2 text-[11px] font-semibold text-silk-indigo shadow-md transition hover:border-silk-gold"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}