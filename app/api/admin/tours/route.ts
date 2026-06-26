import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { getAllTours, normalizeTourInput, saveTour } from "@/lib/cms/tours";
import type { CmsTour } from "@/lib/cms/types";
import { cmsNow, newId } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const tours = await getAllTours();
  return NextResponse.json(tours);
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = (await request.json()) as Partial<CmsTour>;
  const now = cmsNow();
  const tour = normalizeTourInput({
    ...body,
    id: newId("tour"),
    createdAt: now,
  });
  const saved = await saveTour(tour);
  return NextResponse.json(saved, { status: 201 });
}