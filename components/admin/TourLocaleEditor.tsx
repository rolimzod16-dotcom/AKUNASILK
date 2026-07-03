"use client";

import type { CmsLocale, CmsTour, TourContent } from "@/lib/cms/types";
import { buildItinerarySkeleton } from "@/lib/cms/tour-content";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItineraryDaysEditor from "@/components/admin/ItineraryDaysEditor";
import FaqItemsEditor from "@/components/admin/FaqItemsEditor";
import GalleryImagesEditor from "@/components/admin/GalleryImagesEditor";

type TourLocaleEditorProps = {
  locale: CmsLocale;
  content: TourContent;
  tour: CmsTour;
  onChange: (content: TourContent) => void;
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export default function TourLocaleEditor({
  locale,
  content,
  tour,
  onChange,
}: TourLocaleEditorProps) {
  const patch = (partial: Partial<TourContent>) => onChange({ ...content, ...partial });

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList variant="line" className="mb-4 h-auto w-full flex-wrap justify-start gap-1 bg-transparent">
        {(
          [
            ["about", locale === "ru" ? "О туре" : "About"],
            ["itinerary", locale === "ru" ? "Маршрут" : "Itinerary"],
            ["included", locale === "ru" ? "Включено" : "Included"],
            ["gallery", locale === "ru" ? "Галерея" : "Gallery"],
            ["faq", locale === "ru" ? "FAQ" : "FAQ"],
          ] as const
        ).map(([value, label]) => (
          <TabsTrigger
            key={value}
            value={value}
            className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-bold uppercase data-active:border-silk-gold data-active:bg-transparent"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="about" className="space-y-4">
        <div className="space-y-2">
          <Label>Tour title ({locale})</Label>
          <Input value={content.title} onChange={(e) => patch({ title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Short description — hero subtitle</Label>
          <Textarea rows={3} value={content.desc} onChange={(e) => patch({ desc: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>About the trip — full overview</Label>
          <Textarea
            rows={5}
            value={content.overview ?? ""}
            onChange={(e) => patch({ overview: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Highlights (one per line)</Label>
          <Textarea
            rows={4}
            value={arrayToLines(content.highlights)}
            onChange={(e) => patch({ highlights: linesToArray(e.target.value) })}
          />
        </div>
      </TabsContent>

      <TabsContent value="itinerary">
        <ItineraryDaysEditor
          days={content.itinerary ?? []}
          duration={tour.duration}
          onChange={(itinerary) => patch({ itinerary })}
          onSyncDuration={() => patch({ itinerary: buildItinerarySkeleton(tour, locale) })}
        />
      </TabsContent>

      <TabsContent value="included" className="space-y-4">
        <div className="space-y-2">
          <Label>Included in package (one per line)</Label>
          <Textarea
            rows={6}
            value={arrayToLines(content.included ?? [])}
            onChange={(e) => patch({ included: linesToArray(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Not included (one per line)</Label>
          <Textarea
            rows={4}
            value={arrayToLines(content.excluded ?? [])}
            onChange={(e) => patch({ excluded: linesToArray(e.target.value) })}
          />
        </div>
      </TabsContent>

      <TabsContent value="gallery">
        <GalleryImagesEditor
          images={content.gallery ?? []}
          onChange={(gallery) => patch({ gallery: gallery.filter(Boolean) })}
        />
      </TabsContent>

      <TabsContent value="faq">
        <FaqItemsEditor items={content.faq ?? []} onChange={(faq) => patch({ faq })} />
      </TabsContent>
    </Tabs>
  );
}