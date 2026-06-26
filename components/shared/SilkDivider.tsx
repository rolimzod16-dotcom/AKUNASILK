import { cn } from "@/lib/utils";

type SilkDividerProps = {
  className?: string;
  light?: boolean;
};

export default function SilkDivider({ className, light = false }: SilkDividerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "h-px w-12",
          light ? "bg-white/30" : "silk-shimmer"
        )}
      />
      <svg
        viewBox="0 0 24 24"
        className={cn("size-4", light ? "text-silk-gold" : "text-silk-gold")}
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 2z" />
      </svg>
      <div
        className={cn(
          "h-px w-12",
          light ? "bg-white/30" : "silk-shimmer"
        )}
      />
    </div>
  );
}