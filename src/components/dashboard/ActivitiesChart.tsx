import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "@/components/ui/chart";
import ChartCard from "./ChartCard";
import type { ChartConfig } from "@/components/ui/chart";
import { useGarminData } from "@/hooks/useGarminData";
import useDashboardFilters from "@/hooks/useDashboardFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { chartColors } from "@/lib/chartColors";
import useSelection from "@/hooks/useSelection";

const chartConfig = {
  distance: {
    label: "Distance (km)",
    color: chartColors["1"],
  },
  duration: {
    label: "Duration (min)",
    color: chartColors["2"],
  },
} satisfies ChartConfig;

export function ActivitiesChart() {
  const data = useGarminData();
  const { activity, range } = useDashboardFilters();
  const { selected, toggle } = useSelection();
  if (!data) return <Skeleton className="h-60 md:col-span-2" />;
  let activities = data.activities;

  if (activity !== 'all') {
    activities = activities.filter(
      (a) => a.type.toLowerCase() === activity,
    );
  }

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  activities = activities.filter(
    (a) => new Date(a.date) >= start,
  );

  return (
    <ChartCard
      title="Activities"
      description="Distance vs Duration"
      className="md:col-span-2"
      lastSync={data.lastSync}
    >
      <ChartContainer config={chartConfig} className="h-60 md:h-80 lg:h-96">
        <LineChart data={activities} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              additionalMetrics={(payload) => {
                const index = payload?.[0]?.payloadIndex
                if (index === undefined || index <= 0) return null
                const current = payload[0].payload as any
                const prev = activities[index - 1]
                if (!prev) return null
                const deltaDistance =
                  (current.distance ?? 0) - (prev.distance ?? 0)
                const deltaDuration =
                  (current.duration ?? 0) - (prev.duration ?? 0)
                return (
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Δ Distance
                      </span>
                      <span className="font-mono text-foreground">
                        {deltaDistance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Δ Duration
                      </span>
                      <span className="font-mono text-foreground">
                        {deltaDuration.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
          }
        />
        <ChartLegend
          onClick={(o: any) => {
            if (o && o.dataKey) toggle(String(o.dataKey));
          }}
          content={<ChartLegendContent activeKeys={selected} />}
        />
        {(!selected.length || selected.includes("distance")) && (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="distance"
            stroke={chartConfig.distance.color}
            animationDuration={300}
          />
        )}
        {(!selected.length || selected.includes("duration")) && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="duration"
            stroke={chartConfig.duration.color}
            animationDuration={300}
          />
        )}
      </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
