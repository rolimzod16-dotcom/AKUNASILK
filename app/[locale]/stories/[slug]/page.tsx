import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getBlogPosts, getPostBySlug, getStoryContent } from "@/lib/data/blog";
import SilkDivider from "@/components/shared/SilkDivider";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const content = getStoryContent(post, locale);
  return { title: `${content.title} | GREATSILKTRAILS` };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blog = await getTranslations({ locale, namespace: "blog" });
  const content = getStoryContent(post, locale);

  return (
    <article className="bg-silk-cream">
      <header className="silk-gradient-hero silk-pattern pt-14">
        <div className="mx-auto max-w-[780px] px-6 pt-12 pb-10 text-center">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-silk-turquoise hover:text-silk-indigo"
          >
            <ArrowLeft className="size-3.5" />
            {blog("backToStories")}
          </Link>
          <time className="mt-6 block text-xs text-apple-muted" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="mx-2">·</span>
            {blog("readTime", { minutes: post.readTime })}
          </time>
          <h1 className="silk-headline mt-3 text-3xl text-silk-indigo sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
          <SilkDivider className="my-5" />
          <p className="apple-subhead text-lg text-apple-muted">{content.excerpt}</p>
        </div>
      </header>

      <div className="relative mx-auto max-w-[980px] px-6 -mt-6">
        <div className="silk-frame relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={content.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 980px) 100vw, 980px"
          />
        </div>
      </div>

      <section className="apple-section">
        <div className="mx-auto max-w-[680px] px-6 space-y-5">
          {content.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-apple-subtle">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </article>
  );
}