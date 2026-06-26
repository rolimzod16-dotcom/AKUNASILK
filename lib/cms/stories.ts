import type { CmsLocale, CmsStory, StoryContent } from "./types";
import { readCmsJson, writeCmsJson, cmsNow, newId, slugify } from "./storage";
import { seedStories } from "./seed";

const FILE = "stories.json";

export async function getAllStories(): Promise<CmsStory[]> {
  return readCmsJson<CmsStory[]>(FILE, seedStories);
}

export async function getPublishedStories(): Promise<CmsStory[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.published).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getStoryBySlug(slug: string): Promise<CmsStory | undefined> {
  const stories = await getAllStories();
  return stories.find((s) => s.slug === slug);
}

export async function getPublishedStoryBySlug(slug: string): Promise<CmsStory | undefined> {
  const story = await getStoryBySlug(slug);
  return story?.published ? story : undefined;
}

export function getStoryContent(story: CmsStory, locale: string): StoryContent {
  const loc = (locale === "ru" ? "ru" : "en") as CmsLocale;
  return story.content[loc] ?? story.content.en;
}

export async function getStoryById(id: string): Promise<CmsStory | undefined> {
  const stories = await getAllStories();
  return stories.find((s) => s.id === id);
}

export async function saveStory(story: CmsStory): Promise<CmsStory> {
  const stories = await getAllStories();
  const index = stories.findIndex((s) => s.id === story.id);
  const next = { ...story, updatedAt: cmsNow() };
  if (index >= 0) stories[index] = next;
  else stories.push(next);
  await writeCmsJson(FILE, stories);
  return next;
}

export async function deleteStory(id: string): Promise<boolean> {
  const stories = await getAllStories();
  const filtered = stories.filter((s) => s.id !== id);
  if (filtered.length === stories.length) return false;
  await writeCmsJson(FILE, filtered);
  return true;
}

export function createEmptyStory(): CmsStory {
  const now = cmsNow();
  return {
    id: newId("story"),
    slug: "",
    published: false,
    image: "",
    date: now.slice(0, 10),
    readTime: 5,
    content: {
      en: { title: "", excerpt: "", body: [] },
      ru: { title: "", excerpt: "", body: [] },
    },
    createdAt: now,
    updatedAt: now,
  };
}