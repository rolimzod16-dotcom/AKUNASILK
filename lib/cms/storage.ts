import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  BLOB_CMS_SETUP_MESSAGE,
  canUseBlobStorage,
  isVercelRuntime,
  readBlobJson,
  writeBlobJson,
} from "@/lib/storage/vercel-blob";
import {
  canUseGithubCms,
  readGithubJson,
  writeGithubJson,
} from "@/lib/storage/github-cms";

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

  const fromGithub = await readGithubJson<T>(filename);
  if (fromGithub !== null) return fromGithub;

  const fromDisk = await readLocalJson<T>(filename);
  if (fromDisk !== null) return fromDisk;

  if (!isVercelRuntime()) {
    await writeLocalJson(filename, fallback);
  }
  return fallback;
}

export async function writeCmsJson<T>(filename: string, data: T): Promise<void> {
  const errors: string[] = [];

  if (canUseBlobStorage()) {
    try {
      await writeBlobJson(blobPath(filename), data);
      return;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Blob write failed");
    }
  }

  if (canUseGithubCms()) {
    try {
      await writeGithubJson(filename, data);
      return;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "GitHub write failed");
    }
  }

  if (!isVercelRuntime()) {
    await writeLocalJson(filename, data);
    return;
  }

  const hint = canUseGithubCms()
    ? errors.join("; ")
    : `${BLOB_CMS_SETUP_MESSAGE} Or add GITHUB_TOKEN + GITHUB_REPO in Vercel env.`;
  throw new Error(errors.length > 0 ? errors.join("; ") : hint);
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

export function getCmsStorageStatus() {
  return {
    runtime: isVercelRuntime() ? "vercel" : "local",
    blob: canUseBlobStorage(),
    github: canUseGithubCms(),
    canSave:
      !isVercelRuntime() || canUseBlobStorage() || canUseGithubCms(),
  };
}