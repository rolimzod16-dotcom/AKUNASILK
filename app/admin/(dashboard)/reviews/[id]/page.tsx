import { notFound } from "next/navigation";
import ReviewEditor from "@/components/admin/ReviewEditor";
import { getReviewById } from "@/lib/cms/reviews";
import { getAllTours } from "@/lib/cms/tours";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [review, tours] = await Promise.all([getReviewById(id), getAllTours()]);
  if (!review) notFound();
  return (
    <ReviewEditor
      review={review}
      tourOptions={tours.map((tour) => ({
        slug: tour.slug,
        title: tour.content.en.title || tour.slug,
      }))}
    />
  );
}
