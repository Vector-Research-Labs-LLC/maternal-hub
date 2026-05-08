import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainDump } from "@/components/BrainDump";
import { BioBoundary } from "@/components/BioBoundary";
import { Brain, HeartPulse, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Motherboard — Calm command center for moms" },
      {
        name: "description",
        content:
          "Motherboard: voice brain dumps and a maternal battery dashboard to protect your bandwidth.",
      },
      { property: "og:title", content: "Motherboard" },
      {
        property: "og:description",
        content: "Voice brain dumps + a maternal battery dashboard.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [tab, setTab] = useState("braindump");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, onboarded")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? null);
        if (data && !data.onboarded) navigate({ to: "/onboarding" });
      });
  }, [user, navigate]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pt-8 pb-28">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Motherboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Hey, {displayName || "mama"} 💛
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          aria-label="Sign out"
          className="glass h-11 w-11 rounded-full"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <TabsList className="glass-strong sticky top-3 z-10 grid h-14 w-full grid-cols-2 rounded-2xl p-1.5">
          <TabsTrigger
            value="braindump"
            className="flex h-full items-center gap-2 rounded-xl text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
          >
            <Brain className="h-4 w-4" />
            BrainDump
          </TabsTrigger>
          <TabsTrigger
            value="bio"
            className="flex h-full items-center gap-2 rounded-xl text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
          >
            <HeartPulse className="h-4 w-4" />
            Bio-Boundary
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="braindump"
          className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
        >
          <BrainDump />
        </TabsContent>
        <TabsContent
          value="bio"
          className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
        >
          <BioBoundary />
        </TabsContent>
      </Tabs>
    </main>
  );
}
