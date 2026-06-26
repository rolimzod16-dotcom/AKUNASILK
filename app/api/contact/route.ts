import { NextResponse } from "next/server";
import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { getPublishedTours } from "@/lib/cms/tours";

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
};

async function sendViaResend(payload: ContactPayload, inquiryId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "hello@greatsilktrails.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "GREATSILKTRAILS <onboarding@resend.dev>";

  if (!apiKey) return false;

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
        `Locale: ${payload.locale || "en"}`,
        "",
        payload.message,
      ].join("\n"),
    }),
  });

  return res.ok;
}

async function saveInquiry(payload: ContactPayload, inquiryId: string) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, "inquiries.jsonl");
  const line = JSON.stringify({
    id: inquiryId,
    ...payload,
    createdAt: new Date().toISOString(),
  });
  await appendFile(file, line + "\n", "utf8");
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
    const payload: ContactPayload = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim(),
      tour,
      message: body.message.trim(),
      locale: body.locale,
    };

    const inquiryId = `GST-${Date.now().toString(36).toUpperCase()}`;
    await saveInquiry(payload, inquiryId);
    await sendViaResend(payload, inquiryId);

    return NextResponse.json({ ok: true, inquiryId });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}