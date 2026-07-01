import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

export async function storeCmsImage(
  buffer: Buffer,
  folder: string,
  contentType: string,
  originalName: string
): Promise<{ url: string; storage: "blob" | "local" }> {
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error("Unsupported image type");
  }

  const filename = `${Date.now()}-${safeName(originalName)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`cms/${folder}/${filename}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return { url: blob.url, storage: "blob" };
  }

  const dir = path.join(process.cwd(), "public", "uploads", "cms", folder);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);
  return { url: `/uploads/cms/${folder}/${filename}`, storage: "local" };
}