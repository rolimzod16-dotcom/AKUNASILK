"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type StorageStatus = {
  canSave: boolean;
  blob: boolean;
  github: boolean;
  runtime: string;
};

export default function AdminStorageBanner() {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [hints, setHints] = useState<string[]>([]);

  useEffect(() => {
    void fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data: { storage?: StorageStatus; hints?: string[] }) => {
        if (data.storage) setStatus(data.storage);
        if (data.hints) setHints(data.hints);
      })
      .catch(() => null);
  }, []);

  if (!status || status.canSave) return null;

  return (
    <div className="rounded-xl border border-silk-terracotta/40 bg-silk-terracotta/10 px-4 py-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-silk-terracotta" />
        <div className="text-sm">
          <p className="font-semibold text-silk-indigo">
            Сохранение туров на Vercel не настроено
          </p>
          <p className="mt-1 text-apple-muted">
            Подключите одно из хранилищ — иначе туры не сохранятся на сайте:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-apple-muted">
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-apple-muted">
            Blob: {status.blob ? "✓" : "✗"} · GitHub: {status.github ? "✓" : "✗"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminStorageOk() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data: { storage?: StorageStatus }) => {
        if (data.storage?.canSave) setOk(true);
      })
      .catch(() => null);
  }, []);

  if (!ok) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-silk-turquoise">
      <CheckCircle2 className="size-3.5" />
      Сохранение работает
    </span>
  );
}