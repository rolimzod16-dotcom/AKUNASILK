"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Bus,
  Hotel,
  Utensils,
  ShieldCheck,
  Ticket,
  Headphones,
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";

const items = [
  { key: "guide", icon: Headphones },
  { key: "hotel", icon: Hotel },
  { key: "transfer", icon: Bus },
  { key: "meals", icon: Utensils },
  { key: "tickets", icon: Ticket },
  { key: "support", icon: ShieldCheck },
] as const;

export default function PackageIncludes() {
  const t = useTranslations("shop.includes");

  return (
    <section className="apple-section bg-white">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {items.map(({ key, icon: Icon }, i) => (
            <ScrollReveal key={key} delay={i * 0.05}>
              <div className="group rounded-2xl border border-silk-gold/20 bg-gradient-to-b from-white to-silk-cream p-5 text-center transition duration-500 hover:border-silk-gold/50 hover:shadow-xl hover:shadow-silk-gold/10 sm:p-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mx-auto flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-silk-gold/25 to-silk-amber/15 transition group-hover:from-silk-gold/40 group-hover:to-silk-amber/25"
                >
                  <Icon className="size-5 text-silk-terracotta" />
                </motion.div>
                <p className="mt-3 text-sm font-semibold text-silk-indigo">
                  {t(`items.${key}.title`)}
                </p>
                <p className="mt-1 text-xs text-apple-muted">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}