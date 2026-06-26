import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { getAllStories, saveStory, createEmptyStory } from "@/lib/cms/stories";
import type { CmsStory } from "@/lib/cms/types";
import { cmsNow, newId, slugify } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getAllStories());
}

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = (await request.json()) as Partial<CmsStory>;
  const base = createEmptyStory();
  const story: CmsStory = {
    ...base,
    ...body,
    id: newId("story"),
    slug: slugify(body.slug || body.content?.en?.title || base.slug || "story"),
    content: {
      en: { ...base.content.en, ...body.content?.en },
      ru: { ...base.content.ru, ...body.content?.ru },
    },
    createdAt: cmsNow(),
    updatedAt: cmsNow(),
  };
  const saved = await saveStory(story);
  return NextResponse.json(saved, { status: 201 });
}