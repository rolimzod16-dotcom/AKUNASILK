import { notFound } from "next/navigation";
import StoryEditor from "@/components/admin/StoryEditor";
import { getStoryById } from "@/lib/cms/stories";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();
  return <StoryEditor story={story} />;
}