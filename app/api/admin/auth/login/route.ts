import { NextResponse } from "next/server";
import {
  adminPasswordConfigured,
  createAdminSessionToken,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Session error" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("gst_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}