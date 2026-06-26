import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { deleteStory, getStoryById, saveStory } from "@/lib/cms/stories";
import type { CmsStory } from "@/lib/cms/types";
import { cmsNow, slugify } from "@/lib/cms/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(story);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getStoryById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json()) as Partial<CmsStory>;
  const story: CmsStory = {
    ...existing,
    ...body,
    id,
    slug: slugify(body.slug || body.content?.en?.title || existing.slug),
    content: {
      en: { ...existing.content.en, ...body.content?.en },
      ru: { ...existing.content.ru, ...body.content?.ru },
    },
    updatedAt: cmsNow(),
  };
  return NextResponse.json(await saveStory(story));
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteStory(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}