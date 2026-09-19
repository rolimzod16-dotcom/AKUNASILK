import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function canUseSupabase(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ""
  );
}

function getSupabaseServiceKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    ""
  );
}

let client: SupabaseClient | null | undefined;

/** Server-only client. Bypasses RLS. Never import from client components. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    client = null;
    return null;
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const CMS_BUCKET = "cms";
export const CMS_TABLE = "cms_documents";
