import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import {
  createEmptyDestination,
  getAllDestinations,
  saveDestination,
} from "@/lib/cms/destinations";
import type { CmsDestination } from "@/lib/cms/types";
import { cmsNow, newId } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getAllDestinations());
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await request.json()) as Partial<CmsDestination>;
  const base = createEmptyDestination();
  const item: CmsDestination = {
    ...base,
    ...body,
    id: newId("dest"),
    content: {
      en: { ...base.content.en, ...body.content?.en },
      ru: { ...base.content.ru, ...body.content?.ru },
    },
    createdAt: cmsNow(),
    updatedAt: cmsNow(),
  };
  return NextResponse.json(await saveDestination(item), { status: 201 });
}
