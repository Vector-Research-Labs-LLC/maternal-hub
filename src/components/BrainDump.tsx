import { useState } from "react";
import { Mic, ShoppingBasket, CalendarClock, ListChecks, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DumpCard = {
  title: string;
  icon: typeof Mic;
  tone: "mint" | "peach" | "lilac" | "sky";
  items: { text: string; meta?: string }[];
};

const cards: DumpCard[] = [
  {
    title: "Groceries",
    icon: ShoppingBasket,
    tone: "mint",
    items: [
      { text: "Oat milk (the barista one)" },
      { text: "Diapers — size 4" },
      { text: "Strawberries" },
      { text: "Sourdough", meta: "from Saul's" },
    ],
  },
  {
    title: "Deadlines",
    icon: CalendarClock,
    tone: "peach",
    items: [
      { text: "Preschool tuition", meta: "Fri" },
      { text: "Q3 deck draft", meta: "Mon" },
      { text: "Pediatrician forms", meta: "Wed" },
    ],
  },
  {
    title: "Action Items",
    icon: ListChecks,
    tone: "lilac",
    items: [
      { text: "Book swim lessons" },
      { text: "Refill Lexi's inhaler" },
      { text: "Reply to Mom about Sunday" },
      { text: "Cancel that subscription" },
    ],
  },
  {
    title: "Partner Delegation",
    icon: Users,
    tone: "sky",
    items: [
      { text: "Dog meds @ 8pm" },
      { text: "Pack daycare bag" },
      { text: "Call plumber re: sink" },
    ],
  },
];

const toneBg: Record<DumpCard["tone"], string> = {
  mint: "bg-mint/60",
  peach: "bg-peach/60",
  lilac: "bg-lilac/60",
  sky: "bg-sky/60",
};

export function BrainDump() {
  const [recording, setRecording] = useState(false);

  return (
    <div className="space-y-8">
      {/* Mic */}
      <section className="glass-strong relative overflow-hidden rounded-3xl px-6 pt-8 pb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Tap & talk
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          What's swirling in your head?
        </h2>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setRecording((r) => !r)}
            aria-label="Start voice brain dump"
            className={cn(
              "mic-pulse relative isolate flex h-40 w-40 items-center justify-center rounded-full transition-transform active:scale-95",
              "bg-gradient-to-br from-[oklch(0.78_0.14_330)] via-[oklch(0.8_0.12_300)] to-[oklch(0.82_0.1_260)]",
              "shadow-[0_20px_50px_-12px_oklch(0.7_0.18_330/0.55),inset_0_2px_0_0_oklch(1_0_0/0.5)]",
            )}
          >
            <div className="absolute inset-3 rounded-full bg-white/15 backdrop-blur-sm" />
            <Mic
              className="relative h-16 w-16 text-white drop-shadow-md"
              strokeWidth={2.2}
            />
          </button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {recording ? "Listening… speak freely." : "Stream of consciousness — we'll sort it."}
        </p>
      </section>

      {/* Cards */}
      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold tracking-tight">From this morning's dump</h3>
          <span className="text-xs text-muted-foreground">8:14 AM</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.title}
                className="glass flex flex-col gap-3 rounded-2xl border-0 p-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      toneBg[c.tone],
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 text-foreground/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.items.length} items
                    </p>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {c.items.slice(0, 3).map((it, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-snug text-foreground/85"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                      <span className="flex-1">
                        {it.text}
                        {it.meta && (
                          <Badge
                            variant="secondary"
                            className="ml-1 h-4 rounded-md bg-white/60 px-1.5 text-[10px] font-medium text-foreground/70"
                          >
                            {it.meta}
                          </Badge>
                        )}
                      </span>
                    </li>
                  ))}
                  {c.items.length > 3 && (
                    <li className="pt-0.5 text-[11px] font-medium text-foreground/50">
                      +{c.items.length - 3} more
                    </li>
                  )}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
