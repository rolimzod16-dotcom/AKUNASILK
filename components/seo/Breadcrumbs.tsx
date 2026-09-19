import { Link } from "@/i18n/routing";
import { getSiteUrl, localePath } from "@/lib/seo/site";

export type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({
  items,
  locale = "en",
}: {
  items: Crumb[];
  locale?: string;
}) {
  const site = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${site}${localePath(locale, item.href)}` : undefined,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-apple-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-silk-gold">
                  {item.label}
                </Link>
              ) : (
                <span className="text-silk-indigo">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
