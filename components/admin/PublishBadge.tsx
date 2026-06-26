import { Badge } from "@/components/ui/badge";

export default function PublishBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge className="bg-silk-turquoise/15 text-silk-turquoise hover:bg-silk-turquoise/15">
      Published
    </Badge>
  ) : (
    <Badge variant="outline" className="border-silk-gold/40 text-apple-muted">
      Draft
    </Badge>
  );
}