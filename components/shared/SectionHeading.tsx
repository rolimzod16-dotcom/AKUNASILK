import SilkDivider from "./SilkDivider";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  dark?: boolean;
  size?: "default" | "large";
  className?: string;
  as?: "h1" | "h2";
};

export default function SectionHeading({
  title,
  subtitle,
  dark = false,
  size = "default",
  className,
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;
  return (
    <div className={cn("text-center", className)}>
      <SilkDivider className="mb-5" light={dark} />
      <HeadingTag
        className={cn(
          "silk-headline",
          size === "large"
            ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            : "text-3xl sm:text-4xl md:text-5xl",
          dark ? "text-white" : "text-silk-indigo"
        )}
      >
        {title}
      </HeadingTag>
      {subtitle && (
        <p
          className={cn(
            "apple-subhead mx-auto mt-4 max-w-2xl text-lg sm:text-xl md:text-2xl",
            dark ? "text-white/70" : "text-apple-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}