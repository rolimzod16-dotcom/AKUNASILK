/**
 * Telegram notify for booking / plan enquiries.
 * Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (or TELEGRAM_CHAT_IDS comma-separated).
 */

export type InquiryNotifyPayload = {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  tour: string;
  message: string;
  locale?: string;
  travelers?: number;
  preferredDate?: string;
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

function formatMessage(payload: InquiryNotifyPayload): string {
  const lines = [
    "🛎 <b>GREATSILKTRAILS — new enquiry</b>",
    "",
    `<b>ID:</b> <code>${escapeHtml(payload.inquiryId)}</code>`,
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Email:</b> ${escapeHtml(payload.email)}`,
    `<b>Phone:</b> ${escapeHtml(payload.phone || "—")}`,
    `<b>Tour / intent:</b> ${escapeHtml(payload.tour)}`,
    `<b>Travelers:</b> ${payload.travelers ?? "—"}`,
    `<b>Preferred date:</b> ${escapeHtml(payload.preferredDate || "—")}`,
    `<b>Source:</b> ${escapeHtml(payload.source || "form")}`,
    `<b>Locale:</b> ${escapeHtml(payload.locale || "en")}`,
    "",
    "<b>Message:</b>",
    escapeHtml(payload.message.slice(0, 3500)),
    "",
    "<i>Status: enquiry / 24h hold — not paid yet. Confirm availability before requesting deposit.</i>",
  ];
  return lines.join("\n");
}

/** Fire-and-forget safe: returns true if at least one chat got the message. */
export async function notifyTelegramInquiry(
  payload: InquiryNotifyPayload
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const ids = chatIds();
  if (!token || ids.length === 0) return false;

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
        if (res.ok) anyOk = true;
        else {
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
