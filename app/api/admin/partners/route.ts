import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import {
  createEmptyPartner,
  normalizePartnerSlug,
  savePartner,
  getAllPartners,
} from "@/lib/cms/partners";
import type { CmsPartner } from "@/lib/cms/types";
import { cmsNow, newId } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getAllPartners());
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = (await request.json()) as Partial<CmsPartner>;
  const base = createEmptyPartner();
  const partner: CmsPartner = {
    ...base,
    ...body,
    id: newId("partner"),
    slug: normalizePartnerSlug(body),
    content: {
      en: { ...base.content.en, ...body.content?.en },
      ru: { ...base.content.ru, ...body.content?.ru },
    },
    createdAt: cmsNow(),
    updatedAt: cmsNow(),
  };
  return NextResponse.json(await savePartner(partner), { status: 201 });
}