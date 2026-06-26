import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const CMS_DIR = path.join(process.cwd(), "data", "cms");

export async function ensureCmsDir() {
  await mkdir(CMS_DIR, { recursive: true });
}

export async function readCmsJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await writeCmsJson(filename, fallback);
    return fallback;
  }
}

export async function writeCmsJson<T>(filename: string, data: T): Promise<void> {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function cmsNow() {
  return new Date().toISOString();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}