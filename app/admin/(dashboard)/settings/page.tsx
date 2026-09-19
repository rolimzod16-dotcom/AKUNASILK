import SettingsEditor from "@/components/admin/SettingsEditor";
import AdminStorageBanner from "@/components/admin/AdminStorageBanner";
import { getSiteSettings } from "@/lib/cms/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <AdminStorageBanner />
      <SettingsEditor settings={settings} />
    </div>
  );
}
