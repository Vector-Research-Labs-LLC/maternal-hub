import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Motherboard" }] }),
  component: Onboarding,
});

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.onboarded) navigate({ to: "/" });
      if (data?.display_name) setDisplayName(data.display_name);
      if (data?.partner_name) setPartnerName(data.partner_name);
      if (data?.partner_phone) setPartnerPhone(data.partner_phone);
    });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        partner_name: partnerName || null,
        partner_phone: partnerPhone || null,
        onboarded: true,
      })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("All set 🌸");
    navigate({ to: "/" });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Welcome</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Let's set the scene</h1>
        <p className="mt-2 text-sm text-muted-foreground">A few quick details so Motherboard feels like yours.</p>
      </div>
      <Card className="glass-strong rounded-3xl border-0 p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dn">Your name</Label>
            <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Sam" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pn">Partner's name (optional)</Label>
            <Input id="pn" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Daniel" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pp">Partner's phone (optional)</Label>
            <Input id="pp" type="tel" value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)} placeholder="+1 555 123 4567" />
            <p className="text-xs text-muted-foreground">Used to draft SMS messages. Never sent without your tap.</p>
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-xl">
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </Card>
    </main>
  );
}
