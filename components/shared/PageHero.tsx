import SectionHeading from "./SectionHeading";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  compact?: boolean;
};

export default function PageHero({ title, subtitle, compact }: PageHeroProps) {
  return (
    <section
      className={
        compact
          ? "silk-gradient-hero silk-pattern pt-24 pb-8 sm:pt-28 sm:pb-10"
          : "silk-gradient-hero silk-pattern pt-28 pb-14 sm:pt-32 sm:pb-16"
      }
    >
      <div className="mx-auto max-w-[980px] px-6">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          size={compact ? "default" : "large"}
        />
      </div>
    </section>
  );
}