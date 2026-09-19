import { getAllInquiries } from "@/lib/cms/inquiries";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="silk-headline text-3xl text-silk-indigo">Заявки</h1>
        <p className="text-sm text-apple-muted">
          Запросы с формы Plan My Journey / Contact. Хранятся в Supabase.
        </p>
      </div>
      {inquiries.length === 0 ? (
        <Card className="border-dashed border-silk-gold/40">
          <CardContent className="py-12 text-center text-sm text-apple-muted">
            Пока нет заявок.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((item) => {
            const p = item.payload;
            return (
              <Card key={item.id} className="border-silk-gold/20">
                <CardContent className="space-y-1 p-5 text-sm">
                  <p className="font-semibold text-silk-indigo">
                    {String(p.name || "—")} · {item.id}
                  </p>
                  <p className="text-xs text-apple-muted">
                    {new Date(item.created_at).toLocaleString()} · {String(p.email || "")} ·{" "}
                    {String(p.phone || "")}
                  </p>
                  <p className="text-apple-muted">
                    {String(p.tour || p.tourTitle || "")}
                    {p.message ? ` — ${String(p.message).slice(0, 240)}` : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
