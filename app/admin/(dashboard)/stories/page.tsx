import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllStories } from "@/lib/cms/stories";
import PublishBadge from "@/components/admin/PublishBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminStoriesPage() {
  const stories = await getAllStories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">Stories</h1>
        <Button variant="silk" size="pill-sm" asChild>
          <Link href="/admin/stories/new"><Plus className="size-4" />New story</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {stories.map((story) => (
          <Card key={story.id} className="border-silk-gold/20">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-silk-indigo">{story.content.en.title}</h2>
                  <PublishBadge published={story.published} />
                </div>
                <p className="text-xs text-apple-muted">/stories/{story.slug}</p>
              </div>
              <Button variant="silkOutline" size="pill-sm" asChild>
                <Link href={`/admin/stories/${story.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}