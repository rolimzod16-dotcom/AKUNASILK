import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/shared/PageHero";
import AnimateIn from "@/components/shared/AnimateIn";
import { getBlogPosts, getStoryContent } from "@/lib/data/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.stories" });
  return { title: `${t("title")} | GREATSILKTRAILS` };
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages.stories" });
  const blog = await getTranslations({ locale, namespace: "blog" });
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero title={pages("title")} subtitle={pages("subtitle")} compact />
      <section className="pb-12 pt-2">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post, i) => {
              const content = getStoryContent(post, locale);
              return (
                <AnimateIn key={post.id} delay={i * 0.1}>
                  <article className="group overflow-hidden rounded-2xl border border-silk-gold/15 bg-white shadow-sm transition hover:shadow-lg">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={content.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="50vw"
                      />
                    </div>
                    <div className="p-6">
                      <time className="text-xs text-apple-muted" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h2 className="silk-headline mt-2 text-xl text-silk-indigo group-hover:text-silk-gold">
                        {content.title}
                      </h2>
                      <p className="mt-2 text-sm text-apple-muted">{content.excerpt}</p>
                      <Link
                        href={`/stories/${post.slug}`}
                        className="mt-4 inline-block text-sm font-semibold text-silk-turquoise"
                      >
                        {blog("readMore")} →
                      </Link>
                    </div>
                  </article>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}