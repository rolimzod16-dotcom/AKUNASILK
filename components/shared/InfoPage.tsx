import PageHero from "@/components/shared/PageHero";
import BookNowButton from "@/components/automation/BookNowButton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

type InfoPageProps = {
  title: string;
  subtitle: string;
  body: string;
  cta?: string;
  secondaryCta?: string;
  secondaryHref?: string;
};

export default function InfoPage({
  title,
  subtitle,
  body,
  cta,
  secondaryCta,
  secondaryHref = "/contact",
}: InfoPageProps) {
  const blocks = body
    .split(/(?<=\.)\s+(?=(?:What we|Process:|Timing:|Fees:|CTA:|Permit types|Documents:|Lead times:|Restrictions:|Vehicle categories:|Seats and luggage:|Driver included:|Route suitability:|Languages:|Guide vs|Route expertise:|Pricing:|Levels we|What can be|Examples:|Scope:|Plan a Private|Ideal for:))/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero title={title} subtitle={subtitle} />
      <section className="apple-section">
        <div className="mx-auto max-w-[760px] px-6">
          <div className="space-y-4">
            {(blocks.length ? blocks : [body]).map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-apple-muted">
                {paragraph}
              </p>
            ))}
          </div>
          {(cta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <BookNowButton
                  variant="silk"
                  size="pill"
                  label={cta}
                  prefill={{ source: "info-page", tourSlug: "any" }}
                />
              )}
              {secondaryCta && (
                <Button variant="silkOutline" size="pill" asChild>
                  <Link href={secondaryHref}>{secondaryCta}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
