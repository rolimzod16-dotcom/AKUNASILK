import { notFound } from "next/navigation";
import PartnerEditor from "@/components/admin/PartnerEditor";
import { getPartnerById } from "@/lib/cms/partners";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) notFound();
  return <PartnerEditor partner={partner} />;
}