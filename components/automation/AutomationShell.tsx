"use client";

import type { ReactNode } from "react";
import { BookingProvider } from "@/lib/automation/booking-context";

export default function AutomationShell({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}