"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Link2, Loader2, Upload } from "lucide-react";
import { compressImageFile } from "@/lib/upload/compress-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "tours" | "stories" | "general";
  hint?: string;
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "general",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImageFile(file);
      const body = new FormData();
      body.append("file", compressed);
      body.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (!data.url) throw new Error("No URL returned");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-apple-muted">{hint}</p>}

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition",
          dragOver ? "border-silk-gold bg-silk-gold/10" : "border-silk-gold/25 bg-silk-cream/40",
          uploading && "pointer-events-none opacity-70"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) void uploadFile(file);
        }}
      >
        {value ? (
          <div className="relative aspect-[16/7] w-full">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="600px" unoptimized={value.startsWith("/uploads/")} />
            <div className="absolute inset-0 bg-gradient-to-t from-silk-indigo/60 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-[16/7] flex-col items-center justify-center gap-2 px-4 text-center">
            <ImagePlus className="size-8 text-silk-gold/70" />
            <p className="text-sm font-medium text-silk-indigo">Drop image here or click to upload</p>
            <p className="text-[11px] text-apple-muted">Auto-compressed · JPG/PNG/WebP · max 3 MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="silkOutline"
          size="pill-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload file"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="pill-sm"
          className="text-xs"
          onClick={() => setShowUrl((v) => !v)}
        >
          <Link2 className="size-3.5" />
          {showUrl ? "Hide URL" : "Paste URL instead"}
        </Button>
      </div>

      {showUrl && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/…"
          className="bg-background text-sm"
        />
      )}

      {error && (
        <p className="text-xs leading-relaxed text-silk-terracotta">
          {error}
          {error.includes("Blob Storage") && (
            <span className="mt-1 block text-apple-muted">
              Vercel Dashboard → Storage → Blob → Connect to Project → Redeploy
            </span>
          )}
        </p>
      )}
    </div>
  );
}