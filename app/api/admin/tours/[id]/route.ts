import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import {
  deleteTour,
  getTourById,
  normalizeTourInput,
  saveTour,
} from "@/lib/cms/tours";
import type { CmsTour } from "@/lib/cms/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tour);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getTourById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as Partial<CmsTour>;
  const tour = normalizeTourInput({ ...existing, ...body, id });
  const saved = await saveTour(tour);
  return NextResponse.json(saved);
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteTour(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}