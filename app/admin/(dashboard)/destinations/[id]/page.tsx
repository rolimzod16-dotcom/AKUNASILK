import { notFound } from "next/navigation";
import DestinationEditor from "@/components/admin/DestinationEditor";
import { getDestinationById } from "@/lib/cms/destinations";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) notFound();
  return <DestinationEditor destination={destination} />;
}
