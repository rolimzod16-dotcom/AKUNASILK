import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { createEmptyReview, getAllReviews, saveReview } from "@/lib/cms/reviews";
import type { CmsReview } from "@/lib/cms/types";
import { cmsNow, newId } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getAllReviews());
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const body = (await request.json()) as Partial<CmsReview>;
  const base = createEmptyReview();
  const review: CmsReview = {
    ...base,
    ...body,
    id: newId("review"),
    createdAt: cmsNow(),
    updatedAt: cmsNow(),
  };
  return NextResponse.json(await saveReview(review), { status: 201 });
}
