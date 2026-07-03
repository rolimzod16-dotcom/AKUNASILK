import TourEditor from "@/components/admin/TourEditor";
import { createEmptyTour } from "@/lib/cms/tours";
import { prepareTourForEditor } from "@/lib/cms/tour-content";

export default function NewTourPage() {
  return <TourEditor tour={prepareTourForEditor(createEmptyTour())} isNew />;
}