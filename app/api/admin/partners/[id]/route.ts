import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import {
  deletePartner,
  getPartnerById,
  normalizePartnerSlug,
  savePartner,
} from "@/lib/cms/partners";
import type { CmsPartner } from "@/lib/cms/types";
import { cmsNow } from "@/lib/cms/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(partner);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getPartnerById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as Partial<CmsPartner>;
  const partner: CmsPartner = {
    ...existing,
    ...body,
    id,
    slug: normalizePartnerSlug({ ...existing, ...body }),
    content: {
      en: { ...existing.content.en, ...body.content?.en },
      ru: { ...existing.content.ru, ...body.content?.ru },
    },
    updatedAt: cmsNow(),
  };
  return NextResponse.json(await savePartner(partner));
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deletePartner(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}