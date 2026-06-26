import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPartners } from "@/lib/cms/partners";
import PublishBadge from "@/components/admin/PublishBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPartnersPage() {
  const partners = await getAllPartners();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="silk-headline text-3xl text-silk-indigo">Partners</h1>
        <Button variant="silk" size="pill-sm" asChild>
          <Link href="/admin/partners/new"><Plus className="size-4" />New partner</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {partners.map((partner) => (
          <Card key={partner.id} className="border-silk-gold/20">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-silk-indigo">{partner.content.en.name}</h2>
                  <PublishBadge published={partner.published} />
                </div>
                <p className="text-xs text-apple-muted">{partner.category} · {partner.country}</p>
              </div>
              <Button variant="silkOutline" size="pill-sm" asChild>
                <Link href={`/admin/partners/${partner.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}