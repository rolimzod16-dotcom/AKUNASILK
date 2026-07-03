import { notFound } from "next/navigation";
import TourEditor from "@/components/admin/TourEditor";
import { getTourById } from "@/lib/cms/tours";
import { prepareTourForEditor } from "@/lib/cms/tour-content";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) notFound();
  return <TourEditor tour={prepareTourForEditor(tour)} />;
}