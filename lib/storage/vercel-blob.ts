import { get, put } from "@vercel/blob";

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}

export function canUseBlobStorage(): boolean {
  return !!(
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_STORE_ID ||
    isVercelRuntime()
  );
}

export const BLOB_SETUP_MESSAGE =
  "Image uploads on Vercel need Blob Storage. Open Vercel → Storage → Blob → Connect to Project, then Redeploy. Or paste an image URL instead.";

export const BLOB_CMS_SETUP_MESSAGE =
  "Saving tours on Vercel needs Blob Storage. Connect Blob in Vercel Storage, then Redeploy.";

export async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!canUseBlobStorage()) return null;

  try {
    const result = await get(pathname, { access: "public" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function writeBlobJson<T>(pathname: string, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2) + "\n";
  await put(pathname, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}