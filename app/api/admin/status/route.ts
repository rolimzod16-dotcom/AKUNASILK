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
          "Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run node scripts/setup-supabase.mjs",
          "Fallback: Vercel → Storage → Blob → Connect to Project → Redeploy",
        ],
  });
}