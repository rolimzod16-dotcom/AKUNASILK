"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BookingPrefill = {
  tourSlug?: string;
  travelers?: number;
  preferredDate?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  source?: "wizard" | "concierge" | "matcher" | "card" | "hero" | "header" | "info-page" | "travel-styles";
};

type BookingContextValue = {
  open: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});

  const openBooking = useCallback((next?: BookingPrefill) => {
    setPrefill(next ?? {});
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ open, prefill, openBooking, closeBooking }),
    [open, prefill, openBooking, closeBooking]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}