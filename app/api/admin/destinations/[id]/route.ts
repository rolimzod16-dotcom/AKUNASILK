import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import {
  deleteDestination,
  getDestinationById,
  saveDestination,
} from "@/lib/cms/destinations";
import type { CmsDestination } from "@/lib/cms/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const item = await getDestinationById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getDestinationById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await request.json()) as Partial<CmsDestination>;
  return NextResponse.json(
    await saveDestination({
      ...existing,
      ...body,
      id,
      content: {
        en: { ...existing.content.en, ...body.content?.en },
        ru: { ...existing.content.ru, ...body.content?.ru },
      },
    })
  );
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteDestination(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
