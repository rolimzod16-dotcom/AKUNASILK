"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryImagesEditorProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function GalleryImagesEditor({ images, onChange }: GalleryImagesEditorProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-apple-muted">
        Gallery tab on the tour page. Upload files or paste URLs. First image is the hero if cover is empty.
      </p>

      {images.length === 0 ? (
        <p className="rounded-lg border border-dashed border-silk-gold/30 px-4 py-6 text-center text-sm text-apple-muted">
          No gallery images yet.
        </p>
      ) : (
        <div className="space-y-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="rounded-xl border border-silk-gold/20 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-silk-turquoise">
                  Image {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-silk-terracotta"
                  onClick={() => onChange(images.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {url ? (
                <div className="relative mb-3 aspect-[16/7] overflow-hidden rounded-lg">
                  <Image src={url} alt="" fill className="object-cover" sizes="400px" unoptimized={url.startsWith("/uploads/")} />
                </div>
              ) : null}
              <ImageUploadField
                label="Upload or replace"
                folder="tours"
                value={url}
                onChange={(next) =>
                  onChange(images.map((img, i) => (i === index ? next : img)))
                }
              />
              <Input
                className="mt-2 text-sm"
                value={url}
                onChange={(e) =>
                  onChange(images.map((img, i) => (i === index ? e.target.value : img)))
                }
                placeholder="https://… or /uploads/…"
              />
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="silkOutline" size="sm" onClick={() => onChange([...images, ""])}>
        <Plus className="size-4" />
        Add image
      </Button>
    </div>
  );
}