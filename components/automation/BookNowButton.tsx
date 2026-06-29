"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useBooking, type BookingPrefill } from "@/lib/automation/booking-context";
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
  const { openBooking } = useBooking();

  return (
    <Button
      type="button"
      className={cn(className)}
      onClick={() => openBooking(prefill)}
      {...props}
    >
      {children ?? label}
    </Button>
  );
}