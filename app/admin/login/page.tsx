"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="silk-gradient-hero silk-pattern flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-silk-gold/30 shadow-xl shadow-silk-gold/10">
        <CardContent className="p-8">
          <p className="silk-headline text-center text-2xl text-silk-indigo">
            GREAT<span className="text-silk-gold">SILK</span>TRAILS
          </p>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-apple-muted">
            Content Admin
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
              });
              if (res.ok) {
                router.push("/admin");
                router.refresh();
              } else {
                setError("Invalid password or admin not configured.");
              }
              setLoading(false);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="password">Admin password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
            {error && <p className="text-sm text-silk-terracotta">{error}</p>}
            <Button type="submit" variant="silk" size="pill" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}