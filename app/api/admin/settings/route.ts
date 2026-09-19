import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { getSiteSettings, saveSiteSettings } from "@/lib/cms/settings";
import type { CmsSiteSettings } from "@/lib/cms/types";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  try {
    const body = (await request.json()) as CmsSiteSettings;
    const saved = await saveSiteSettings(body);
    return NextResponse.json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
