"use client";
import ChartCard from "./ChartCard";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import useReadingHeatmap, { HeatmapCell } from "@/hooks/useReadingHeatmap";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function labelForIntensity(intensity: number): string {
  if (intensity > 0.66) return "Deep Dive";
  if (intensity > 0.33) return "Study";
  if (intensity > 0) return "Skim";
  return "";
}

export default function ReadingFocusHeatmap() {
  const data = useReadingHeatmap();

  if (!data) return <Skeleton className="h-64" />;

  const grid: HeatmapCell[][] = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => ({ day: 0, hour: 0, intensity: 0 })),
  );
  data.forEach((c) => {
    grid[c.hour][c.day] = c;
  });

  return (
    <ChartCard title="Reading Focus" description="When you read most intently">
      <ChartContainer config={{}} className="h-64">
        <div className="grid gap-px text-center text-[10px] h-full">
          <div className="grid grid-cols-7 text-xs font-medium">
            {dayLabels.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="overflow-y-auto">
            {grid.map((row, hour) => (
              <div key={hour} className="grid grid-cols-7">
                {row.map((cell, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center border bg-accent text-accent-foreground h-6"
                    style={{
                      opacity: cell.intensity,
                    }}
                    aria-label={labelForIntensity(cell.intensity)}
                  >
                    {labelForIntensity(cell.intensity)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ChartContainer>
    </ChartCard>
  );
}
