"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TourItineraryDay } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ItineraryDaysEditorProps = {
  days: TourItineraryDay[];
  onChange: (days: TourItineraryDay[]) => void;
  duration?: number;
  onSyncDuration?: () => void;
};

export default function ItineraryDaysEditor({
  days,
  onChange,
  duration,
  onSyncDuration,
}: ItineraryDaysEditorProps) {
  function updateDay(index: number, patch: Partial<TourItineraryDay>) {
    onChange(days.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function removeDay(index: number) {
    onChange(
      days
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 }))
    );
  }

  function addDay() {
    const next = days.length + 1;
    onChange([
      ...days,
      {
        day: next,
        title: `Day ${next}`,
        description: "",
      },
    ]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-apple-muted">
          One block per day — appears on the Itinerary tab on the tour page.
        </p>
        {onSyncDuration && duration ? (
          <Button type="button" variant="outline" size="sm" onClick={onSyncDuration}>
            Sync to {duration} days
          </Button>
        ) : null}
      </div>

      {days.length === 0 ? (
        <p className="rounded-lg border border-dashed border-silk-gold/30 px-4 py-6 text-center text-sm text-apple-muted">
          No days yet. Add days or sync from tour duration.
        </p>
      ) : (
        <div className="space-y-3">
          {days.map((day, index) => (
            <div
              key={`${day.day}-${index}`}
              className="rounded-xl border border-silk-gold/20 bg-silk-cream/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="text-xs font-bold uppercase tracking-wide text-silk-turquoise">
                  Day {day.day}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-silk-terracotta"
                  onClick={() => removeDay(index)}
                  aria-label="Remove day"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[72px_1fr]">
                <div className="space-y-1">
                  <Label className="text-xs">#</Label>
                  <Input
                    type="number"
                    min={1}
                    value={day.day}
                    onChange={(e) => updateDay(index, { day: Number(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={day.title}
                    onChange={(e) => updateDay(index, { title: e.target.value })}
                    placeholder="Day 1: Arrival in Dushanbe"
                  />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  rows={3}
                  value={day.description}
                  onChange={(e) => updateDay(index, { description: e.target.value })}
                  placeholder="What happens this day — transfers, sights, overnight."
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button type="button" variant="silkOutline" size="sm" onClick={addDay}>
        <Plus className="size-4" />
        Add day
      </Button>
    </div>
  );
}