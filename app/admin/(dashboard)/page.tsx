import Link from "next/link";
import { Map, BookOpen, Handshake, ArrowRight, Plus, Globe2, MessageSquareQuote, Settings } from "lucide-react";
import AdminStorageBanner from "@/components/admin/AdminStorageBanner";
import { getAllTours } from "@/lib/cms/tours";
import { getAllStories } from "@/lib/cms/stories";
import { getAllPartners } from "@/lib/cms/partners";
import { getAllReviews } from "@/lib/cms/reviews";
import { getAllDestinations } from "@/lib/cms/destinations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [tours, stories, partners, reviews, destinations] = await Promise.all([
    getAllTours(),
    getAllStories(),
    getAllPartners(),
    getAllReviews(),
    getAllDestinations(),
  ]);

  const stats = [
    {
      label: "Туры",
      total: tours.length,
      published: tours.filter((t) => t.published).length,
      href: "/admin/tours",
      icon: Map,
    },
    {
      label: "Направления",
      total: destinations.length,
      published: destinations.filter((d) => d.published).length,
      href: "/admin/destinations",
      icon: Globe2,
    },
    {
      label: "Отзывы",
      total: reviews.length,
      published: reviews.filter((r) => r.published).length,
      href: "/admin/reviews",
      icon: MessageSquareQuote,
    },
    {
      label: "Истории",
      total: stories.length,
      published: stories.filter((s) => s.published).length,
      href: "/admin/stories",
      icon: BookOpen,
    },
    {
      label: "Партнёры",
      total: partners.length,
      published: partners.filter((p) => p.published).length,
      href: "/admin/partners",
      icon: Handshake,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminStorageBanner />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="silk-headline text-3xl text-silk-indigo">Панель управления</h1>
          <p className="mt-2 max-w-2xl text-sm text-apple-muted">
            Всё содержимое сайта добавляется здесь. После сохранения и публикации страница
            обновляется без программиста.
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 rounded-full bg-silk-gold px-5 py-2.5 text-sm font-bold text-silk-indigo shadow-md shadow-silk-gold/30 transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Добавить тур
        </Link>
      </div>

      <Card className="border-silk-gold/30 bg-white">
        <CardHeader>
          <CardTitle className="text-silk-indigo">Как наполнять сайт</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-apple-muted">
          <p>1. <Link className="font-semibold text-silk-indigo underline" href="/admin/settings">Настройки</Link> — телефон, WhatsApp, email, адрес, включение цен / отзывов / партнёров.</p>
          <p>2. <Link className="font-semibold text-silk-indigo underline" href="/admin/tours">Туры</Link> — фото, маршрут, даты. Чтобы цена была на сайте: поставьте «Показывать цену» у тура и включите цены в Настройках.</p>
          <p>3. <Link className="font-semibold text-silk-indigo underline" href="/admin/destinations">Направления</Link> — новые страны. Опубликованная страна появляется в меню и на главной.</p>
          <p>4. <Link className="font-semibold text-silk-indigo underline" href="/admin/reviews">Отзывы</Link> — только с согласием гостя. После публикации блок появится на главной.</p>
          <p>5. Фото загружайте кнопкой загрузки в карточке тура или направления (не нужен код).</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, total, published, href, icon: Icon }) => (
          <Card key={href} className="border-silk-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base text-silk-indigo">{label}</CardTitle>
              <Icon className="size-5 text-silk-gold" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-silk-indigo">{total}</p>
              <p className="text-xs text-apple-muted">{published} published</p>
              <Button variant="link" className="mt-3 h-auto p-0" asChild>
                <Link href={href}>
                  Открыть <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        <Card className="border-silk-gold/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base text-silk-indigo">Настройки</CardTitle>
            <Settings className="size-5 text-silk-gold" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-apple-muted">Контакты, цены, отзывы</p>
            <Button variant="link" className="mt-3 h-auto p-0" asChild>
              <Link href="/admin/settings">
                Открыть <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
