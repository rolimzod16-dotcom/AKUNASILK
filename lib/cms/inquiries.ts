import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type CmsInquiry = {
  id: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export async function getAllInquiries(): Promise<CmsInquiry[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cms_inquiries")
    .select("id, payload, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[cms] inquiries read failed", error.message);
    return [];
  }
  return (data ?? []) as CmsInquiry[];
}
