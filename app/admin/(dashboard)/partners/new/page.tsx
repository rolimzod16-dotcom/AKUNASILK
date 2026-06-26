import PartnerEditor from "@/components/admin/PartnerEditor";
import { createEmptyPartner } from "@/lib/cms/partners";

export default function NewPartnerPage() {
  return <PartnerEditor partner={createEmptyPartner()} isNew />;
}