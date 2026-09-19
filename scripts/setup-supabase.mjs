/**
 * Creates CMS tables + public image bucket, then seeds JSON from data/cms.
 * Usage: node scripts/setup-supabase.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(process.cwd(), ".env.local"));

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const service =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const postgresUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!url || !service || !postgresUrl) {
  console.error("Missing SUPABASE_URL / SERVICE_ROLE_KEY / POSTGRES_URL in .env.local");
  process.exit(1);
}

const schema = readFileSync(path.join(process.cwd(), "supabase", "schema.sql"), "utf8");
const sql = postgres(postgresUrl, { ssl: "require", max: 1 });

try {
  await sql.unsafe(schema);
  console.log("Created cms_documents and cms_inquiries");
} finally {
  await sql.end();
}

const supabase = createClient(url, service, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((b) => b.name === "cms")) {
  const { error } = await supabase.storage.createBucket("cms", {
    public: true,
    fileSizeLimit: "8MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
  if (error && !/already exists/i.test(error.message)) {
    throw error;
  }
  console.log("Created public storage bucket: cms");
} else {
  console.log("Storage bucket cms already exists");
}

const cmsDir = path.join(process.cwd(), "data", "cms");
if (existsSync(cmsDir)) {
  for (const file of readdirSync(cmsDir).filter((name) => name.endsWith(".json"))) {
    const payload = JSON.parse(readFileSync(path.join(cmsDir, file), "utf8"));
    const { error } = await supabase.from("cms_documents").upsert({
      id: file,
      payload,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    console.log("Seeded", file);
  }
}

console.log("Supabase CMS is ready.");
