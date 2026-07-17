import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { getPublishedTours, getTourContent } from "@/lib/cms/tours";
import { notifyTelegramInquiry } from "@/lib/notify/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getValidTourSlugs(): Promise<Set<string>> {
  const tours = await getPublishedTours();
  return new Set(["any", "bespoke", ...tours.map((t) => t.slug)]);
}

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  tour: string;
  message: string;
  locale?: string;
  travelers?: number;
  preferredDate?: string;
  price?: number;
  source?: string;
  sendClientConfirmation?: boolean;
};

async function sendOperatorEmail(payload: ContactPayload, inquiryId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "hello@greatsilktrails.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "GREATSILKTRAILS <onboarding@resend.dev>";

  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `[Booking ${inquiryId}] ${payload.tour} — ${payload.name}`,
        text: [
          `Inquiry ID: ${inquiryId}`,
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone || "—"}`,
          `Tour: ${payload.tour}`,
          `Travelers: ${payload.travelers ?? "—"}`,
          `Preferred date: ${payload.preferredDate || "—"}`,
          `Source: ${payload.source || "contact-form"}`,
          `Locale: ${payload.locale || "en"}`,
          "",
          payload.message,
        ].join("\n"),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[contact] operator email failed", err);
    return false;
  }
}

async function sendClientConfirmation(payload: ContactPayload, inquiryId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "GREATSILKTRAILS <onboarding@resend.dev>";
  const supportEmail = process.env.CONTACT_TO_EMAIL ?? "hello@greatsilktrails.com";

  if (!apiKey || !payload.sendClientConfirmation) return false;

  const locale = payload.locale === "ru" ? "ru" : "en";
  const tourRecord = (await getPublishedTours()).find((t) => t.slug === payload.tour);
  const tourName =
    payload.tour === "any"
      ? locale === "ru"
        ? "Тур на выбор"
        : "Tour to be confirmed"
      : payload.tour === "bespoke"
        ? locale === "ru"
          ? "Индивидуальный тур"
          : "Bespoke private tour"
        : tourRecord
          ? getTourContent(tourRecord, locale).title
          : payload.tour;

  const isRu = locale === "ru";
  const subject = isRu
    ? `Ваша заявка ${inquiryId} — GREATSILKTRAILS`
    : `Your trip request ${inquiryId} — GREATSILKTRAILS`;

  const text = isRu
    ? [
        `Здравствуйте, ${payload.name}!`,
        "",
        "Спасибо за заявку на тур по Шёлковому пути. Мы зарезервировали ваш запрос на 24 часа.",
        "",
        `Номер заявки: ${inquiryId}`,
        `Тур: ${tourName}`,
        payload.travelers ? `Путешественников: ${payload.travelers}` : null,
        payload.preferredDate ? `Предпочтительная дата: ${payload.preferredDate}` : null,
        "",
        "Что дальше:",
        "1. Менеджер свяжется с вами в течение 24 часов.",
        "2. Вы получите программу и варианты оплаты.",
        "3. После депозита место подтверждается официально.",
        "",
        `Вопросы? Напишите нам: ${supportEmail}`,
        "",
        "GREATSILKTRAILS — путешествия по Шёлковому пути",
      ]
        .filter(Boolean)
        .join("\n")
    : [
        `Hi ${payload.name},`,
        "",
        "Thank you for your Silk Road trip request. We've placed a 24-hour courtesy hold on your inquiry.",
        "",
        `Reference: ${inquiryId}`,
        `Tour: ${tourName}`,
        payload.travelers ? `Travelers: ${payload.travelers}` : null,
        payload.preferredDate ? `Preferred date: ${payload.preferredDate}` : null,
        "",
        "What happens next:",
        "1. A travel specialist replies within 24 hours.",
        "2. You receive a day-by-day itinerary and payment options.",
        "3. Your spot is confirmed after deposit.",
        "",
        `Questions? Email us: ${supportEmail}`,
        "",
        "GREATSILKTRAILS — Silk Road tours, made simple.",
      ]
        .filter(Boolean)
        .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.email],
        reply_to: supportEmail,
        subject,
        text,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[contact] client email failed", err);
    return false;
  }
}

/**
 * Best-effort local log. On Vercel the app filesystem is read-only —
 * never throw; Telegram/email must still run.
 */
async function saveInquiry(payload: ContactPayload, inquiryId: string) {
  try {
    const base =
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
        ? path.join("/tmp", "gst-inquiries")
        : path.join(process.cwd(), "data");
    await mkdir(base, { recursive: true });
    const file = path.join(base, "inquiries.jsonl");
    const line = JSON.stringify({
      id: inquiryId,
      ...payload,
      createdAt: new Date().toISOString(),
    });
    await appendFile(file, line + "\n", "utf8");
    return true;
  } catch (err) {
    console.warn("[contact] saveInquiry skipped (non-fatal)", err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const validSlugs = await getValidTourSlugs();
    const tour = validSlugs.has(body.tour) ? body.tour : "any";
    const locale = body.locale === "ru" ? "ru" : "en";
    const published = await getPublishedTours();
    const tourRecord = published.find((t) => t.slug === tour);
    const tourTitle =
      tour === "any"
        ? locale === "ru"
          ? "Тур на выбор / Plan Your Journey"
          : "Help me choose / Plan Your Journey"
        : tour === "bespoke"
          ? locale === "ru"
            ? "Индивидуальный / private trip"
            : "Bespoke private tour"
          : tourRecord
            ? getTourContent(tourRecord, locale).title
            : tour;

    const payload: ContactPayload = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim(),
      tour,
      message: body.message.trim(),
      locale,
      travelers:
        typeof body.travelers === "number" && body.travelers >= 1 && body.travelers <= 12
          ? body.travelers
          : undefined,
      preferredDate: body.preferredDate?.trim(),
      price:
        typeof body.price === "number" && body.price > 0
          ? body.price
          : tourRecord?.price,
      source: body.source?.trim(),
      sendClientConfirmation: body.sendClientConfirmation,
    };

    const inquiryId = `GST-${Date.now().toString(36).toUpperCase()}`;

    // Never block notifications on local file write
    await saveInquiry(payload, inquiryId);

    const [telegramOk, emailOk] = await Promise.all([
      notifyTelegramInquiry({
        inquiryId,
        ...payload,
        tourTitle,
      }),
      sendOperatorEmail(payload, inquiryId),
    ]);

    // Client email is optional; ignore failures
    void sendClientConfirmation(payload, inquiryId);

    if (!telegramOk) {
      console.error(
        "[contact] telegram notify failed — check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_IDS on Vercel"
      );
    }

    return NextResponse.json({
      ok: true,
      inquiryId,
      notified: { telegram: telegramOk, email: emailOk },
    });
  } catch (err) {
    console.error("[contact] POST failed", err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
