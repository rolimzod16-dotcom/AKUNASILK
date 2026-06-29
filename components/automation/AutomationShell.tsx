"use client";

import type { ReactNode } from "react";
import { BookingProvider } from "@/lib/automation/booking-context";
import BookingWizard from "@/components/automation/BookingWizard";
import SilkConcierge from "@/components/automation/SilkConcierge";

export default function AutomationShell({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      {children}
      <BookingWizard />
      <SilkConcierge />
    </BookingProvider>
  );
}