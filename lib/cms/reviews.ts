import type { CmsReview } from "./types";
import { readCmsJson, writeCmsJson, cmsNow, newId } from "./storage";

const FILE = "reviews.json";

export async function getAllReviews(): Promise<CmsReview[]> {
  return readCmsJson<CmsReview[]>(FILE, []);
}

export async function getPublishedReviews(): Promise<CmsReview[]> {
  const reviews = await getAllReviews();
  return reviews.filter((item) => item.published && item.consentRecorded && item.text.trim());
}

export async function getReviewsForTour(slug: string): Promise<CmsReview[]> {
  const reviews = await getPublishedReviews();
  return reviews.filter((item) => item.tourSlug === slug);
}

export async function getReviewById(id: string): Promise<CmsReview | undefined> {
  const reviews = await getAllReviews();
  return reviews.find((item) => item.id === id);
}

export async function saveReview(review: CmsReview): Promise<CmsReview> {
  const reviews = await getAllReviews();
  const next = { ...review, updatedAt: cmsNow() };
  const index = reviews.findIndex((item) => item.id === review.id);
  if (index >= 0) reviews[index] = next;
  else reviews.push(next);
  await writeCmsJson(FILE, reviews);
  return next;
}

export async function deleteReview(id: string): Promise<boolean> {
  const reviews = await getAllReviews();
  const filtered = reviews.filter((item) => item.id !== id);
  if (filtered.length === reviews.length) return false;
  await writeCmsJson(FILE, filtered);
  return true;
}

export function createEmptyReview(): CmsReview {
  const now = cmsNow();
  return {
    id: newId("review"),
    published: false,
    consentRecorded: false,
    guestName: "",
    country: "",
    year: String(new Date().getFullYear()),
    tourSlug: "",
    tourTitle: "",
    text: "",
    sourceUrl: "",
    createdAt: now,
    updatedAt: now,
  };
}
