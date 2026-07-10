"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

/** Static trust facts only — no fabricated live booking events (TZ §1 / §3). */
const EVENT_KEYS = ["e6", "e7", "e8"] as const;

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
        <Shield className="size-3.5 shrink-0 text-silk-turquoise" />
        <AnimatePresence mode="wait">
          <motion.p
            key={key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-xs text-apple-subtle sm:text-sm"
          >
            {t(`events.${key}`)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
