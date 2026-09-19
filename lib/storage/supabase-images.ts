import { CMS_BUCKET, getSupabaseAdmin, getSupabaseUrl } from "@/lib/supabase/admin";

export async function uploadSupabaseImage(
  buffer: Buffer,
  folder: string,
  filename: string,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const path = `${folder}/${filename}`;
  const { error } = await supabase.storage.from(CMS_BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Supabase image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(CMS_BUCKET).getPublicUrl(path);
  if (data?.publicUrl) return data.publicUrl;

  const base = getSupabaseUrl().replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${CMS_BUCKET}/${path}`;
}
