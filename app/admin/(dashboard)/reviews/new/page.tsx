import ReviewEditor from "@/components/admin/ReviewEditor";
import { createEmptyReview } from "@/lib/cms/reviews";
import { getAllTours } from "@/lib/cms/tours";

export default async function NewReviewPage() {
  const tours = await getAllTours();
  return (
    <ReviewEditor
      review={createEmptyReview()}
      isNew
      tourOptions={tours.map((tour) => ({
        slug: tour.slug,
        title: tour.content.en.title || tour.slug,
      }))}
    />
  );
}
