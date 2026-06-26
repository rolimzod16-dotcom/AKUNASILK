import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "./admin";

export async function requireAdminApi(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("gst_admin")?.value;
  const ok = await verifyAdminSession(token);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}