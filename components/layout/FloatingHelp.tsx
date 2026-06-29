"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MessageCircle, HelpCircle } from "lucide-react";

export default function FloatingHelp() {
  const t = useTranslations("traveler.help");

  return (
    <div className="fixed bottom-20 right-4 z-40 hidden flex-col gap-2 lg:bottom-6 lg:flex">
      <a
        href="https://wa.me/998712004567"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full border border-silk-gold/40 bg-white px-4 py-2.5 text-xs font-semibold text-silk-indigo shadow-lg shadow-silk-gold/15 transition hover:border-silk-gold hover:bg-silk-gold/10"
        title={t("whatsapp")}
      >
        <MessageCircle className="size-4 text-silk-turquoise" />
        {t("whatsapp")}
      </a>
      <Link
        href="/faq"
        className="flex items-center gap-2 rounded-full border border-silk-gold/40 bg-silk-indigo px-4 py-2.5 text-xs font-semibold text-silk-gold shadow-lg transition hover:bg-silk-indigo-mid"
      >
        <HelpCircle className="size-4" />
        {t("faq")}
      </Link>
    </div>
  );
}