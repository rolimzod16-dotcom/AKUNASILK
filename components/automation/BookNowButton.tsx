"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { BookingPrefill } from "@/lib/automation/booking-context";
import { planJourneyHref } from "@/lib/site";
import { cn } from "@/lib/utils";

type BookNowButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  prefill?: BookingPrefill;
  label?: string;
};

export default function BookNowButton({
  prefill,
  label,
  children,
  className,
  ...props
}: BookNowButtonProps) {
  const href = planJourneyHref({
    tour: prefill?.tourSlug,
    date: prefill?.preferredDate,
    source: prefill?.source,
    service: prefill?.service,
    destination: prefill?.countries,
    style: prefill?.interests,
  });

  return (
    <Button className={cn(className)} asChild {...props}>
      <Link href={href}>{children ?? label ?? "Plan My Journey"}</Link>
    </Button>
  );
}