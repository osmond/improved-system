"use client";
import { ChartContainer } from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import { Skeleton } from "@/components/ui/skeleton";
import useMovementFingerprint from "@/hooks/useMovementFingerprint";

export default function MovementFingerprint() {
  const data = useMovementFingerprint();

  if (!data) return <Skeleton className="h-24" />;

  const max = Math.max(1, ...data.map((d) => d.steps));

  return (
    <ChartCard title="Movement Fingerprint" description="Average steps by hour">
      <ChartContainer config={{}} className="h-24">
        <div
          className="grid gap-px h-full text-[10px]"
          style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
        >
          {data.map((pt) => (
            <div
              key={pt.hour}
              className="flex items-end justify-center border bg-accent text-accent-foreground"
              style={{ opacity: pt.steps / max }}
              aria-label={`${Math.round(pt.steps)} steps at ${pt.hour}:00`}
            >
              &nbsp;
            </div>
          ))}
        </div>
      </ChartContainer>
    </ChartCard>
  );
}
