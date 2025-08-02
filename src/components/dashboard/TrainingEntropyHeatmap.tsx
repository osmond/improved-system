"use client";
import ChartCard from "./ChartCard";
import { ChartContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import useTrainingConsistency from "@/hooks/useTrainingConsistency";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TrainingEntropyHeatmap() {
  const data = useTrainingConsistency();

  if (!data) return <Skeleton className="h-64" />;

  const grid = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => ({ count: 0 }))
  );
  let max = 0;
  data.heatmap.forEach((c) => {
    grid[c.hour][c.day] = c;
    if (c.count > max) max = c.count;
  });

  const entropySeries = data.weeklyEntropy.map((e, i) => ({ week: i + 1, entropy: e }));
  const entropyMax = Math.log2(168);

  return (
    <ChartCard
      title="Training Consistency"
      description="Low entropy + steady volume indicates a robust routine; spikes signal schedule disruption."
    >
      <ChartContainer config={{}} className="h-64 md:h-80 lg:h-96">
        <div className="grid gap-2 h-full" style={{ gridTemplateRows: "1fr auto" }}>
          <div className="grid gap-px text-center text-[10px] overflow-y-auto">
            <div className="grid grid-cols-7 text-xs font-medium">
              {dayLabels.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            {grid.map((row, hour) => (
              <div key={hour} className="grid grid-cols-7">
                {row.map((cell, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center border bg-accent text-accent-foreground h-4"
                    style={{ opacity: max ? cell.count / max : 0 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="h-24 md:h-32 lg:h-40 w-full">
            <LineChart data={entropySeries} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, entropyMax]} hide />
              <ChartTooltip />
              <Line type="monotone" dataKey="entropy" stroke="hsl(var(--chart-1))" dot={false} />
            </LineChart>
          </div>
        </div>
      </ChartContainer>
    </ChartCard>
  );
}
