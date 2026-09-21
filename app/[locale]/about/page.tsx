import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import PageHero from "@/components/shared/PageHero";
import { getSiteSettings } from "@/lib/cms/settings";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/about",
    title: "About Great Silk Trails | Local Central Asia Experts",
    description:
      "Meet the people behind Great Silk Trails and learn how we design and coordinate journeys in Tajikistan and across Central Asia.",
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const contact = settings.contact;

  return (
    <>
      <PageHero
        title="A Silk Road travel company rooted in Tajikistan"
        subtitle="Great Silk Trails designs and coordinates journeys from Tajikistan across Central Asia, combining local operating experience with trusted regional partners."
      />

      <section className="apple-section">
        <div className="mx-auto max-w-[820px] space-y-12 px-6 text-base leading-relaxed text-apple-muted">
          <div>
            <h2 className="silk-headline text-2xl text-silk-indigo">How we started</h2>
            <p className="mt-3">
              Great Silk Trails grew from local operating work in Tajikistan — mountain roads,
              permits, homestays and long Pamir days — into a company that designs private and
              small-group journeys across neighbouring Silk Road countries.
            </p>
          </div>

          <div className="rounded-2xl border border-silk-gold/20 bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-silk-gold">
              Founder
            </p>
            <h2 className="silk-headline mt-2 text-2xl text-silk-indigo">Sultonsho Guliev</h2>
            <p className="mt-1 text-sm font-semibold text-silk-indigo">Founder</p>
            <p className="mt-3">
              Local operating experience in Tajikistan, with a focus on the Pamirs, mountain
              roads, permits and community-based travel. A founder photograph will be published
              after GST approval.
            </p>
          </div>

          <div>
            <h2 className="silk-headline text-2xl text-silk-indigo">How we operate</h2>
            <p className="mt-3">
              We operate directly in Tajikistan and work with confirmed regional partners in other
              countries. Each itinerary is checked with local drivers, guides and hosts before it
              is offered to travellers.
            </p>
          </div>

          <div>
            <h2 className="silk-headline text-2xl text-silk-indigo">Why travel with us</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Local knowledge of the Pamirs, mountain roads, permits and communities.</li>
              <li>Routes designed with people who drive and host them.</li>
              <li>Private and small-group travel with clear vehicles and group sizes.</li>
              <li>One team from first enquiry to the journey home.</li>
            </ul>
          </div>

          <div>
            <h2 className="silk-headline text-2xl text-silk-indigo">Responsible travel</h2>
            <p className="mt-3">
              We work with local drivers, guides and family stays where they are the right fit for
              the route. Specific community and environmental actions will be published as GST
              confirms them — we do not list generic promises here.
            </p>
          </div>

          {(contact.legalName || contact.address) && (
            <div>
              <h2 className="silk-headline text-2xl text-silk-indigo">Legal details</h2>
              <p className="mt-3">
                {contact.legalName}
                {contact.address ? ` · ${contact.address}` : ""}
              </p>
            </div>
          )}

          <Button variant="silk" size="pill" asChild>
            <Link href="/plan-my-journey">Plan a private trip</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
