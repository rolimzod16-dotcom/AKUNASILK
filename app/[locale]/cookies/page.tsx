import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/cookies",
    title: "Cookie Settings | Great Silk Trails",
    description: "How Great Silk Trails uses essential cookies to run the website.",
    noIndex: true,
  });
}

export default function CookiesPage() {
  return (
    <>
      <PageHero
        title="Cookie settings"
        subtitle="We use essential cookies to run the site. Analytics cookies will be added only after GST confirms Google Analytics and Search Console."
        compact
      />
      <section className="apple-section">
        <div className="mx-auto max-w-[720px] px-6 text-sm leading-relaxed text-apple-muted">
          <p>
            Essential cookies keep the admin session and form submissions working. We do not
            currently set marketing cookies. When analytics is enabled, this page will let you
            review optional measurement cookies.
          </p>
        </div>
      </section>
    </>
  );
}
