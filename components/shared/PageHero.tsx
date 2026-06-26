import SectionHeading from "./SectionHeading";

type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="silk-gradient-hero silk-pattern pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div className="mx-auto max-w-[980px] px-6">
        <SectionHeading title={title} subtitle={subtitle} size="large" />
      </div>
    </section>
  );
}