import { AlertTriangle, MessageCircle, Send, Heart, Moon, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function BatteryRing({ value }: { value: number }) {
  const size = 220;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.82 0.16 75)" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 35)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(0.92 0.02 300)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#batteryGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Heart className="h-5 w-5 text-warning" fill="currentColor" />
        <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
          <span className="text-2xl text-muted-foreground">%</span>
        </p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Maternal Battery
        </p>
      </div>
    </div>
  );
}

const stats = [
  { label: "Sleep", value: "5h 12m", icon: Moon },
  { label: "Hydration", value: "32 oz", icon: Droplets },
  { label: "Heart", value: "82 bpm", icon: Heart },
];

export function BioBoundary() {
  return (
    <div className="space-y-6">
      {/* Battery Ring */}
      <Card className="glass-strong flex flex-col items-center gap-4 rounded-3xl border-0 p-6">
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Today
            </p>
            <p className="text-sm font-semibold">Bio Snapshot</p>
          </div>
          <span className="rounded-full bg-warning/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warning-foreground">
            Low
          </span>
        </div>

        <BatteryRing value={38} />

        <div className="grid w-full grid-cols-3 gap-2 pt-2">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="glass flex flex-col items-center gap-1 rounded-xl px-2 py-3"
              >
                <Icon className="h-4 w-4 text-foreground/70" />
                <p className="text-sm font-semibold tabular-nums">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Preservation Mode Alert */}
      <Card className="glass rounded-2xl border-0 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/25">
            <AlertTriangle className="h-5 w-5 text-warning-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Preservation Mode Activated</p>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Non-essential tasks paused. Auto-delegating to your support network.
            </p>
          </div>
        </div>
      </Card>

      {/* Auto-drafted SMS */}
      <Card className="glass-strong rounded-2xl border-0 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-foreground/70" />
            <p className="text-sm font-semibold">Drafted to Daniel</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Auto · 2m ago
          </span>
        </div>

        <div className="rounded-2xl rounded-bl-sm bg-gradient-to-br from-[oklch(0.92_0.06_330)] to-[oklch(0.9_0.06_280)] px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
          Battery is at <span className="font-semibold">38%</span>. You are on
          point for <span className="font-semibold">dinner</span>,{" "}
          <span className="font-semibold">bath time</span>, and the{" "}
          <span className="font-semibold">dog meds</span> tonight. 💛
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            className="glass h-10 flex-1 rounded-xl border-0 text-sm font-medium"
          >
            Edit
          </Button>
          <Button className="h-10 flex-1 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90">
            <Send className="mr-1.5 h-4 w-4" />
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
