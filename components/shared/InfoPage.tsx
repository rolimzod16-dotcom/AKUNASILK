import PageHero from "@/components/shared/PageHero";
import BookNowButton from "@/components/automation/BookNowButton";

type InfoPageProps = {
  title: string;
  subtitle: string;
  body: string;
  cta?: string;
};

export default function InfoPage({ title, subtitle, body, cta }: InfoPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} />
      <section className="apple-section">
        <div className="mx-auto max-w-[760px] px-6">
          <p className="text-base leading-relaxed text-apple-muted">{body}</p>
          {cta && (
            <div className="mt-8">
              <BookNowButton variant="silk" size="pill" label={cta} prefill={{ source: "info-page" }} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}