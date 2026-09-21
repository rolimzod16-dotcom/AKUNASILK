import Image from "next/image";
import SectionHeading from "./SectionHeading";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  compact?: boolean;
  image?: string;
  imageAlt?: string;
};

export default function PageHero({ title, subtitle, compact, image, imageAlt }: PageHeroProps) {
  if (image) {
    return (
      <section className="relative min-h-[42vh] overflow-hidden sm:min-h-[48vh]">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-silk-indigo/80 via-silk-indigo/50 to-silk-indigo/20" />
        <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-[1280px] items-end px-6 pb-10 pt-24 sm:min-h-[48vh] sm:pb-14">
          <div className="max-w-[720px]">
            <h1 className="silk-headline text-3xl text-white sm:text-5xl">{title}</h1>
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

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
          as="h1"
        />
      </div>
    </section>
  );
}
