import StoryEditor from "@/components/admin/StoryEditor";
import { createEmptyStory } from "@/lib/cms/stories";

export default function NewStoryPage() {
  return <StoryEditor story={createEmptyStory()} isNew />;
}