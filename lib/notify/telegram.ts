/**
 * Telegram notify for booking / plan enquiries.
 * Env:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_IDS=id1,id2   (preferred)
 *   or TELEGRAM_CHAT_ID=id
 */

export type InquiryNotifyPayload = {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  tour: string;
  tourTitle?: string;
  message: string;
  locale?: string;
  travelers?: number;
  preferredDate?: string;
  price?: number;
  source?: string;
};

function chatIds(): string[] {
  const multi = process.env.TELEGRAM_CHAT_IDS?.trim();
  if (multi) {
    return multi
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const one = process.env.TELEGRAM_CHAT_ID?.trim();
  return one ? [one] : [];
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && chatIds().length > 0);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isBookingSource(source?: string, tour?: string): boolean {
  const s = (source || "").toLowerCase();
  if (["card", "wizard", "matcher", "concierge"].includes(s)) return true;
  if (tour && tour !== "any" && tour !== "bespoke") {
    if (s === "card" || s.includes("reserve") || s.includes("book")) return true;
  }
  return Boolean(tour && tour !== "any" && tour !== "bespoke" && s !== "header" && s !== "info-page" && s !== "plan-journey");
}

function formatMessage(payload: InquiryNotifyPayload): string {
  const booking = isBookingSource(payload.source, payload.tour);
  const headline = booking
    ? "🛎 <b>GREATSILKTRAILS — Reserve / booking hold</b>"
    : "📩 <b>GREATSILKTRAILS — Plan Your Journey enquiry</b>";

  const tourLabel = payload.tourTitle
    ? `${payload.tourTitle} (${payload.tour})`
    : payload.tour;

  const lines = [
    headline,
    "",
    `<b>ID:</b> <code>${escapeHtml(payload.inquiryId)}</code>`,
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Email:</b> ${escapeHtml(payload.email)}`,
    `<b>Phone / WhatsApp:</b> ${escapeHtml(payload.phone || "—")}`,
    `<b>Tour:</b> ${escapeHtml(tourLabel)}`,
    payload.price != null ? `<b>Price shown:</b> $${payload.price}` : null,
    `<b>Travelers:</b> ${payload.travelers ?? "—"}`,
    `<b>Preferred date:</b> ${escapeHtml(payload.preferredDate || "—")}`,
    `<b>Source:</b> ${escapeHtml(payload.source || "form")}`,
    `<b>Locale:</b> ${escapeHtml(payload.locale || "en")}`,
    "",
    "<b>Message / notes:</b>",
    escapeHtml((payload.message || "—").slice(0, 3500)),
    "",
    booking
      ? "<i>Status: 24h hold request — confirm availability before any deposit.</i>"
      : "<i>Status: general / private trip planner — no tour locked yet.</i>",
  ].filter((line): line is string => line != null);

  return lines.join("\n");
}

/** Returns true if at least one chat received the message. */
export async function notifyTelegramInquiry(
  payload: InquiryNotifyPayload
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const ids = chatIds();
  if (!token || ids.length === 0) {
    console.warn("[telegram] not configured — skip notify");
    return false;
  }

  const text = formatMessage(payload);
  let anyOk = false;

  await Promise.all(
    ids.map(async (chatId) => {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          }
        );
        if (res.ok) {
          anyOk = true;
        } else {
          const body = await res.text().catch(() => "");
          console.error("[telegram] send failed", chatId, res.status, body);
        }
      } catch (err) {
        console.error("[telegram] send error", chatId, err);
      }
    })
  );

  return anyOk;
}
