import DestinationEditor from "@/components/admin/DestinationEditor";
import { createEmptyDestination } from "@/lib/cms/destinations";

export default function NewDestinationPage() {
  return <DestinationEditor destination={createEmptyDestination()} isNew />;
}
