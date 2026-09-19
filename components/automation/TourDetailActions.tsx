"use client";

import BookNowButton from "@/components/automation/BookNowButton";

type TourDetailActionsProps = {
  slug: string;
  price?: number;
  spotsLeft?: number;
  nextDeparture?: string;
};

export default function TourDetailActions({
  slug,
  nextDeparture,
}: TourDetailActionsProps) {
  return (
    <>
      <BookNowButton
        variant="silk"
        size="pill"
        className="mt-6 w-full"
        prefill={{
          tourSlug: slug,
          preferredDate: nextDeparture,
          source: "tour",
        }}
        label="Request Availability"
      />
      <BookNowButton
        variant="silkOutline"
        size="pill"
        className="mt-3 w-full"
        prefill={{
          tourSlug: slug,
          source: "tour",
          notes: "Private departure",
        }}
        label="Plan a Private Departure"
      />
      <BookNowButton
        variant="link"
        className="mt-2 w-full text-sm"
        prefill={{
          tourSlug: slug,
          source: "tour",
          notes: "Question about this journey",
        }}
        label="Ask a Question"
      />
    </>
  );
}
