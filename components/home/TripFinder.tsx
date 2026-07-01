"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const regions = [
  { key: "uzbekistan", href: "/journeys?country=uzbekistan" },
  { key: "centralAsia", href: "/journeys?region=central" },
  { key: "pamir", href: "/journeys?region=pamir" },
  { key: "china", href: "/journeys?region=china" },
  { key: "persia", href: "/journeys?region=persia" },
  { key: "caucasus", href: "/journeys?region=caucasus" },
] as const;

export default function TripFinder() {
  const t = useTranslations("traveler.finder");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl shadow-silk-indigo/20 backdrop-blur-md sm:p-5"
    >
      <div className="flex items-center gap-2 text-silk-indigo">
        <Search className="size-4 text-silk-gold" />
        <p className="text-sm font-semibold">{t("title")}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {regions.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            className="rounded-full border border-silk-gold/30 bg-silk-cream px-3 py-1.5 text-xs font-medium text-silk-indigo transition hover:border-silk-gold hover:bg-silk-gold/20"
          >
            {t(`regions.${key}`)}
          </Link>
        ))}
      </div>
      <Button variant="silk" size="pill-sm" className="mt-4 w-full sm:w-auto" asChild>
        <Link href="/journeys">
          {t("viewAll")}
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </motion.div>
  );
}