"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TourFaqItem } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FaqItemsEditorProps = {
  items: TourFaqItem[];
  onChange: (items: TourFaqItem[]) => void;
};

export default function FaqItemsEditor({ items, onChange }: FaqItemsEditorProps) {
  function updateItem(index: number, patch: Partial<TourFaqItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-apple-muted">Questions shown on the tour FAQ tab.</p>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-silk-gold/30 px-4 py-6 text-center text-sm text-apple-muted">
          No FAQ items. Add common questions for this tour.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-silk-gold/20 bg-silk-cream/40 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs font-bold text-silk-indigo">FAQ #{index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-silk-terracotta"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  value={item.question}
                  onChange={(e) => updateItem(index, { question: e.target.value })}
                  placeholder="Question"
                />
                <Textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => updateItem(index, { answer: e.target.value })}
                  placeholder="Answer"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="silkOutline"
        size="sm"
        onClick={() => onChange([...items, { question: "", answer: "" }])}
      >
        <Plus className="size-4" />
        Add question
      </Button>
    </div>
  );
}