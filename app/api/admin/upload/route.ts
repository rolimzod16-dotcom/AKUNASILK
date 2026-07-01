import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { storeCmsImage } from "@/lib/upload/store";

const MAX_BYTES = 3 * 1024 * 1024;
const FOLDERS = new Set(["tours", "stories", "general"]);

export async function POST(request: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") ?? "general");
    const folder = FOLDERS.has(folderRaw) ? folderRaw : "general";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large after compression (max 3 MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, storage } = await storeCmsImage(
      buffer,
      folder,
      file.type,
      file.name
    );

    return NextResponse.json({ ok: true, url, storage });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}