import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-admin";
import { getCmsStorageStatus } from "@/lib/cms/storage";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const storage = getCmsStorageStatus();

  return NextResponse.json({
    storage,
    hints: storage.canSave
      ? []
      : [
          "Vercel → Storage → Blob → Connect to Project → Redeploy",
          "Or: Settings → Environment Variables → GITHUB_TOKEN + GITHUB_REPO=owner/repo",
        ],
  });
}