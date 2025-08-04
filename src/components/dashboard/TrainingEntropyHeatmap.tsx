"use client";
import ChartCard from "./ChartCard";
import { ChartContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, ChartTooltip } from "@/ui/chart";
import { Skeleton } from "@/ui/skeleton";
import useTrainingConsistency from "@/hooks/useTrainingConsistency";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/ui/tooltip";
import { Dialog, DialogContent } from "@/ui/dialog";
import { useState, useMemo } from "react";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TrainingEntropyHeatmap() {
  const { data, error } = useTrainingConsistency();

  if (error)
    return (
      <div className="h-64 flex items-center justify-center text-sm text-destructive">
        Failed to load training data
      </div>
    );

  if (!data) return <Skeleton className="h-64" />;

  const { sessions, heatmap, weeklyEntropy } = data;

  const [selected, setSelected] = useState<{
    day: number;
    hour: number;
  } | null>(null);

  const selectedSessions = useMemo(() => {
    if (!selected) return [];
    return sessions.filter((s) => {
      const d = new Date(s.start ?? s.date);
      return d.getDay() === selected.day && d.getHours() === selected.hour;
    });
  }, [selected, sessions]);

  const grid = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => ({ count: 0 }))
  );
  let max = 0;
  heatmap.forEach((c) => {
    grid[c.hour][c.day] = c;
    if (c.count > max) max = c.count;
  });

  const entropySeries = weeklyEntropy.map((e, i) => ({ week: i + 1, entropy: e }));
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
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-center border bg-accent text-accent-foreground h-4"
                          style={{ opacity: max ? cell.count / max : 0 }}
                          tabIndex={0}
                          aria-label={`${dayLabels[idx]} hour ${hour}: ${cell.count} sessions`}
                          onClick={() => setSelected({ day: idx, hour })}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {`${cell.count} sessions on ${dayLabels[idx]} at ${hour
                          .toString()
                          .padStart(2, "0")}:00`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
        <Dialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DialogContent>
            <div className="space-y-2">
              {selected && (
                <p className="font-medium text-sm">
                  {dayLabels[selected.day]} {selected.hour.toString().padStart(2, "0")}
                  :00
                </p>
              )}
              <ul className="list-disc pl-4">
                {selectedSessions.length > 0 ? (
                  selectedSessions.map((s) => (
                    <li key={s.id}>Session {s.id}</li>
                  ))
                ) : (
                  <li>No sessions</li>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </ChartContainer>
    </ChartCard>
  );
}
