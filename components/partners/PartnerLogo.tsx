import { cn } from "@/lib/utils";

type PartnerLogoProps = {
  initials: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-12 text-xs",
  md: "size-16 text-sm",
  lg: "size-20 text-base",
} as const;

export default function PartnerLogo({
  initials,
  name,
  className,
  size = "md",
}: PartnerLogoProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border border-silk-gold/30 bg-gradient-to-br from-silk-cream to-white font-bold tracking-tight text-silk-indigo shadow-sm shadow-silk-gold/10 transition duration-500 group-hover:border-silk-gold/60 group-hover:shadow-lg group-hover:shadow-silk-gold/20",
        sizeClasses[size],
        className
      )}
      aria-hidden
    >
      <span className="text-silk-indigo">{initials}</span>
      <span className="sr-only">{name}</span>
    </div>
  );
}