import { CMS_TABLE, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function readSupabaseJson<T>(filename: string): Promise<T | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(CMS_TABLE)
    .select("payload")
    .eq("id", filename)
    .maybeSingle();

  if (error) {
    console.error("[cms] supabase read failed", filename, error.message);
    return null;
  }
  if (!data?.payload) return null;
  return data.payload as T;
}

export async function writeSupabaseJson<T>(filename: string, payload: T): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase.from(CMS_TABLE).upsert({
    id: filename,
    payload,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Supabase save failed: ${error.message}`);
  }
}

export async function insertInquiry(id: string, payload: unknown): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("cms_inquiries").insert({
    id,
    payload,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Supabase inquiry save failed: ${error.message}`);
  }
}
