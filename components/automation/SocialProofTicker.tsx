"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

const EVENT_KEYS = ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"] as const;

export default function SocialProofTicker() {
  const t = useTranslations("automation.social");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % EVENT_KEYS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const key = EVENT_KEYS[index];

  return (
    <div className="border-y border-silk-gold/20 bg-silk-indigo/5 py-2.5">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 text-center">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-silk-turquoise opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-silk-turquoise" />
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-1 text-xs text-apple-subtle sm:text-sm"
          >
            <MapPin className="size-3.5 text-silk-turquoise" />
            {t(`events.${key}`)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}