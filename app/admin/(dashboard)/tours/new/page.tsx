import TourEditor from "@/components/admin/TourEditor";
import { createEmptyTour } from "@/lib/cms/tours";

export default function NewTourPage() {
  return <TourEditor tour={createEmptyTour()} isNew />;
}