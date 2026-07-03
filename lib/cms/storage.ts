import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  BLOB_CMS_SETUP_MESSAGE,
  canUseBlobStorage,
  isVercelRuntime,
  readBlobJson,
  writeBlobJson,
} from "@/lib/storage/vercel-blob";

const CMS_DIR = path.join(process.cwd(), "data", "cms");
const CMS_BLOB_PREFIX = "cms-data/";

function blobPath(filename: string): string {
  return `${CMS_BLOB_PREFIX}${filename}`;
}

export async function ensureCmsDir() {
  await mkdir(CMS_DIR, { recursive: true });
}

async function readLocalJson<T>(filename: string): Promise<T | null> {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeLocalJson<T>(filename: string, data: T): Promise<void> {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function readCmsJson<T>(filename: string, fallback: T): Promise<T> {
  const fromBlob = await readBlobJson<T>(blobPath(filename));
  if (fromBlob !== null) return fromBlob;

  const fromDisk = await readLocalJson<T>(filename);
  if (fromDisk !== null) return fromDisk;

  if (!isVercelRuntime()) {
    await writeLocalJson(filename, fallback);
  }
  return fallback;
}

export async function writeCmsJson<T>(filename: string, data: T): Promise<void> {
  if (isVercelRuntime()) {
    if (!canUseBlobStorage()) {
      throw new Error(BLOB_CMS_SETUP_MESSAGE);
    }
    try {
      await writeBlobJson(blobPath(filename), data);
      return;
    } catch {
      throw new Error(BLOB_CMS_SETUP_MESSAGE);
    }
  }

  if (canUseBlobStorage()) {
    try {
      await writeBlobJson(blobPath(filename), data);
    } catch {
      // Local dev can still save to disk when blob is misconfigured.
    }
  }

  await writeLocalJson(filename, data);
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